"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sendLokEmail } from "@/lib/email"

export async function registerLokAttendance(date: string, memberIds: string[]) {
  const supabase = await createClient()

  // Find attendees data to include in email
  const { data: members, error: memError } = await supabase
    .from("members")
    .select("*")
    .in("id", memberIds)

  if (memError) {
    console.error("Error fetching members for email:", memError)
    return { success: false, error: "Kunde inte hämta medlemmar." }
  }

  // Delete previous attendance for this date (if we want to replace it)
  // Actually, standard way is to clear and re-insert for the selected date to allow toggling off
  const { error: deleteError } = await supabase
    .from("lok_attendance")
    .delete()
    .eq("date", date)

  if (deleteError) {
    console.error("Error clearing attendance:", deleteError)
    return { success: false, error: "Kunde inte nollställa tidigare närvaro." }
  }

  if (memberIds.length > 0) {
    const attendanceData = memberIds.map(id => ({
      date,
      member_id: id
    }))

    const { error: insertError } = await supabase
      .from("lok_attendance")
      .insert(attendanceData)

    if (insertError) {
      console.error("Error saving attendance:", insertError)
      return { success: false, error: "Kunde inte spara närvaro." }
    }
  }

  // Send email if there are attendees
  if (members && members.length > 0) {
    await sendLokEmail(date, members)
  }

  revalidatePath("/admin")
  revalidatePath("/lok")
  
  return { success: true }
}
