"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { LogoutButton } from "./logout-button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/news", label: "Berita", icon: "📰" },
  { href: "/admin/gallery", label: "Galeri", icon: "🖼️" },
  { href: "/admin/government", label: "Pemerintah Desa", icon: "👥" },
  // { href: "/admin/pages", label: "Halaman Statis", icon: "📄" },
  // { href: "/admin/settings", label: "Pengaturan", icon: "⚙️" },
]

export default function AdminNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 z-50 md:hidden bg-white border-b border-border p-4 w-full flex justify-between items-center">
        <h1 className="font-bold text-lg text-primary">Desa Admin</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-muted rounded-md">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-white border-r border-border p-6 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } z-40 md:z-0 pt-20 md:pt-6 overflow-y-auto`}
      >
        <div className="mb-8 hidden md:block">
          <h1 className="text-2xl font-bold text-primary">Desa Admin</h1>
          <p className="text-xs text-muted-foreground">Dashboard Manajemen</p>
        </div>

        <div className="space-y-2 mb-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <hr className="my-6" />

        <LogoutButton />
      </nav>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main content offset on mobile */}
      <div className="h-20 md:h-0 w-full md:w-0" />
    </>
  )
}
