/**
 * Centrally Managed Capability Maturity Configuration for NewSystem
 * Compliance with Section 1: Product Maturity Rule
 */

export type MaturityState =
  | "PLANNED"
  | "IN_DEVELOPMENT"
  | "PROTOTYPE"
  | "PILOT_AVAILABLE"
  | "GENERALLY_AVAILABLE";

export interface MaturityBadgeConfig {
  label: string;
  badgeClass: string;
  description: string;
}

export const MATURITY_STATE_CONFIG: Record<MaturityState, MaturityBadgeConfig> = {
  PLANNED: {
    label: "Direncanakan (Planned)",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    description: "Spesifikasi arsitektur selesai, dalam roadmap pengembangan produk.",
  },
  IN_DEVELOPMENT: {
    label: "Dalam Pengembangan (In Development)",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    description: "Sedang dikembangkan secara aktif oleh tim engineering.",
  },
  PROTOTYPE: {
    label: "Prototipe (Prototype)",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "Desain interaktif & prototipe fungsional telah divalidasi.",
  },
  PILOT_AVAILABLE: {
    label: "Tersedia untuk Pilot (Pilot Available)",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Tersedia untuk pengujian dan validasi bersama Design Partner.",
  },
  GENERALLY_AVAILABLE: {
    label: "Tersedia Publik (Generally Available)",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Siap digunakan secara penuh dalam produksi.",
  },
};

export interface ModuleCapabilityStatus {
  id: string;
  name: string;
  category: "CORE_SUITE" | "OPERATIONAL" | "AI_INTELLIGENCE" | "WORKSPACE";
  status: MaturityState;
  summary: string;
  pilotProgram: boolean;
  notes: string;
}

export const CAPABILITY_STATUSES: Record<string, ModuleCapabilityStatus> = {
  erp: {
    id: "erp",
    name: "Enterprise Resource Planning (ERP)",
    category: "CORE_SUITE",
    status: "PILOT_AVAILABLE",
    summary: "Pengadaan, manajemen stok/multi-gudang, BOM, routing, dan pesanan produksi.",
    pilotProgram: true,
    notes: "Tersedia untuk validasi alur pengadaan & stok bersama mitra manufaktur.",
  },
  mes: {
    id: "mes",
    name: "Manufacturing Execution System (MES)",
    category: "OPERATIONAL",
    status: "PILOT_AVAILABLE",
    summary: "Shop floor dispatching, job cards, pelacakan output riil, dan jam kerja operator.",
    pilotProgram: true,
    notes: "Tervalidasi pada alur Make-to-Order dan Batch Manufacturing.",
  },
  hris: {
    id: "hris",
    name: "Human Resource Information System (HRIS)",
    category: "CORE_SUITE",
    status: "IN_DEVELOPMENT",
    summary: "Manajemen data karyawan, shift pabrik, absensi, dan alokasi biaya tenaga kerja ke HPP.",
    pilotProgram: false,
    notes: "Fokus kalkulasi biaya tenaga kerja langsung (Direct Labor) ke produksi.",
  },
  crm: {
    id: "crm",
    name: "Customer Relationship Management (CRM)",
    category: "CORE_SUITE",
    status: "PILOT_AVAILABLE",
    summary: "Manajemen prospek pabrik, pipeline B2B, penawaran harga (Quotation), hingga Sales Order.",
    pilotProgram: true,
    notes: "Terhubung langsung dengan pengecekan ketersediaan stok & kapasitas pabrik.",
  },
  accounting: {
    id: "accounting",
    name: "Financial Accounting & Costing",
    category: "CORE_SUITE",
    status: "PILOT_AVAILABLE",
    summary: "Double-entry bookkeeping, AR/AP, jurnal otomatis transaksi, dan kalkulasi HPP riil.",
    pilotProgram: true,
    notes: "Buku besar otomatis berdasarkan pergerakan barang dan penyelesaian job card.",
  },
  quality: {
    id: "quality",
    name: "Quality Management System (QMS)",
    category: "OPERATIONAL",
    status: "IN_DEVELOPMENT",
    summary: "Inspeksi material masuk (IQC), in-process inspection (IPQC), penahanan lot, dan NCR.",
    pilotProgram: true,
    notes: "Penahanan stok otomatis bila hasil QC dinyatakan hold/reject.",
  },
  maintenance: {
    id: "maintenance",
    name: "Maintenance Management (CMMS)",
    category: "OPERATIONAL",
    status: "IN_DEVELOPMENT",
    summary: "Jadwal pemeliharaan preventif mesin, pelaporan kerusakan, spare parts, dan tracking downtime.",
    pilotProgram: false,
    notes: "Membantu menekan downtime mendadak di lini produksi.",
  },
  automation: {
    id: "automation",
    name: "Workflow Automation Studio",
    category: "WORKSPACE",
    status: "PROTOTYPE",
    summary: "Otomatisasi bisnis Event → Condition → Approval → Action → Notification tanpa koding.",
    pilotProgram: true,
    notes: "Engine alur persetujuan lintas departemen.",
  },
  workspace: {
    id: "workspace",
    name: "Smart Workspace & Document Management",
    category: "WORKSPACE",
    status: "PROTOTYPE",
    summary: "Penyusunan dokumen resmi (PO, Invoice, Kontrak, Surat Jalan), arsip SOP, dan cloud sync.",
    pilotProgram: true,
    notes: "Dokumen resmi dihasilkan langsung dari data transaksi bisnis.",
  },
  connect: {
    id: "connect",
    name: "NewSystem Connect & Integration Hub",
    category: "WORKSPACE",
    status: "IN_DEVELOPMENT",
    summary: "Konektor email (Gmail/Outlook), penyimpanan cloud, mesin timbang, dan Open API.",
    pilotProgram: false,
    notes: "Arsitektur konektor aman untuk sistem pihak ketiga.",
  },
  intelligence: {
    id: "intelligence",
    name: "Business Intelligence (BI)",
    category: "AI_INTELLIGENCE",
    status: "PROTOTYPE",
    summary: "Dashboard lintas departemen: pendapatan, HPP riil, utilisasi mesin, dan margin per pesanan.",
    pilotProgram: true,
    notes: "Visualisasi analitik berbasis single system of record.",
  },
  bi: {
    id: "bi",
    name: "Business Intelligence (BI)",
    category: "AI_INTELLIGENCE",
    status: "PROTOTYPE",
    summary: "Dashboard lintas departemen: pendapatan, HPP riil, utilisasi mesin, dan margin per pesanan.",
    pilotProgram: true,
    notes: "Visualisasi analitik berbasis single system of record.",
  },
  ai_copilot: {
    id: "ai_copilot",
    name: "Module Copilots & Company Copilot",
    category: "AI_INTELLIGENCE",
    status: "PROTOTYPE",
    summary: "Asisten AI kontekstual per departemen dengan batasan izin ketat dan jejak audit.",
    pilotProgram: true,
    notes: "AI memberikan wawasan berbasis bukti transaksi tanpa mengambil alih kontrol posting.",
  },
};
