import React from "react";
import { Metadata } from "next";
import { Mail, Phone, MapPin, MessageSquare, Clock } from "lucide-react";
import { LeadForm } from "@/components/marketing/LeadForm";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Hubungi Kami — Konsultasi & Pemetaan Proses Pabrik",
  description:
    "Diskusikan tantangan operasional, integrasi alur kerja, dan kebutuhan sistem manufaktur Anda bersama tim konsultan teknis NewSystem.",
};

export default function ContactPage() {
  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 pt-12 pb-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
            Konsultasi & Kemitraan
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Mari Diskusikan Alur Operasional Pabrik Anda
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Apakah Anda ingin memetakan alur dari pesanan penjualan ke job order, menyelesaikan selisih inventori, atau menghitung HPP aktual? Tim arsitek solusi NewSystem siap berdiskusi.
          </p>
        </div>
      </section>

      {/* Contact Content & Form Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Informasi Kantor & Kontak
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Kantor pusat dan laboratorium riset kami berbasis di Jakarta, melayani pabrik di seluruh kawasan industri Indonesia.
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <Mail className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Email Resmi</strong>
                  <span className="text-slate-600">contact@newsystem.space</span>
                  <br />
                  <span className="text-slate-500 text-xs">Untuk inquiry bisnis dan demonstrasi alur.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <MapPin className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Lokasi Operasional</strong>
                  <span className="text-slate-600">Jakarta Selatan, DKI Jakarta, Indonesia</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <Clock className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Waktu Respons</strong>
                  <span className="text-slate-600">Senin – Jumat: 08.30 – 17.30 WIB</span>
                  <br />
                  <span className="text-slate-500 text-xs">Respons awal maksimal dalam 1x24 jam kerja.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Jadwalkan Diskusi & Demonstrasi
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Lengkapi formulir di bawah ini untuk membantu kami memahami profil industri dan tantangan operasional Anda.
            </p>

            <LeadForm
              variant="DEMO_REQUEST"
              sourcePage="/contact"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
