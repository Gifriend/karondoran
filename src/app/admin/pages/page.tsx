"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { pagesDB } from "@/lib/supabase/db"
import type { PageItem } from "@/lib/supabase/types"

export default function StaticPages() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPages() {
      try {
        const data = await pagesDB.getAll("title", true) // Urutkan A-Z
        setPages(data)
      } catch (error) {
        console.error("Gagal memuat halaman statis:", error)
      } finally {
        setLoading(false)
      }
    }
    loadPages()
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Halaman Statis</h1>
        <p className="text-muted-foreground">Kelola halaman statis website</p>
      </div>

      <Card className="p-6 bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr>
              <th className="text-left py-3 px-4">Judul</th>
              <th className="text-left py-3 px-4">Slug</th>
              <th className="text-left py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4 font-medium text-foreground">{page.title}</td>
                <td className="py-3 px-4 text-muted-foreground">/{page.slug}</td>
                <td className="py-3 px-4">
                  {/* TODO: Buat halaman edit /admin/pages/[slug]/edit */}
                  <button className="text-primary hover:underline text-sm font-semibold">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}