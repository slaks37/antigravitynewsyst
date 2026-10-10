"use client";

import React, { useState } from "react";
import { Sparkles, Bot, CheckCircle2, Copy, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AiAssistantPage() {
  const [mode, setMode] = useState<"outline" | "headline" | "meta" | "claim_check">("outline");
  const [topic, setTopic] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/ai/editorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, topic, currentContent }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses permintaan AI.");

      setResult(data.suggestion);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-indigo" />
          <span>AI Editorial Assistant</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Bantu tim editorial merancang outline artikel teknis, mengoptimasi judul, dan memverifikasi kepatuhan klaim.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Pilih Mode Bantuan AI:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "outline", label: "Struktur Outline Artikel" },
                  { id: "headline", label: "Optimasi Judul (Headlines)" },
                  { id: "meta", label: "Draf Meta Description" },
                  { id: "claim_check", label: "Pemeriksaan Kepatuhan Klaim" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id as any)}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                      mode === m.id
                        ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Topik Utama / Masalah Manufaktur <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="misal: Mengapa stok fisik kain sering selisih dengan sistem ERP"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {mode === "claim_check" && (
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Teks Artikel yang Ingin Diperiksa Klaimnya:
                </label>
                <textarea
                  rows={4}
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  placeholder="Tempelkan paragraf artikel di sini..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none"
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Rekomendasi...</span>
                </span>
              ) : (
                "Jalankan Analisis AI"
              )}
            </Button>
          </form>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Box */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Hasil Rekomendasi Asisten
            </h2>
            {result && (
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
              </button>
            )}
          </div>

          {!result ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <Bot className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p>Pilih mode di sebelah kiri dan masukkan topik untuk menghasilkan draf.</p>
            </div>
          ) : (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
