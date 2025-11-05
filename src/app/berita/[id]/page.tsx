"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { newsDB } from "@/lib/supabase/db";
import type { NewsItem } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNewsDetail(id);
    }
  }, [id]);

  const loadNewsDetail = async (newsId: string) => {
    try {
      setLoading(true);
      const item = await newsDB.getById(newsId);
      // Cek jika berita tidak ada atau masih draft
      if (!item || item.status !== "Published") {
        setNewsItem(null);
      } else {
        setNewsItem(item);
      }
    } catch (error) {
      console.error("[v0] Error loading news detail:", error);
      setNewsItem(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p>Memuat berita...</p>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Berita Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-6">
          Berita yang Anda cari mungkin telah dihapus atau masih dalam draf.
        </p>
        <Button onClick={() => router.push("/berita")}>
          Kembali ke Daftar Berita
        </Button>
      </div>
    );
  }

  return (
    <article className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-8"
        >
          ← Kembali
        </Button>

        <Card className="p-6 md:p-10 bg-white shadow-lg">
          {/* Judul dan Metadata */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {newsItem.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-semibold">
              {newsItem.category}
            </span>
            <span>
              {new Date(newsItem.created_at).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Gambar Utama */}
          {newsItem.image_url && (
            <img
              src={newsItem.image_url}
              alt={newsItem.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Konten Berita */}
          <div
            className="prose max-w-none text-foreground"
            // Menampilkan newline (\n) sebagai paragraf
            style={{ whiteSpace: "pre-line" }}
          >
            {newsItem.content}
          </div>
        </Card>
      </div>
    </article>
  );
}
