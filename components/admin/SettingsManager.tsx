"use client";

import React, { useState } from "react";
import { Sliders, ShieldCheck, Check, AlertCircle, Terminal, Cpu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MaturityState, MATURITY_STATE_CONFIG } from "@/lib/capabilities/status";

interface SettingsManagerProps {
  initialSettings: Record<string, unknown>;
  defaultCapabilities: Record<
    string,
    {
      id: string;
      name: string;
      status: MaturityState;
      summary: string;
    }
  >;
}

export function SettingsManager({ initialSettings, defaultCapabilities }: SettingsManagerProps) {
  const [capabilities, setCapabilities] = useState<Record<string, MaturityState>>(() => {
    const overrides = (initialSettings.capability_overrides as Record<string, MaturityState>) || {};
    const initialMap: Record<string, MaturityState> = {};
    for (const [key, item] of Object.entries(defaultCapabilities)) {
      initialMap[key] = overrides[key] || item.status;
    }
    return initialMap;
  });

  const [general, setGeneral] = useState({
    siteName: (initialSettings.general as { siteName?: string })?.siteName || "NewSystem",
    tagline: (initialSettings.general as { tagline?: string })?.tagline || "One System. Every Process. Smarter Business.",
    contactEmail: (initialSettings.general as { contactEmail?: string })?.contactEmail || "stefen@newsystem.space",
    contactPhone: (initialSettings.general as { contactPhone?: string })?.contactPhone || "+62 822-9675-6759",
    officeAddress:
      (initialSettings.general as { officeAddress?: string })?.officeAddress ||
      "Menara Industri Lt. 18, Kawasan Industri Jababeka & SCBD Jakarta Selatan, Indonesia",
  });

  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingCapabilities, setSavingCapabilities] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "general", value: general }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan pengaturan umum");
      setSuccessMessage("Pengaturan umum berhasil disimpan!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleCapabilitiesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCapabilities(true);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "capability_overrides", value: capabilities }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui status kapabilitas");
      setSuccessMessage("Matriks status kedewasaan produk berhasil diperbarui!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSavingCapabilities(false);
    }
  };

  return (
    <div className="space-y-8">
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
        <h2 className="text-base font-bold text-slate-900 mb-1">Informasi Perusahaan & Situs</h2>
        <p className="text-xs text-slate-500 mb-6">
          Data kontak resmi, tagline korporat, dan alamat operasional yang ditampilkan di footer serta halaman kontak.
        </p>

        <form onSubmit={handleGeneralSubmit} className="space-y-4 text-xs max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Brand / Produk</label>
              <input
                type="text"
                value={general.siteName}
                onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline Resmi</label>
              <input
                type="text"
                value={general.tagline}
                onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Kontak Resmi</label>
              <input
                type="email"
                value={general.contactEmail}
                onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon Kantor</label>
              <input
                type="text"
                value={general.contactPhone}
                onChange={(e) => setGeneral({ ...general, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Kantor / Pabrik Mitra</label>
            <textarea
              rows={2}
              value={general.officeAddress}
              onChange={(e) => setGeneral({ ...general, officeAddress: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" disabled={savingGeneral} className="text-xs">
              {savingGeneral ? "Menyimpan..." : "Simpan Informasi Umum"}
            </Button>
          </div>
        </form>
      </div>

      {/* Capability Maturity Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Matriks Status Kedewasaan Produk (Product Maturity Matrix)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sesuai dengan ketentuan kejujuran produk (Section 1), setiap modul wajib dilabeli status kedewasaan yang akurat: Planned, In Development, Prototype, Pilot Available, atau Generally Available.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-brand-blue border border-blue-200 shrink-0">
            Tata Kelola Terpusat
          </span>
        </div>

        <form onSubmit={handleCapabilitiesSubmit} className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Modul</th>
                  <th className="py-3 px-4">Ringkasan Fungsi</th>
                  <th className="py-3 px-4">Status Kedewasaan Saat Ini</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {Object.entries(defaultCapabilities).map(([slug, item]) => {
                  const currentStatus = capabilities[slug] || item.status;
                  return (
                    <tr key={slug} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-md">{item.summary}</td>
                      <td className="py-3 px-4">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            setCapabilities({
                              ...capabilities,
                              [slug]: e.target.value as MaturityState,
                            })
                          }
                          className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        >
                          {(Object.keys(MATURITY_STATE_CONFIG) as MaturityState[]).map((state) => (
                            <option key={state} value={state}>
                              {MATURITY_STATE_CONFIG[state].label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={savingCapabilities}
              className="text-xs"
            >
              {savingCapabilities ? "Menyimpan Matriks..." : "Perbarui Matriks Kedewasaan"}
            </Button>
          </div>
        </form>
      </div>

      {/* Blog Automation & MCP API Integration Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">
                Integrasi Otomasi Blog & Endpoint API (MCP)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Konfigurasi endpoint dan server MCP untuk otomatisasi posting blog (AI Agent, n8n, Make, script Python, dll.).
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-blue-50 text-brand-blue border border-blue-200">
            cms.newsystem.space
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block">Alamat CMS & Endpoint REST:</span>
            <div className="font-mono text-[11px] bg-slate-900 text-slate-200 p-2.5 rounded-lg overflow-x-auto space-y-1">
              <div><span className="text-emerald-400">CMS URL:</span> https://cms.newsystem.space</div>
              <div><span className="text-brand-cyan">POST</span> /api/v1/posts (Auto-posting)</div>
              <div><span className="text-brand-cyan">GET</span> /api/v1/posts (List artikel)</div>
              <div><span className="text-brand-cyan">GET</span> /api/v1/categories (List kategori)</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block">Model Context Protocol (MCP):</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              NewSystem MCP Server siap dihubungkan langsung ke Claude Desktop, Cursor, Antigravity, atau agent LLM lainnya.
            </p>
            <div className="font-mono text-[11px] bg-slate-900 text-slate-200 p-2.5 rounded-lg overflow-x-auto">
              <span className="text-amber-400">node</span> scripts/blog-mcp-server.mjs
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-semibold text-slate-800 text-xs block">Contoh Perintah cURL Publikasi Otomatis:</span>
          <pre className="font-mono text-[11px] bg-slate-900 text-emerald-300 p-4 rounded-xl overflow-x-auto whitespace-pre leading-relaxed">
{`curl -X POST https://cms.newsystem.space/api/v1/posts \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer newsystem_dev_automation_key" \\
  -d '{
    "title": "Optimasi Alur Work Order Pabrik Modern",
    "content": "## Pendahuluan\\n\\nArtikel otomasi langsung dipublikasikan...",
    "category": "erp-core",
    "author": "Stefen",
    "tags": ["ERP", "Shop Floor", "Otomasi"],
    "status": "PUBLISHED"
  }'`}
          </pre>
        </div>
      </div>
    </div>
  );
}
