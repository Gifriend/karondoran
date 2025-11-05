"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { newsDB } from "@/lib/supabase/db"
import { NewsItem } from "@/lib/supabase/types"

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const items = await newsDB.getAll() 
      setNews(items || [])
    } catch (error) {
      console.error("[v0] Error loading news:", error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const categories = ["Semua", "Pendidikan", "Kesehatan", "Budaya", "Ekonomi", "Infrastruktur", "Pertanian"]
  const filteredNews = selectedCategory === "Semua" ? news : news.filter((item) => item.category === selectedCategory)

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-foreground">Berita Terkini</h2>
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-foreground">Berita Terkini</h2>
          <p className="text-center text-muted-foreground">
            Ikuti perkembangan terbaru dan informasi penting dari Desa Karondoran
          </p>
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
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <Card className="p-12 bg-white text-center">
            <p className="text-muted-foreground">Tidak ada berita untuk kategori ini</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <img src={item.image_url || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{item.content}</p>
                  <button className="text-primary font-semibold text-sm hover:underline self-start">
                    Baca Selengkapnya →
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
