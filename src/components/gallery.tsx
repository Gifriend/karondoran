"use client"

import { useState, useEffect } from "react"
import { galleryDB } from "@/lib/supabase/db"
import type { Gallery } from "@/lib/supabase/types"

export default function Gallery() {
  const [images, setImages] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null)

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      const items = await galleryDB.getAll()
      setImages(items || [])
    } catch (error) {
      console.error("[v0] Error loading gallery:", error)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const categories = ["Semua", "Alam", "Komunitas", "Infrastruktur", "Ekonomi", "Pertanian", "Budaya"]
  const filteredImages =
    selectedCategory === "Semua" ? images : images.filter((item) => item.category === selectedCategory)

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Galeri Foto</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-foreground">Galeri Foto</h2>
          <p className="text-center text-muted-foreground">Koleksi foto keindahan dan aktivitas Desa Karondoran</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors text-sm font-medium ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-white text-foreground border border-border hover:bg-muted"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada foto untuk kategori ini</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {filteredImages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end p-4">
                    <p className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                      {item.title}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 bg-primary/80 text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                    {item.category}
                  </div>
                </button>
              ))}
            </div>

            {/* Image Modal */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedImage(null)}
              >
                <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl">
                  <img
                    src={selectedImage.image_url || "/placeholder.svg"}
                    alt={selectedImage.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-foreground">{selectedImage.title}</h3>
                      <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedImage.category}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="text-primary hover:underline text-sm font-semibold"
                    >
                      Tutup ✕
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
