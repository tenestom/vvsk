"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function togglePaymentStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  
  // Verify user is an admin (authenticated)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Obehörig" }
  }

  const { error } = await supabase
    .from("registrations")
    .update({ paid: !currentStatus })
    .eq("id", id)

  if (error) {
    console.error("Error toggling payment status:", error)
    return { success: false, error: "Kunde inte uppdatera betalningsstatus." }
  }

  // Revalidate the admin dashboard so it reflects the new status
  revalidatePath("/admin")
  return { success: true }
}
