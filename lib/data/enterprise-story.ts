import { CAPABILITY_STATUSES } from "@/lib/capabilities/status";

// One fictional order connects every scene. No customer records or live product calls.
export const SIMULATED_ORDER = {
  company: "PT Arunika Ruang",
  customer: "Ruang Karya Studio",
  id: "SO-1042",
  product: "Meja kerja A120",
  quantity: 120,
  target: "12 Nov 2026",
  material: "Panel laminasi",
  purchase: "PO-0086",
  work: "WO-0214",
  delayDays: 2,
  completed: 72,
  materialCost: 28_800_000,
  laborCost: 7_200_000,
  overheadCost: 4_800_000,
} as const;

export type Department =
  | "sales"
  | "planning"
  | "procurement"
  | "inventory"
  | "people"
  | "operations"
  | "quality"
  | "finance"
  | "documents";
export const DEPARTMENTS: {
  id: Department;
  name: string;
  module: string;
  href: string;
  x: number;
  y: number;
}[] = [
  {
    id: "sales",
    name: "Sales & CRM",
    module: "crm",
    href: "/modules/crm",
    x: 16,
    y: 17,
  },
  {
    id: "planning",
    name: "Planning",
    module: "erp",
    href: "/modules/erp",
    x: 50,
    y: 17,
  },
  {
    id: "procurement",
    name: "Procurement",
    module: "erp",
    href: "/modules/erp",
    x: 84,
    y: 17,
  },
  {
    id: "people",
    name: "People & Assets",
    module: "hris",
    href: "/modules/hris",
    x: 16,
    y: 49,
  },
  {
    id: "inventory",
    name: "Inventory",
    module: "erp",
    href: "/modules/erp",
    x: 84,
    y: 49,
  },
  {
    id: "finance",
    name: "Finance",
    module: "accounting",
    href: "/modules/accounting",
    x: 16,
    y: 81,
  },
  {
    id: "documents",
    name: "Documents",
    module: "workspace",
    href: "/modules/workspace",
    x: 50,
    y: 81,
  },
  {
    id: "operations",
    name: "Operations & MES",
    module: "mes",
    href: "/modules/mes",
    x: 84,
    y: 81,
  },
  {
    id: "quality",
    name: "Quality",
    module: "quality",
    href: "/modules/quality",
    x: 50,
    y: 49,
  },
];

