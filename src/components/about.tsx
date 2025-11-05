import GovernmentStructure from "./government-structure"

export default function About() {
  const stats = [
    { label: "Penduduk", value: "5,234" },
    { label: "Kepala Keluarga", value: "1,250" },
    { label: "Luas Wilayah", value: "25 km²" },
    { label: "Tahun Berdiri", value: "1985" },
  ]

  const programs = [
    {
      title: "Program Pendidikan",
      description:
        "Peningkatan akses pendidikan berkualitas untuk anak-anak desa melalui beasiswa dan fasilitas belajar.",
      icon: "📚",
    },
    {
      title: "Pemberdayaan UMKM",
      description: "Pelatihan keterampilan dan bantuan modal untuk mengembangkan usaha kecil menengah masyarakat.",
      icon: "🏪",
    },
    {
      title: "Kesehatan Masyarakat",
      description: "Program kesehatan gratis dan pemeriksaan kesehatan berkala untuk semua warga desa.",
      icon: "⚕️",
    },
    {
      title: "Infrastruktur & Lingkungan",
      description: "Pembangunan jalan, jembatan, dan pelestarian lingkungan untuk kesejahteraan bersama.",
      icon: "🏗️",
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">Tentang Desa Sejahtera</h2>

        {/* Hero Section */}
        <div className="mb-16 rounded-lg overflow-hidden">
          <img src="/village-overview-aerial-view.jpg" alt="Desa Sejahtera" className="w-full h-96 object-cover" />
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Visi Kami</h3>
            <p className="text-muted-foreground leading-relaxed mb-6 text-justify">
              Desa Sejahtera yang maju, mandiri, dan sejahtera melalui peningkatan kualitas sumber daya manusia dan
              pemberdayaan ekonomi lokal. Kami percaya bahwa dengan kolaborasi dan inovasi, desa kami dapat menjadi
              model pembangunan pedesaan yang berkelanjutan.
            </p>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Misi Kami</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">✓</span>
                <span>Meningkatkan kualitas pendidikan masyarakat</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">✓</span>
                <span>Memberdayakan ekonomi lokal dan UMKM</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">✓</span>
                <span>Menjaga kelestarian lingkungan dan budaya</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">✓</span>
                <span>Meningkatkan kesehatan dan kesejahteraan masyarakat</span>
              </li>
            </ul>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Programs */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center text-foreground">Program Utama Kami</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{program.icon}</div>
                <h4 className="font-bold text-foreground mb-2">{program.title}</h4>
                <p className="text-sm text-muted-foreground">{program.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Government Structure */}
        <div className="mb-16 bg-white rounded-lg p-8 border border-border">
          <GovernmentStructure />
        </div>
      </div>
    </section>
  )
}
