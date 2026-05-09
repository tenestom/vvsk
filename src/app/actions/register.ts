"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { sendConfirmationEmail } from "@/lib/email"

// Re-validate on the server
const formSchema = z.object({
  participant_name: z.string().min(2),
  participant_personnummer: z.string().regex(/^\d{8}-\d{4}$/),
  guardian1_name: z.string().min(2),
  guardian1_phone: z.string().min(6),
  guardian2_name: z.string().optional(),
  guardian2_phone: z.string().optional(),
  email: z.string().email(),
  selected_products: z.array(z.string()).min(1),
})

type FormValues = z.infer<typeof formSchema>

export async function submitRegistration(data: FormValues) {
  try {
    // 1. Server-side validation
    const parsedData = formSchema.parse(data)
    
    // 3. Connect to database
    const supabase = await createClient()

    // Fetch selected products to get accurate price and titles
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*")
      .in("id", parsedData.selected_products)

    if (prodError || !products || products.length === 0) {
      console.error("Error fetching products for registration:", prodError)
      return { success: false, error: "Kunde inte validera valda produkter." }
    }

    // Compute price and collect names
    const totalPrice = products.reduce((sum, p) => sum + p.price, 0)
    const selectedProductsSnapshot = products.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price
    }))

    // Legacy support or just use a string summary for the old column
    const selectedSessionSummary = products.map(p => p.title).join(", ")

    // 4. Save to database
    const { data: insertedData, error } = await supabase.from("registrations").insert({
      participant_name: parsedData.participant_name,
      participant_personnummer: parsedData.participant_personnummer,
      guardian1_name: parsedData.guardian1_name,
      guardian1_phone: parsedData.guardian1_phone,
      guardian2_name: parsedData.guardian2_name || null,
      guardian2_phone: parsedData.guardian2_phone || null,
      email: parsedData.email,
      selected_session: selectedSessionSummary, // Fallback for old column
      selected_products: selectedProductsSnapshot, // New JSONB column
      total_price: totalPrice,
      paid: false,
      confirmation_sent: false,
    }).select().single()

    if (error || !insertedData) {
      console.error("Supabase insert error:", error)
      return { success: false, error: "Ett fel uppstod när anmälan skulle sparas. Vänligen försök igen." }
    }

    // 5. Send confirmation email
    const productTitles = products.map(p => p.title).join(", ")
    const productDates = products.map(p => p.start_date ? `${p.start_date} till ${p.end_date}` : "Inget datum").join(", ")
    
    const emailResult = await sendConfirmationEmail({
      participantName: parsedData.participant_name,
      sessionTitle: productTitles,
      sessionDate: productDates,
      totalPrice: totalPrice,
      email: parsedData.email,
    })

    // 6. Update confirmation_sent if email succeeded
    if (emailResult?.success) {
      await supabase
        .from("registrations")
        .update({ confirmation_sent: true })
        .eq("id", insertedData.id)
    }

    return { success: true }
  } catch (err) {
    console.error("Registration error:", err)
    return { success: false, error: "Ogiltig data skickades." }
  }
}
