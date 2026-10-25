import React from "react";
import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowUpRight } from "lucide-react";
import { LeadForm } from "@/components/marketing/LeadForm";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Hubungi Kami — Konsultasi & Pemetaan Proses Pabrik",
  description:
    "Diskusikan tantangan operasional, integrasi alur kerja, dan kebutuhan sistem manufaktur Anda bersama Stefen dan tim konsultan teknis NewSystem.",
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
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Informasi Kantor & Kontak
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Hubungi kami langsung untuk konsultasi kebutuhan sistem manufaktur Anda. Tim kami melayani pabrik di seluruh kawasan industri Indonesia.
              </p>
            </div>

            {/* Direct Reachout Card: Stefen */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/50 border border-blue-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-brand-blue text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Kontak Langsung
                </span>
                <span className="text-xs text-slate-500">Respon Cepat</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Stefen</h3>
                <p className="text-xs text-slate-600">
                  Solusi Operasional & Kemitraan Pabrik NewSystem
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <a
                  href="https://wa.me/6282296756759?text=Halo%20Stefen%2C%20saya%20tertarik%20untuk%20berdiskusi%20tentang%20kebutuhan%20sistem%20pabrik%20di%20NewSystem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 flex-shrink-0" />
                    <span>WhatsApp: 0822-9675-6759</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-80" />
                </a>

                <a
                  href="tel:+6282296756759"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-brand-blue flex-shrink-0" />
                    <span>Telepon Langsung: 0822-9675-6759</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="mailto:stefen@newsystem.space"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-blue flex-shrink-0" />
                    <span>stefen@newsystem.space</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-3.5 text-sm text-slate-700">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <Mail className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Email Resmi</strong>
                  <div className="space-y-0.5">
                    <a href="mailto:stefen@newsystem.space" className="text-brand-blue hover:underline font-medium block">
                      stefen@newsystem.space
                    </a>
                    <a href="mailto:contact@newsystem.space" className="text-slate-600 hover:underline block text-xs">
                      contact@newsystem.space (Inquiry Umum)
                    </a>
                  </div>
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
                  <span className="text-slate-500 text-xs">WhatsApp & Telepon: Respon fleksibel untuk kebutuhan mendesak.</span>
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
              Lengkapi formulir di bawah ini untuk membantu kami memahami profil industri dan tantangan operasional Anda. Data Anda akan langsung diterima oleh Stefen dan tim solusi kami.
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