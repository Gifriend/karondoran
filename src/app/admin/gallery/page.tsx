"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { galleryDB, storageDB } from "@/lib/supabase/db"

interface GalleryItem {
  id: string
  title: string
  category: string
  image_url: string
  image_size: number
  created_at: string
}

export default function GalleryManagement() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      setLoading(true)
      const items = await galleryDB.getAll()
      setGallery(items || [])
      setError(null)
    } catch (err) {
      console.error("[v0] Error loading gallery:", err)
      setError("Gagal memuat galeri")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus foto ini?")) {
      try {
        // Extract file path from URL and delete from storage
        const urlParts = imageUrl.split("/storage/v1/object/public/village-images/")
        if (urlParts[1]) {
          await storageDB.deleteImage("gallery", imageUrl);
        }

        // Delete from database
        await galleryDB.delete(id)
        setGallery(gallery.filter((item) => item.id !== id))
      } catch (err) {
        console.error("[v0] Error deleting gallery item:", err)
        alert("Gagal menghapus foto")
      }
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border border-red-200">
          <p className="text-red-800">{error}</p>
          <Button onClick={loadGallery} className="mt-4">
            Coba Lagi
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Galeri</h1>
          <p className="text-muted-foreground">Kelola foto dan gambar galeri desa ({gallery.length} total)</p>
        </div>
        <Link href="/admin/gallery/create">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ Upload Foto</Button>
        </Link>
      </div>

      {gallery.length === 0 ? (
        <Card className="p-12 bg-white text-center">
          <p className="text-muted-foreground mb-4">Belum ada foto di galeri. Upload foto pertama Anda.</p>
          <Link href="/admin/gallery/create">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Upload Foto</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <Card key={item.id} className="p-4 bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={item.image_url || "/placeholder.svg"}
                alt={item.title}
                className="mb-4 w-full h-40 object-cover rounded-lg"
              />
              <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground mb-1">{item.category}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {new Date(item.created_at).toLocaleDateString("id-ID")}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 text-sm text-primary hover:underline font-semibold">Edit</button>
                <button
                  onClick={() => handleDelete(item.id, item.image_url)}
                  className="flex-1 text-sm text-destructive hover:underline font-semibold"
                >
                  Hapus
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
