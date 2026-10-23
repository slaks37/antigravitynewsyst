import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Cpu,
  Layers,
  Building2,
  Workflow,
  BarChart3,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SimulatedBadge } from "@/components/ui/SimulatedBadge";

export const metadata: Metadata = {
  alternates: { canonical: "/platform" },
  title: "Arsitektur Platform & Unified Operating System",
  description:
    "Pelajari arsitektur terpadu NewSystem: transactional core berprinsip single system of record, dukungan multi-company/multi-plant, dan tata kelola keamanan enterprise.",
};

export default function PlatformPage() {
  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 pt-12 pb-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
            Fondasi Arsitektur
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Satu Arsitektur Terpadu. Tanpa Kompromi Fragmentasi.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            NewSystem dibangun sebagai sistem operasi modular terintegrasi dengan bounded contexts eksplisit, transactional outbox, dan single source of truth untuk setiap objek bisnis.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="primary" size="lg">
              Diskusikan Kebutuhan Pabrik
            </Button>
            <Button href="/modules" variant="outline" size="lg">
              Eksplorasi Seluruh Modul
            </Button>
          </div>
        </div>
      </section>

      {/* 1. UNIFIED OPERATING SYSTEM */}
      <section id="unified-architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
              Prinsip Desain Inti
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Single System of Record per Objek Bisnis
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              Di sistem konvensional, stok dicatat di modul gudang, sementara accounting memiliki tabel persediaannya sendiri yang sering tidak seimbang. NewSystem memecahkan masalah ini dengan kepemilikan domain yang tegas:
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <strong className="text-slate-900 block mb-0.5">Kuantitas Stok Resmi:</strong>
                Dimiliki secara eksklusif oleh ERP Inventory. Mutasi stok dicatat permanen dalam Stock Ledger.
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <strong className="text-slate-900 block mb-0.5">Valuasi Persediaan & GL:</strong>
                Dimiliki oleh Accounting. Jurnal otomatis terbentuk dari pergerakan barang riil.
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <strong className="text-slate-900 block mb-0.5">Eksekusi Lantai Produksi:</strong>
                Dimiliki oleh MES Shop Floor melalui pelacakan job cards, output aktual, dan jam operator.
              </div>
            </div>
          </div>

          <div className="bg-navy rounded-3xl p-8 text-white shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <span className="text-xs font-mono text-brand-cyan font-bold">domain-ownership-matrix</span>
              <SimulatedBadge label="Arsitektur Bounded Context" />
            </div>
            <div className="space-y-4 text-xs font-mono">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <p className="text-slate-400">{"// CRM Domain"}</p>
                <p className="text-sky-300">Customer → Quotation → Confirmed Sales Order</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <p className="text-slate-400">{"// ERP Domain"}</p>
                <p className="text-blue-300">MRP → Purchase Order → Goods Receipt → Stock Ledger</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <p className="text-slate-400">{"// MES Domain"}</p>
                <p className="text-cyan-300">Work Center → Job Card → Scrap/Rework Log → Operator Hours</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <p className="text-slate-400">{"// Accounting Domain"}</p>
                <p className="text-indigo-300">General Ledger → Double-Entry Journal → Actual HPP Costing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MULTI-COMPANY & MULTI-PLANT */}
      <section id="multi-plant" className="bg-slate-100/70 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
              Skalabilitas Enterprise
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dirancang untuk Grup Usaha Multi-Company & Multi-Plant
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Kelola beberapa entitas hukum, holding perusahaan, dan puluhan fasilitas pabrik dalam satu konsol terpusat tanpa kehilangan batas isolasi data antar entitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Legal Entity Context</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap transaksi keuangan, pajak faktur, dan neraca pembukuan memiliki konteks entitas hukum yang jelas untuk memudahkan konsolidasi audit.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Plant Routing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kapasitas mesin dan gudang diatur per fasilitas pabrik spesifik. Perpindahan antar-pabrik diperlakukan sebagai transfer resmi yang terekam.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Inter-Company Transactions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dukungan transaksi jual-beli antar anak perusahaan dengan eliminasi otomatis pada laporan konsolidasi holding grup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECURITY & GOVERNANCE */}
      <section id="security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 block">
            Kepatuhan & Keamanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Keamanan Data & Tata Kelola Hak Akses (RBAC)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Pemisahan wewenang yang ketat (Segregation of Duties) menjamin integritas operasional dan mencegah kebocoran data industri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Granular RBAC",
              desc: "Hak akses berbasis peran: operator, mandor, staf purchasing, akuntan, manajer, hingga level direksi.",
            },
            {
              title: "Audit Trail Lengkap",
              desc: "Setiap perubahan data, persetujuan transaksi, dan ekspor file terekam dengan timestamp dan identitas pengguna.",
            },
            {
              title: "Enkripsi End-to-End",
              desc: "Data tersimpan terenkripsi dengan standar industri AES-256 dan komunikasi data terlindungi TLS 1.3.",
            },
            {
              title: "Tenant Isolation",
              desc: "Isolasi data yang ketat pada tingkat database untuk menjamin kerahasiaan kekayaan intelektual resep/BOM pabrik.",
            },
          ].map((sec, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex flex-col justify-between"
            >
              <div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{sec.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
