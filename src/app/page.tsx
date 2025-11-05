"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import HeroSlider from "@/components/hero-slider"
import About from "@/components/about"
import News from "@/components/news"
import Gallery from "@/components/gallery"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")

  return (
    <main className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {activeSection === "home" && <HeroSlider setActiveSection={setActiveSection} />}
      {activeSection === "about" && <About />}
      {activeSection === "news" && <News />}
      {activeSection === "gallery" && <Gallery />}
      {activeSection === "contact" && <Contact />}

      <Footer />
    </main>
  )
}
