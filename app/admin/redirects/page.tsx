import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { redirects } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { RedirectsManager } from "@/components/admin/RedirectsManager";

export default async function AdminRedirectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!hasPermission(user.role, "redirects:manage")) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-xs text-slate-500 mt-1">
          Peran Anda ({user.role}) tidak memiliki izin untuk mengelola aturan redirect.
        </p>
      </div>
    );
  }

  const db = getDatabase();
  const rules = await db.select().from(redirects).orderBy(desc(redirects.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Manajemen SEO Redirects (301 & 302)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pertahankan equity backlink dan hindari halaman 404 ketika memperbarui struktur URL artikel atau modul.
        </p>
      </div>

      <RedirectsManager
        initialRedirects={rules.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
