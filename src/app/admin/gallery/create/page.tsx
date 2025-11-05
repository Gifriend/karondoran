"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { galleryDB, storageDB } from "@/lib/supabase/db"
import { compressImage, getReadableFileSize } from "@/lib/image-compression"

export default function CreateGallery() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    category: "Alam",
  })
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      let fileToUpload = file
      if (file.size > 1024 * 1024) {
        fileToUpload = await compressImage(file, 1)
      }

      setSelectedFile(fileToUpload)

      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(fileToUpload)
    } catch (error) {
      console.error("[v0] Error preparing image:", error)
      alert("Gagal memproses gambar")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert("Pilih gambar terlebih dahulu")
      return
    }

    setSaving(true)

    try {
      // 1. Upload gambar
      const filePath = await storageDB.uploadImage(selectedFile, "gallery")
      // 2. Dapatkan URL publik
      const publicUrl = storageDB.getPublicUrl("gallery", filePath) // Perlu bucket & path

      // 3. Simpan ke database
      await galleryDB.create({
        ...formData,
        image_url: publicUrl,
        image_size: selectedFile.size,
      })

      alert("Foto telah berhasil ditambahkan ke galeri!")
      router.push("/admin/gallery")
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan foto")
      console.error("[v0] Error:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Upload Foto Baru</h1>
        <p className="text-muted-foreground">Tambahkan foto baru ke galeri desa</p>
      </div>

      <Card className="p-8 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
              Judul Foto <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-white"
              placeholder="Masukkan judul foto"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-foreground mb-2">
                Kategori <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-white"
              >
                <option>Alam</option>
                <option>Komunitas</option>
                <option>Infrastruktur</option>
                <option>Ekonomi</option>
                <option>Pertanian</option>
                <option>Budaya</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-foreground mb-2">
                Upload Gambar <span className="text-destructive">*</span>
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage || saving}
                required
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-white disabled:opacity-50"
              />
            </div>
          </div>

          {imagePreview && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Preview Gambar</label>
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-md"
              />
              {selectedFile && (
                <p className="text-xs text-muted-foreground mt-2">Ukuran: {getReadableFileSize(selectedFile.size)}</p>
              )}
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-sm text-green-800">
              Foto akan diupload ke Supabase Storage. Gambar lebih dari 1MB akan otomatis dikompres menjadi maksimal
              1MB.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={saving || uploadingImage || !selectedFile}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {saving || uploadingImage ? "Menyimpan..." : "Tambahkan ke Galeri"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