export const STORY_SCENES = [
  {
    id: "customer",
    number: "03",
    label: "PELANGGAN → PERUSAHAAN",
    title: "Setiap peluang membawa pekerjaan bagi seluruh perusahaan.",
    description:
      "Satu permintaan pelanggan dapat memengaruhi harga, kapasitas, material, jadwal kerja, dan komitmen pengiriman.",
    detail:
      "Ruang Karya Studio mengajukan 120 meja kerja kepada PT Arunika Ruang. Sales menyusun penawaran; persetujuan manusia menjadi gerbang sebelum pesanan dikonfirmasi.",
    steps: [
      "Permintaan pelanggan",
      "Opportunity",
      "Quotation",
      "Persetujuan",
      "Sales Order",
    ],
    active: ["sales", "planning", "finance"],
    modules: ["crm", "erp", "accounting"],
    previewTitle: "Sebuah peluang menjadi komitmen.",
    rows: [
      ["Pelanggan", "Ruang Karya Studio"],
      ["Penawaran", "QT-0064 · ditinjau"],
      ["Sales Order", "SO-1042 · ilustrasi dikonfirmasi"],
    ],
  },
  {
    id: "planning",
    number: "04",
    label: "RENCANA → KEBUTUHAN",
    title: "Rencana terbaik dimulai dari informasi yang tepat.",
    description:
      "Apa yang harus dikerjakan? Material apa yang tersedia? Siapa yang bertanggung jawab? Berapa biayanya? Kapan pekerjaan dapat diselesaikan?",
    detail:
      "Pesanan yang sama menjadi konteks bersama bagi perencana, purchasing, gudang, dan finance. Kebutuhan bahan diperiksa sebelum jadwal kerja disepakati.",
    steps: [
      "Kebutuhan material",
      "Cek persediaan",
      "Usulan pengadaan",
      "Tinjau kapasitas",
      "Estimasi biaya",
    ],
    active: ["planning", "procurement", "inventory", "finance", "operations"],
    modules: ["erp", "accounting", "mes"],
    previewTitle: "Rencana bertemu ketersediaan.",
    rows: [
      ["Material utama", "Panel laminasi"],
      ["Usulan pengadaan", "PO-0086 · tinjau kebutuhan"],
      ["Target awal simulasi", "12 Nov 2026"],
    ],
  },
  {
    id: "people",
    number: "05",
    label: "ORANG → KESIAPAN OPERASI",
    title: "Di balik setiap proses, ada orang yang membuatnya berjalan.",
    description:
      "Karyawan, supervisor, operator, dan manajer membutuhkan informasi yang berbeda, tetapi bekerja menuju tujuan yang sama.",
    detail:
      "Penanggung jawab, rencana shift, dan kesiapan aset mendukung work order yang sama. HRIS dan Maintenance masih dalam pengembangan; panel ini menunjukkan rancangan hubungan, bukan fitur produksi yang sudah aktif.",
    steps: [
      "Tanggung jawab",
      "Rencana shift",
      "Kesiapan aset",
      "Instruksi kerja",
    ],
    active: ["people", "planning", "operations"],
    modules: ["hris", "maintenance", "mes"],
    previewTitle: "Pekerjaan membutuhkan kesiapan.",
    rows: [
      ["Tim simulasi", "Shift A · lini perakitan"],
      ["Penanggung jawab", "Supervisor operasi"],
      ["Aset", "Meja perakitan · cek kesiapan"],
    ],
  },
  {
    id: "execution",
    number: "06",
    label: "RENCANA → HASIL KERJA",
    title: "Dari rencana menjadi pekerjaan yang terukur.",
    description:
      "Setiap pekerjaan memiliki tahapan, tanggung jawab, target, dan hasil yang perlu dicatat.",
    detail:
      "WO-0214 membawa instruksi dari persiapan, perakitan, hingga pemeriksaan. Hasil yang belum lolos checkpoint ditinjau untuk rework sebelum dinyatakan selesai.",
    steps: [
      "Work order",
      "Penugasan",
      "Pencatatan hasil",
      "Quality checkpoint",
      "Rework / selesai",
    ],
    active: ["operations", "quality", "inventory", "people"],
    modules: ["mes", "quality"],
    previewTitle: "Progres dengan konteks mutu.",
    rows: [
      ["Work order", "WO-0214 · 120 meja"],
      ["Output contoh", "72 dari 120 unit"],
      ["Checkpoint mutu", "Inspeksi dimensi · perlu review"],
    ],
  },
  {
    id: "ripple",
    number: "07",
    label: "THE RIPPLE EFFECT",
    title: "Satu perubahan. Dampaknya ke seluruh perusahaan.",
    description:
      "Kiriman supplier terlambat dua hari. Persoalannya tidak berhenti di purchasing—komitmen kerja di departemen lain perlu ditinjau bersama.",
    detail:
      "Telusuri hubungan sebab-akibat pada pesanan SO-1042. Perubahan di bawah ini adalah simulasi untuk membantu memahami ketergantungan, bukan penjadwalan, prediksi, atau notifikasi otomatis yang sedang berjalan.",
    steps: [
      "Kiriman tertunda",
      "Material ditinjau",
      "Rencana disesuaikan manusia",
      "Komitmen dikaji bersama",
    ],
    active: [
      "procurement",
      "inventory",
      "planning",
      "operations",
      "people",
      "sales",
      "finance",
    ],
    modules: ["erp", "crm", "hris", "accounting"],
    previewTitle: "Dampak berawal dari satu material.",
    rows: [
      ["Sumber perubahan", "PO-0086 · panel laminasi"],
      ["Keterlambatan simulasi", "2 hari"],
      ["Tindakan", "Tinjauan lintas departemen"],
    ],
  },
  {
    id: "governance",
    number: "08",
    label: "AKTIVITAS → JEJAK TRANSAKSI",
    title: "Setiap aktivitas memiliki cerita. Setiap transaksi memiliki jejak.",
    description:
      "Dokumen, persetujuan, biaya, dan transaksi adalah bagian dari alur bisnis yang sama.",
    detail:
      "Purchase order, penerimaan material, surat jalan, dan invoice menggambarkan aktivitas yang berbeda. Dokumen mengikuti catatan transaksi; mengedit file tidak mengubah transaksi yang sudah dibukukan.",
    steps: [
      "Purchase order",
      "Penerimaan",
      "Surat jalan",
      "Invoice",
      "Jurnal & audit trail",
    ],
    active: ["documents", "finance", "procurement", "operations"],
    modules: ["accounting", "workspace", "automation"],
    previewTitle: "Dari aktivitas ke bukti bisnis.",
    rows: [
      ["Dokumen contoh", "PO-0086 → penerimaan → invoice"],
      ["Estimasi biaya order", "Rp 40,8 juta · data simulasi"],
      ["Kendali", "Persetujuan & jejak perubahan"],
    ],
  },
  {
    id: "intelligence",
    number: "09",
    label: "INFORMASI → PEMAHAMAN",
    title: "Informasi yang terhubung. Keputusan yang lebih terarah.",
    description:
      "Saat informasi lintas departemen dapat dipahami bersama, perusahaan memiliki dasar yang lebih baik untuk mengenali masalah, menentukan prioritas, dan mengambil keputusan.",
    detail:
      "Rancangan Company Copilot menghubungkan pertanyaan manajemen dengan sumber bisnis yang relevan. Akses mengikuti kewenangan pengguna; rekomendasi tidak mengubah transaksi atau melewati persetujuan manusia.",
    steps: [
      "Konteks pesanan",
      "Sumber informasi",
      "Penjelasan risiko",
      "Keputusan manusia",
    ],
    active: [
      "sales",
      "planning",
      "procurement",
      "inventory",
      "operations",
      "finance",
      "documents",
    ],
    modules: ["intelligence", "automation", "ai_copilot"],
    previewTitle: "Lihat hubungan, lalu tentukan langkah.",
    rows: [
      ["Pertanyaan ilustratif", "Pesanan mana berisiko terlambat?"],
      ["Sumber yang relevan", "SO-1042 · PO-0086 · rencana kerja"],
      ["Batas tindakan", "Analisis contoh · persetujuan manusia"],
    ],
  },
] as const;

