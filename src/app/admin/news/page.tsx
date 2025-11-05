"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import { newsDB } from "@/lib/supabase/db"
import { NewsItem } from "@/lib/supabase/types"

export default function NewsManagement() {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      // Gunakan helper standar, urutkan dari terbaru
      const items = await newsDB.getAll("created_at", false)
      setNewsList(items || [])
      setError(null)
    } catch (err) {
      // ...
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      try {
        await newsDB.delete(id) // Gunakan helper standar
        setNewsList(newsList.filter((item) => item.id !== id))
      } catch (err) {
        // ...
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
          <Button onClick={loadNews} className="mt-4">
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
          <h1 className="text-3xl font-bold text-foreground">Manajemen Berita</h1>
          <p className="text-muted-foreground">Kelola semua berita dan artikel desa ({newsList.length} total)</p>
        </div>
        <Link href="/admin/news/create">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ Berita Baru</Button>
        </Link>
      </div>

      {newsList.length === 0 ? (
        <Card className="p-12 bg-white text-center">
          <p className="text-muted-foreground mb-4">Belum ada berita. Buat berita pertama Anda.</p>
          <Link href="/admin/news/create">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Buat Berita Baru</Button>
          </Link>
        </Card>
      ) : (
        <Card className="p-6 bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4">Judul</th>
                <th className="text-left py-3 px-4">Kategori</th>
                <th className="text-left py-3 px-4">Tanggal</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((news) => (
                <tr key={news.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium text-foreground">{news.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">{news.category}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(news.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        news.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {news.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <Link href={`/admin/news/${news.id}`}>
                      <button className="text-primary hover:underline p-1 hover:bg-muted rounded" title="Edit">
                        <Edit size={18} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(news.id)}
                      className="text-destructive hover:underline p-1 hover:bg-muted rounded"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
