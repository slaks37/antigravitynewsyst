import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { posts, leads, auditLogs } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import {
  FileText,
  UserCheck,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Send,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const db = getDatabase();

  // 1. Post statistics
  const allPosts = await db.select().from(posts);
  const publishedCount = allPosts.filter((p) => p.status === "PUBLISHED").length;
  const inReviewCount = allPosts.filter((p) => p.status === "IN_REVIEW").length;
  const draftCount = allPosts.filter((p) => p.status === "DRAFT").length;
  const scheduledCount = allPosts.filter((p) => p.status === "SCHEDULED").length;

  // 2. Leads statistics & recent leads
  const allLeads = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt))
    .limit(5);

  const newLeadsCount = allLeads.filter((l) => l.status === "NEW").length;

  // 3. Articles awaiting review for Reviewer/Content Manager
  const articlesInReview = allPosts.filter((p) => p.status === "IN_REVIEW");

  // 4. Recent audit logs
  const recentLogs = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ikhtisar Portal CMS & Operasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Selamat datang, <strong className="text-slate-800">{user.name}</strong> ({user.role})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button href="/admin/posts/new" variant="primary" size="sm">
            + Buat Artikel Baru
          </Button>
          <Button href="/admin/ai-assistant" variant="outline" size="sm">
            AI Assistant
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Artikel Publik
          </p>
          <p className="text-3xl font-extrabold text-slate-900">{publishedCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Tayang di situs resmi</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Menunggu Review
          </p>
          <p className="text-3xl font-extrabold text-amber-600">{inReviewCount}</p>
          <span className="text-[11px] text-slate-500">Perlu persetujuan reviewer</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Draf Artikel
          </p>
          <p className="text-3xl font-extrabold text-slate-700">{draftCount}</p>
          <span className="text-[11px] text-slate-500">{scheduledCount} terjadwal</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Prospek (Leads)
          </p>
          <p className="text-3xl font-extrabold text-brand-blue">{allLeads.length}</p>
          <span className="text-[11px] text-rose-600 font-medium">
            {newLeadsCount} belum difollow-up
          </span>
        </div>
      </div>

      {/* Reviewer Notice (if articles in review exist) */}
      {articlesInReview.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h2 className="text-base font-bold text-amber-900">
              Perhatian Reviewer: Ada {articlesInReview.length} Artikel Menunggu Tinjauan
            </h2>
          </div>
          <div className="space-y-2">
            {articlesInReview.map((art) => (
              <div
                key={art.id}
                className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">{art.title}</p>
                  <p className="text-slate-500 text-[11px]">{art.excerpt.slice(0, 80)}...</p>
                </div>
                <Link
                  href={`/admin/posts/${art.id}/edit`}
                  className="px-3 py-1.5 rounded-lg font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Tinjau & Setujui
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leads and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-blue" />
              <span>Prospek & Pendaftaran Terbaru</span>
            </h2>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-brand-blue hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {allLeads.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">Belum ada data prospek masuk.</p>
          ) : (
            <div className="space-y-3">
              {allLeads.map((l) => (
                <div
                  key={l.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {l.company} <span className="font-normal text-slate-500">({l.fullName})</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {l.industry} • {l.plantCount} Plant • {l.businessEmail}
                    </p>
                    {l.businessProblem && (
                      <p className="text-[11px] text-slate-600 mt-1 italic line-clamp-1">
                        &ldquo;{l.businessProblem}&rdquo;
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${
                      l.status === "NEW"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audit / Editorial Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Log Aktivitas Editorial Terakhir</span>
            </h2>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-slate-500 hover:underline"
            >
              Seluruh Log
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">Belum ada log aktivitas.</p>
          ) : (
            <div className="space-y-2.5">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{log.action}</p>
                    <p className="text-[11px] text-slate-500">{log.notes || "-"}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                    {log.createdAt ? new Date(log.createdAt).toLocaleTimeString("id-ID") : "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