export function getRippleImpacts(delayed: boolean) {
  if (!delayed) return [];
  return [
    {
      department: "inventory",
      label: "Inventory",
      cause: "PO-0086 tertunda",
      effect: "Ketersediaan panel laminasi perlu diperiksa kembali.",
    },
    {
      department: "planning",
      label: "Planning",
      cause: "Material belum siap",
      effect: "Urutan dan tanggal pekerjaan SO-1042 perlu ditinjau.",
    },
    {
      department: "operations",
      label: "Operations",
      cause: "Rencana dapat berubah",
      effect: "Supervisor meninjau alokasi pekerjaan WO-0214.",
    },
    {
      department: "people",
      label: "HR & Maintenance",
      cause: "Kebutuhan kerja bergeser",
      effect: "Rencana shift dan kesiapan aset dikaji bersama tim operasi.",
    },
    {
      department: "sales",
      label: "Sales",
      cause: "Target awal perlu dikaji",
      effect: "Tim meninjau komitmen pelanggan sebelum memberi pembaruan.",
    },
    {
      department: "finance",
      label: "Finance & Management",
      cause: "Dampak lintas proses",
      effect: "Biaya, arus kas, dan prioritas dibahas dari konteks yang sama.",
    },
  ] as const;
}

export const PLATFORM_GROUPS = [
  {
    id: "business",
    title: "Run Your Business",
    headline: "Dari peluang menjadi keputusan bisnis.",
    description:
      "Selaraskan kebutuhan pelanggan, perencanaan sumber daya, dan tanggung jawab keuangan.",
    useCase:
      "Sales, purchasing, dan finance meninjau pesanan yang sama sebelum membuat komitmen.",
    modules: ["crm", "erp", "accounting"],
    visual: "sales",
  },
  {
    id: "operations",
    title: "Run Your Operations",
    headline: "Beri pekerjaan konteks yang dibutuhkan.",
    description:
      "Hubungkan instruksi, kesiapan aset, dan checkpoint mutu dengan rencana operasional.",
    useCase:
      "Supervisor melihat work order, tim quality meninjau hasil, dan maintenance memetakan kesiapan aset.",
    modules: ["mes", "quality", "maintenance"],
    visual: "execution",
  },
  {
    id: "people",
    title: "Empower Your People",
    headline: "Orang yang tepat. Informasi yang relevan.",
    description:
      "Rancang hubungan tanggung jawab, jadwal, dan dokumen kerja yang dapat dipahami bersama.",
    useCase:
      "HR dan tim operasi menyelaraskan kebutuhan shift dengan instruksi serta dokumen pekerjaan.",
    modules: ["hris", "workspace"],
    visual: "people",
  },
  {
    id: "connect",
    title: "Connect Your Workflows",
    headline: "Hubungkan alur, tetap jaga kendali.",
    description:
      "Petakan perpindahan informasi dan gerbang persetujuan di antara tim serta sistem.",
    useCase:
      "Dokumen dan permintaan berpindah melalui jalur review, bukan melewati aturan bisnis.",
    modules: ["automation", "connect"],
    visual: "governance",
  },
  {
    id: "intelligence",
    title: "Understand Your Business",
    headline: "Pahami sebab di balik sebuah angka.",
    description:
      "Rancang pandangan manajemen dan pertanyaan lintas departemen dengan sumber yang dapat ditelusuri.",
    useCase:
      "Direksi meninjau hubungan pesanan, material, pekerjaan, dan implikasi biaya sebelum memutuskan.",
    modules: ["intelligence", "ai_copilot"],
    visual: "intelligence",
  },
] as const;

