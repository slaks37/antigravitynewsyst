import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { CAPABILITY_STATUSES } from "@/lib/capabilities/status";
import { SettingsManager } from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!hasPermission(user.role, "site_settings:manage")) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-xs text-slate-500 mt-1">
          Peran Anda ({user.role}) tidak memiliki izin untuk mengelola pengaturan sistem.
        </p>
      </div>
    );
  }

  const db = getDatabase();
  const settingsList = await db.select().from(siteSettings);

  const settingsMap: Record<string, unknown> = {};
  for (const item of settingsList) {
    settingsMap[item.key] = item.value;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Pengaturan Sistem & Matriks Kedewasaan
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Konfigurasi identitas situs, informasi kontak korporat, dan kontrol label transparansi kedewasaan produk.
        </p>
      </div>

      <SettingsManager
        initialSettings={settingsMap}
        defaultCapabilities={CAPABILITY_STATUSES}
      />
    </div>
  );
}
