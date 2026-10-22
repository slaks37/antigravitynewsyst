import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Boxes,
  Factory,
  TrendingUp,
  Workflow,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Zap,
  Quote,
  Star,
  Layers,
  Cpu,
  BarChart3,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { SimulatedBadge } from "@/components/ui/SimulatedBadge";
import { LeadForm } from "@/components/marketing/LeadForm";
import { getLatestArticles } from "@/lib/data/blog-service";
import { CAPABILITY_STATUSES } from "@/lib/capabilities/status";
import { InteractiveFeatureShowcase } from "@/components/marketing/InteractiveFeatureShowcase";
import { ComparisonMatrix } from "@/components/marketing/ComparisonMatrix";

export default async function HomePage() {
  const latestArticles = await getLatestArticles(3);

  const coreModulesList = [
    {
      id: "erp",
      name: "ERP Core",
      subtitle: "Perencanaan & Inventori Terpadu",
      problem: "Stok spreadsheet selisih dengan fisik, pembelian bahan baku telat atau berlebih.",
      capability: "Pengadaan, multi-gudang, BOM revisi, routing, MRP, dan reservasi stok.",
      connections: "Terhubung otomatis ke MES, CRM, dan Akuntansi.",
      href: "/modules/erp",
      status: CAPABILITY_STATUSES.erp.status,
    },
    {
      id: "mes",
      name: "MES Shop Floor",
      subtitle: "Eksekusi Manufaktur Real-Time",
      problem: "Progres mesin tidak terlacak, scrap baru diketahui akhir shift, mandor mencatat manual.",
      capability: "Digital job cards, dispatching workstation, pelacakan output, scrap, & jam kerja.",
      connections: "Memperbarui stock ledger ERP dan biaya tenaga kerja akuntansi.",
      href: "/modules/mes",
      status: CAPABILITY_STATUSES.mes.status,
    },
    {
      id: "accounting",
      name: "Accounting & Costing",
      subtitle: "Double-Entry & HPP Aktual",
      problem: "Laporan laba rugi terlambat 2 minggu, HPP hanya estimasi teoretis standar.",
      capability: "Jurnal otomatis tiap pergerakan barang, AR/AP, rekonsiliasi, dan HPP aktual per order.",
      connections: "Menerima data biaya riil dari pengadaan ERP dan job card MES.",
      href: "/modules/accounting",
      status: CAPABILITY_STATUSES.accounting.status,
    },
    {
      id: "crm",
      name: "CRM Manufaktur",
      subtitle: "Pipeline Sales & Kontrak B2B",
      problem: "Sales menjanjikan tanggal kirim tanpa tahu kapasitas lini dan ketersediaan bahan.",
      capability: "Manajemen prospek pabrik, quotation berdasar estimasi BOM, hingga Sales Order.",
      connections: "Memicu verifikasi stok ERP dan penerbitan Production Order.",
      href: "/modules/crm",
      status: CAPABILITY_STATUSES.crm.status,
    },
    {
      id: "hris",
      name: "HRIS & Direct Labor",
      subtitle: "Karyawan, Shift & Biaya Kerja",
      problem: "Biaya lembur membengkak dan tidak teralokasi ke harga pokok produk bersangkutan.",
      capability: "Shift kerja pabrik, absensi, payroll, dan pembebanan direct labor ke job orders.",
      connections: "Menghitung biaya tenaga kerja langsung untuk komponen HPP.",
      href: "/modules/hris",
      status: CAPABILITY_STATUSES.hris.status,
    },
    {
      id: "quality",
      name: "Quality Management (QMS)",
      subtitle: "Kepatuhan Mutu & Penahanan Lot",
      problem: "Material cacat terlanjur masuk lini perakitan, riwayat lot supplier tidak terlacak.",
      capability: "Inspeksi IQC, IPQC, OQC, penahanan lot cacat (lot hold), dan alur investigasi NCR.",
      connections: "Mengunci status stok di ERP agar tidak dapat dikeluarkan gudang.",
      href: "/modules/quality",
      status: CAPABILITY_STATUSES.quality.status,
    },
    {
      id: "maintenance",
      name: "Maintenance (CMMS)",
      subtitle: "Pencegahan Kerusakan Mesin",
      problem: "Mesin mati mendadak di tengah deadline pesanan, spare part kritis tidak tersedia.",
      capability: "Jadwal pemeliharaan preventif, log downtime, work order perbaikan, & stok suku cadang.",
      connections: "Sinkronisasi status mesin offline ke jadwal dispatching MES.",
      href: "/modules/maintenance",
      status: CAPABILITY_STATUSES.maintenance.status,
    },
    {
      id: "automation",
      name: "Workflow Automation",
      subtitle: "Otomasi Approval Lintas Tim",
      problem: "Persetujuan dokumen tertahan berhari-hari di meja manajer yang sedang dinas.",
      capability: "Visual workflow builder: Event → Condition → Approval → Action → Notification.",
      connections: "Menghubungkan trigger dari seluruh modul tanpa coding khusus.",
      href: "/modules/automation",
      status: CAPABILITY_STATUSES.automation.status,
    },
    {
      id: "workspace",
      name: "Smart Workspace & DMS",
      subtitle: "Dokumen Resmi dari Data Bisnis",
      problem: "PO, invoice, dan surat jalan dibuat ulang manual di Word sehingga rentan salah ketik.",
      capability: "Penerbitan dokumen resmi dari data transaksi, manajemen SOP, dan versi file.",
      connections: "Merender rekaman transaksi bisnis resmi menjadi dokumen terotorisasi.",
      href: "/modules/workspace",
      status: CAPABILITY_STATUSES.workspace.status,
    },
    {
      id: "intelligence",
      name: "Business Intelligence",
      subtitle: "Visibilitas Eksekutif Terpadu",
      problem: "Direksi harus meminta laporan dari 5 manajer berbeda untuk memahami profit bulan lalu.",
      capability: "Dashboard analitik terpadu: margin kontribusi per produk, OEE mesin, dan arus kas.",
      connections: "Membaca data terverifikasi dari seluruh modul operasional.",
      href: "/modules/intelligence",
      status: CAPABILITY_STATUSES.intelligence.status,
    },
  ];

  // Structured Data for Google Rich Snippets (SoftwareApplication & FAQPage)
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NewSystem Manufacturing Operating System",
    operatingSystem: "Cloud Web Platform (Responsive Desktop & Tablet)",
    applicationCategory: "BusinessApplication",
    description:
      "Cloud ERP & MES software for modern Indonesian manufacturers. Integrates live shop floor tracking, inventory management, actual costing, and AI copilot.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "38",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Apa perbedaan NewSystem dengan ERP konvensional?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ERP konvensional hanya fokus pada pencatatan transaksi pembukuan di kantor. NewSystem menyatukan ERP dengan Manufacturing Execution System (MES) di lantai produksi secara real-time, sehingga kalkulasi HPP dan pergerakan stok sinkron tanpa jeda hari.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah NewSystem cocok untuk pabrik yang masih memakai Excel / spreadsheet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sangat cocok. NewSystem dirancang dengan antarmuka modern yang intuitif dan menyediakan alur migrasi bertahap, mulai dari inventori dan BOM hingga eksekusi job order tanpa menghentikan operasional harian.",
        },
      },
      {
        "@type": "Question",
        name: "Berapa lama proses implementasi NewSystem?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dengan template industri siap pakai untuk sektor General, F&B, Garment, dan Furnitur, implementasi dasar NewSystem dapat go-live dalam waktu 2 hingga 4 minggu.",
        },
      },
    ],
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-20 overflow-hidden">
      {/* Structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* ========================================================================= */}
      {/* SECTION 1 — HERO SECTION (KATANA MRP / FULCRUM PRO STYLE)                */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-16 lg:pt-20">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-brand-blue/15 via-brand-cyan/15 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Announcement Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-xs sm:text-sm font-semibold text-brand-blue mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span>Generasi Baru Cloud ERP & MES Manufaktur Indonesia</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12] mb-6">
            Sistem Operasi Cerdas untuk{" "}
            <span className="bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-indigo bg-clip-text text-transparent">
              Manufaktur Modern
            </span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Tinggalkan ERP warisan yang kaku dan spreadsheet terpisah. Hubungkan seluruh alur pabrik Anda—mulai dari Penjualan, Rencana Produksi (MRP), Eksekusi Lantai Pabrik (MES), hingga Akuntansi & HPP Aktual dalam satu platform real-time.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-blue-500/20 px-8 py-3.5 text-base font-bold">
              Jadwalkan Konsultasi Pabrik
            </Button>
            <Button href="/platform" variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold border-slate-300 hover:bg-slate-100">
              Pelajari Platform
            </Button>
          </div>

          {/* TRUST / VALIDATION BAR (Katana MRP style) */}
          <div className="pt-4 pb-12 border-t border-slate-200/80 max-w-4xl mx-auto">
            <p className="text-xs uppercase font-bold tracking-widest text-slate-600 mb-5">
              Dipercaya & Divalidasi untuk Berbagai Sektor Manufaktur di Indonesia
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs font-semibold text-slate-700">
              {[
                { name: "Food & Beverage", sub: "Batch & Expired Control" },
                { name: "General Manufacturing", sub: "Multi-Routing & PPIC" },
                { name: "Garment & Tekstil", sub: "Matrix Size & Sewing Line" },
                { name: "Furnitur & Rakit", sub: "Multi-Level BOM & Custom" },
                { name: "Precision & Logam", sub: "OEE & QC Lot Hold" },
              ].map((sec, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white/80 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center hover:border-slate-300 transition-colors"
                >
                  <span className="font-bold text-slate-900">{sec.name}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{sec.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — INTERACTIVE FEATURE SHOWCASE (KATANA MRP TABBED PREVIEW)      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Eksplorasi Platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Satu Sistem untuk Setiap Sudut Operasional Pabrik
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Lihat bagaimana NewSystem mengotomatisasi aliran data dari lantai produksi hingga pembukuan keuangan eksekutif.
          </p>
        </div>

        <InteractiveFeatureShowcase />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — MEASURABLE BUSINESS IMPACT & METRICS (ROI STATS)               */}
      {/* ========================================================================= */}
      <section className="bg-navy text-white py-16 sm:py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-4 border-r border-slate-800/80 last:border-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-brand-cyan font-mono">+35%</p>
              <p className="text-sm font-semibold text-white mt-2">Kapasitas Output Pabrik</p>
              <p className="text-xs text-slate-400 mt-1">Downtime terminimalisir via dispatching MES terpadu.</p>
            </div>
            <div className="p-4 border-r border-slate-800/80 last:border-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-white font-mono">99.4%</p>
              <p className="text-sm font-semibold text-white mt-2">Akurasi Stok Gudang</p>
              <p className="text-xs text-slate-400 mt-1">Immutable stock ledger dengan pelacakan batch lot.</p>
            </div>
            <div className="p-4 border-r border-slate-800/80 last:border-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono">-50%</p>
              <p className="text-sm font-semibold text-white mt-2">Waktu Tutup Buku & HPP</p>
              <p className="text-xs text-slate-400 mt-1">Jurnal otomatis tiap pergerakan barang riil.</p>
            </div>
            <div className="p-4">
              <p className="text-4xl sm:text-5xl font-extrabold text-purple-400 font-mono">&lt; 3 Mgg</p>
              <p className="text-sm font-semibold text-white mt-2">Go-Live Cepat & Mulus</p>
              <p className="text-xs text-slate-400 mt-1">Template industri terkonfigurasi tanpa kustom coding rumit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — COMPARISON MATRIX (SPREADSHEET VS LEGACY ERP VS NEWSYSTEM)    */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Perbandingan Solusi
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Mengapa Pabrik Beralih ke NewSystem?
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Bandingkan fleksibilitas dan presisi NewSystem terhadap kerumitan spreadsheet dan kekakuan ERP warisan.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-4 sm:p-8">
          <ComparisonMatrix />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — CUSTOMER TESTIMONIAL & CASE HIGHLIGHT                         */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 rounded-3xl border border-blue-100 p-8 sm:p-12 shadow-sm text-center relative">
          <Quote className="w-10 h-10 text-brand-blue/30 mx-auto mb-4" />
          <blockquote className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed max-w-3xl mx-auto mb-6">
            &ldquo;Dulu kami harus menunggu 2 minggu setelah akhir bulan hanya untuk mengetahui apakah pesanan ekspor kami untung atau rugi. Dengan integrasi job card MES dan HPP NewSystem, kami langsung tahu margin aktual saat batch selesai dirakit di lini packing.&rdquo;
          </blockquote>
          <div className="flex flex-col items-center">
            <p className="font-bold text-slate-900 text-sm">Direktur Operasional Manufaktur</p>
            <p className="text-xs text-slate-500">Pabrik Perakitan & Komponen Mesin — Jawa Barat</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — CORE MODULES MATRIX (THE 10 UNIFIED PILLARS)                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Arsitektur Terpadu
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            10 Modul Inti. Nol Data yang Bertentangan.
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Setiap modul beroperasi pada skema basis data bersama. Satu kejadian di shop floor otomatis mengalir ke seluruh ekosistem tanpa rekonsiliasi manual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreModulesList.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-blue" />
                    <h3 className="font-bold text-slate-900 text-base">{m.name}</h3>
                  </div>
                  <MaturityBadge status={m.status} />
                </div>
                <p className="text-xs font-semibold text-brand-blue mb-3">{m.subtitle}</p>

                <div className="space-y-3 text-xs mb-6">
                  <div className="p-2.5 bg-rose-50/70 rounded-lg border border-rose-100 text-slate-700">
                    <strong className="text-rose-700 block mb-0.5">Tantangan Lapangan:</strong>
                    {m.problem}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-slate-700">
                    <strong className="text-slate-900 block mb-0.5">Solusi NewSystem:</strong>
                    {m.capability}
                  </div>
                </div>
              </div>

              <Link
                href={m.href}
                className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center justify-between pt-3 border-t border-slate-100 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Pelajari Detail Modul</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7 — INDUSTRY SOLUTIONS                                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Solusi Siap Pakai
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Disesuaikan dengan Karakteristik Industri Anda
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Setiap sektor manufaktur memiliki variabel unik yang sudah kami petakan dalam konfigurasi alur NewSystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "General Manufacturing",
              desc: "Work centers fleksibel, routing bertahap, perhitungan efisiensi lintasan, dan kontrol biaya produksi terpadu.",
              href: "/solutions/general-manufacturing",
              points: ["Perencanaan PPIC", "Job Cards Shop Floor", "HPP Aktual Riil"],
            },
            {
              title: "Food & Beverage (F&B)",
              desc: "Manajemen produksi batch, resep formula, tanggal kedaluwarsa, pemantauan yield, dan kepatuhan higienis BPOM/Halal.",
              href: "/solutions/food-beverage",
              points: ["Kontrol Expired Lot", "Yield & Susut Bahan", "Pencatatan Batch"],
            },
            {
              title: "Garment & Tekstil",
              desc: "Matriks varian ukuran & warna, pemotongan kain (cutting marker), alur sewing berurutan, dan produktivitas per operator.",
              href: "/solutions/garment",
              points: ["Matrix Size & Color", "Cutting & Sewing Lines", "Defect Tracking"],
            },
            {
              title: "Furnitur & Assembly",
              desc: "Struktur multi-level BOM (kayu, busa, finishing, hardware), pesanan Make-to-Order custom, dan pelacakan biaya per order.",
              href: "/solutions/furniture-assembly",
              points: ["Multi-Level BOM", "Custom Job Orders", "Costing Sub-Assembly"],
            },
          ].map((ind, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{ind.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{ind.desc}</p>
                <ul className="space-y-1.5 mb-6 text-xs text-slate-700">
                  {ind.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={ind.href}
                className="text-xs font-semibold text-brand-blue hover:text-blue-700 flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Lihat Solusi Industri</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8 — BLOG & OPERATIONAL INSIGHTS (KATANA MRP / FULCRUM STYLE)      */}
      {/* ========================================================================= */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
                Pusat Pengetahuan Manufaktur
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Artikel & Wawasan Operasional Terbaru
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1.5 shrink-0"
            >
              <span>Jelajahi Seluruh Artikel Blog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {latestArticles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-brand-blue font-bold text-[11px] border border-blue-100">
                      {art.categoryName || "Manufaktur"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readingTimeMinutes} mnt baca
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-2 leading-snug">
                    <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-5">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{art.authorName || "Tim NewSystem"}</span>
                  <Link
                    href={`/blog/${art.slug}`}
                    className="font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Baca Artikel</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9 — FINAL HIGH-CONVERTING CTA (KATANA / FULCRUM PRO STYLE)        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          {/* Ambient blue glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 inline-block">
                Design Partner Program — Terbuka Terbatas
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                Siap Memodernisasi Operasional Pabrik Anda?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Diskusikan tantangan alur kerja lantai produksi, selisih stok, atau kalkulasi HPP pabrik Anda bersama tim solusi NewSystem. Kami akan memetakan proses bisnis dan mendemonstrasikan solusinya.
              </p>

              <div className="space-y-3 text-sm text-slate-300 pt-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0" />
                  <span>Akses prioritas penuh ke seluruh modul ERP & MES.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0" />
                  <span>Pendampingan pemetaan proses bisnis langsung dari arsitek sistem.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0" />
                  <span>Jaminan keamanan data terenkripsi dan kedaulatan server di Indonesia.</span>
                </div>
              </div>
            </div>

            {/* Direct Consultation / Lead Form */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 text-slate-900 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Jadwalkan Konsultasi Pabrik
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Isi data pabrik Anda untuk konsultasi alur kerja dan demonstrasi sistem.
              </p>

              <LeadForm
                variant="DESIGN_PARTNER"
                sourcePage="homepage-final-cta"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
