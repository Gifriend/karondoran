"use client";

import { useEffect, useState } from "react";
// 1. Impor helper & tipe yang benar
import { getActiveGovernmentStaffDB } from "@/lib/supabase/db";
import type { GovernmentStaff } from "@/lib/supabase/types";

export default function GovernmentStructure() {
  const [staff, setStaff] = useState<GovernmentStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGovernmentStaff();
  }, []);

  async function loadGovernmentStaff() {
    try {
      // 2. Panggil fungsi baru dari db.ts
      const data = await getActiveGovernmentStaffDB();
      setStaff(data);
    } catch (error) {
      console.error("Error loading government staff:", error);
    } finally {
      setLoading(false);
    }
  }

  // Group staff by level
  const groupedByLevel: Record<number, GovernmentStaff[]> = {};
  staff.forEach((member) => {
    if (!groupedByLevel[member.level]) {
      groupedByLevel[member.level] = [];
    }
    groupedByLevel[member.level].push(member);
  });

  const levelLabels: Record<number, string> = {
    1: "Level 1 - Pimpinan Utama",
    2: "Level 2 - Wakil Pimpinan",
    3: "Level 3 - Seksi & Fungsi",
    4: "Level 4 - Staf Senior",
    5: "Level 5 - Staf Junior",
  };

  if (loading) {
    return (
      <div className="text-center py-12">Memuat data pemerintah desa...</div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Pyramid Structure */}
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold text-foreground mb-8">
          Struktur Organisasi Pemerintah Desa
        </h3>

        <div className="w-full max-w-4xl">
          {/* Level 1 - Top */}
          {groupedByLevel[1] && (
            <div className="flex justify-center mb-8">
              <div className="flex gap-6 flex-wrap justify-center">
                {groupedByLevel[1].map((member) => (
                  <StaffCard key={member.id} staff={member} level={1} />
                ))}
              </div>
            </div>
          )}

          {/* Level 2 */}
          {groupedByLevel[2] && (
            <div className="flex justify-center mb-8">
              <div className="flex gap-4 flex-wrap justify-center max-w-3xl">
                {groupedByLevel[2].map((member) => (
                  <StaffCard key={member.id} staff={member} level={2} />
                ))}
              </div>
            </div>
          )}

          {/* Level 3 */}
          {groupedByLevel[3] && (
            <div className="flex justify-center mb-8">
              <div className="flex gap-3 flex-wrap justify-center max-w-2xl">
                {groupedByLevel[3].map((member) => (
                  <StaffCard key={member.id} staff={member} level={3} />
                ))}
              </div>
            </div>
          )}

          {/* Level 4 */}
          {groupedByLevel[4] && (
            <div className="flex justify-center mb-8">
              <div className="flex gap-2 flex-wrap justify-center max-w-xl">
                {groupedByLevel[4].map((member) => (
                  <StaffCard key={member.id} staff={member} level={4} />
                ))}
              </div>
            </div>
          )}

          {/* Level 5 */}
          {groupedByLevel[5] && (
            <div className="flex justify-center">
              <div className="flex gap-2 flex-wrap justify-center max-w-sm">
                {groupedByLevel[5].map((member) => (
                  <StaffCard key={member.id} staff={member} level={5} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed List */}
      <div className="grid gap-6">
        <h3 className="text-2xl font-bold text-foreground text-center">
          Detail Pegawai Pemerintah Desa
        </h3>
        {[1, 2, 3, 4, 5].map(
          (level) =>
            groupedByLevel[level] && (
              <div
                key={level}
                className="bg-white rounded-lg p-6 border border-border"
              >
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  {levelLabels[level]}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedByLevel[level].map((member) => (
                    <div
                      key={member.id}
                      className="bg-muted/50 rounded-lg p-4 flex gap-4"
                    >
                      {/* 3. Kode ini akan menampilkan foto (Sudah Benar) */}
                      {member.photo_url && (
                        <div className="w-16 h-16 shrink-0">
                          <img
                            src={member.photo_url || "/placeholder.svg"}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-foreground truncate">
                          {member.name}
                        </h5>
                        <p className="text-sm text-primary font-medium">
                          {member.position}
                        </p>
                        {member.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {member.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

// Komponen StaffCard tidak berubah
interface StaffCardProps {
  staff: GovernmentStaff;
  level: number;
}

function StaffCard({ staff, level }: StaffCardProps) {
  const sizeClasses: Record<number, string> = {
    1: "w-32",
    2: "w-28",
    3: "w-24",
    4: "w-20",
    5: "w-16",
  };

  const textSizes: Record<number, string> = {
    1: "text-sm",
    2: "text-xs",
    3: "text-xs",
    4: "text-[10px]",
    5: "text-[10px]",
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${sizeClasses[level]} aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary/50 overflow-hidden`}
      >
        {staff.photo_url ? (
          <img
            src={staff.photo_url || "/placeholder.svg"}
            alt={staff.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
            {staff.name.charAt(0)}
          </div>
        )}
      </div>
      <h5
        className={`${textSizes[level]} font-semibold text-foreground text-center mt-2 line-clamp-2`}
      >
        {staff.name}
      </h5>
      <p
        className={`${textSizes[level]} text-primary text-center line-clamp-2`}
      >
        {staff.position}
      </p>
    </div>
  );
}
