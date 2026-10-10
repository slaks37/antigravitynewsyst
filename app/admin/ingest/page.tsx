import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { contentIngestRecords } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { IngestManager } from "@/components/admin/IngestManager";

export default async function AdminIngestPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!hasPermission(user.role, "ingest:manage")) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-xs text-slate-500 mt-1">
          Peran Anda ({user.role}) tidak memiliki izin untuk mengelola antrean ingest konten.
        </p>
      </div>
    );
  }

  const db = getDatabase();
  const records = await db
    .select()
    .from(contentIngestRecords)
    .orderBy(desc(contentIngestRecords.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Antrean Ingest Konten Otomatis
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor rekonsiliasi data artikel yang di-ingest via webhook eksternal, n8n, Make, atau CMS eksternal melalui endpoint Bearer token.
        </p>
      </div>

      <IngestManager
        initialRecords={records.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
