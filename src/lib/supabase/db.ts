// lib/supabase/db.ts

import { createBrowserClient } from "@supabase/ssr"
import type { Gallery, GovernmentStaff, NewsItem, PageItem, SettingItem } from "./types"

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

/**
 * =================================================================
 * HELPER STORAGE (UPLOAD)
 * =================================================================
 */
// Kode ini SUDAH BENAR karena getSupabaseClient() ada DI DALAM fungsi.
// Tidak perlu diubah.
export const storageDB = {
  uploadImage: async (file: File, bucket: string, fileName?: string) => {
    const supabase = getSupabaseClient() // <-- Benar!
    const fileExt = file.name.split(".").pop()
    const path = fileName ? `${fileName}.${fileExt}` : `${Date.now()}.${fileExt}`

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
    })

    if (error) {
      console.error(`[StorageDB] Error uploading to ${bucket}:`, error)
      throw new Error(`Gagal meng-upload file: ${error.message}`)
    }
    return path
  },

  getPublicUrl: (bucket: string, path: string) => {
    const supabase = getSupabaseClient() // <-- Benar!
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },

  deleteImage: async (bucket: string, path: string) => {
    const supabase = getSupabaseClient() // <-- Benar!
    const fileName = path.split("/").pop()
    if (!fileName) throw new Error("Path file tidak valid")

    const { error } = await supabase.storage.from(bucket).remove([fileName])

    if (error) {
      console.error(`[StorageDB] Error deleting from ${bucket}:`, error)
      throw new Error(`Gagal menghapus file: ${error.message}`)
    }
    return true
  },
}

/**
 * =================================================================
 * HELPER DATABASE (CRUD)
 * =================================================================
 */

// Factory untuk membuat fungsi CRUD generik
function createSupabaseCRUD<T extends { id: string }>(tableName: string) {
  // 
  // HAPUS: const supabase = getSupabaseClient() DARI SINI
  //

  return {
    /** Ambil semua item */
    getAll: async (orderBy: Extract<keyof T, string> = "created_at" as any, ascending = false) => {
      const supabase = getSupabaseClient() // <-- PINDAHKAN KE SINI
      const { data, error } = await supabase.from(tableName).select("*").order(orderBy, { ascending })
      if (error) throw error
      return data as T[]
    },

    /** Ambil satu item berdasarkan ID */
    getById: async (id: string) => {
      const supabase = getSupabaseClient() // <-- PINDAHKAN KE SINI
      const { data, error } = await supabase.from(tableName).select("*").eq("id", id).single()
      if (error) throw error
      return data as T
    },

    /** Buat item baru */
    // Saya juga perbaiki tipe Omit-nya agar lebih akurat
    create: async (itemData: Omit<T, "id" | "created_at" | "updated_at">) => {
      const supabase = getSupabaseClient() // <-- PINDAHKAN KE SINI
      const { data, error } = await supabase.from(tableName).insert([itemData as any]).select().single()
      if (error) throw error
      return data as T
    },

    /** Update item berdasarkan ID */
    update: async (id: string, itemData: Partial<Omit<T, "id">>) => {
      const supabase = getSupabaseClient() // <-- PINDAHKAN KE SINI
      const { data, error } = await supabase.from(tableName).update(itemData as any).eq("id", id).select().single()
      if (error) throw error
      return data as T
    },

    /** Hapus item berdasarkan ID */
    delete: async (id: string) => {
      const supabase = getSupabaseClient() // <-- PINDAHKAN KE SINI
      const { error } = await supabase.from(tableName).delete().eq("id", id)
      if (error) throw error
      return true
    },
  }
}

// Ekspor helper (tidak ada perubahan di sini)
export const galleryDB = createSupabaseCRUD<Gallery>("gallery")
export const newsDB = createSupabaseCRUD<NewsItem>("news")
export const governmentStaffDB = createSupabaseCRUD<GovernmentStaff>("government_staff")
export const pagesDB = createSupabaseCRUD<PageItem>("pages")

/**
 * =================================================================
 * HELPER KHUSUS (Settings)
 * =================================================================
 */
export const settingsDB = {
  /** Ambil semua settings dan ubah jadi Objek { key: value } */
  getAllAsObject: async () => {
    const supabase = getSupabaseClient() // <-- PINDAHKAN KE SINI
    const { data, error } = await supabase.from("settings").select("key, value")
    if (error) throw error

    return (data as { key: string; value: string }[]).reduce(
    	(acc, item) => {
        	acc[item.key] = item.value
        	return acc
    	},
    	{} as Record<string, string>,
    )
  },

  /** Update beberapa settings sekaligus */
  updateBatch: async (settings: Record<string, string>) => {
    const supabase = getSupabaseClient() // <-- PINDAHKAN KE SINI
    const promises = Object.entries(settings).map(([key, value]) =>
      supabase.from("settings").update({ value }).eq("key", key),
    )

    const results = await Promise.allSettled(promises)
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Gagal update setting:", result.reason)
      }
    })
    return true
  },
}
export const getActiveGovernmentStaffDB = async () => {
  const supabase = getSupabaseClient() // Ambil client yang baru
  const { data, error } = await supabase
    .from("government_staff")
    .select("*")
    .eq("is_active", true) // 1. Hanya ambil yang aktif
    .order("sort_order", { ascending: true }) // 2. Urutkan berdasarkan 'sort_order'
  
  if (error) throw error
  return data as GovernmentStaff[]
}