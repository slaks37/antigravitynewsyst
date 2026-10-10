"use client";

import React, { useState } from "react";
import { Users, Plus, Edit2, Trash2, X, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Author {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  role: string | null;
  bio: string | null;
  avatarUrl: string | null;
  active: boolean;
}

export function AuthorsManager({ initialAuthors }: { initialAuthors: Author[] }) {
  const [authorsList, setAuthorsList] = useState<Author[]>(initialAuthors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingAuthor(null);
    setName("");
    setSlug("");
    setEmail("");
    setRole("");
    setBio("");
    setAvatarUrl("");
    setActive(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (author: Author) => {
    setEditingAuthor(author);
    setName(author.name);
    setSlug(author.slug);
    setEmail(author.email || "");
    setRole(author.role || "");
    setBio(author.bio || "");
    setAvatarUrl(author.avatarUrl || "");
    setActive(author.active);
    setError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingAuthor) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        slug,
        email: email || null,
        role: role || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        active,
      };

      if (editingAuthor) {
        const res = await fetch(`/api/admin/authors/${editingAuthor.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal memperbarui profil penulis");

        setAuthorsList((prev) =>
          prev.map((a) => (a.id === editingAuthor.id ? data.author : a))
        );
      } else {
        const res = await fetch("/api/admin/authors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal membuat penulis");

        setAuthorsList((prev) => [...prev, data.author]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, authorName: string) => {
    if (!confirm(`Hapus penulis "${authorName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/authors/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus penulis");

      setAuthorsList((prev) => prev.filter((a) => a.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus penulis");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daftar Penulis & Analis</h2>
          <p className="text-xs text-slate-500">
            Total {authorsList.length} kontributor editorial dan analis industri manufaktur.
          </p>
        </div>
        <Button onClick={openCreateModal} variant="primary" className="text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Tambah Penulis
        </Button>
      </div>

      {/* Authors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Penulis</th>
                <th className="py-3 px-4">Jabatan / Keahlian</th>
                <th className="py-3 px-4">Slug Publik</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {authorsList.map((author) => (
                <tr key={author.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{author.name}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm">
                      {author.bio || "Belum ada bio"}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {author.role || "—"}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-brand-blue">
                    /blog/author/{author.slug}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-600">
                    {author.email || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        author.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {author.active ? "Aktif" : "Non-Aktif"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(author)}
                      className="p-1 text-slate-500 hover:text-brand-blue transition-colors"
                      title="Edit Penulis"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(author.id, author.name)}
                      className="p-1 text-slate-500 hover:text-rose-600 transition-colors"
                      title="Hapus Penulis"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingAuthor ? "Edit Profil Penulis" : "Tambah Penulis Baru"}
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
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Budi Santoso, M.T."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="budi-santoso"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jabatan / Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Manufacturing Systems Architect"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@newsystem.id"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Biografi Ringkas</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Praktisi sistem operasional pabrik dengan pengalaman 15 tahun di industri perakitan..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Avatar / Foto</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://... atau /brand/avatar.jpg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="authorActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                />
                <label htmlFor="authorActive" className="text-xs font-medium text-slate-700">
                  Aktifkan Profil Penulis untuk Publikasi
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
                  {loading ? "Menyimpan..." : editingAuthor ? "Simpan Perubahan" : "Tambah Penulis"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
