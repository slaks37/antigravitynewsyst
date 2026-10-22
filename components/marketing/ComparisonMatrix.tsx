import React from "react";
import { Check, X, Minus, Sparkles } from "lucide-react";

interface ComparisonRow {
  dimension: string;
  spreadsheet: string;
  legacyErp: string;
  newsystem: string;
  highlight?: boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    dimension: "Waktu Implementasi & Go-Live",
    spreadsheet: "Instan, namun rusak saat tim bertambah",
    legacyErp: "6–18 bulan dengan konsultan mahal",
    newsystem: "2–4 minggu dengan template siap pakai",
    highlight: true,
  },
  {
    dimension: "Pelacakan Shop Floor MES",
    spreadsheet: "Formulir kertas manual, input sore hari",
    legacyErp: "Modul terpisah mahal, jarang dipakai operator",
    newsystem: "Tablet operator responsif, dispatching detik ini",
  },
  {
    dimension: "Kalkulasi HPP Aktual",
    spreadsheet: "Rumus estimasi statis, rawan salah formula",
    legacyErp: "HPP standar, varians baru ketahuan akhir bulan",
    newsystem: "HPP aktual per batch dari konsumsi & jam riil",
    highlight: true,
  },
  {
    dimension: "Akurasi & Integritas Stok",
    spreadsheet: "Sering selisih fisik vs catatan (75%+ eror)",
    legacyErp: "Data terkunci, prosedur koreksi berbelit-belit",
    newsystem: "Immutable stock ledger + batch/lot traceability",
  },
  {
    dimension: "Konektivitas Sales ke Produksi",
    spreadsheet: "Miskomunikasi via WA & email terpisah",
    legacyErp: "Perlu re-input berulang dari CRM ke Modul PPIC",
    newsystem: "Otomatis: Sales Order → MRP → Job Card MES",
  },
  {
    dimension: "Kecerdasan AI & Otomasi",
    spreadsheet: "Tidak ada (Manual copy-paste)",
    legacyErp: "Add-on kaku, tidak paham konteks pabrik lokal",
    newsystem: "Built-in Company Copilot dengan batasan RBAC aman",
    highlight: true,
  },
];

export function ComparisonMatrix() {
  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-4 px-4 sm:px-6 font-bold text-slate-900 w-1/4">
                Kriteria Operasional
              </th>
              <th className="py-4 px-4 sm:px-6 font-semibold text-slate-500 w-1/4 bg-slate-100/50">
                Spreadsheet (Excel / Sheets)
              </th>
              <th className="py-4 px-4 sm:px-6 font-semibold text-slate-500 w-1/4">
                ERP Warisan / Konvensional
              </th>
              <th className="py-4 px-4 sm:px-6 font-bold text-brand-blue w-1/4 bg-blue-50/50 border-t-2 border-brand-blue">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-blue" />
                  <span>NewSystem Modern Cloud</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {COMPARISON_DATA.map((row, idx) => (
              <tr
                key={idx}
                className={row.highlight ? "bg-slate-50/60" : "hover:bg-slate-50/40 transition-colors"}
              >
                <td className="py-4 px-4 sm:px-6 font-medium text-slate-900">
                  {row.dimension}
                </td>
                <td className="py-4 px-4 sm:px-6 text-slate-600 bg-slate-100/30">
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{row.spreadsheet}</span>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6 text-slate-600">
                  <div className="flex items-start gap-2">
                    <Minus className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{row.legacyErp}</span>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6 text-slate-900 font-semibold bg-blue-50/30">
                  <div className="flex items-start gap-2 text-brand-blue">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800">{row.newsystem}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
