"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { sendConfirmationEmail } from "@/lib/email"

// Re-validate on the server
const formSchema = z.object({
  participant_name: z.string().min(2),
  guardian1_name: z.string().min(2),
  guardian1_phone: z.string().min(6),
  guardian2_name: z.string().optional(),
  guardian2_phone: z.string().optional(),
  email: z.string().email(),
  selected_session: z.enum(["session_1", "session_2", "both"]),
})

type FormValues = z.infer<typeof formSchema>

export async function submitRegistration(data: FormValues) {
  try {
    // 1. Server-side validation
    const parsedData = formSchema.parse(data)
    
    // 2. Compute price
    const totalPrice = parsedData.selected_session === "both" ? 1200 : 600

    // 3. Connect to database
    const supabase = await createClient()

    // 4. Save to database
    const { data: insertedData, error } = await supabase.from("registrations").insert({
      participant_name: parsedData.participant_name,
      guardian1_name: parsedData.guardian1_name,
      guardian1_phone: parsedData.guardian1_phone,
      guardian2_name: parsedData.guardian2_name || null,
      guardian2_phone: parsedData.guardian2_phone || null,
      email: parsedData.email,
      selected_session: parsedData.selected_session,
      total_price: totalPrice,
      paid: false,
      confirmation_sent: false,
    }).select().single()

    if (error || !insertedData) {
      console.error("Supabase insert error:", error)
      return { success: false, error: "Ett fel uppstod när anmälan skulle sparas. Vänligen försök igen." }
    }

    // 5. Send confirmation email
    const sessionTitles: Record<string, string> = {
      "session_1": "Tillfälle 1 (14–15 juni)",
      "session_2": "Tillfälle 2 (6–7 juli)",
      "both": "Båda tillfällena",
    }
    
    const emailResult = await sendConfirmationEmail({
      participantName: parsedData.participant_name,
      sessionTitle: sessionTitles[parsedData.selected_session],
      sessionDate: parsedData.selected_session === "both" ? "Båda datumen" : sessionTitles[parsedData.selected_session],
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
