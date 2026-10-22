"use client";

import React, { useState } from "react";
import {
  Boxes,
  Factory,
  BarChart3,
  Bot,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  FileSpreadsheet,
  Workflow,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface FeatureTab {
  id: string;
  name: string;
  badge: string;
  headline: string;
  description: string;
  bullets: string[];
  moduleLink: string;
  moduleLinkText: string;
}

const TABS: FeatureTab[] = [
  {
    id: "mes",
    name: "Shop Floor MES",
    badge: "Lantai Produksi Real-Time",
    headline: "Kontrol Detik-ke-Detik Tanpa Catatan Kertas Manual",
    description:
      "Tinggalkan papan tulis dan formulir fisik yang baru dikumpulkan sore hari. Operator menggunakan tablet responsif untuk menerima job card, mencatat output, dan memantau scrap seketika.",
    bullets: [
      "Digital Job Card dengan instruksi kerja (SOP) & gambar teknik digital",
      "Pencatatan scrap, rework, dan waktu setup mesin secara riil",
      "Perhitungan OEE (Availability, Performance, Quality) otomatis per work center",
      "Sinkronisasi langsung ke saldo persediaan dan alur biaya akuntansi",
    ],
    moduleLink: "/modules/mes",
    moduleLinkText: "Pelajari Modul MES Shop Floor",
  },
  {
    id: "inventory",
    name: "Live Inventory & MRP",
    badge: "Presisi Rantai Pasok",
    headline: "Ketahui Persis Stok Tersedia, Terpesan, dan Di Lantai Produksi",
    description:
      "MRP otomatis yang menghitung kebutuhan bahan baku berdasarkan jadwal pesanan penjualan, stok aman (safety stock), dan waktu tunggu pengiriman dari pemasok.",
    bullets: [
      "Immutable Stock Ledger: setiap pergerakan tercatat dengan audit trail lengkap",
      "Pemisahan tegas: On-Hand Fisik, Reserved (Terkunci untuk PO), dan Free Stock",
      "Pelacakan Nomor Lot & Batch untuk masa kedaluwarsa serta kepatuhan audit",
      "Multi-gudang terpadu: Gudang Bahan Baku, WIP Antar-Lini, dan Gudang Barang Jadi",
    ],
    moduleLink: "/modules/erp",
    moduleLinkText: "Pelajari Modul ERP & Inventori",
  },
  {
    id: "costing",
    name: "HPP Aktual & Akuntansi",
    badge: "Profitabilitas Presisi",
    headline: "HPP Riil per Batch Tanpa Menunggu Akhir Bulan",
    description:
      "Hentikan tebak-tebakan margin dengan standar teoretis yang usang. NewSystem mengagregasi biaya aktual dari bahan baku yang dikonsumsi, jam kerja operator, dan overhead mesin secara otomatis.",
    bullets: [
      "Kalkulasi 3 komponen biaya: Direct Material + Direct Labor + Machine Overhead",
      "Jurnal otomatis double-entry pada setiap transaksi fisik barang",
      "Analisis selisih varians (BOM Standar vs Pemakaian Aktual) seketika",
      "Visibilitas margin kotor per produk, per pelanggan, dan per batch pesanan",
    ],
    moduleLink: "/modules/accounting",
    moduleLinkText: "Pelajari Modul Akuntansi & Biaya",
  },
  {
    id: "sales-flow",
    name: "Sales Order ke Produksi",
    badge: "Otomasi Alur Bisnis",
    headline: "Konfirmasi Pesanan Langsung Menjadi Jadwal Lini Pabrik",
    description:
      "Hilangkan miskomunikasi antara Sales dan PPIC. Saat pelanggan menerbitkan PO, sistem langsung memverifikasi ketersediaan material dan kapasitas lini secara instan.",
    bullets: [
      "Quotation B2B dengan estimasi biaya berdasar Master BOM fleksibel",
      "Penerbitan Production Order otomatis begitu Sales Order disetujui",
      "Penetapan tanggal kirim realistis (Available-to-Promise) berbasis antrean mesin",
      "Customer Portal untuk memantau status pesanan dan surat jalan digital",
    ],
    moduleLink: "/modules/crm",
    moduleLinkText: "Pelajari Modul CRM & Sales Order",
  },
  {
    id: "copilot",
    name: "AI Copilot & Otomasi",
    badge: "Kecerdasan Operasional",
    headline: "Asisten Cerdas yang Memahami Data Operasional Pabrik Anda",
    description:
      "Tanyakan status lini atau anomali biaya dalam bahasa sehari-hari. Copilot NewSystem membaca seluruh transaksi bisnis yang terverifikasi tanpa pernah menembus aturan approval.",
    bullets: [
      "Analisis akar masalah: 'Mengapa profit lini minuman botol turun minggu ini?'",
      "Peringatan anomali: deteksi lonjakan scrap di mesin cetak sebelum shift berakhir",
      "Visual Workflow Studio: Otomasi approval dokumen multi-level tanpa kode",
      "Evidence-backed insights: setiap jawaban AI menyertakan referensi nomor transaksi",
    ],
    moduleLink: "/copilot",
    moduleLinkText: "Eksplorasi Kemampuan AI Copilot",
  },
];

export function InteractiveFeatureShowcase() {
  const [activeTabId, setActiveTabId] = useState("mes");
  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  return (
    <div className="w-full">
      {/* Category Pills Navigation (Katana MRP style) */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {tab.id === "mes" && <Factory className="w-3.5 h-3.5" />}
              {tab.id === "inventory" && <Boxes className="w-3.5 h-3.5" />}
              {tab.id === "costing" && <TrendingUp className="w-3.5 h-3.5" />}
              {tab.id === "sales-flow" && <Workflow className="w-3.5 h-3.5" />}
              {tab.id === "copilot" && <Sparkles className="w-3.5 h-3.5" />}
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-10 lg:p-12 overflow-hidden transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-brand-blue">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
              {activeTab.badge}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {activeTab.headline}
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {activeTab.description}
            </p>

            <ul className="space-y-3 pt-2">
              {activeTab.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href={activeTab.moduleLink}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-blue-700 transition-colors group"
              >
                <span>{activeTab.moduleLinkText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Mockup for the specific feature */}
          <div className="lg:col-span-7">
            {activeTabId === "mes" && (
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 text-slate-100 shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <p className="text-xs font-mono font-bold text-white">Workstation CNC-04 // Shift Pagi</p>
                      <p className="text-[11px] text-slate-400">Operator: Ahmad Fauzi (ID: OP-089)</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
                    STATUS: RUNNING
                  </span>
                </div>

                {/* Job Card Details */}
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800/80 mb-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Job Order Aktif:</span>
                    <span className="font-mono text-cyan-400 font-bold">WO-2026-1049 (Flange Stainless 304)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Target / Selesai:</span>
                    <span className="font-mono text-white font-semibold">185 / 250 unit (74%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-blue to-brand-cyan h-2 rounded-full w-[74%]" />
                  </div>
                </div>

                {/* Metric Gauges */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">OEE Riil</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">89.4%</p>
                    <p className="text-[9px] text-slate-500">Benchmark: 85%</p>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Scrap Rate</p>
                    <p className="text-lg font-bold text-amber-400 font-mono mt-0.5">1.2%</p>
                    <p className="text-[9px] text-slate-500">Toleransi: 2.0%</p>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Cycle Time</p>
                    <p className="text-lg font-bold text-sky-400 font-mono mt-0.5">42 det</p>
                    <p className="text-[9px] text-slate-500">Standar: 45 det</p>
                  </div>
                </div>

                {/* Shop Floor Action Bar */}
                <div className="flex items-center justify-between text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Durasi Pengerjaan: <strong>3j 42m</strong></span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-medium text-slate-300">
                      Catat Scrap (+1)
                    </span>
                    <span className="px-2.5 py-1 rounded bg-brand-blue text-[11px] font-semibold text-white">
                      Selesaikan Batch
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTabId === "inventory" && (
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 text-slate-100 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-brand-cyan" />
                    <span className="text-xs font-mono font-bold text-white">Stock Ledger // Live Multi-Gudang</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Auto-Refreshed: Detik ini</span>
                </div>

                {/* Inventory Table Preview */}
                <div className="space-y-2.5 mb-4">
                  {[
                    {
                      sku: "RAW-ALUM-6061",
                      name: "Aluminium Billet 6061 (Batang 6m)",
                      onHand: "420 btg",
                      reserved: "280 btg",
                      free: "140 btg",
                      status: "SAFE",
                      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
                    },
                    {
                      sku: "PKG-BOX-CORR-L",
                      name: "Karton Box Ekspor Double Wall",
                      onHand: "1,200 pcs",
                      reserved: "1,150 pcs",
                      free: "50 pcs",
                      status: "REORDER POINT",
                      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
                    },
                    {
                      sku: "CHEM-RESIN-EPOXY",
                      name: "Resin Epoxy High-Tensile (Drum 200L)",
                      onHand: "18 drum",
                      reserved: "12 drum",
                      free: "6 drum",
                      status: "SAFE",
                      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">{item.sku}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${item.statusColor}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div>
                          <p className="text-[10px] text-slate-500">Stok Fisik</p>
                          <p className="text-white font-medium">{item.onHand}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500">Reserved</p>
                          <p className="text-amber-400 font-medium">{item.reserved}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500">Free Stock</p>
                          <p className="text-emerald-400 font-bold">{item.free}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/50 flex items-center justify-between text-xs text-blue-200">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-cyan" />
                    MRP Otomatis: Draf PO #PO-2026-088 siap diajukan untuk 500 pcs Karton Box.
                  </span>
                  <span className="text-cyan-400 font-semibold cursor-pointer hover:underline">Review</span>
                </div>
              </div>
            )}

            {activeTabId === "costing" && (
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 text-slate-100 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-white">Analisis HPP Aktual // Job Order WO-2026-1049</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                    MARGIN: 31.4%
                  </span>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 mb-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">1. Bahan Baku Langsung (Direct Material)</span>
                      <span className="font-mono text-white font-semibold">Rp 38.500.000 (62%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-sky-500 h-1.5 rounded-full w-[62%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">2. Tenaga Kerja Langsung (Direct Labor)</span>
                      <span className="font-mono text-white font-semibold">Rp 14.200.000 (23%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-1.5 rounded-full w-[23%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">3. Overhead Mesin & Pabrik (Allocated MOH)</span>
                      <span className="font-mono text-white font-semibold">Rp 9.300.000 (15%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-500 h-1.5 rounded-full w-[15%]" />
                    </div>
                  </div>
                </div>

                {/* Summary Table */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <p className="text-[11px] text-slate-400">Total Biaya Produksi Riil</p>
                    <p className="text-lg font-bold text-white font-mono mt-0.5">Rp 62.000.000</p>
                    <p className="text-[10px] text-emerald-400 font-mono">- Rp 1.800.000 di bawah estimasi</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <p className="text-[11px] text-slate-400">HPP Aktual per Unit (250 unit)</p>
                    <p className="text-lg font-bold text-cyan-400 font-mono mt-0.5">Rp 248.000</p>
                    <p className="text-[10px] text-slate-400 font-mono">Harga Jual: Rp 360.000 / unit</p>
                  </div>
                </div>
              </div>
            )}

            {activeTabId === "sales-flow" && (
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 text-slate-100 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-brand-cyan" />
                    <span className="text-xs font-mono font-bold text-white">Alur Otomatis: SO-2026-8802 → Delivery</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">100% TERHUBUNG</span>
                </div>

                {/* Pipeline visual steps */}
                <div className="space-y-3">
                  {[
                    { step: "1. Quotation Disetujui", desc: "Pelanggan menandatangani kontrak PO bernilai Rp 140 Juta", done: true },
                    { step: "2. Verifikasi Bahan Baku MRP", desc: "Stok bebas teralokasi, 2 item pendukung otomatis di-reservasi", done: true },
                    { step: "3. Disposisi Work Order MES", desc: "Job cards diterbitkan ke Lini Sewing & Finishing shift berikutnya", done: true },
                    { step: "4. QC Release & Jurnal HPP", desc: "Surat jalan otomatis tercetak saat barang lolos QC gudang barang jadi", done: false },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        s.done
                          ? "bg-slate-900/80 border-slate-800 text-slate-200"
                          : "bg-slate-900/30 border-slate-800/40 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {s.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-white">{s.step}</p>
                          <p className="text-[11px] text-slate-400">{s.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">
                        {s.done ? "Completed" : "Next"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTabId === "copilot" && (
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 text-slate-100 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-mono font-bold text-white">Company Copilot // Diagnostic Mode</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                    Evidence-Backed
                  </span>
                </div>

                {/* Simulated Conversation */}
                <div className="space-y-3 text-xs mb-4">
                  {/* User Question */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-right">
                    <p className="text-[10px] text-slate-400 mb-1">Direktur Operasional:</p>
                    <p className="text-slate-200 font-medium">
                      "Mengapa scrap di Lini Packaging melonjak 8% kemarin sore?"
                    </p>
                  </div>

                  {/* AI Response */}
                  <div className="bg-purple-950/30 p-3.5 rounded-xl border border-purple-900/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">NewSystem Copilot:</p>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-[11px] sm:text-xs">
                      Berdasarkan cross-check log <strong>Job Card WO-1042</strong> dan catatan maintenance:
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                      <li>Suhu sealing bar Mesin Pack-02 turun ke 165°C pada pukul 14:20 (standar: 180°C).</li>
                      <li>Hal ini menyebabkan 124 pouch bocor sebelum operator menyadari anomali suhu.</li>
                    </ul>
                    <div className="p-2 bg-slate-900/80 rounded border border-purple-900/30 text-[10px] text-purple-300 font-mono">
                      Rekomendasi: Lakukan inspeksi sensor pemanas termokopel pada Work Order Maintenance #MNT-409.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
