"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { newsDB, galleryDB, pagesDB } from "@/lib/supabase/db";
import type { NewsItem } from "@/lib/supabase/types"; // Pastikan tipe ini ada

// Tipe untuk data statistik
interface DashboardStats {
  totalBerita: number;
  fotoGaleri: number;
  halamanStatis: number;
  kunjunganHariIni: string; // Tetap statis untuk saat ini
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBerita: 0,
    fotoGaleri: 0,
    halamanStatis: 0,
    kunjunganHariIni: "1,234", // Nilai default statis
  });
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Ambil semua data secara paralel
        const [newsData, galleryData, pagesData] = await Promise.all([
          newsDB.getAll("created_at", false), // Ambil berita (terbaru dulu)
          galleryDB.getAll(), // Ambil galeri
          pagesDB.getAll(), // Ambil halaman
        ]);

        // Set data statistik
        setStats((prevStats) => ({
          ...prevStats,
          totalBerita: newsData.length,
          fotoGaleri: galleryData.length,
          halamanStatis: pagesData.length,
        }));

        // Set 3 berita terbaru
        setRecentNews(newsData.slice(0, 3));
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
        alert("Gagal memuat data dashboard. Coba refresh halaman.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Tampilkan pesan loading
  if (loading) {
    return <div className="p-8">Memuat data dashboard...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di panel admin Desa Karondoran
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Berita</p>
              <p className="text-3xl font-bold text-primary">
                {stats.totalBerita}
              </p>
            </div>
            <span className="text-4xl">📰</span>
          </div>
        </Card>
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Foto Galeri</p>
              <p className="text-3xl font-bold text-primary">
                {stats.fotoGaleri}
              </p>
            </div>
            <span className="text-4xl">🖼️</span>
          </div>
        </Card>
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Halaman Statis
              </p>
              <p className="text-3xl font-bold text-primary">
                {stats.halamanStatis}
              </p>
            </div>
            <span className="text-4xl">📄</span>
          </div>
        </Card>
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Kunjungan Hari Ini
              </p>
              <p className="text-3xl font-bold text-primary">
                {stats.kunjunganHariIni}
              </p>
            </div>
            <span className="text-4xl">👥</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Pengaturan */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* ... Card "Buat Konten Baru" (Tidak berubah) ... */}
        <Card className="p-6 bg-white">
          <h3 className="font-bold text-lg text-foreground mb-4">
            Buat Konten Baru
          </h3>
          <div className="space-y-2">
            <Link href="/admin/news/create">
              <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
                📰 Berita Baru
              </Button>
            </Link>
            <Link href="/admin/gallery/create">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                🖼️ Foto Galeri
              </Button>
            </Link>
          </div>
        </Card>

        {/* ... Card "Kelola Konten" (Tidak berubah) ... */}
        <Card className="p-6 bg-white">
          <h3 className="font-bold text-lg text-foreground mb-4">
            Kelola Konten
          </h3>
          <div className="space-y-2">
            <Link href="/admin/news">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                📰 Semua Berita
              </Button>
            </Link>
            <Link href="/admin/gallery">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                🖼️ Semua Foto
              </Button>
            </Link>
          </div>
        </Card>

        {/* Card "Pengaturan" (Link di-aktifkan) */}
        <Card className="p-6 bg-white">
          <h3 className="font-bold text-lg text-foreground mb-4">Pengaturan</h3>
          <div className="space-y-2">
            <Link href="/admin/settings">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                ⚙️ Pengaturan Site
              </Button>
            </Link>
            <Link href="/admin/pages">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                📄 Halaman Statis
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent News */}
      <Card className="p-6 bg-white">
        <h3 className="font-bold text-lg text-foreground mb-4">
          Berita Terbaru
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-2 px-4">Judul</th>
                <th className="text-left py-2 px-4">Tanggal</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-left py-2 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentNews.map((news) => (
                <tr
                  key={news.id}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="py-3 px-4 font-medium">{news.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(news.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        news.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {news.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link href={`/admin/news/${news.id}`}>
                      <button className="text-primary hover:underline text-sm font-semibold">
                        Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
