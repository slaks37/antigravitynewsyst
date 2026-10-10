import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { posts, categories, authors } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  FileText,
  Plus,
  ExternalLink,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PostsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminPostsPage({ searchParams }: PostsPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { status: filterStatus } = await searchParams;
  const db = getDatabase();

  const allPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      publishedAt: posts.publishedAt,
      scheduledPublishAt: posts.scheduledPublishAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      categoryName: categories.name,
      authorName: authors.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
    .leftJoin(authors, eq(posts.authorId, authors.id))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt));

  const filteredPosts = filterStatus
    ? allPosts.filter((p) => p.status === filterStatus)
    : allPosts;

  const statusBadges: Record<string, string> = {
    PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    IN_REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
    CHANGES_REQUESTED: "bg-rose-50 text-rose-700 border-rose-200",
    APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
    SCHEDULED: "bg-purple-50 text-purple-700 border-purple-200",
    DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
    ARCHIVED: "bg-slate-100 text-slate-500 border-slate-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Artikel & Konten
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola draf, peninjauan editorial, publikasi, dan arsip posting blog.
          </p>
        </div>

        <Button href="/admin/posts/new" variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Buat Artikel Baru</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs border-b border-slate-200">
        {[
          { label: "Semua", value: "" },
          { label: "Publik (Published)", value: "PUBLISHED" },
          { label: "Menunggu Review", value: "IN_REVIEW" },
          { label: "Disetujui (Approved)", value: "APPROVED" },
          { label: "Draf (Draft)", value: "DRAFT" },
          { label: "Terjadwal", value: "SCHEDULED" },
        ].map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/posts?status=${tab.value}` : `/admin/posts`}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              (filterStatus || "") === tab.value
                ? "bg-brand-blue text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Judul Artikel</th>
              <th className="p-4 hidden md:table-cell">Kategori</th>
              <th className="p-4 hidden sm:table-cell">Penulis</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Tidak ada artikel yang cocok dengan filter ini.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 text-sm line-clamp-1">{post.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono">/blog/{post.slug}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell text-slate-600">
                    {post.categoryName || "-"}
                  </td>
                  <td className="p-4 hidden sm:table-cell text-slate-600">
                    {post.authorName || "-"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        statusBadges[post.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    {post.status === "PUBLISHED" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-brand-blue font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
