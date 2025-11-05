import type React from "react"
import type { Metadata } from "next"
import AdminNav from "@/components/admin/admin-nav"

export const metadata: Metadata = {
  title: "Admin Dashboard - Desa Karondoran",
  description: "Dashboard Admin untuk mengelola konten Desa Karondoran",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
