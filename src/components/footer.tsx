export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Desa Karondoran</h3>
            <p className="text-sm opacity-90">
              Portal Informasi Resmi Pemerintah Desa Karondoran. Transparansi dan pelayanan untuk masyarakat.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Menu Utama</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:opacity-80 transition">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80 transition">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80 transition">
                  Berita
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80 transition">
                  Galeri
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:opacity-80 transition">
                  Pelayanan Publik
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80 transition">
                  Surat Keterangan
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80 transition">
                  Pengaduan Masyarakat
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80 transition">
                  Bantuan Sosial
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kontak & Ikuti Kami</h4>
            <p className="text-sm mb-3">
              Jl. Raya Desa No. 123
              <br />
              Telepon: (0274) 123-4567
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-80 transition text-sm">
                Facebook
              </a>
              <a href="#" className="hover:opacity-80 transition text-sm">
                Instagram
              </a>
              <a href="#" className="hover:opacity-80 transition text-sm">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm">
          <p>
            &copy; {currentYear} Pemerintah Desa Karondoran. Semua hak dilindungi. |
            <a href="#" className="hover:opacity-80 transition ml-2">
              Kebijakan Privasi
            </a>{" "}
            |
            <a href="#" className="hover:opacity-80 transition ml-2">
              Syarat & Ketentuan
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
