"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { type GovernmentStaff } from "@/lib/supabase/types"
import { compressImage } from "@/lib/image-compression"
import { createBrowserClient } from "@supabase/ssr"
import { governmentStaffDB, storageDB } from "@/lib/supabase/db"

export default function EditGovernmentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [staff, setStaff] = useState<GovernmentStaff | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    level: "1",
    description: "",
    is_active: true,
    sort_order: 0,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  useEffect(() => {
    loadGovernmentStaff()
  }, [id])

  async function loadGovernmentStaff() {
    try {
      const data = await governmentStaffDB.getById(id)

      // if (error) throw error
      if (data) {
        setStaff(data)
        setFormData({
          name: data.name,
          position: data.position,
          level: data.level.toString(),
          description: data.description || "",
          is_active: data.is_active,
          sort_order: data.sort_order,
        })
        if (data.photo_url) {
          setPhotoPreview(data.photo_url)
        }
      }
    } catch (err) {
      setError("Gagal memuat data pegawai")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setError("")
      const compressedFile = await compressImage(file, 1024 * 1024) // 1MB
      setSelectedFile(compressedFile)

      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(compressedFile)
    } catch (err) {
      setError("Gagal mengompresi foto")
      console.error(err)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      let photoUrl = staff?.photo_url || ""

      // Upload photo if new one is selected
      if (selectedFile) {
        const filePath = await storageDB.uploadImage(selectedFile, "staff_photos", id)
        photoUrl = storageDB.getPublicUrl("staff_photos", filePath)
      }

      // Update staff record
      await governmentStaffDB.update(id, { // Gunakan helper standar
        name: formData.name,
        position: formData.position,
        level: Number.parseInt(formData.level),
        description: formData.description,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
        photo_url: photoUrl,
      })

      router.push("/admin/government")
    } catch (err) {
      setError("Gagal mengubah pegawai")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Memuat data...</div>

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-foreground mb-6">Edit Pegawai Pemerintah Desa</h1>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-6 border border-border">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Foto Profil</label>
          <div className="space-y-3">
            {photoPreview && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-border">
                <img src={photoPreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Nama Lengkap *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Jabatan *</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Level Struktur *</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="1">Level 1 - Pimpinan Utama</option>
            <option value="2">Level 2 - Wakil Pimpinan</option>
            <option value="3">Level 3 - Seksi & Fungsi</option>
            <option value="4">Level 4 - Staf Senior</option>
            <option value="5">Level 5 - Staf Junior</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Deskripsi (Opsional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          />
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Urutan Tampil</label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: Number.parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            min="0"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="is_active" className="text-sm font-semibold text-foreground">
            Aktif (Tampil di halaman publik)
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
