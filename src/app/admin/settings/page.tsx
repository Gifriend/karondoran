"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
// Impor dari file helper baru
import { settingsDB } from "@/lib/supabase/db"

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({
    siteName: "",
    siteDescription: "",
    phone: "",
    email: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      try {
        // Ambil data sebagai objek { siteName: "...", ... }
        const data = await settingsDB.getAllAsObject()
        setSettings({
          siteName: data.siteName || "",
          siteDescription: data.siteDescription || "",
          phone: data.phone || "",
          email: data.email || "",
        })
      } catch (error) {
        console.error("Gagal memuat pengaturan:", error)
      	alert("Gagal memuat pengaturan")
      } finally {
        setLoading(false)
      }
  }
    loadSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Gunakan helper batch update
      await settingsDB.updateBatch(settings)
      alert("Pengaturan telah disimpan")
    } catch (error) {
      console.error("Gagal menyimpan pengaturan:", error)
      alert("Gagal menyimpan pengaturan")
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return <div className="p-6">Loading pengaturan...</div>
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Pengaturan Site</h1>
        <p className="text-muted-foreground">Kelola pengaturan umum website desa</p>
      </div>

      <Card className="p-8 bg-white space-y-6">
        <div>
          <label htmlFor="siteName" /* ... */>Nama Website</label>
          <input
            type="text"
            id="siteName"
            name="siteName" // Pastikan name sesuai dengan key di state/DB
            value={settings.siteName}
            onChange={handleChange}
            /* ... */
          />
        </div>

        <div>
          <label htmlFor="siteDescription" /* ... */>Deskripsi Website</label>
          <textarea
            id="siteDescription"
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleChange}
            /* ... */
          />
        </div>

        <div>
          <label htmlFor="phone" /* ... */>Nomor Telepon</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={settings.phone}
            onChange={handleChange}
            /* ... */
          />
  v     </div>

        <div>
          <label htmlFor="email" /* ... */>Email Desa</label>
          <input
            type="email"
            id="email"
            name="email"
          	value={settings.email}
          	onChange={handleChange}
          	/* ... */
          />
        </div>

        <Button onClick={handleSave} disabled={saving || loading}>
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </Card>
    </div>
  )
}