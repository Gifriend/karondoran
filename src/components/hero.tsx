"use client"

import { Button } from "@/components/ui/button"

interface HeroProps {
  setActiveSection: (section: string) => void
}

export default function Hero({ setActiveSection }: HeroProps) {
  return (
    <section className="relative py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-6 inline-block">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏞️</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight mb-6 text-foreground">
          Selamat Datang di Desa Karondoran
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Portal Informasi Resmi Desa Karondoran - Tempat untuk mengetahui berita terkini, program pembangunan, dan
          layanan masyarakat desa kami.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => setActiveSection("news")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
          >
            Baca Berita
          </Button>
          <Button
            onClick={() => setActiveSection("about")}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 px-8 py-3"
          >
            Pelajari Lebih Lanjut
          </Button>
        </div>
      </div>

      {/* Decorative background */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/5 rounded-full blur-3xl"></div>
    </section>
  )
}
