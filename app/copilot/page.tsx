import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  BarChart3,
  Search,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SimulatedBadge } from "@/components/ui/SimulatedBadge";
import { MaturityBadge } from "@/components/ui/MaturityBadge";

export const metadata: Metadata = {
  alternates: { canonical: "/copilot" },
  title: "AI Copilot — Kecerdasan Perusahaan & Analisis Departemen",
  description:
    "Pelajari arsitektur AI Copilot NewSystem: Company Copilot untuk wawasan lintas departemen dan Module Copilots dengan batasan tata kelola persetujuan ketat.",
};

export default function CopilotPage() {
  const copilotsList = [
    {
      name: "ERP & Procurement Copilot",
      scope: "Modul ERP",
      desc: "Menganalisis tren konsumsi bahan baku, mendeteksi potensi stockout, dan menyarankan kuantitas pembelian paling ekonomis (EOQ).",
      sample: "Apakah persediaan resin aman untuk target produksi 2 minggu ke depan?",
    },
    {
      name: "MES Shop Floor Copilot",
      scope: "Modul MES",
      desc: "Mendeteksi anomali reject rate per mesin, korelasi scrap dengan suhu ruangan/operator, dan rekomendasi penyeimbangan lintasan.",
      sample: "Mengapa workstation stamping mengalami penurunan output 12% pada shift siang?",
    },
    {
      name: "Finance & Costing Copilot",
      scope: "Modul Accounting",
      desc: "Menjelaskan selisih varians HPP aktual vs standar, tren margin kontribusi per produk, dan proyeksi arus kas pabrik.",
      sample: "Berapa selisih varians biaya pemakaian bahan baku pada pesanan PO-771?",
    },
    {
      name: "Quality & CAPA Copilot",
      scope: "Modul QMS",
      desc: "Menghubungkan pola komplain pelanggan dengan riwayat lot supplier tertentu dan menyarankan parameter inspeksi yang diperketat.",
      sample: "Identifikasi supplier bahan baku dengan tingkat cacat di atas 2% dalam 6 bulan terakhir.",
    },
    {
      name: "Maintenance Copilot",
      scope: "Modul CMMS",
      desc: "Menghitung Mean Time Between Failures (MTBF) dan mengingatkan penggantian suku cadang kritis sebelum terjadi kerusakan mendadak.",
      sample: "Kapan jadwal servis besar berikutnya untuk mesin Kompresor Unit 1?",
    },
    {
      name: "HRIS & Labor Copilot",
      scope: "Modul HRIS",
      desc: "Memproyeksikan kebutuhan alokasi operator shift pabrik dan menganalisis efisiensi biaya lembur terhadap output produk.",
      sample: "Apakah rencana lembur hari Sabtu akan menutup target pengiriman pesanan ekspor?",
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-purple-50/40 via-white to-slate-50 pt-12 pb-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs sm:text-sm font-semibold text-brand-indigo mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI Built for Manufacturing Operations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            AI Copilot untuk Setiap Departemen.{" "}
            <br className="hidden sm:inline" />
            Kecerdasan untuk Seluruh Perusahaan.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Bukan sekadar chatbot umum. NewSystem Copilot adalah asisten analitik kontekstual yang menghubungkan titik-titik data operasional antar departemen dengan batasan tata kelola yang tegas.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="primary" size="lg">
              Diskusikan Kasus Penggunaan AI
            </Button>
            <Button href="#governance" variant="outline" size="lg">
              Prinsip Tata Kelola & Approval
            </Button>
          </div>
        </div>
      </section>

      {/* Company Copilot Deep Dive */}
      <section id="company-copilot" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
                Tingkat Perusahaan
              </span>
              <SimulatedBadge label="Prototipe Analisis Lintas Modul" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Company Copilot: Mengapa Omzet Naik Namun Laba Turun?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
              Ketika manajemen mengajukan pertanyaan strategis yang rumit, Company Copilot menelusuri data lintas modul secara terkoordinasi: membaca data penjualan CRM, memeriksa konsumsi bahan dan scrap di MES, mengecek jam lembur di HRIS, dan menyajikan kesimpulan akuntansi double-entry yang transparan.
            </p>

            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700/80 space-y-4 text-xs sm:text-sm font-sans">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-xs border-b border-slate-800 pb-2">
                <Bot className="w-4 h-4 text-brand-cyan" />
                <span>Simulasi Penelusuran Transaksi Bersumber Nyata</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                <strong className="text-brand-cyan">Penjelasan Copilot:</strong> &ldquo;Terjadi lonjakan omzet Rp 340jt dari pesanan Seri-B. Namun laba bersih turun karena lot material #842 memiliki tingkat cacat potong 14% di lini cutting, yang memaksa shift malam lembur darurat 56 jam (+Rp 22,1jt biaya kerja) untuk mengejar deadline ekspor.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Module Copilots Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
            Asisten Spesifik Peran
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Copilot Khusus untuk Setiap Departemen Pabrik
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {copilotsList.map((cp, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-premium flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue mb-1 block">
                  {cp.scope}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{cp.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{cp.desc}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Contoh Pertanyaan:</p>
                <p className="text-slate-700 italic">&ldquo;{cp.sample}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Governance & Safety Rules */}
      <section id="governance" className="bg-slate-100/70 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2 block">
              Batasan Otoritas & Keamanan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Prinsip Tata Kelola AI: Kontrol Bisnis Tetap di Tangan Manusia
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Di NewSystem, AI adalah alat pembantu analisis data, bukan pengambil keputusan transaksi otonom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Tidak Ada Autonom Posting Jurnal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI tidak diizinkan memposting transaksi jurnal keuangan, mengeluarkan stok gudang, atau membayar tagihan secara otonom tanpa validasi akuntan resmi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Evidence-Backed Explanations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap kesimpulan analisis yang disajikan oleh Copilot wajib menyertakan jejak nomor dokumen transaksi (PO, SO, Job Card, Lot #) agar dapat diverifikasi manusia.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                RBAC & Data Perimeter Terkunci
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Copilot hanya dapat membaca data yang menjadi hak akses dari peran pengguna yang sedang login. Mandor tidak bisa menanyakan gaji eksekutif, dan staf penjualan tidak bisa mengakses neraca rahasia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
