import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Boxes,
  Factory,
  Cpu,
  BarChart3,
  Bot,
  Layers,
  Workflow,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRightLeft,
  ChevronRight,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { SimulatedBadge } from "@/components/ui/SimulatedBadge";
import { LeadForm } from "@/components/marketing/LeadForm";
import { getDatabase } from "@/lib/db";
import { posts, categories, authors } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { CAPABILITY_STATUSES } from "@/lib/capabilities/status";

// Query latest articles from PostgreSQL
async function getLatestArticles() {
  try {
    const db = getDatabase();
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        publishedAt: posts.publishedAt,
        readingTimeMinutes: posts.readingTimeMinutes,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: authors.name,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
      .leftJoin(authors, eq(posts.authorId, authors.id))
      .where(eq(posts.status, "PUBLISHED"))
      .orderBy(desc(posts.publishedAt))
      .limit(3);

    return result;
  } catch (err) {
    console.error("Failed to fetch latest articles:", err);
    return [];
  }
}

export default async function HomePage() {
  const latestArticles = await getLatestArticles();

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

  return (
    <div className="space-y-24 sm:space-y-32 pb-20 overflow-hidden">
      {/* ========================================================================= */}
      {/* SECTION 1 — HERO                                                          */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-16 lg:pt-20">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-brand-blue/10 via-brand-cyan/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs sm:text-sm font-semibold text-brand-blue mb-8 animate-in fade-in slide-in-from-bottom-2">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-ping" />
            <span>One System. Every Process. Smarter Business.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15] mb-6">
            Sistem Operasi Cerdas untuk{" "}
            <span className="bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-indigo bg-clip-text text-transparent">
              Manufaktur Modern
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            NewSystem dirancang untuk menghubungkan seluruh operasional pabrik Anda—mulai dari penjualan, pengadaan, inventori, eksekusi lantai produksi, dan tenaga kerja hingga pembukuan keuangan, dokumen resmi, otomasi, dan kecerdasan AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
              Diskusikan Pabrik Anda
            </Button>
            <Button href="/platform" variant="outline" size="lg" className="w-full sm:w-auto">
              Pelajari Platform
            </Button>
          </div>

          {/* Interconnected Modules Architecture Visual Concept */}
          <div className="relative mx-auto max-w-5xl rounded-2xl bg-navy border border-slate-800 p-4 sm:p-8 shadow-2xl text-left overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-mono ml-2">
                  newsystem-operating-system // interconnected-core
                </span>
              </div>
              <SimulatedBadge label="Konsep Arsitektur Terpadu" />
            </div>

            {/* Architecture Node Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
              {[
                { name: "CRM", label: "Demand & Sales", color: "border-sky-500/30 text-sky-400" },
                { name: "ERP", label: "Inventory & BOM", color: "border-blue-500/30 text-blue-400" },
                { name: "MES", label: "Shop Floor & Job Card", color: "border-cyan-500/30 text-cyan-400" },
                { name: "QMS", label: "QC & Lot Hold", color: "border-emerald-500/30 text-emerald-400" },
                { name: "Accounting", label: "HPP & Double-Entry", color: "border-indigo-500/30 text-indigo-400" },
                { name: "AI Copilot", label: "Cross-Domain Intelligence", color: "border-purple-500/30 text-purple-400" },
              ].map((node) => (
                <div
                  key={node.name}
                  className={`p-3 rounded-xl bg-slate-900/80 border ${node.color} flex flex-col justify-between`}
                >
                  <p className="text-xs font-bold">{node.name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{node.label}</p>
                </div>
              ))}
            </div>

            {/* Visual Process Flow Ribbon */}
            <div className="bg-slate-900/60 rounded-xl p-4 sm:p-5 border border-slate-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium text-white">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  Satu Transaksi Menyebar Otomatis:
                </span>
                <span className="text-slate-400 font-mono text-[11px] sm:text-xs text-center sm:text-right">
                  Sales Order → MRP PPIC → Work Order MES → Sub-Ledger HPP → Laporan Margin
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — START WITH THE PROBLEM                                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
            Fragmentasi Operasional
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Pabrik Anda Berjalan Sebagai Satu Bisnis. Mengapa Sistem Anda Terpisah-Pisah?
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Sebagian besar pabrik tidak kekurangan aplikasi. Mereka menderita karena data terperangkap di pulau-pulau sistem yang tidak saling bicara.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Pesanan Penjualan Dicatat Terpisah",
              desc: "Tim sales menggunakan CRM atau spreadsheet tersendiri. PPIC baru mengetahui pesanan masuk setelah dikirim via chat, memicu keterlambatan pengadaan material.",
            },
            {
              title: "Inventori Dikelola di Lembar Excel",
              desc: "Formula yang tidak sengaja terhapus dan kelalaian update membuat catatan stok di kantor berbeda jauh dengan tumpukan fisik di rak gudang.",
            },
            {
              title: "Status Lantai Produksi Manual",
              desc: "Mandor mengumpulkan kertas laporan di akhir shift. Downtime mesin dan barang reject baru diketahui berjam-jam setelah peristiwa terjadi.",
            },
            {
              title: "Data HR Terputus dari Biaya Tenaga Kerja",
              desc: "Gaji dihitung bulanan oleh HR, namun jam kerja riil dan lembur operator tidak pernah dibebankan secara presisi ke job order produksi.",
            },
            {
              title: "Finance Menghitung HPP Setelah Selesai",
              desc: "Manajemen baru menyadari pesanan merugi saat tutup buku bulanan tiba, tanpa sempat melakukan mitigasi scrap dan pemborosan.",
            },
            {
              title: "Dokumen Resmi Tercecer Tanpa Validasi",
              desc: "PO, invoice, dan surat jalan dibuat ulang manual di word processor sehingga rawan salah ketik nominal dan tidak sesuai riwayat transaksi.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-premium hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — INTRODUCING NEWSYSTEM FLOW                                    */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-2 block">
              Sinergi Alur Terpadu
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Hubungkan Setiap Departemen. Pahami Setiap Keputusan.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Ketika satu transaksi terjadi, NewSystem menyebarkan dampaknya secara atomik ke seluruh fungsi operasional tanpa re-entry manual.
            </p>
          </div>

          {/* Sequential Process Diagram */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10">
              {[
                { step: "01", name: "CRM", role: "Penerimaan Order B2B", desc: "Sales Order terkonfirmasi mengunci komitmen pengiriman." },
                { step: "02", name: "ERP", role: "PPIC & Material Planning", desc: "MRP menghitung kebutuhan bahan & merilis Production Order." },
                { step: "03", name: "MES", role: "Eksekusi Shop Floor", desc: "Job Card diterbitkan ke workstation; pencatatan output riil." },
                { step: "04", name: "QMS", role: "Inspeksi & QC Release", desc: "Pemeriksaan kualitas material masuk & lot barang jadi." },
                { step: "05", name: "Accounting", role: "Kalkulasi HPP Aktual", desc: "Jurnal double-entry mencatat WIP & persediaan riil." },
                { step: "06", name: "BI & AI", role: "Analitik Keputusan", desc: "Wawasan profitabilitas dan deteksi inefisiensi seketika." },
              ].map((flow, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-800/90 border border-slate-700/80 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-mono text-brand-cyan font-bold">{flow.step}</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-1">{flow.name}</h3>
                    <p className="text-xs font-semibold text-slate-300 mb-2">{flow.role}</p>
                    <p className="text-xs text-slate-400 leading-normal">{flow.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — ONE PLATFORM, ALL CORE MODULES                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Suite Fungsional Lengkap
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Satu Platform Terpadu. Seluruh Modul Inti Pabrik.
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Setiap modul mengatasi masalah spesifik departemen, namun berbagi master data dan aturan bisnis yang sama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {coreModulesList.map((mod) => (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-premium flex flex-col justify-between hover:border-brand-blue/50 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                      {mod.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{mod.subtitle}</p>
                  </div>
                  <MaturityBadge status={mod.status} />
                </div>

                <div className="space-y-3 my-4 text-xs">
                  <div className="bg-rose-50/60 p-2.5 rounded-lg border border-rose-100">
                    <span className="font-bold text-rose-800 block mb-0.5">Tantangan:</span>
                    <span className="text-slate-600 leading-tight">{mod.problem}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-0.5">Kapabilitas Kunci:</span>
                    <span className="text-slate-600 leading-tight">{mod.capability}</span>
                  </div>

                  <div className="text-slate-500 text-[11px] italic">
                    <span className="font-medium text-slate-700 not-italic">Integrasi: </span>
                    {mod.connections}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={mod.href}
                  className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center justify-between group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Pelajari Rincian Modul {mod.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — AI COPILOT DEMONSTRATION (SIMULATED CONVERSATION)             */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-slate-900 to-navy text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-2 block">
              Kecerdasan AI Teratur
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              AI Copilot untuk Setiap Departemen. Kecerdasan untuk Seluruh Perusahaan.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Bukan sekadar generator teks umum, melainkan mesin analitik yang menghubungkan titik-titik data operasional antar modul dengan batas kewenangan ketat.
            </p>
          </div>

          {/* Interactive Simulated Conversation Card */}
          <div className="max-w-4xl mx-auto bg-slate-800/90 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Company Copilot Analysis</h3>
                  <p className="text-xs text-slate-400">Penyelidikan Lintas Modul: Accounting + MES + HRIS</p>
                </div>
              </div>
              <SimulatedBadge label="Simulasi Analisis Copilot" />
            </div>

            {/* Prompt */}
            <div className="mb-6 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0 mt-0.5">
                CEO
              </div>
              <div className="bg-slate-700/60 p-4 rounded-xl rounded-tl-none border border-slate-600/60 max-w-2xl">
                <p className="text-sm font-medium text-white">
                  &ldquo;Mengapa omzet pabrik kita bulan ini naik 18%, tetapi laba bersih justru turun 7%?&rdquo;
                </p>
              </div>
            </div>

            {/* AI Response Connecting 4 Domains */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                AI
              </div>
              <div className="bg-slate-900/90 p-5 rounded-xl rounded-tl-none border border-slate-700/80 space-y-4 max-w-3xl">
                <p className="text-xs text-slate-300 font-mono">
                  [AUDITED_QUERY_TRACE]: Menelusuri 124 Sales Orders, 43 Work Orders, 18 Lot Material, dan Absensi Shift.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <span className="text-slate-400 block mb-1 font-semibold">1. Modul Accounting</span>
                    <span className="text-white font-medium">Pendapatan naik Rp 340jt dari pesanan produk Seri-B.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <span className="text-slate-400 block mb-1 font-semibold">2. Modul MES & QMS</span>
                    <span className="text-amber-400 font-medium">Scrap rate lini cutting melonjak 14% karena lot kain lot#842 rapuh.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <span className="text-slate-400 block mb-1 font-semibold">3. Modul HRIS</span>
                    <span className="text-rose-400 font-medium">Lembur mendadak 56 jam operator akhir pekan (+Rp 22jt biaya labor).</span>
                  </div>
                </div>

                <div className="pt-2 text-xs sm:text-sm text-slate-200 border-t border-slate-800 leading-relaxed">
                  <strong className="text-brand-cyan">Kesimpulan Terverifikasi:</strong> Margin tergerus bukan akibat diskon harga komersial, melainkan pembengkakan biaya pemborosan material (Rp 38,4 juta) dan biaya lembur darurat (Rp 22,1 juta) untuk mengejar tenggat pengiriman pesanan darurat.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — INDUSTRY SOLUTIONS                                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Kapabilitas Spesifik Sektor
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Dirancang Sesuai Karakteristik Nyata Pabrik Anda
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Setiap industri memiliki alur kerja unik yang diakomodasi melalui konfigurasi template NewSystem tanpa perlu fork kode kustom.
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
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-premium flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{ind.title}</h3>
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
      {/* SECTION 7 & 8 — SMART WORKSPACE & WORKFLOW AUTOMATION                     */}
      {/* ========================================================================= */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Smart Workspace */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-premium">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
                Smart Workspace & DMS
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Dokumen Resmi Dihasilkan Langsung dari Transaksi Bisnis
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Tidak ada lagi dokumen PO atau invoice yang dibuat terpisah di aplikasi pengolah kata. Seluruh Purchase Order, Faktur Penjualan, Kontrak, dan Surat Jalan dirender otomatis dari data sistem inti dengan nomor seri resmi yang tidak dapat di-overwrite.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900 block mb-0.5">PO & Faktur Resmi</span>
                  <span className="text-slate-500">Otomatis dari modul ERP & Pembukuan.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900 block mb-0.5">Cloud Connectivity</span>
                  <span className="text-slate-500">Tersambung ke Google Drive & OneDrive.</span>
                </div>
              </div>
            </div>

            {/* Workflow Automation Engine */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-premium">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo mb-2 block">
                Workflow Automation Studio
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Otomasi Alur: Event → Condition → Approval → Action
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Hilangkan keterlambatan persetujuan manual. Rancang alur kerja cerdas yang merespons kejadian di lapangan tanpa perlu menulis baris kode baru.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Contoh Alur: Kekurangan Material di Lini Cutting</span>
                </div>
                <p className="text-slate-600 pl-4 font-mono text-[11px]">
                  Stok Kain &lt; Ambang Batas → Generate Draf PR Otomatis → Notifikasi Approval Manajer → Rilis PO ke Supplier
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9 — WHY NEWSYSTEM DIFFERENTIATORS                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Keunggulan Desain Arsitektur
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Mengapa Memilih NewSystem untuk Masa Depan Pabrik Anda?
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Fondasi teknis yang kokoh untuk mendukung pertumbuhan bisnis manufaktur jangka panjang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Satu Arsitektur Terpadu",
              desc: "Bukan tambal sulam modul pihak ketiga dengan database berbeda. Seluruh data disimpan dalam satu transactional source of truth.",
            },
            {
              title: "Konfigurasi Alur Fleksibel",
              desc: "Menyesuaikan alur kerja MTO, MTS, batch, atau discrete tanpa memerlukan fork kustomisasi kode per pelanggan.",
            },
            {
              title: "Kesederhanaan Berbasis Peran",
              desc: "Operator shop floor hanya melihat tombol aksi relevan, sementara direksi mendapatkan gambaran strategis makro.",
            },
            {
              title: "Jejak Transaksi yang Immutable",
              desc: "Setiap mutasi stok dan jurnal biaya dicatat dalam buku besar transaksi permanen yang diaudit dan dapat direkonsiliasi.",
            },
            {
              title: "Kecerdasan AI dengan Kontrol Ketat",
              desc: "AI bertindak sebagai penjelas analisis cerdas tanpa wewenang mem-bypass invarian bisnis dan approval penting.",
            },
            {
              title: "Desain Multi-Company & Multi-Plant",
              desc: "Dukungan bawaan untuk grup perusahaan dengan banyak entitas hukum dan fasilitas pabrik yang tersebar.",
            },
          ].map((diff, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-premium">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{diff.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{diff.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10 — RESOURCES & LATEST ARTICLES (DATABASE-DRIVEN)                */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
                Pusat Pengetahuan Manufaktur
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Artikel & Wawasan Operasional Terbaru
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-brand-blue hover:text-blue-700 flex items-center gap-1.5"
            >
              <span>Jelajahi Seluruh Artikel Blog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {latestArticles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-premium flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-blue font-medium border border-blue-100">
                      {art.categoryName || "Manufaktur"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readingTimeMinutes} mnt baca
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-2">
                    <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{art.authorName || "Tim NewSystem"}</span>
                  <Link
                    href={`/blog/${art.slug}`}
                    className="font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11 & 12 — DESIGN PARTNER INVITATION & FINAL CTA                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 inline-block">
                Design Partner Program — Terbuka Terbatas
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                Bantu Bentuk Masa Depan Operasional Manufaktur.
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                Kami mengundang 3 pabrik percontohan (General, F&B, dan Garment/Furnitur) untuk berkolaborasi langsung bersama tim founding engineers NewSystem dalam memvalidasi alur kerja riil lantai produksi Anda.
              </p>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan flex-shrink-0" />
                  <span>Akses prioritas penuh ke seluruh modul Full Suite R1.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan flex-shrink-0" />
                  <span>Pendampingan pemetaan proses bisnis langsung dari tim arsitek.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan flex-shrink-0" />
                  <span>Tanpa komitmen sebelum validasi terbukti di pabrik Anda.</span>
                </div>
              </div>
            </div>

            {/* Embedded Direct Lead & Design Partner Form */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 text-slate-900 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Mari Petakan Proses Pabrik Anda
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Isi data pabrik Anda untuk konsultasi awal bersama tim solusi NewSystem.
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
