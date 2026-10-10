import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AuditLogsViewer } from "@/components/admin/AuditLogsViewer";

export default async function AdminAuditLogsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!hasPermission(user.role, "audit_logs:view")) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-xs text-slate-500 mt-1">
          Peran Anda ({user.role}) tidak memiliki izin untuk melihat riwayat jejak audit sistem.
        </p>
      </div>
    );
  }

  const db = getDatabase();
  const logs = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Log Aktivitas & Jejak Audit (Audit Trail)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pencatatan menyeluruh setiap aktivitas pengguna, perubahan status artikel, penerbitan konten, dan ingest data untuk akuntabilitas redaksi.
        </p>
      </div>

      <AuditLogsViewer
        initialLogs={logs.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
