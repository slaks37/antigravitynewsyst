"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, Copy, Check, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  altText: string | null;
  caption: string | null;
  createdAt: string;
}

export function MediaManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [altText, setAltText] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", altText || file.name);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah berkas");

      setMediaList((prev) => [
        {
          ...data.media,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      if (fileInputRef.current) fileInputRef.current.value = "";
      setAltText("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus berkas "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus berkas");

      setMediaList((prev) => prev.filter((m) => m.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus berkas");
    }
  };

  const filtered = mediaList.filter(
    (m) =>
      m.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.altText && m.altText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
        <h2 className="text-sm font-bold text-slate-900 mb-2">Unggah Berkas Baru</h2>
        <p className="text-xs text-slate-500 mb-4">
          Unggah gambar ilustrasi artikel, diagram proses manufaktur, atau visual dokumen. Format didukung: PNG, JPG, WebP, SVG.
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            disabled={isUploading}
            accept="image/*"
            className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100 cursor-pointer"
          />
          {isUploading && (
            <span className="text-xs font-semibold text-brand-blue animate-pulse">
              Mengunggah media ke server...
            </span>
          )}
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari media atau teks alt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
        <p className="text-xs text-slate-500">
          Menampilkan {filtered.length} dari {mediaList.length} media
        </p>
      </div>

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Media Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Belum ada gambar yang sesuai dengan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => {
            const isImage = item.mimeType.startsWith("image/");
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.fileUrl}
                      alt={item.altText || item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                {/* Details */}
                <div className="p-3 text-xs flex flex-col justify-between flex-1">
                  <div>
                    <p className="font-semibold text-slate-900 truncate" title={item.originalName}>
                      {item.originalName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {Math.round(item.fileSize / 1024)} KB
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(item.fileUrl, item.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:underline"
                      title="Salin URL Gambar"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.originalName)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Hapus Media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
