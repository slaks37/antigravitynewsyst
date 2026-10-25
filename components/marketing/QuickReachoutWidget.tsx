"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Phone, Mail, X, ArrowUpRight, MessageSquare } from "lucide-react";

export function QuickReachoutWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide on admin portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const whatsappUrl =
    "https://wa.me/6282296756759?text=Halo%20Stefen%2C%20saya%20tertarik%20untuk%20berdiskusi%20tentang%20sistem%20NewSystem";
  const emailUrl =
    "mailto:stefen@newsystem.space?subject=Inquiry%20Sistem%20Operasi%20Pabrik%20NewSystem";
  const phoneUrl = "tel:+6282296756759";

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded Popover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Kontak Stefen NewSystem"
          className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-5 animate-in fade-in slide-in-from-bottom-2 duration-200 text-slate-900"
        >
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-brand-blue text-sm">
                S
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Stefen</h4>
                <p className="text-[11px] text-slate-500">
                  Konsultasi & Kemitraan NewSystem
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Tutup popover kontak"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 my-3 leading-relaxed">
            Ingin mendiskusikan alur operasional, kendala inventori, atau integrasi pabrik? Hubungi saya langsung:
          </p>

          <div className="space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>Chat WhatsApp: 0822-9675-6759</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={phoneUrl}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>Telepon: 0822-9675-6759</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={emailUrl}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>stefen@newsystem.space</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Atau isi formulir detail:</span>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-brand-blue font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Halaman Kontak</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Tutup kontak Stefen" : "Buka kontak Stefen"}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl border border-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
        </div>
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          {isOpen ? "Tutup Kontak" : "Hubungi Stefen"}
        </span>
      </button>
    </div>
  );
}
