"use client";

import React, { useState } from "react";
import { Send, Download, Search, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Subscriber {
  id: string;
  email: string;
  status: string;
  sourcePage: string | null;
  createdAt: string;
}

export function NewsletterManager({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "SUBSCRIBED" | "UNSUBSCRIBED">("ALL");

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "SUBSCRIBED" ? "UNSUBSCRIBED" : "SUBSCRIBED";
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengubah status langganan");

      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Email", "Status", "Halaman Asal", "Tanggal Daftar"];
    const rows = filtered.map((s) => [
      s.id,
      s.email,
      s.status,
      s.sourcePage || "",
      new Date(s.createdAt).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsystem_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = subscribers.filter((s) => {
    const matchesQuery = s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "ALL" || s.status === filterStatus;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari alamat email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
            {(["ALL", "SUBSCRIBED", "UNSUBSCRIBED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterStatus === st
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st === "ALL" ? "Semua" : st === "SUBSCRIBED" ? "Aktif" : "Unsubscribed"}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={exportCSV} variant="outline" className="text-xs">
          <Download className="w-3.5 h-3.5 mr-1" />
          Ekspor CSV ({filtered.length})
        </Button>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Alamat Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Halaman Asal</th>
                <th className="py-3 px-4">Tanggal Bergabung</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada pelanggan buletin yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{s.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          s.status === "SUBSCRIBED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {s.status === "SUBSCRIBED" ? (
                          <>
                            <CheckCircle className="w-2.5 h-2.5" />
                            Aktif Berlangganan
                          </>
                        ) : (
                          <>
                            <XCircle className="w-2.5 h-2.5" />
                            Berhenti (Opted-Out)
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {s.sourcePage || "/"}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(s.id, s.status)}
                        className="text-xs text-brand-blue font-semibold hover:underline"
                      >
                        {s.status === "SUBSCRIBED" ? "Set Unsubscribed" : "Aktifkan Kembali"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
