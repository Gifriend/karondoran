import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

export interface GovernmentStaff {
  id: string
  name: string
  position: string
  level: number
  photo_url: string | null
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// Get all active government staff (for public display)
export async function getActiveGovernmentStaff(): Promise<GovernmentStaff[]> {
  const { data, error } = await supabase
    .from("government_staff")
    .select("*")
    .eq("is_active", true)
    .order("level", { ascending: true })
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data || []
}

// Get all government staff (for admin)
export async function getAllGovernmentStaff(): Promise<GovernmentStaff[]> {
  const { data, error } = await supabase
    .from("government_staff")
    .select("*")
    .order("level", { ascending: true })
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data || []
}

// Create government staff
export async function createGovernmentStaff(staff: Omit<GovernmentStaff, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("government_staff").insert([staff]).select().single()

  if (error) throw error
  return data
}

// Update government staff
export async function updateGovernmentStaff(id: string, staff: Partial<GovernmentStaff>) {
  const { data, error } = await supabase.from("government_staff").update(staff).eq("id", id).select().single()

  if (error) throw error
  return data
}

// Delete government staff
export async function deleteGovernmentStaff(id: string) {
  const { error } = await supabase.from("government_staff").delete().eq("id", id)

  if (error) throw error
}

// Upload staff photo
export async function uploadStaffPhoto(file: File, staffId: string): Promise<string> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${staffId}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from("village-images")
    .upload(`government/${fileName}`, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from("village-images").getPublicUrl(`government/${fileName}`)

  return data.publicUrl
}
