import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NewsletterManager } from "@/components/admin/NewsletterManager";

export default async function AdminNewsletterPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!hasPermission(user.role, "newsletter:view")) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-xs text-slate-500 mt-1">
          Peran Anda ({user.role}) tidak memiliki izin untuk melihat data pelanggan buletin.
        </p>
      </div>
    );
  }

  const db = getDatabase();
  const subscribers = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Pelanggan Buletin Manufaktur
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar kontak profesional industri dan eksekutif pabrik yang berlangganan wawasan digitalisasi NewSystem.
        </p>
      </div>

      <NewsletterManager
        initialSubscribers={subscribers.map((s) => ({
          ...s,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
