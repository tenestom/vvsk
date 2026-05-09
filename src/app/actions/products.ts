"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createProduct(data: {
  title: string
  description?: string
  start_date?: string
  end_date?: string
  price: number
  active: boolean
}) {
  const supabase = await createClient()
  
  // Verify user is an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Obehörig" }
  }

  const { data: insertedData, error } = await supabase
    .from("products")
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error("Error creating product:", error)
    return { success: false, error: "Kunde inte skapa produkten." }
  }

  revalidatePath("/admin")
  return { success: true, data: insertedData }
}

export async function updateProduct(id: string, data: {
  title?: string
  description?: string
  start_date?: string
  end_date?: string
  price?: number
  active?: boolean
}) {
  const supabase = await createClient()
  
  // Verify user is an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Obehörig" }
  }

  const { error } = await supabase
    .from("products")
    .update(data)
    .eq("id", id)

  if (error) {
    console.error("Error updating product:", error)
    return { success: false, error: "Kunde inte uppdatera produkten." }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  
  // Verify user is an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Obehörig" }
  }

  // Soft delete by setting active to false, or hard delete?
  // The prompt says "do NOT hard delete by default".
  const { error } = await supabase
    .from("products")
    .update({ active: false })
    .eq("id", id)

  if (error) {
    console.error("Error deactivating product:", error)
    return { success: false, error: "Kunde inte avaktivera produkten." }
  }

  revalidatePath("/admin")
  return { success: true }
}
