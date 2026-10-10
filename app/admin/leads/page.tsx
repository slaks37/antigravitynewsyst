import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { LeadsManager } from "@/components/admin/LeadsManager";

export default async function AdminLeadsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!hasPermission(user.role, "leads:view")) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-xs text-slate-500 mt-1">
          Peran Anda ({user.role}) tidak memiliki izin untuk melihat data prospek.
        </p>
      </div>
    );
  }

  const db = getDatabase();
  const allLeads = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Manajemen Prospek Pabrik (Leads)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar pendaftaran Design Partner, permintaan demonstrasi, dan konsultasi alur operasional pabrik.
        </p>
      </div>

      <LeadsManager
        initialLeads={allLeads.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
