import { MaturityState } from "../capabilities/status";

export interface ModuleData {
  slug: string;
  name: string;
  fullName: string;
  tagline: string;
  category: string;
  status: MaturityState;
  heroProblem: string;
  heroDescription: string;
  coreProblems: Array<{ title: string; desc: string }>;
  capabilities: Array<{ title: string; desc: string; icon?: string }>;
  workflowSteps: Array<{ step: string; title: string; desc: string }>;
  crossModuleIntegrations: Array<{ module: string; flow: string }>;
  copilotHighlight: {
    name: string;
    description: string;
    sampleQuery: string;
    sampleResponse: string;
  };
  useCases: Array<{ industry: string; scenario: string }>;
  expectedOutcomes: Array<{ metric: string; target: string }>;
  categorySlug: string;
}

export const MODULES_MAP: Record<string, ModuleData> = {
  erp: {
    slug: "erp",
    name: "ERP Core",
    fullName: "Enterprise Resource Planning & Supply Chain",
    tagline: "Perencanaan Material, Pengadaan & Master Data Terpusat",
    category: "CORE_SUITE",
    status: "PILOT_AVAILABLE",
    heroProblem: "Spreadsheet terfragmentasi menyebabkan selisih stok, pembelian material telat, dan jadwal pengiriman pelanggan yang meleset.",
    heroDescription: "NewSystem ERP menyatukan master item, multi-gudang, BOM engineering, Material Requirements Planning (MRP), dan pengadaan dalam satu aliran transaksi terpadu.",
    coreProblems: [
      {
        title: "Selisih Stok Fisik vs Catatan Sistem",
        desc: "Tidak adanya transactional stock ledger dan reservasi alokasi menyebabkan material ganda terpakai di pesanan berbeda.",
      },
      {
        title: "Keterlambatan Pengadaan Bahan Baku",
        desc: "Purchasing tidak mengetahui kekurangan bahan baku sampai mandor mengeluhkan stok kosong di lantai produksi.",
      },
      {
        title: "Ketidaksesuaian Revisi BOM",
        desc: "Lantai produksi memakai gambar teknik lama sementara pelanggan telah menyetujui perubahan spesifikasi produk.",
      },
      {
        title: "Multi-Gudang Tidak Tersinkronisasi",
        desc: "Perpindahan bahan baku antar gudang transit atau antar plant tidak tercatat secara real-time.",
      },
    ],
    capabilities: [
      {
        title: "Transactional Stock Ledger",
        desc: "Setiap pergerakan barang (PO receive, transfer, issue, return) dicatat permanen dalam buku besar mutasi yang immutable.",
      },
      {
        title: "Multi-Level BOM & Routing Revisions",
        desc: "Manajemen struktur komponen bertingkat dengan riwayat revisi dan tanggal efektivitas yang jelas.",
      },
      {
        title: "Material Requirements Planning (MRP)",
        desc: "Perhitungan otomatis kebutuhan bersih bahan baku berdasarkan Sales Order terkonfirmasi dan stok bebas di gudang.",
      },
      {
        title: "Hard & Soft Stock Reservation",
        desc: "Mengunci stok material fisik untuk job order tertentu agar tidak terpakai oleh pesanan lain secara tidak sengaja.",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Sales Demand Capture", desc: "Sales Order terkonfirmasi masuk ke antrean perencanaan PPIC." },
      { step: "02", title: "MRP Calculation", desc: "Sistem menghitung kebutuhan bahan baku versus stok bebas dan PO berjalan." },
      { step: "03", title: "Draf Purchase Requisition", desc: "Otomatis menghasilkan draf PR jika terdeteksi kekurangan bahan." },
      { step: "04", title: "Release Production Order", desc: "Menerbitkan perintah produksi resmi dan mengunci stok bahan baku." },
    ],
    crossModuleIntegrations: [
      { module: "MES Shop Floor", flow: "Production Order dirilis menjadi Job Cards ke stasiun kerja lantai produksi." },
      { module: "Accounting & Costing", flow: "Setiap penerimaan barang (Goods Receipt) mencatat accrued AP dan saldo persediaan." },
      { module: "CRM", flow: "Memberikan status ketersediaan stok aktual dan estimasi tanggal penyelesaian ke tim sales." },
    ],
    copilotHighlight: {
      name: "ERP & Supply Chain Copilot",
      description: "Mendeteksi risiko kekurangan bahan baku sebelum pesanan dirilis ke shop floor.",
      sampleQuery: "Apakah stok material untuk pesanan PO-409 cukup untuk produksi minggu depan?",
      sampleResponse: "Stok kain poliester cukup (800m aman), tetapi kancing ukuran 18mm kurang 2.400 pcs. Ada PO supplier yang dijadwalkan tiba Selasa depan.",
    },
    useCases: [
      { industry: "General Manufacturing", scenario: "Perencanaan stok bahan mentah, sub-assembly, dan pengadaan komponen kritis." },
      { industry: "Furnitur & Rakitan", scenario: "Multi-level BOM untuk komponen kayu, busa, finishing cat, dan baut engsel." },
    ],
    expectedOutcomes: [
      { metric: "Akurasi Saldo Inventori", target: "≥ 98% kesesuaian fisik vs sistem" },
      { metric: "Lead Time Pengadaan Darurat", target: "Turun hingga 40%" },
    ],
    categorySlug: "erp-business-management",
  },

  mes: {
    slug: "mes",
    name: "MES Shop Floor",
    fullName: "Manufacturing Execution System & Dispatching",
    tagline: "Eksekusi Produksi Real-Time & Pengendalian Lantai Pabrik",
    category: "OPERATIONAL",
    status: "PILOT_AVAILABLE",
    heroProblem: "Kertas laporan mandor baru direkap sore hari, status mesin mati tidak diketahui manajemen, dan scrap terakumulasi tanpa investigasi.",
    heroDescription: "NewSystem MES mendigitalkan lantai produksi dengan digital job cards, dispatching mesin, pencatatan hasil potong/cetak aktual, dan jam kerja operator langsung.",
    coreProblems: [
      {
        title: "Blind Spot Lantai Produksi",
        desc: "Manajemen tidak tahu apakah lini produksi sedang berjalan lancar, terhambat setup mesin, atau menunggu bahan.",
      },
      {
        title: "Pencatatan Jam Kerja Operator Terputus",
        desc: "Tidak ada data akurat berapa jam operator dihabiskan untuk Job Order tertentu, menyulitkan penghitungan direct labor.",
      },
      {
        title: "Scrap & Rework Terlambat Diketahui",
        desc: "Barang cacat baru dilaporkan setelah shift selesai, sehingga bahan baku telah terbuang percuma.",
      },
      {
        title: "Penumpukan Barang Setengah Jadi (WIP)",
        desc: "Workstation kedua macet sementara workstation pertama terus memproduksi, memicu bottleneck.",
      },
    ],
    capabilities: [
      {
        title: "Digital Job Cards & Operator Dispatching",
        desc: "Layar sentuh / tablet shop floor yang menampilkan instruksi kerja, gambar teknik, dan target kuantitas per shift.",
      },
      {
        title: "Pencatatan Output & Scrap Real-Time",
        desc: "Operator mencatat jumlah lolos (good parts) dan alasan scrap (cacat potong, cacat suhu, cacat cetak) seketika.",
      },
      {
        title: "Tracking Downtime & Alasan Mesin Berhenti",
        desc: "Klasifikasi waktu henti: setup alat, penggantian pisau, perbaikan mekanik, atau kehabisan bahan baku.",
      },
      {
        title: "Integrasi Pelacakan Lot & Barcode",
        desc: "Memindai nomor lot material masuk untuk memastikan ketertelusuran penuh dari bahan mentah hingga barang jadi.",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Job Card Dispatch", desc: "PPIC menjadwalkan pekerjaan ke Work Center mesin spesifik." },
      { step: "02", title: "Operator Check-in", desc: "Operator memindai identitas dan memulai setup mesin." },
      { step: "03", title: "Run Execution & Scrap Log", desc: "Pencatatan output produk dan alasan reject per interval jam." },
      { step: "04", title: "QC Disposition & Handover", desc: "Lot dipindahkan ke stasiun kerja berikutnya atau karantina QC." },
    ],
    crossModuleIntegrations: [
      { module: "ERP Inventory", flow: "Mengonsumsi saldo bahan baku di gudang shop-floor secara atomik saat output dilaporkan." },
      { module: "Accounting & Costing", flow: "Mengirimkan data jam kerja riil operator dan mesin untuk komponen HPP WIP." },
      { module: "QMS", flow: "Memicu inspeksi in-process bila reject rate melampaui batas toleransi 3%." },
    ],
    copilotHighlight: {
      name: "MES Shop Floor Copilot",
      description: "Mendeteksi anomali kecepatan produksi dan korelasi reject rate per shift.",
      sampleQuery: "Mengapa shift 2 kemarin menghasilkan scrap 8% lebih tinggi di mesin Stamping #3?",
      sampleResponse: "Terdeteksi fluktuasi ketebalan material pada coil plat lot#0912 dan waktu setup cetakan lebih singkat dari SOP standar.",
    },
    useCases: [
      { industry: "General & Discrete", scenario: "Pelacakan job card mesin bubut, CNC, stamping, dan perakitan manual." },
      { industry: "Garment", scenario: "Line balancing lintasan sewing, target output bundle per jam per operator." },
    ],
    expectedOutcomes: [
      { metric: "Visibilitas Progres Produksi", target: "Real-time (detik) dari tablet shop floor" },
      { metric: "Tingkat Scrap yang Tidak Terlacak", target: "Turun menjadi 0% (semua tercatat dengan alasan)" },
    ],
    categorySlug: "mes-production-intelligence",
  },

  accounting: {
    slug: "accounting",
    name: "Accounting & Costing",
    fullName: "Financial Accounting, Double-Entry & Actual Costing",
    tagline: "Pembukuan Double-Entry Otomatis & Kalkulasi HPP Aktual",
    category: "CORE_SUITE",
    status: "PILOT_AVAILABLE",
    heroProblem: "Laporan laba rugi terlambat 3 minggu, HPP hanya angka teoretis standar, dan margin keuntungan per produk tidak pernah diketahui secara pasti.",
    heroDescription: "NewSystem Accounting menghubungkan pergerakan fisik gudang dan jam kerja mesin langsung ke buku besar akuntansi, menyajikan HPP aktual riil saat produk selesai.",
    coreProblems: [
      {
        title: "HPP Teoretis Tidak Mencerminkan Biaya Riil",
        desc: "Standar costing usang mengabaikan kenaikan harga bahan baku mendadak, scrap tinggi, dan lembur operator darurat.",
      },
      {
        title: "Tutup Buku Bulanan Lambat dan Penuh Selisih",
        desc: "Staf finance harus mencocokkan ratusan lembar mutasi gudang manual dengan faktur pembelian pemasok.",
      },
      {
        title: "Pemisahan Sub-Ledger dan General Ledger",
        desc: "Nilai persediaan di modul gudang sering tidak sama dengan saldo akun persediaan di neraca keuangan.",
      },
    ],
    capabilities: [
      {
        title: "Jurnal Otomatis Berbasis Event Bisnis",
        desc: "Penerimaan PO, pengeluaran bahan ke produksi, dan transfer Finished Goods otomatis membentuk jurnal akuntansi seimbang.",
      },
      {
        title: "Actual Costing Engine",
        desc: "Menghitung HPP berdasarkan harga perolehan material aktual (FIFO/Weighted Average) + direct labor + overhead pabrik.",
      },
      {
        title: "Variance Analysis (Standar vs Aktual)",
        desc: "Membedah selisih biaya: varians harga bahan, varians kuantitas pemakaian, dan varians tarif tenaga kerja.",
      },
      {
        title: "Laporan Margin Kontribusi Per Job Order",
        desc: "Mengetahui secara tepat pesanan mana yang paling menguntungkan dan pesanan mana yang tergerus marginnya.",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Goods Receipt", desc: "Akuntansi mencatat debit Persediaan Bahan Baku dan kredit Accrued AP." },
      { step: "02", title: "Material Issue to Work Order", desc: "Bahan berpindah ke akun Persediaan Barang Dalam Proses (WIP)." },
      { step: "03", title: "Direct Labor Allocation", desc: "Jam kerja terverifikasi dari absensi/MES dibebankan ke WIP." },
      { step: "04", title: "Finished Goods Completion", desc: "Saldo WIP ditransfer ke akun Persediaan Barang Jadi sebesar total biaya riil." },
    ],
    crossModuleIntegrations: [
      { module: "ERP Procurement", flow: "Mencocokkan 3-way matching: PO vs Surat Jalan Penerimaan vs Faktur Tagihan Supplier." },
      { module: "MES Shop Floor", flow: "Menangkap konsumsi material riil dan scrap untuk membebankan kerugian operasional." },
      { module: "HRIS Payroll", flow: "Merekonsiliasi total pengeluaran gaji dengan biaya tenaga kerja yang dialokasikan ke produk." },
    ],
    copilotHighlight: {
      name: "Finance & Costing Copilot",
      description: "Menjelaskan anomali varians biaya dan proyeksi arus kas pabrik.",
      sampleQuery: "Mengapa HPP produk Kursi Ergonomis tipe A naik 12% pada pesanan batch lalu?",
      sampleResponse: "Kenaikan HPP dipicu oleh pemakaian lembur shift malam (+Rp 14.000/unit) dan pemborosan bahan kain busa akibat reject pola potong 9%.",
    },
    useCases: [
      { industry: "General Manufacturing", scenario: "Penentuan harga jual minimum berbasis margin kontribusi riil." },
      { industry: "Food & Beverage", scenario: "Alokasi biaya penyusutan formula dan bahan per batch produksi." },
    ],
    expectedOutcomes: [
      { metric: "Waktu Tutup Buku Bulanan", target: "Dipersingkat dari 15 hari menjadi 2 hari kerja" },
      { metric: "Akurasi Biaya Produksi Aktual", target: "100% terlacak ke nomor job order" },
    ],
    categorySlug: "finance-hpp-profitability",
  },

  crm: {
    slug: "crm",
    name: "CRM Manufaktur",
    fullName: "Customer Relationship Management & Sales Pipelines",
    tagline: "Pipeline Penjualan B2B & Konfirmasi Pesanan Manufaktur",
    category: "CORE_SUITE",
    status: "PILOT_AVAILABLE",
    heroProblem: "Sales menjanjikan waktu kirim yang tidak realistis ke pelanggan, penawaran harga dibuat tanpa rujukan biaya akurat, dan riwayat pesanan tercecer.",
    heroDescription: "NewSystem CRM dirancang khusus untuk alur penjualan manufaktur: quotation berbasis struktur BOM, verifikasi kapasitas pabrik, hingga konfirmasi Sales Order.",
    coreProblems: [
      {
        title: "Penawaran Harga (Quotation) Kurang Akurat",
        desc: "Sales menghitung estimasi biaya secara kasar tanpa mengecek harga bahan baku terkini, memicu risiko order merugi.",
      },
      {
        title: "Janji Pengiriman (Delivery Promise) Meleset",
        desc: "Sales tidak memiliki akses ke kapasitas mesin dan jadwal PPIC, sehingga pesanan menumpuk di lini yang sudah penuh.",
      },
    ],
    capabilities: [
      {
        title: "BOM Cost Estimator for Quotation",
        desc: "Menghitung estimasi biaya dasar langsung dari draf struktur BOM sebelum mengirimkan proposal harga ke klien.",
      },
      {
        title: "Katalog Produk & Spesifikasi Kustom B2B",
        desc: "Mendukung katalog produk standar (MTS) dan formulir spesifikasi pesanan khusus (Make-to-Order).",
      },
      {
        title: "Konversi Otomatis Quotation ke Sales Order",
        desc: "Setelah disetujui konsumen, draf penawaran langsung menjadi Sales Order resmi tanpa re-entry.",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Lead & Inquiry", desc: "Mencatat permintaan pelanggan dan spesifikasi produk yang diinginkan." },
      { step: "02", title: "Cost & Feasibility Review", desc: "Pengecekan estimasi bahan baku dan ketersediaan kapasitas pabrik." },
      { step: "03", title: "Quotation Issuance", desc: "Penerbitan surat penawaran harga resmi dengan syarat pembayaran." },
      { step: "04", title: "Sales Order Confirmation", desc: "Pelanggan menerbitkan PO; sistem memicu alur reservasi stok dan PPIC." },
    ],
    crossModuleIntegrations: [
      { module: "ERP PPIC", flow: "Memicu perhitungan MRP dan penjadwalan produksi secara otomatis." },
      { module: "Accounting", flow: "Membentuk draf tagihan Down Payment (DP) atau Invoice Pelunasan." },
    ],
    copilotHighlight: {
      name: "CRM Sales Copilot",
      description: "Menganalisis probabilitas penawaran harga dan rekomendasi diskon batas aman margin.",
      sampleQuery: "Berapa batas diskon maksimal untuk tender 5.000 unit PT Maju agar margin kotor tetap di atas 22%?",
      sampleResponse: "Diskon maksimal yang diizinkan adalah 6,5% dengan asumsi pembelian bahan baku skala besar (bulk order).",
    },
    useCases: [
      { industry: "Furnitur & Custom Order", scenario: "Quotation custom berdasarkan bahan kayu, jenis kain, dan ukuran khusus." },
      { industry: "General B2B", scenario: "Penjualan kontrak repeat order dengan syarat termin pembayaran 30/60 hari." },
    ],
    expectedOutcomes: [
      { metric: "Waktu Pembuatan Quotation", target: "Turun dari 3 hari menjadi 30 menit" },
      { metric: "Kepatuhan Margin Penjualan", target: "Zero pesanan di bawah target margin tanpa approval direksi" },
    ],
    categorySlug: "erp-business-management",
  },

  hris: {
    slug: "hris",
    name: "HRIS & Direct Labor",
    fullName: "Human Resource Information System & Factory Labor Allocation",
    tagline: "Pengelolaan Shift Pabrik, Absensi & Biaya Tenaga Kerja Langsung",
    category: "CORE_SUITE",
    status: "IN_DEVELOPMENT",
    heroProblem: "Shift kerja pabrik berantakan, data lembur terlambat disinkronkan, dan biaya upah tenaga kerja tidak teralokasi ke harga pokok produk.",
    heroDescription: "NewSystem HRIS menghubungkan manajemen karyawan, jadwal shift rotasi pabrik, mesin absensi, dan penggajian langsung ke kalkulasi direct labor HPP.",
    coreProblems: [
      {
        title: "Biaya Lembur Tidak Terkontrol",
        desc: "Lembur darurat sering terjadi tanpa kejelasan apakah order bersangkutan memiliki margin yang memadai untuk menutup biaya lembur.",
      },
      {
        title: "Jadwal Shift Pabrik yang Rumit",
        desc: "Pabrik dengan 2-3 shift dan operator lintas keahlian sering kesulitan mengatur jadwal pengganti jika ada yang absen.",
      },
    ],
    capabilities: [
      {
        title: "Multi-Shift & Rotation Scheduler",
        desc: "Pengaturan shift harian, mingguan, lembur akhir pekan, dan pembagian regu kerja lini pabrik.",
      },
      {
        title: "Direct Labor Cost Tracking",
        desc: "Mengonversi jam kerja riil operator di work center menjadi beban biaya tenaga kerja langsung per nomor order.",
      },
      {
        title: "Payroll & Kepatuhan Regulasi Indonesia",
        desc: "Penghitungan gaji pokok, tunjangan shift, lembur sesuai Depnaker, BPJS Ketenagakerjaan & Kesehatan, serta PPh 21.",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Shift Assignment", desc: "Penjadwalan regu kerja berdasarkan rencana kapasitas produksi PPIC." },
      { step: "02", title: "Attendance & Shop Floor Clock-in", desc: "Pencatatan kehadiran dan verifikasi operator di workstation." },
      { step: "03", title: "Overhead & Labor Capture", desc: "Pencatatan jam kerja riil yang dihabiskan untuk Job Cards." },
      { step: "04", title: "Payroll & Costing Settlement", desc: "Penggajian bulanan dan alokasi biaya tenaga kerja ke akun akuntansi." },
    ],
    crossModuleIntegrations: [
      { module: "MES Shop Floor", flow: "Memvalidasi sertifikasi keahlian operator sebelum diizinkan mengoperasikan mesin kritis." },
      { module: "Accounting", flow: "Menerbitkan jurnal beban gaji dan membebankan direct labor ke sub-ledger WIP." },
    ],
    copilotHighlight: {
      name: "HRIS Workforce Copilot",
      description: "Memprediksi kebutuhan tenaga kerja dan mendeteksi anomali absensi pada shift kritis.",
      sampleQuery: "Berapa kebutuhan operator sewing untuk mengejar target pengiriman minggu ke-3 bulan depan?",
      sampleResponse: "Dibutuhkan 32 operator (asumsi OEE 78%). Dengan kapasitas regu saat ini (28 operator), disarankan penambahan 1 shift lembur pada hari Sabtu.",
    },
    useCases: [
      { industry: "Garment & Tekstil", scenario: "Manajemen 200+ operator sewing dengan sistem target output harian." },
      { industry: "General Manufacturing", scenario: "Rotasi 3 shift pabrik dengan premi shift malam dan integrasi lembur." },
    ],
    expectedOutcomes: [
      { metric: "Kecepatan Rekonsiliasi Absensi & Lembur", target: "Otomatis seketika setiap pergantian shift" },
      { metric: "Akurasi Pembebanan Biaya Tenaga Kerja", target: "100% terhubung ke nomor batch/order" },
    ],
    categorySlug: "workforce-hr-management",
  },

  quality: {
    slug: "quality",
    name: "Quality Management (QMS)",
    fullName: "Quality Control, Lot Traceability & Non-Conformance",
    tagline: "Inspeksi Mutu Terpadu & Penahanan Lot Otomatis",
    category: "OPERATIONAL",
    status: "IN_DEVELOPMENT",
    heroProblem: "Bahan baku cacat dari supplier terlanjur diproses di mesin, scrap menumpuk, dan laporan komplain pelanggan tidak memiliki data telusur.",
    heroDescription: "NewSystem QMS menyatukan inspeksi material masuk (IQC), in-process inspection (IPQC), penerbitan sertifikat COA, dan penahanan lot cacat (lot hold) langsung di sistem gudang.",
    coreProblems: [
      {
        title: "Material Cacat Lolos ke Lini Produksi",
        desc: "Tidak ada sistem penahan otomatis di gudang saat material masih menunggu hasil uji laboratorium QC.",
      },
      {
        title: "Ketertelusuran Lot Lemah",
        desc: "Ketika pelanggan mengeluhkan cacat produk jadi, pabrik tidak tahu bahan baku dari supplier mana yang bermasalah.",
      },
    ],
    capabilities: [
      {
        title: "Automatic QC Quarantine & Lot Hold",
        desc: "Material yang baru datang otomatis berstatus QC_HOLD dan terkunci secara sistemik agar tidak bisa dikeluarkan gudang.",
      },
      {
        title: "Sampling Plan & Inspection Checklists",
        desc: "Checklist parameter inspeksi (dimensi, kadar air, kekuatan tarik, warna) dengan ambang batas AQL (Acceptable Quality Limit).",
      },
      {
        title: "Non-Conformance Report (NCR) & CAPA",
        desc: "Alur penanganan barang cacat: penolakan ke supplier (return), pengerjaan ulang (rework), atau penurunan grade.",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Goods Receipt & Quarantine", desc: "Material masuk gudang langsung dikunci statusnya untuk inspeksi IQC." },
      { step: "02", title: "Inspection & Testing", desc: "Petugas QC memasukkan hasil uji parameter ke formulir digital." },
      { step: "03", title: "Disposition Decision", desc: "Keputusan: QC Pass (buka kunci ke stok aktif), Rework, atau Reject." },
      { step: "04", title: "CAPA / Supplier Feedback", desc: "Penerbitan surat klaim atau nota debit ke supplier jika terjadi cacat berulang." },
    ],
    crossModuleIntegrations: [
      { module: "ERP Inventory", flow: "Mengunci atau membuka blokir saldo stok material berdasarkan hasil inspeksi." },
      { module: "MES Shop Floor", flow: "Mencegah dimulainya job card jika bahan baku belum berstatus QC_RELEASE." },
    ],
    copilotHighlight: {
      name: "Quality Copilot",
      description: "Menghubungkan pola komplain pelanggan dengan riwayat lot pemasok bahan baku.",
      sampleQuery: "Apakah ada korelasi antara komplain retak produk seri C dengan pemasok resin tertentu?",
      sampleResponse: "Ya, 83% komplain retak berasal dari batch produksi yang menggunakan resin dari Pemasok X (Lot #R-4412).",
    },
    useCases: [
      { industry: "Food & Beverage", scenario: "Pemeriksaan kadar air, uji organoleptik, suhu pendingin, dan kepatuhan nomor izin edar." },
      { industry: "General Engineering", scenario: "Inspeksi toleransi dimensi dengan mikrometer dan uji kekerasan bahan." },
    ],
    expectedOutcomes: [
      { metric: "Pencegahan Material Cacat Masuk Lini", target: "100% terkunci otomatis hingga rilis QC" },
      { metric: "Waktu Pelacakan Riwayat Lot", target: "Kurang dari 60 detik" },
    ],
    categorySlug: "quality-maintenance",
  },

  maintenance: {
    slug: "maintenance",
    name: "Maintenance (CMMS)",
    fullName: "Computerized Maintenance Management System",
    tagline: "Perawatan Mesin Terjadwal & Pengurangan Downtime",
    category: "OPERATIONAL",
    status: "IN_DEVELOPMENT",
    heroProblem: "Mesin mati mendadak saat kejar deadline, teknisi bekerja secara reaktif, dan suku cadang kritis tidak tersedia di gudang.",
    heroDescription: "NewSystem Maintenance mengelola jadwal pemeliharaan preventif (PM), log kerusakan breakdown, work order teknisi, dan ketersediaan spare parts mesin.",
    coreProblems: [
      {
        title: "Downtime Tak Terduga (Unplanned Downtime)",
        desc: "Pabrik kehilangan jam produksi bernilai puluhan juta rupiah karena mengabaikan jadwal ganti oli dan kalibrasi rutin.",
      },
      {
        title: "Suku Cadang Kritis Kosong",
        desc: "Mesin berhenti selama 3 hari hanya karena menunggu baut atau bearing khusus yang lupa dipesan ke supplier.",
      },
    ],
    capabilities: [
      {
        title: "Preventive Maintenance (PM) Scheduler",
        desc: "Jadwal berkala berbasis waktu (harian, bulanan) atau berbasis jam kerja mesin (runtime hours).",
      },
      {
        title: "Breakdown Work Orders & Response Log",
        desc: "Operator dapat melaporkan kerusakan mesin langsung dari tablet shop floor dengan tombol panggil teknisi.",
      },
      {
        title: "Spare Parts Inventory Integration",
        desc: "Pelacakan saldo suku cadang di gudang teknik dengan batas minimum pemesanan ulang (reorder point).",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Schedule Trigger", desc: "Jadwal pemeliharaan preventif jatuh tempo atau operator melapor breakdown." },
      { step: "02", title: "Work Order Dispatch", desc: "Penugasan teknisi pemeliharaan dan reservasi suku cadang dari gudang." },
      { step: "03", title: "Execution & Spare Part Consumption", desc: "Pencatatan durasi perbaikan dan suku cadang yang diganti." },
      { step: "04", title: "Status Sync to MES", desc: "Mesin dinyatakan siap operasi kembali; status online diperbarui di MES." },
    ],
    crossModuleIntegrations: [
      { module: "MES Shop Floor", flow: "Sinkronisasi status mesin offline agar PPIC tidak menjadwalkan pesanan ke mesin rusak." },
      { module: "ERP Procurement", flow: "Menerbitkan draf pembelian otomatis untuk suku cadang yang menipis." },
    ],
    copilotHighlight: {
      name: "Maintenance Copilot",
      description: "Menganalisis MTBF (Mean Time Between Failures) dan rekomendasi penggantian komponen kritis.",
      sampleQuery: "Kapan jadwal servis besar berikutnya untuk mesin Kompresor Utama Unit 2?",
      sampleResponse: "Mesin telah beroperasi 4.820 jam. Disarankan servis ganti filter dan oli kompresor dalam 180 jam kerja ke depan.",
    },
    useCases: [
      { industry: "General Manufacturing", scenario: "Pemeliharaan mesin cetak, stamping press, kompresor, dan generator listrik pabrik." },
      { industry: "Food & Beverage", scenario: "Jadwal sanitasi lini pipa (CIP - Clean-in-Place) dan kalibrasi sensor suhu." },
    ],
    expectedOutcomes: [
      { metric: "Penurunan Downtime Tidak Terencana", target: "Hingga 35% dengan pemeliharaan preventif disiplin" },
      { metric: "Ketersediaan Suku Cadang Kritis", target: "≥ 99% pada suku cadang prioritas A" },
    ],
    categorySlug: "quality-maintenance",
  },

  automation: {
    slug: "automation",
    name: "Workflow Automation",
    fullName: "No-Code Workflow Studio & Approval Engine",
    tagline: "Otomasi Alur Bisnis Event-Driven Lintas Departemen",
    category: "WORKSPACE",
    status: "PROTOTYPE",
    heroProblem: "Persetujuan dokumen bisnis tertahan berhari-hari di meja manajer, notifikasi penting terlewat, dan alur kerja lintas departemen macet.",
    heroDescription: "NewSystem Workflow Automation memungkinkan pabrik mendesain alur persetujuan Event → Condition → Approval → Action → Notification tanpa perlu koding khusus.",
    coreProblems: [
      {
        title: "Approval Tertahan Tanpa Eskalasi",
        desc: "Pengadaan bahan baku mendesak terhambat karena manajer sedang cuti atau bertugas di luar pabrik tanpa pendelegasian wewenang.",
      },
      {
        title: "Miskomunikasi Perubahan Pesanan",
        desc: "Pelanggan mengubah kuantitas Sales Order, namun informasi ini tidak tersampaikan ke kepala produksi yang sedang memotong bahan.",
      },
    ],
    capabilities: [
      {
        title: "Visual Trigger & Condition Builder",
        desc: "Memicu alur berdasarkan kejadian: stok di bawah ambang batas, scrap melampaui toleransi, atau PO melebihi Rp 50 juta.",
      },
      {
        title: "Multi-Tier Approval Hierarchy",
        desc: "Persetujuan berjenjang berdasarkan batas nominal keuangan atau tingkat risiko keselamatan kerja.",
      },
      {
        title: "Notifikasi Multikanal (Email, WA, In-App)",
        desc: "Mengirimkan tautan persetujuan 1-klik ke ponsel manajer secara aman dengan autentikasi dua faktor.",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Business Event Trigger", desc: "Terjadi kejadian bisnis: misal, draf PO diterbitkan oleh staf purchasing." },
      { step: "02", title: "Condition Evaluation", desc: "Sistem mengecek: apakah nilai PO > Rp 25 juta? Jika ya, butuh approval Direktur." },
      { step: "03", title: "Approval Dispatch", desc: "Notifikasi dikirim ke aplikasi; audit log mencatat waktu dan pemberi persetujuan." },
      { step: "04", title: "Action Execution", desc: "Setelah disetujui, sistem otomatis mengirimkan PO resmi ke email supplier." },
    ],
    crossModuleIntegrations: [
      { module: "Seluruh Modul Inti", flow: "Dapat memicu aksi di modul manapun (ERP, MES, QMS, HRIS, Accounting)." },
    ],
    copilotHighlight: {
      name: "Workflow Copilot",
      description: "Mendeteksi hambatan alur persetujuan (bottleneck) dalam organisasi.",
      sampleQuery: "Di mana persetujuan dokumen paling lama tertahan dalam 30 hari terakhir?",
      sampleResponse: "Rata-rata persetujuan PR suku cadang tertahan 3,4 hari pada departemen Maintenance karena belum adanya delegasi saat manajer bertugas.",
    },
    useCases: [
      { industry: "Semua Pabrik", scenario: "Otomasi persetujuan diskon komersial, pembelian bahan kimia, dan izin lembur operator." },
    ],
    expectedOutcomes: [
      { metric: "Waktu Siklus Persetujuan Dokumen", target: "Dipersingkat dari 4 hari menjadi kurang dari 4 jam" },
      { metric: "Kepatuhan SOP Internal", target: "100% terekam dalam audit trail digital" },
    ],
    categorySlug: "ai-automation-bi",
  },

  workspace: {
    slug: "workspace",
    name: "Smart Workspace",
    fullName: "Business Document Generator & Digital SOP Archive",
    tagline: "Dokumen Resmi Bisnis Dihasilkan dari Transaksi Nyata",
    category: "WORKSPACE",
    status: "PROTOTYPE",
    heroProblem: "PO, invoice, dan surat jalan dibuat manual di aplikasi terpisah sehingga rawan salah ketik nominal, nomor seri berantakan, dan SOP versi lama beredar.",
    heroDescription: "NewSystem Smart Workspace merender dokumen bisnis resmi langsung dari data transaksi inti, mengelola versi SOP pabrik, dan terhubung dengan penyimpanan cloud.",
    coreProblems: [
      {
        title: "Duplikasi Pembuatan Dokumen",
        desc: "Staf administrasi mengetik ulang rincian barang dari ERP ke template Word untuk membuat Purchase Order atau Invoice.",
      },
      {
        title: "SOP Usang Masih Beredar di Shop Floor",
        desc: "Operator masih mengacu pada instruksi kerja cetak tahun lalu sementara formula teknis telah diperbarui.",
      },
    ],
    capabilities: [
      {
        title: "Transactional Document Rendering",
        desc: "Merender PO, Invoice, Surat Jalan, dan Surat Tugas resmi dari record transaksi database yang tidak dapat diubah.",
      },
      {
        title: "Digital SOP & Version Control",
        desc: "Pusat arsip instruksi kerja digital dengan riwayat revisi yang langsung tampil di layar tablet workstation MES.",
      },
      {
        title: "Konektor Google Drive & OneDrive",
        desc: "Menyimpan salinan arsip dokumen resmi ke cloud penyimpanan perusahaan secara terstruktur dan terindeks.",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Transaction Finalization", desc: "Transaksi di ERP atau Akuntansi dinyatakan selesai dan diaudit." },
      { step: "02", title: "Document Rendering", desc: "Sistem menghasilkan PDF resmi dengan QR code verifikasi dan nomor unik." },
      { step: "03", title: "Distribution & Archive", desc: "Terkirim ke mitra bisnis dan tersimpan di repositori dokumen perusahaan." },
    ],
    crossModuleIntegrations: [
      { module: "ERP & Accounting", flow: "Sumber data resmi untuk rincian item, harga, pajak, dan termin pembayaran." },
      { module: "MES Shop Floor", flow: "Menampilkan lampiran gambar teknik dan SOP resmi di layar kerja operator." },
    ],
    copilotHighlight: {
      name: "Workspace Copilot",
      description: "Pencarian cerdas isi dokumen SOP dan arsip korespondensi bisnis.",
      sampleQuery: "Apa langkah SOP keselamatan kerja saat menyalakan mesin boiler setelah libur akhir pekan?",
      sampleResponse: "Berdasarkan SOP-BLR-Rev3: lakukan pengecekan level air, bersihkan katup burner, dan nyalakan sirkulasi pompa minimal 15 menit sebelum pemanasan.",
    },
    useCases: [
      { industry: "Semua Pabrik", scenario: "Penerbitan surat jalan legalitas pengiriman barang dan sertifikat mutu produk." },
    ],
    expectedOutcomes: [
      { metric: "Kesalahan Ketik Dokumen Bisnis", target: "Turun menjadi 0% (karena dirender langsung dari sistem)" },
      { metric: "Aksesibilitas SOP Terkini", target: "100% operator mengakses revisi terbaru" },
    ],
    categorySlug: "ai-automation-bi",
  },

  connect: {
    slug: "connect",
    name: "Integration Hub",
    fullName: "NewSystem Connect & Open API Platform",
    tagline: "Konektivitas Email, Mesin Timbang, dan Sistem Eksternal",
    category: "WORKSPACE",
    status: "IN_DEVELOPMENT",
    heroProblem: "Pabrik terisolasi dari sistem pihak ketiga seperti email supplier, mesin timbang digital, sensor PLC, dan marketplace e-commerce B2B.",
    heroDescription: "NewSystem Connect menyediakan arsitektur integrasi yang aman melalui REST API, Webhooks, konektor email (Gmail/Outlook), dan jembatan ke perangkat industri.",
    coreProblems: [
      {
        title: "Data Timbangan Truk Diinput Manual",
        desc: "Operator jembatan timbang mengetik ulang berat truk ke komputer, rawan kesalahan angka dan manipulasi.",
      },
      {
        title: "Pesanan Email Tertumpuk di Inbox",
        desc: "Order dari pelanggan setia via email sering terlewat karena tidak otomatis masuk ke antrean CRM.",
      },
    ],
    capabilities: [
      {
        title: "Secure Public REST APIs & Webhooks",
        desc: "Endpoint terotorisasi dengan HMAC signing, rate limiting, dan isolasi tenant ketat.",
      },
      {
        title: "Email-to-Task Connector",
        desc: "Mengonversi email PO dari pelanggan terdaftar menjadi draf Sales Order untuk ditinjau tim sales.",
      },
      {
        title: "Industrial Hardware Bridges",
        desc: "Dukungan penerimaan data timbangan digital, scanner barcode nirkabel, dan sensor edge.",
      },
    ],
    workflowSteps: [
      { step: "01", title: "External Signal Capture", desc: "Data masuk via API webhook, email, atau pembacaan sensor timbangan." },
      { step: "02", title: "Security & Schema Validation", desc: "Pemeriksaan autentikasi token dan validasi format payload." },
      { step: "03", title: "Domain Ingestion", desc: "Data dialirkan ke antrean draf untuk ditinjau oleh operator berwenang." },
    ],
    crossModuleIntegrations: [
      { module: "Seluruh Modul", flow: "Menyediakan gerbang komunikasi data masuk dan keluar yang diaudit secara aman." },
    ],
    copilotHighlight: {
      name: "Connect Copilot",
      description: "Mendeteksi anomali pada log integrasi API dan pesan masuk yang gagal diproses.",
      sampleQuery: "Apakah ada webhook yang gagal dikirim ke sistem logistik hari ini?",
      sampleResponse: "Tercatat 2 kegagalan akibat timeout pada server ekspedisi partner; sistem otomatis menjadwalkan retry berjarak 5 menit.",
    },
    useCases: [
      { industry: "Pabrik dengan Jembatan Timbang", scenario: "Penerimaan bobot truk tebu/sawit/biji plastik langsung dari mesin timbang." },
    ],
    expectedOutcomes: [
      { metric: "Integritas Data Integrasi", target: "Zero data leakage dan audit log menyeluruh" },
    ],
    categorySlug: "ai-automation-bi",
  },

  intelligence: {
    slug: "intelligence",
    name: "Business Intelligence",
    fullName: "Unified BI Analytics & Performance Metrics",
    tagline: "Satu Sumber Kebenaran Data untuk Keputusan Strategis",
    category: "AI_INTELLIGENCE",
    status: "PROTOTYPE",
    heroProblem: "Direksi harus menunggu laporan bulanan yang disusun terpisah, tanpa kemampuan melakukan drill-down ke transaksi sumber yang mendasarinya.",
    heroDescription: "NewSystem Business Intelligence menyatukan metrik operasional dan keuangan dalam dashboard real-time: OEE mesin, margin laba per pesanan, dan arus kas pabrik.",
    coreProblems: [
      {
        title: "Laporan yang Bertentangan Antar Departemen",
        desc: "Data penjualan tim Sales berbeda dengan data pengiriman Gudang dan data penerimaan uang Finance.",
      },
      {
        title: "Ketidakmampuan Melacak Akar Masalah (Drill-Down)",
        desc: "Grafik menunjukkan biaya membengkak, namun manajemen tidak dapat mengeklik grafik untuk melihat invoice atau job card mana yang bertanggung jawab.",
      },
    ],
    capabilities: [
      {
        title: "Single Source of Truth Metrics",
        desc: "Metrik bisnis dihitung langsung dari transactional database yang sama tanpa duplikasi data terpisah.",
      },
      {
        title: "Interactive Transactional Drill-Down",
        desc: "Dari grafik laba kotor di level perusahaan, dapat diklik hingga level pesanan, work center, dan lot material.",
      },
      {
        title: "Overall Equipment Effectiveness (OEE)",
        desc: "Pengukuran ketersediaan mesin (Availability), performa kecepatan (Performance), dan rasio kualitas (Quality).",
      },
    ],
    workflowSteps: [
      { step: "01", title: "Transactional Emission", desc: "Seluruh aktivitas bisnis di ERP, MES, dan Akuntansi memicu pencatatan data." },
      { step: "02", title: "Aggregation & Semantic Read Models", desc: "Model pembacaan analitik diperbarui secara berkala dan efisien." },
      { step: "03", title: "Executive Decision Making", desc: "Manajemen memantau KPI dan melakukan intervensi sebelum masalah membesar." },
    ],
    crossModuleIntegrations: [
      { module: "Seluruh Modul", flow: "Membaca data terotorisasi dari semua domain untuk visualisasi analitik eksekutif." },
    ],
    copilotHighlight: {
      name: "BI Copilot",
      description: "Memberikan penjelasan naratif atas tren grafik keuangan dan efisiensi pabrik.",
      sampleQuery: "Jelaskan tren OEE lini perakitan selama 3 bulan terakhir dan rekomendasi peningkatannya.",
      sampleResponse: "OEE rata-rata 71% (standar industri 85%). Kehilangan terbesar berada pada faktor Availability akibat waktu tunggu setup pisau potong.",
    },
    useCases: [
      { industry: "Multi-Plant Holdings", scenario: "Konsolidasi performa output dan profitabilitas 3 pabrik dalam satu dashboard." },
    ],
    expectedOutcomes: [
      { metric: "Waktu Pengambilan Keputusan Eksekutif", target: "Dari mingguan menjadi seketika (real-time)" },
    ],
    categorySlug: "ai-automation-bi",
  },
};
