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

export async function deleteRegistration(id: string) {
  const supabase = await createClient()
  
  // Verify user is an admin (authenticated)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Obehörig" }
  }

  const { error } = await supabase
    .from("registrations")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting registration:", error)
    return { success: false, error: "Kunde inte ta bort anmälan." }
  }

  // Revalidate the admin dashboard so it reflects the new status
  revalidatePath("/admin")
  return { success: true }
}

export async function updateRegistration(id: string, data: any) {
  const supabase = await createClient()
  
  // Verify user is an admin (authenticated)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Obehörig" }
  }

  const { error } = await supabase
    .from("registrations")
    .update(data)
    .eq("id", id)

  if (error) {
    console.error("Error updating registration:", error)
    return { success: false, error: "Kunde inte uppdatera anmälan." }
  }

  // Revalidate the admin dashboard so it reflects the new status
  revalidatePath("/admin")
  return { success: true }
}

export async function addMember(name: string, role: string) {
  const supabase = await createClient()
  
  // Verify user is an admin (authenticated)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Obehörig" }
  }

  const { error } = await supabase
    .from("members")
    .insert([{ name, role }])

  if (error) {
    console.error("Error adding member:", error)
    return { success: false, error: "Kunde inte lägga till medlem." }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteMember(id: string) {
  const supabase = await createClient()
  
  // Verify user is an admin (authenticated)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Obehörig" }
  }

  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting member:", error)
    return { success: false, error: "Kunde inte ta bort medlem." }
  }

  revalidatePath("/admin")
  return { success: true }
}
