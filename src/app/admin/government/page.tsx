"use client";

import { useEffect, useState } from "react";
// 1. Impor storageDB
import { governmentStaffDB, storageDB } from "@/lib/supabase/db";
import type { GovernmentStaff } from "@/lib/supabase/types";
import Link from "next/link";
import { Trash2, Edit, Plus } from "lucide-react";

export default function GovernmentPage() {
  const [staff, setStaff] = useState<GovernmentStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGovernmentStaff();
  }, []);

  async function loadGovernmentStaff() {
    try {
      setLoading(true);
      // Urutkan berdasarkan sort_order (terkecil dulu)
      const data = await governmentStaffDB.getAll("sort_order", true);
      setStaff(data);
    } catch (err) {
      setError("Gagal memuat data pemerintah desa");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 2. Perbaiki fungsi handleDelete
  async function handleDelete(id: string, photoUrl: string | null | undefined) {
    if (confirm("Yakin ingin menghapus pegawai ini?")) {
      try {
        // Hapus foto dari storage DULU (jika ada)
        if (photoUrl) {
          await storageDB.deleteImage("staff_photos", photoUrl);
        }

        // Hapus data dari database
        await governmentStaffDB.delete(id);
        setStaff(staff.filter((s) => s.id !== id));
      } catch (err) {
        setError("Gagal menghapus pegawai");
        console.error(err);
      }
    }
  }

  const levelLabels: Record<number, string> = {
    1: "Level 1 - Pimpinan Utama",
    2: "Level 2 - Wakil Pimpinan",
    3: "Level 3 - Seksi & Fungsi",
    4: "Level 4 - Staf Senior",
    5: "Level 5 - Staf Junior",
  };

  // Logika pengelompokan (sudah benar)
  const groupedByLevel: Record<number, GovernmentStaff[]> = {};
  staff.forEach((member) => {
    if (!groupedByLevel[member.level]) {
      groupedByLevel[member.level] = [];
    }
    groupedByLevel[member.level].push(member);
  });

  if (loading) return <div className="p-6">Memuat data...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">
          Kelola Pemerintah Desa
        </h1>
        <Link
          href="/admin/government/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
        >
          <Plus size={20} />
          Tambah Pegawai
        </Link>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700">{error}</div>}

      {[1, 2, 3, 4, 5].map(
        (level) =>
          groupedByLevel[level] && (
            <div
              key={level}
              className="bg-white rounded-lg border border-border overflow-hidden"
            >
              <div className="bg-muted px-6 py-4">
                <h2 className="font-semibold text-foreground">
                  {levelLabels[level]}
                </h2>
              </div>
              <div className="divide-y">
                {groupedByLevel[level].map((member) => (
                  <div
                    key={member.id}
                    className="p-6 flex items-center justify-between hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* 3. Kode ini untuk menampilkan foto (Sudah Benar) */}
                      {member.photo_url && (
                        <img
                          src={member.photo_url || "/placeholder.svg"}
                          alt={member.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {member.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          member.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {member.is_active ? "Aktif" : "Tidak Aktif"}
                      </span>
                      <Link
                        href={`/admin/government/${member.id}/edit`}
                        className="p-2 hover:bg-primary/10 rounded"
                      >
                        <Edit size={18} className="text-primary" />
                      </Link>
                      <button
                        // 4. Perbarui onClick untuk mengirim foto
                        onClick={() =>
                          handleDelete(member.id, member.photo_url)
                        }
                        className="p-2 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
