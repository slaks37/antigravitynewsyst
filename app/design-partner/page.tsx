import React from "react";
import { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Factory, Sparkles, HelpCircle } from "lucide-react";
import { LeadForm } from "@/components/marketing/LeadForm";

export const metadata: Metadata = {
  alternates: { canonical: "/design-partner" },
  title: "Design Partner Program — Kolaborasi Validasi Pabrik",
  description:
    "Bergabunglah dengan program Design Partner NewSystem. Kami mengundang 3 pabrik percontohan untuk memvalidasi alur operasional ERP, MES, dan HPP aktual bersama tim founding engineers.",
};

export default function DesignPartnerPage() {
  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 pt-12 pb-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
            Program Validasi Khusus
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Bantu Bentuk Masa Depan Sistem Operasi Manufaktur
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-4">
            NewSystem membuka kesempatan kemitraan validasi terbatas bagi 3 pabrik manufaktur di Indonesia (General Manufacturing, Food & Beverage, dan Garment/Furnitur).
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Program kolaboratif untuk memetakan tantangan riil shop floor, akurasi stok, dan pembukuan HPP aktual.
          </p>
        </div>
      </section>

      {/* Program Details & Criteria */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Manfaat Menjadi Design Partner
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Akses Penuh Tanpa Biaya Lisensi di Tahap Validasi",
                    desc: "Pabrik mitra mendapatkan akses ke seluruh rangkaian modul Full Suite R1 selama masa pengujian pilot.",
                  },
                  {
                    title: "Pendampingan Langsung Founding Engineers & Arsitek",
                    desc: "Tim arsitek solusi kami akan terjun langsung membantu pemetaan proses bisnis, master data, dan struktur BOM pabrik Anda.",
                  },
                  {
                    title: "Fitur yang Dibangun Sesuai Kebutuhan Riil Anda",
                    desc: "Masukan operasional dari tim Anda akan diprioritaskan langsung ke dalam roadmap engineering produk.",
                  },
                  {
                    title: "Jaminan Kerahasiaan Data Industri",
                    desc: "Perjanjian Kerahasiaan (NDA) formal untuk melindungi formula, resep, daftar harga, dan data pelanggan Anda.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Kriteria Profil Pabrik Mitra
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  <span>Skala tenaga kerja antara 20 hingga 200 pekerja aktif.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  <span>Memiliki 1 hingga 3 fasilitas pabrik (plants).</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  <span>Saat ini masih mengandalkan spreadsheet atau sistem terfragmentasi.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  <span>Manajemen berkomitmen meluangkan waktu evaluasi alur bersama kami.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Formulir Pendaftaran Design Partner
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Data Anda akan dievaluasi langsung oleh tim pendiri NewSystem untuk kesesuaian kohort validasi pilot.
            </p>

            <LeadForm
              variant="DESIGN_PARTNER"
              sourcePage="/design-partner"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
