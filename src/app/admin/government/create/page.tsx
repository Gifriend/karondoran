"use client";

import type React from "react";
import { useState } from "react";
import { compressImage } from "@/lib/image-compression";
import { useRouter } from "next/navigation";
import { governmentStaffDB, storageDB } from "@/lib/supabase/db";

export default function CreateGovernmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    level: "1",
    description: "",
    is_active: true,
    sort_order: 0,
  });

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError("");
      const compressedFile = await compressImage(file, 1024 * 1024); // 1MB
      setSelectedFile(compressedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      setError("Gagal mengompresi foto");
      console.error(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Buat data pegawai di DB (tanpa foto)
      const newStaff = await governmentStaffDB.create({
        name: formData.name,
        position: formData.position,
        level: Number.parseInt(formData.level),
        description: formData.description,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
        photo_url: "",
      });

      let photoUrl = "";

      // 2. Jika ada file, upload file menggunakan ID baru
      if (selectedFile && newStaff.id) {
        // Gunakan ID pegawai sebagai nama file
        const filePath = await storageDB.uploadImage(
          selectedFile,
          "staff_photos",
          newStaff.id
        );
        photoUrl = storageDB.getPublicUrl("staff_photos", filePath);

        // 3. Update data pegawai dengan URL foto
        await governmentStaffDB.update(newStaff.id, {
          photo_url: photoUrl,
        });
      }

      router.push("/admin/government");
    } catch (err) {
      setError("Gagal membuat pegawai baru");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Tambah Pegawai Pemerintah Desa
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-lg p-6 border border-border"
      >
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Foto Profil
          </label>
          <div className="space-y-3">
            {photoPreview && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-border">
                <img
                  src={photoPreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-muted-foreground">
              Gambar akan otomatis dikompres ke 1MB jika lebih besar
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-border rounded-lg"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Jabatan *
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-border rounded-lg"
            placeholder="Contoh: Kepala Desa, Sekretaris Desa"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Level Struktur *
          </label>
          <select
            value={formData.level}
            onChange={(e) =>
              setFormData({ ...formData, level: e.target.value })
            }
            className="w-full px-4 py-2 border border-border rounded-lg"
          >
            <option value="1">Level 1 - Pimpinan Utama</option>
            <option value="2">Level 2 - Wakil Pimpinan</option>
            <option value="3">Level 3 - Seksi & Fungsi</option>
            <option value="4">Level 4 - Staf Senior</option>
            <option value="5">Level 5 - Staf Junior</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Deskripsi (Opsional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-border rounded-lg"
            placeholder="Tambahkan deskripsi atau keahlian khusus"
            rows={4}
          />
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Urutan Tampil
          </label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                sort_order: Number.parseInt(e.target.value || "0"), // Tambah "|| 0"
              })
            }
            className="w-full px-4 py-2 border border-border rounded-lg"
            min="0"
          />
        </div>

        {/* Active Status - Perbaikan: Menghapus kata "Data" */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="w-4 h-4 border border-border rounded"
          />
          <label
            htmlFor="is_active"
            className="text-sm font-semibold text-foreground"
          >
            Aktif (Tampil di halaman publik)
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg"
          >
            {loading ? "Menyimpan..." : "Simpan Pegawai"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-muted text-foreground rounded-lg"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
