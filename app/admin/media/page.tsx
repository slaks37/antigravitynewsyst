import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { MediaManager } from "@/components/admin/MediaManager";

export default async function AdminMediaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!hasPermission(user.role, "media:upload")) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-xs text-slate-500 mt-1">
          Peran Anda ({user.role}) tidak memiliki izin untuk mengelola pustaka media.
        </p>
      </div>
    );
  }

  const db = getDatabase();
  const mediaList = await db.select().from(media).orderBy(desc(media.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Pustaka Media & Aset Digital
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pusat penyimpanan berkas gambar, infografis diagram manufaktur, dan aset visual editorial.
        </p>
      </div>

      <MediaManager
        initialMedia={mediaList.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
