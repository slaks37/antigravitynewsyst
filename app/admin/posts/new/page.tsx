import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { categories, authors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const db = getDatabase();
  const allCategories = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(eq(categories.active, true));

  const allAuthors = await db
    .select({ id: authors.id, name: authors.name })
    .from(authors)
    .where(eq(authors.active, true));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Tulis Artikel Baru
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Buat draf artikel edukatif baru untuk dipublikasikan di blog resmi NewSystem.
        </p>
      </div>

      <PostEditor
        categories={allCategories}
        authors={allAuthors}
        userRole={user.role}
      />
    </div>
  );
}
