import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SOLUTIONS_MAP } from "@/lib/data/solutions";

export const metadata: Metadata = {
  alternates: { canonical: "/solutions" },
  title: "Solusi Industri Manufaktur",
  description:
    "Solusi proses bisnis khusus untuk sektor General Manufacturing, Food & Beverage, Garment, Furnitur, Batch, Discrete, dan Hybrid.",
};

export default function SolutionsIndexPage() {
  const solutionsList = Object.values(SOLUTIONS_MAP);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
          Spesialisasi Sektor
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Solusi Industri yang Menjawab Logika Nyata Pabrik
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Setiap sektor manufaktur memiliki aturan operasional dan titik kritis tersendiri. NewSystem dirancang dengan template alur kerja yang dapat dikonfigurasi tanpa fork kustomisasi kode.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {solutionsList.map((sol) => (
          <div
            key={sol.slug}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-premium flex flex-col justify-between hover:border-brand-blue transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                  {sol.name}
                </h2>
                {sol.pilotBadge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-200">
                    {sol.pilotBadge}
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-700 mb-2">{sol.tagline}</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                {sol.heroDescription}
              </p>

              <div className="space-y-1.5 mb-6 text-xs text-slate-700">
                {sol.operationalFocus.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                    <span className="line-clamp-1">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                href={`/solutions/${sol.slug}`}
                className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center justify-between"
              >
                <span>Pelajari Solusi Industri</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