export function moduleHref(id: string) {
  return id === "ai_copilot" ? "/copilot" : `/modules/${id}`;
}
export function moduleStatus(id: string) {
  return CAPABILITY_STATUSES[id];
}

export const SERVICE_PHASES = [
  {
    id: "discover",
    number: "01",
    name: "DISCOVER",
    subtitle: "Understand Your Business",
    title: "Mulai dari cara Anda bekerja.",
    description:
      "Memahami proses, titik hambatan, dan prioritas sebelum menentukan solusi.",
    deliverables: [
      "Pemetaan proses bisnis & pain point",
      "Diskusi kecocokan solusi",
      "Usulan prioritas & roadmap transformasi",
    ],
  },
  {
    id: "implement",
    number: "02",
    name: "IMPLEMENT",
    subtitle: "Build Your Connected Workflow",
    title: "Tentukan ruang lingkup yang masuk akal.",
    description:
      "Merancang konfigurasi, kesiapan data, serta rencana pilot dan rollout yang dapat ditinjau bersama.",
    deliverables: [
      "Pembahasan scope & konfigurasi modul",
      "Persiapan data dan rencana pilot",
      "Kriteria validasi & rencana rollout",
    ],
  },
  {
    id: "connect",
    number: "03",
    name: "CONNECT",
    subtitle: "Connect Data, People & Systems",
    title: "Petakan hubungan antarpekerjaan.",
    description:
      "Meninjau kebutuhan integrasi, proses dokumen, dan peluang otomasi dalam batas kewenangan yang jelas.",
    deliverables: [
      "Assessment kebutuhan integrasi",
      "Pemetaan workflow & dokumen",
      "Identifikasi peluang otomasi",
    ],
  },
  {
    id: "grow",
    number: "04",
    name: "GROW",
    subtitle: "Enable Your Team",
    title: "Bantu tim memahami perubahan.",
    description:
      "Menyusun kebutuhan pelatihan, adopsi pengguna, dan pendampingan perbaikan berkelanjutan.",
    deliverables: [
      "Rencana pelatihan & adopsi",
      "Panduan alur operasional",
      "Usulan evaluasi & improvement",
    ],
  },
] as const;
