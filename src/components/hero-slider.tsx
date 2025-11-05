"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  cta: string
  ctaAction: string
}

interface HeroSliderProps {
  setActiveSection: (section: string) => void
}

export default function HeroSlider({ setActiveSection }: HeroSliderProps) {
  const slides: HeroSlide[] = [
    {
      id: 1,
      title: "Selamat Datang di Desa Karondoran",
      subtitle: "Portal Informasi Resmi Desa - Bersama Membangun Masa Depan",
      image: "/village-landscape-prosperity.jpg",
      cta: "Baca Berita",
      ctaAction: "news",
    },
    {
      id: 2,
      title: "Program Pemberdayaan Masyarakat",
      subtitle: "Kami berkomitmen meningkatkan kesejahteraan seluruh warga desa",
      image: "/community-development-cooperation.jpg",
      cta: "Pelajari Program",
      ctaAction: "about",
    },
    {
      id: 3,
      title: "Galeri Keindahan Desa",
      subtitle: "Jelajahi keindahan alam dan budaya lokal Desa Karondoran",
      image: "/village-nature-gallery-scenic.jpg",
      cta: "Lihat Galeri",
      ctaAction: "gallery",
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance leading-tight">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-8 text-balance text-white/90">{slide.subtitle}</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button
                    onClick={() => setActiveSection(slide.ctaAction)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base"
                  >
                    {slide.cta}
                  </Button>
                  <Button
                    onClick={() => setActiveSection("contact")}
                    variant="outline"
                    className="border-white text-white hover:bg-white/20 px-8 py-3 text-base bg-black/30"
                  >
                    Hubungi Kami
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors md:p-3"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors md:p-3"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* AutoPlay Toggle */}
      <button
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="absolute top-6 right-6 z-20 bg-white/30 hover:bg-white/50 text-white px-4 py-2 rounded-full text-sm transition-colors"
      >
        {isAutoPlay ? "⏸ Pause" : "▶ Play"}
      </button>
    </section>
  )
}
