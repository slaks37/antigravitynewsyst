import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!hasPermission(user.role, "categories:manage")) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-xs text-slate-500 mt-1">
          Peran Anda ({user.role}) tidak memiliki izin untuk mengelola kategori.
        </p>
      </div>
    );
  }

  const db = getDatabase();
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Taksonomi & Kategori Konten
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola struktur kategori artikel, metadata SEO, urutan tampilan di navigasi, dan topik manufaktur.
        </p>
      </div>

      <CategoriesManager initialCategories={allCategories} />
    </div>
  );
}
