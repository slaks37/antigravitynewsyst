"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Building2,
  Mail,
  Phone,
  Factory,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface LeadItem {
  id: string;
  formType: string;
  fullName: string;
  businessEmail: string;
  phoneNumber: string | null;
  company: string;
  industry: string | null;
  plantCount: number | null;
  employeeRange: string | null;
  productionType: string | null;
  businessProblem: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

export function LeadsManager({ initialLeads }: { initialLeads: LeadItem[] }) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const filtered = leads.filter((l) => {
    if (filterType && l.formType !== filterType) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    return true;
  });

  const handleOpenLead = (lead: LeadItem) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditNotes(lead.notes || "");
  };

  const handleSaveStatus = async () => {
    if (!selectedLead) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, notes: editNotes }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui");

      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLead.id
            ? { ...l, status: editStatus, notes: editNotes }
            : l
        )
      );

      setSelectedLead(null);
    } catch (err) {
      alert("Error: " + (err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Tipe",
      "Nama",
      "Email",
      "Telepon",
      "Perusahaan",
      "Industri",
      "Pabrik",
      "Karyawan",
      "Tipe Produksi",
      "Masalah Bisnis",
      "Status",
      "Tanggal",
    ];

    const rows = filtered.map((l) => [
      l.id,
      l.formType,
      `"${l.fullName}"`,
      l.businessEmail,
      l.phoneNumber || "",
      `"${l.company}"`,
      `"${l.industry || ""}"`,
      l.plantCount || "",
      `"${l.employeeRange || ""}"`,
      `"${l.productionType || ""}"`,
      `"${(l.businessProblem || "").replace(/"/g, '""')}"`,
      l.status,
      l.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsystem_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColors: Record<string, string> = {
    NEW: "bg-rose-50 text-rose-700 border-rose-200",
    CONTACTED: "bg-amber-50 text-amber-700 border-amber-200",
    QUALIFIED: "bg-blue-50 text-blue-700 border-blue-200",
    IN_DISCUSSION: "bg-purple-50 text-purple-700 border-purple-200",
    CLOSED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="space-y-6">
      {/* Action / Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="text-slate-500 font-semibold mr-1.5">Tipe Form:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 outline-none"
            >
              <option value="">Semua Tipe Form</option>
              <option value="DESIGN_PARTNER">Design Partner</option>
              <option value="DEMO_REQUEST">Permintaan Demo</option>
              <option value="CONTACT">Kontak Umum</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-semibold mr-1.5">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 outline-none"
            >
              <option value="">Semua Status</option>
              <option value="NEW">NEW (Baru)</option>
              <option value="CONTACTED">CONTACTED (Dihubungi)</option>
              <option value="QUALIFIED">QUALIFIED (Memenuhi Syarat)</option>
              <option value="IN_DISCUSSION">IN_DISCUSSION (Diskusi Alur)</option>
              <option value="CLOSED">CLOSED (Selesai)</option>
            </select>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-300"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <th className="p-4">Perusahaan / Kontak</th>
              <th className="p-4 hidden sm:table-cell">Industri & Pabrik</th>
              <th className="p-4 hidden md:table-cell">Tipe Formulir</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Tidak ada prospek yang sesuai filter.
                </td>
              </tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 text-sm">{l.company}</p>
                    <p className="text-slate-500">
                      {l.fullName} • {l.businessEmail}
                    </p>
                    {l.phoneNumber && (
                      <p className="text-[11px] text-slate-400 font-mono">{l.phoneNumber}</p>
                    )}
                  </td>
                  <td className="p-4 hidden sm:table-cell text-slate-700">
                    <p className="font-semibold">{l.industry || "General Manufacturing"}</p>
                    <p className="text-[11px] text-slate-500">
                      {l.plantCount} Pabrik • {l.employeeRange || "20-50 Pekerja"}
                    </p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {l.formType}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        statusColors[l.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenLead(l)}
                      className="px-3 py-1 rounded bg-brand-blue text-white font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Detail & Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail / Update Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedLead.company}</h3>
                <p className="text-slate-500">{selectedLead.fullName} ({selectedLead.businessEmail})</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Sektor:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.industry}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Jumlah Pabrik:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.plantCount} Plant</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tipe Produksi:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.productionType || "-"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Telepon:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.phoneNumber || "-"}</span>
                </div>
              </div>

              {selectedLead.businessProblem && (
                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-400 block mb-0.5 font-semibold">Tantangan Operasional:</span>
                  <p className="text-slate-800 leading-relaxed italic">
                    &ldquo;{selectedLead.businessProblem}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Perbarui Status Follow-Up:
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-900"
                >
                  <option value="NEW">NEW (Baru Masuk)</option>
                  <option value="CONTACTED">CONTACTED (Sudah Dihubungi)</option>
                  <option value="QUALIFIED">QUALIFIED (Kualifikasi Cocok)</option>
                  <option value="IN_DISCUSSION">IN_DISCUSSION (Sedang Diskusi Alur)</option>
                  <option value="CLOSED">CLOSED (Selesai / Terkonversi)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Catatan Tindak Lanjut Internal:
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Catatan tim sales / arsitek solusi..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={handleSaveStatus}
                className="px-4 py-2 rounded-lg bg-brand-blue hover:bg-blue-600 text-white font-semibold flex items-center gap-1.5"
              >
                {updating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
