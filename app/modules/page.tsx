import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MODULES_MAP } from "@/lib/data/modules";
import { MaturityBadge } from "@/components/ui/MaturityBadge";

export const metadata: Metadata = {
  alternates: { canonical: "/modules" },
  title: "Modul Lengkap Sistem Operasi Pabrik",
  description:
    "Jelajahi seluruh modul inti NewSystem: ERP, MES, Akuntansi, CRM, HRIS, Quality, Maintenance, Otomasi, Smart Workspace, dan Business Intelligence.",
};

export default function ModulesIndexPage() {
  const modulesList = Object.values(MODULES_MAP);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
          Arsitektur Modul Terpadu
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Modul Terintegrasi untuk Seluruh Operasi Pabrik
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Setiap modul dirancang untuk memecahkan tantangan spesifik departemen manufaktur, tetapi beroperasi dalam satu sistem penyimpanan data terpadu tanpa fragmentasi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {modulesList.map((mod) => (
          <div
            key={mod.slug}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-premium flex flex-col justify-between hover:border-brand-blue transition-colors group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                    {mod.name}
                  </h2>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{mod.fullName}</p>
                </div>
                <MaturityBadge status={mod.status} />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {mod.heroProblem}
              </p>

              <div className="space-y-1.5 mb-6 text-xs text-slate-700">
                {mod.capabilities.slice(0, 2).map((cap, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                    <span className="line-clamp-1">{cap.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                href={`/modules/${mod.slug}`}
                className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center justify-between"
              >
                <span>Pelajari Detail Modul</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
