"use client";

import React, { useState } from "react";
import { ArrowRightLeft, Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RedirectRule {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  active: boolean;
  createdAt: string;
}

export function RedirectsManager({ initialRedirects }: { initialRedirects: RedirectRule[] }) {
  const [rules, setRules] = useState<RedirectRule[]>(initialRedirects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RedirectRule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form
  const [sourcePath, setSourcePath] = useState("");
  const [targetPath, setTargetPath] = useState("");
  const [statusCode, setStatusCode] = useState<number>(301);
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingRule(null);
    setSourcePath("");
    setTargetPath("");
    setStatusCode(301);
    setActive(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: RedirectRule) => {
    setEditingRule(rule);
    setSourcePath(rule.sourcePath);
    setTargetPath(rule.targetPath);
    setStatusCode(rule.statusCode);
    setActive(rule.active);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        sourcePath,
        targetPath,
        statusCode: Number(statusCode),
        active,
      };

      if (editingRule) {
        const res = await fetch(`/api/admin/redirects/${editingRule.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal memperbarui aturan redirect");

        setRules((prev) =>
          prev.map((r) =>
            r.id === editingRule.id
              ? { ...data.redirect, createdAt: r.createdAt }
              : r
          )
        );
      } else {
        const res = await fetch("/api/admin/redirects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal membuat aturan redirect");

        setRules((prev) => [
          {
            ...data.redirect,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, source: string) => {
    if (!confirm(`Hapus aturan redirect untuk "${source}"?`)) return;

    try {
      const res = await fetch(`/api/admin/redirects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus aturan redirect");

      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus aturan");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Aturan Pengalihan URL (Redirects)</h2>
          <p className="text-xs text-slate-500">
            Jaga peringkat SEO Google dan tangani tautan lama dengan kode status 301 Permanent atau 302 Temporary.
          </p>
        </div>
        <Button onClick={openCreateModal} variant="primary" className="text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Tambah Aturan Redirect
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Jalur Asal (Source)</th>
                <th className="py-3 px-4">Tujuan (Target)</th>
                <th className="py-3 px-4">Status HTTP</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada aturan redirect yang dikonfigurasi.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {rule.sourcePath}
                    </td>
                    <td className="py-3 px-4 font-mono text-brand-blue">
                      {rule.targetPath}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {rule.statusCode} {rule.statusCode === 301 ? "Permanent" : "Temporary"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          rule.active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {rule.active ? "Aktif" : "Non-Aktif"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(rule)}
                        className="p-1 text-slate-500 hover:text-brand-blue transition-colors"
                        title="Edit Aturan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id, rule.sourcePath)}
                        className="p-1 text-slate-500 hover:text-rose-600 transition-colors"
                        title="Hapus Aturan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingRule ? "Edit Aturan Redirect" : "Tambah Aturan Redirect"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source Path *</label>
                <input
                  type="text"
                  required
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  placeholder="/blog/artikel-lama"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <p className="text-[10px] text-slate-400 mt-1">Harus diawali tanda strip miring (/)</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Path *</label>
                <input
                  type="text"
                  required
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  placeholder="/blog/panduan-oee-pabrik-indonesia"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Code HTTP *</label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                >
                  <option value={301}>301 — Moved Permanently (Direkomendasikan SEO)</option>
                  <option value={302}>302 — Found / Temporary Redirect</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="redirectActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                />
                <label htmlFor="redirectActive" className="text-xs font-medium text-slate-700">
                  Aktifkan Aturan Pengalihan
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="text-xs"
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" disabled={loading} className="text-xs">
                  {loading ? "Menyimpan..." : editingRule ? "Simpan Perubahan" : "Buat Aturan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
