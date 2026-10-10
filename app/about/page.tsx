import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Target, Compass, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Tentang NewSystem — Visi, Misi & Prinsip Rekayasa",
  description:
    "Mengenal NewSystem: platform sistem operasi cerdas yang didedikasikan untuk menghubungkan seluruh ekosistem bisnis dan manufaktur pabrik modern di Indonesia.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 pt-12 pb-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
            Mengenal NewSystem
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Membangun Standar Baru Sistem Operasi Manufaktur
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Kami percaya bahwa pabrik di Indonesia tidak kekurangan kerja keras. Yang dibutuhkan adalah sistem operasi yang benar-benar menghubungkan penjualan, inventori, lantai produksi, dan akuntansi dalam satu kebenaran data tanpa fragmentasi.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-premium">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Visi Kami</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Menjadi sistem operasi bisnis dan manufaktur cerdas paling terpercaya di Asia Tenggara, yang memberdayakan pabrik dari skala puluhan pekerja hingga korporasi multi-plant untuk beroperasi dengan efisiensi tinggi, transparansi penuh, dan profitabilitas terverifikasi.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-premium">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Misi Kami</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Menghilangkan sekat-sekat informasi operasional pabrik melalui platform perangkat lunak yang elegan, berprinsip single system of record, berkecepatan tinggi, dan diperkuat kecerdasan buatan teratur yang menghormati kontrol manusia.
            </p>
          </div>
        </div>
      </section>

      {/* Engineering Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
            Prinsip Rekayasa Produk
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nilai yang Memandu Setiap Baris Kode Kami
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Integritas Transaksi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tidak ada jalan pintas dalam akuntansi dan inventori. Setiap angka mutasi wajib dapat diaudit, seimbang (double-entry), dan memiliki bukti dokumen sumber resmi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Transparansi Kematangan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kami tidak memamerkan testimoni palsu atau mengklaim sertifikasi yang belum ada. Seluruh status kapabilitas dilaporkan secara jujur berdasarkan tingkat kesiapannya.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Desain Human-Centered</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Software enterprise tidak harus rumit dan membosankan. Kami merancang UX yang bersih dan cepat, menghargai waktu operator lantai pabrik dan eksekutif.
            </p>
          </div>
        </div>
      </section>

      {/* Status Transparency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-semibold text-brand-cyan uppercase tracking-wider">
              Status Operasional Saat Ini
            </span>
            <h3 className="text-2xl font-bold">NewSystem dalam Tahap Validasi Mitra Desain</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kami sedang mematangkan Full Suite R1 bersama pabrik-pabrik percontohan terpilih di Indonesia sebelum ketersediaan komersial umum.
            </p>
          </div>
          <Button href="/design-partner" variant="primary" size="md" className="flex-shrink-0">
            Pelajari Program Design Partner
          </Button>
        </div>
      </section>
    </div>
  );
}
