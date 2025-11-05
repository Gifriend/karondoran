"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { newsDB, storageDB } from "@/lib/supabase/db"
import { compressImage, getReadableFileSize } from "@/lib/image-compression"

export default function CreateNews() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    category: "Pendidikan",
    content: "",
    image_url: "",
  })
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

      setSelectedFile(fileToUpload) // Hanya simpan file, jangan upload dulu

      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(fileToUpload)
    } catch (error) {
      console.error("[v0] Error preparing image:", error)
      alert("Gagal memproses gambar")
    }
  }

  // Fungsi terpisah untuk menyimpan data (publish atau draft)
  const saveData = async (status: "Published" | "Draft") => {
    setSaving(true)
    let publicUrl = ""

    try {
      // Upload gambar HANYA jika ada file baru yang dipilih
      if (selectedFile) {
        const filePath = await storageDB.uploadImage(selectedFile, "news")
        publicUrl = storageDB.getPublicUrl("news", filePath)
      }

      // Simpan ke database
      await newsDB.create({
        ...formData,
        status: status,
        ...(publicUrl && { image_url: publicUrl }), // Hanya tambahkan jika ada URL
      })

      alert(`Berita telah ${status === "Published" ? "dipublikasikan" : "disimpan sebagai draft"}!`)
      router.push("/admin/news")
    } catch (error) {
      alert(`Terjadi kesalahan saat menyimpan ${status}`)
      console.error("[v0] Error:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveData("Published")
  }

  const handleSaveDraft = () => {
    saveData("Draft")
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Buat Berita Baru</h1>
        <p className="text-muted-foreground">Tambahkan berita dan artikel baru untuk desa</p>
      </div>

      <Card className="p-8 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
              Judul Berita <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-white"
              placeholder="Masukkan judul berita"
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
                <option>Pendidikan</option>
                <option>Kesehatan</option>
                <option>Budaya</option>
                <option>Ekonomi</option>
                <option>Infrastruktur</option>
                <option>Pertanian</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-foreground mb-2">
                Upload Gambar
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
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
            </div>
          )}

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-foreground mb-2">
              Konten Berita <span className="text-destructive">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-white resize-none"
              placeholder="Tulis konten berita di sini..."
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-sm text-green-800">
              Data disimpan di Supabase PostgreSQL. Gambar diupload ke Supabase Storage dan otomatis dikompres jika
              lebih dari 1MB.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={saving || uploadingImage}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Publikasikan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-border bg-transparent"
              onClick={handleSaveDraft}
              disabled={saving || uploadingImage}
            >
              Simpan sebagai Draft
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
