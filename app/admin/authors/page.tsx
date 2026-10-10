import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { authors } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AuthorsManager } from "@/components/admin/AuthorsManager";

export default async function AdminAuthorsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!hasPermission(user.role, "authors:manage")) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-xs text-slate-500 mt-1">
          Peran Anda ({user.role}) tidak memiliki izin untuk mengelola profil penulis.
        </p>
      </div>
    );
  }

  const db = getDatabase();
  const allAuthors = await db.select().from(authors).orderBy(desc(authors.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Penulis & Analis Konten
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola profil penulis artikel, kredensial manufaktur, biografi pakar, dan tautan bio publik.
        </p>
      </div>

      <AuthorsManager initialAuthors={allAuthors} />
    </div>
  );
}
