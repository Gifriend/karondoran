"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { newsDB, storageDB } from "@/lib/supabase/db";
import { compressImage, getReadableFileSize } from "@/lib/image-compression";
import type { NewsItem } from "@/lib/supabase/types";

export default function EditNews() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // State untuk menyimpan data form
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: "",
    category: "Pendidikan",
    content: "",
    status: "Draft",
  });

  // State terpisah untuk file dan loading
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id) {
      loadNewsItem();
    }
  }, [id]);

  // 1. Ambil data berita yang ada
  async function loadNewsItem() {
    try {
      setLoading(true);
      const item = await newsDB.getById(id);
      if (item) {
        setFormData({
          title: item.title,
          category: item.category,
          content: item.content,
          status: item.status,
        });
        if (item.image_url) {
          setImagePreview(item.image_url);
          setOriginalImageUrl(item.image_url ?? undefined);
        }
      }
    } catch (error) {
      console.error("Gagal memuat berita:", error);
      alert("Gagal memuat berita");
      router.push("/admin/news");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let fileToUpload = file;
      if (file.size > 1024 * 1024) {
        fileToUpload = await compressImage(file, 1);
      }
      setSelectedFile(fileToUpload);

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(fileToUpload);
    } catch (error) {
      console.error("Error memproses gambar:", error);
      alert("Gagal memproses gambar");
    }
  };

  // 2. Simpan perubahan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl: string | undefined = originalImageUrl; // Mulai dengan gambar yang ada

      // Jika ada file baru yang dipilih, upload
      if (selectedFile) {
        const filePath = await storageDB.uploadImage(selectedFile, "news");
        finalImageUrl = storageDB.getPublicUrl("news", filePath);
      }

      // Update data di database
      await newsDB.update(id, {
        ...formData,
        image_url: finalImageUrl,
      });

      // 3. Jika berhasil upload gambar baru DAN ada gambar lama, hapus gambar lama
      if (selectedFile && originalImageUrl) {
        try {
          await storageDB.deleteImage("news", originalImageUrl);
        } catch (deleteError) {
          console.warn("Gagal menghapus gambar lama:", deleteError);
        }
      }

      alert("Berita telah berhasil diperbarui!");
      router.push("/admin/news");
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan berita");
      console.error("[v0] Error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Memuat editor berita...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Berita</h1>
        <p className="text-muted-foreground">
          Perbarui detail untuk berita ini
        </p>
      </div>

      <Card className="p-8 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Judul Berita <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-md"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Kategori <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-md"
              >
                <option>Pendidikan</option>
                <option>Kesehatan</option>
                <option>Budaya</option>
                <option>Ekonomi</option>
                <option>Infrastruktur</option>
                <option>Pertanian</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Status <span className="text-destructive">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-md"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Ganti Gambar (Opsional)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={saving}
              className="w-full px-4 py-2 border border-border rounded-md"
            />
          </div>

          {imagePreview && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Preview Gambar
              </label>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-md"
              />
            </div>
          )}

          <div>
            {" "}
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Konten Berita <span className="text-destructive">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-2 border border-border rounded-md"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/news")}
            >
              Batal
            </Button>{" "}
          </div>
        </form>
      </Card>
    </div>
  );
}
