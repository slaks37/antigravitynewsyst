"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Send,
  CheckCircle,
  Eye,
  History,
  Sparkles,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PostEditorProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    coverImageAlt?: string | null;
    primaryCategoryId?: string | null;
    authorId?: string | null;
    featured?: boolean;
    status: string;
    scheduledPublishAt?: string | null;
  };
  categories: Array<{ id: string; name: string }>;
  authors: Array<{ id: string; name: string }>;
  revisions?: Array<{
    id: string;
    revisionNumber: number;
    title: string;
    changeNotes: string | null;
    createdAt: string;
  }>;
  userRole: string;
}

export function PostEditor({
  initialData,
  categories,
  authors,
  revisions = [],
  userRole,
}: PostEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    coverImageAlt: initialData?.coverImageAlt || "",
    primaryCategoryId: initialData?.primaryCategoryId || categories[0]?.id || "",
    authorId: initialData?.authorId || authors[0]?.id || "",
    featured: Boolean(initialData?.featured),
    status: initialData?.status || "DRAFT",
    scheduledPublishAt: initialData?.scheduledPublishAt || "",
    changeNotes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Auto-generate slug from title if new
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !isEditing
        ? val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
        : prev.slug,
    }));
  };

  const handleSave = async (targetStatus?: string) => {
    setError("");
    setSuccessNotice("");
    setSaving(true);

    const statusToSave = targetStatus || formData.status;

    try {
      const payload = {
        ...formData,
        status: statusToSave,
      };

      const url = isEditing
        ? `/api/admin/posts/${initialData?.id}`
        : `/api/admin/posts`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan artikel.");
      }

      setSuccessNotice(`Artikel berhasil disimpan dengan status: ${statusToSave}`);

      if (!isEditing && data.postId) {
        router.push(`/admin/posts/${data.postId}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // AI Assistant Outline / Headline generator
  const handleAiAssistance = async (mode: "headline" | "outline") => {
    if (!formData.title) {
      setError("Silakan masukkan judul artikel terlebih dahulu untuk meminta saran AI.");
      return;
    }

    setAiGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/admin/ai/editorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          topic: formData.title,
          currentContent: formData.content,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses AI");

      if (mode === "headline" && data.suggestion) {
        setFormData((prev) => ({ ...prev, title: data.suggestion }));
      } else if (mode === "outline" && data.suggestion) {
        setFormData((prev) => ({
          ...prev,
          content: prev.content ? `${prev.content}\n\n${data.suggestion}` : data.suggestion,
        }));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 font-mono">
            {isEditing ? `Mengedit Artikel [${initialData?.id}]` : "Membuat Artikel Baru"}
          </span>
          <p className="text-sm font-bold text-slate-800">
            Status Saat Ini: <span className="uppercase text-brand-blue">{formData.status}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Helper Button */}
          <button
            type="button"
            onClick={() => handleAiAssistance("outline")}
            disabled={aiGenerating}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiGenerating ? "AI Berpikir..." : "AI Outline"}</span>
          </button>

          {/* Save Draft */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={() => handleSave("DRAFT")}
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            <span>Simpan Draf</span>
          </Button>

          {/* Submit for Review (Authors/Editors) */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={saving}
            onClick={() => handleSave("IN_REVIEW")}
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            <span>Kirim Review</span>
          </Button>

          {/* Publish Directly (Superadmin/Reviewer/Content Manager) */}
          {["SUPERADMIN", "CONTENT_MANAGER", "REVIEWER"].includes(userRole) && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={saving}
              onClick={() => handleSave("PUBLISHED")}
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              <span>Publikasikan Sekarang</span>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Main Grid: Content and Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Title, Excerpt, Content */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Artikel <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: ERP vs MES: Memahami Perbedaan & Sinergi Kritis untuk Pabrik"
              className="w-full px-4 py-2.5 text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Slug <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 text-xs bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-500 font-mono">
                /blog/
              </span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ringkasan Singkat (Excerpt) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Ringkasan 1-2 kalimat untuk pratinjau kartu dan meta description..."
              className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Isi Konten Artikel (Markdown Format) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Gunakan ## untuk subjudul TOC otomatis
              </span>
            </div>
            <textarea
              rows={18}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Tulis artikel dengan format Markdown: ## Judul Bagian, **teks tebal**, - poin daftar..."
              className="w-full p-4 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none leading-relaxed"
            />
          </div>

          {isEditing && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Catatan Revisi Ini (Change Notes)
              </label>
              <input
                type="text"
                value={formData.changeNotes}
                onChange={(e) => setFormData({ ...formData, changeNotes: e.target.value })}
                placeholder="misal: Menambahkan penjelasan rumus HPP dan grafik alur WIP"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>
          )}
        </div>

        {/* Right Column: Taxonomy, Author, Revisions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
              Taksonomi & Metadata
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori Utama
              </label>
              <select
                value={formData.primaryCategoryId}
                onChange={(e) =>
                  setFormData({ ...formData, primaryCategoryId: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Penulis (Author)
              </label>
              <select
                value={formData.authorId}
                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                URL Gambar Sampul (Opsional)
              </label>
              <input
                type="text"
                value={formData.coverImage || ""}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://... atau /brand/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-300 text-brand-blue"
              />
              <label htmlFor="featured" className="text-slate-700 font-semibold">
                Tampilkan Sebagai Artikel Pilihan (Featured)
              </label>
            </div>
          </div>

          {/* Revision History List */}
          {revisions.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <span>Riwayat Revisi ({revisions.length})</span>
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">
                        Revisi #{rev.revisionNumber}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {rev.changeNotes || "Pembaruan isi"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
