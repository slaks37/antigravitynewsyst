"use client";

import React, { useState } from "react";
import { Send, CheckCircle, XCircle, Clock, AlertTriangle, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface IngestRecord {
  id: string;
  sourceSystem: string;
  externalId: string | null;
  normalizedTitle: string;
  rawPayload: unknown;
  status: string;
  postId: string | null;
  errorLog: string | null;
  createdAt: string;
}

export function IngestManager({ initialRecords }: { initialRecords: IngestRecord[] }) {
  const [records, setRecords] = useState<IngestRecord[]>(initialRecords);
  const [viewingRecord, setViewingRecord] = useState<IngestRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const handleUpdateStatus = async (id: string, newStatus: "QUEUED" | "PROCESSED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/admin/ingest/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui status");

      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (viewingRecord?.id === id) {
        setViewingRecord((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const filtered = records.filter(
    (r) => filterStatus === "ALL" || r.status === filterStatus
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PROCESSED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "QUEUED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "DUPLICATE":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
          {["ALL", "QUEUED", "PROCESSED", "DUPLICATE", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterStatus === st
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st === "ALL" ? "Semua Antrean" : st}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Total {filtered.length} riwayat ingest
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Judul Dokumen / Artikel</th>
                <th className="py-3 px-4">Sistem Sumber</th>
                <th className="py-3 px-4">External ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Waktu Ingest</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada catatan ingest dalam antrean ini.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 max-w-sm truncate">
                        {record.normalizedTitle}
                      </p>
                      {record.errorLog && (
                        <p className="text-[10px] text-rose-600 truncate mt-0.5 max-w-sm">
                          Error: {record.errorLog}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {record.sourceSystem}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {record.externalId || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(record.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setViewingRecord(record)}
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-blue font-semibold text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 truncate max-w-md">
                  {viewingRecord.normalizedTitle}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  ID: {viewingRecord.id} | Sumber: {viewingRecord.sourceSystem}
                </p>
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Status Antrean:</p>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                    viewingRecord.status
                  )}`}
                >
                  {viewingRecord.status}
                </span>
              </div>

              {viewingRecord.errorLog && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
                  <p className="font-bold mb-1">Log Kesalahan:</p>
                  <p className="font-mono text-[11px]">{viewingRecord.errorLog}</p>
                </div>
              )}

              <div>
                <p className="font-semibold text-slate-700 mb-1">Payload JSON Mentah:</p>
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-60">
                  {JSON.stringify(viewingRecord.rawPayload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpdateStatus(viewingRecord.id, "PROCESSED")}
                  variant="primary"
                  className="text-xs"
                >
                  Set PROCESSED
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(viewingRecord.id, "REJECTED")}
                  variant="outline"
                  className="text-xs text-rose-600 hover:bg-rose-50"
                >
                  Set REJECTED
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => setViewingRecord(null)}
                className="text-xs"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
