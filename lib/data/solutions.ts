export interface IndustrySolution {
  slug: string;
  name: string;
  tagline: string;
  heroHeadline: string;
  heroDescription: string;
  operationalFocus: Array<{ title: string; desc: string }>;
  keyWorkflows: Array<{ name: string; description: string }>;
  processDiagramSteps: Array<{ step: string; title: string; desc: string }>;
  metricsTargeted: Array<{ name: string; value: string }>;
  pilotBadge?: string;
}

export const SOLUTIONS_MAP: Record<string, IndustrySolution> = {
  "general-manufacturing": {
    slug: "general-manufacturing",
    name: "General Manufacturing",
    tagline: "Sistem Terpadu Pabrik Manufaktur Umum",
    heroHeadline: "Konfigurasi Alur Kerja Fleksibel & Perhitungan HPP Aktual Riil",
    heroDescription: "Dirancang untuk pabrik manufaktur skala kecil hingga multi-plant dengan workstation modular, perakitan bertingkat, dan pengadaan bahan baku yang presisi.",
    pilotBadge: "Fokus Pilot Utama",
    operationalFocus: [
      {
        title: "Work Centers & Routing Fleksibel",
        desc: "Mendefinisikan kapasitas stasiun kerja mesin, urutan rute operasi, dan tarif per jam mesin.",
      },
      {
        title: "Perencanaan PPIC & Material Tracking",
        desc: "MRP otomatis yang menghitung kebutuhan bahan bersih dan mengunci reservasi stok gudang.",
      },
      {
        title: "Costing & Double-Entry Real-Time",
        desc: "Menghitung HPP aktual per nomor pesanan tanpa menunggu rekonsiliasi manual akhir bulan.",
      },
      {
        title: "Business Intelligence Terpadu",
        desc: "Dashboard eksekutif yang menghubungkan order komersial dengan efisiensi lini produksi.",
      },
    ],
    keyWorkflows: [
      { name: "Alur Pesanan ke Job Order", description: "Sales Order terkonfirmasi otomatis menghasilkan draf Production Order dan Job Cards." },
      { name: "Manajemen Scrap & Waste", description: "Pencatatan persentase susut material langsung dari tablet operator shop floor." },
      { name: "Pelacakan Jam Operator", description: "Absensi dan clock-in operator di workstation dialokasikan langsung ke biaya order." },
    ],
    processDiagramSteps: [
      { step: "01", title: "Sales Confirmation", desc: "Verifikasi kuantitas pesanan dan komitmen tanggal kirim di CRM." },
      { step: "02", title: "PPIC MRP Run", desc: "Pengecekan ketersediaan bahan baku dan draf pengadaan ke supplier." },
      { step: "03", title: "Workstation Dispatching", desc: "Penerbitan job card ke mesin pemotongan, perakitan, dan packing." },
      { step: "04", title: "QC Release & Transfer", desc: "Inspeksi barang jadi dan penerbitan bukti transfer gudang FG." },
    ],
    metricsTargeted: [
      { name: "Akurasi Stok Bahan Baku", value: "≥ 98%" },
      { name: "Kecepatan Tutup Buku Biaya", value: "2 Hari Kerja" },
    ],
  },

  "food-beverage": {
    slug: "food-beverage",
    name: "Food & Beverage (F&B)",
    tagline: "Produksi Batch, Resep & Kontrol Expired Lot",
    heroHeadline: "Ketertelusuran Formula, Tanggal Kedaluwarsa & Standar Higienis",
    heroDescription: "Solusi terpadu pabrik makanan dan minuman untuk mengelola resep formula, yield susut bahan, kepatuhan nomor batch BPOM/Halal, dan kalkulasi HPP batch.",
    pilotBadge: "Mitra Validasi Pilot",
    operationalFocus: [
      {
        title: "Manajemen Batch & Resep Formula",
        desc: "Penskalaan otomatis formula adonan/campuran berdasarkan kapasitas tangki atau oven.",
      },
      {
        title: "Kontrol Tanggal Kedaluwarsa (FEFO)",
        desc: "Metode First-Expired, First-Out untuk memastikan bahan baku dengan tanggal terdekat dipakai lebih dahulu.",
      },
      {
        title: "Pelacakan Yield & Susut Masak",
        desc: "Membandingkan berat adonan mentah dengan berat produk matang untuk mendeteksi deviasi yield.",
      },
      {
        title: "Inspeksi Kualitas Organoleptik & QC",
        desc: "Pencatatan suhu penyimpanan, kadar air, pH, dan uji rasa pada setiap nomor batch.",
      },
    ],
    keyWorkflows: [
      { name: "Batch Dispensing & Weighing", description: "Penimbangan bahan baku sesuai rasio formula sebelum masuk mixer." },
      { name: "Clean-in-Place (CIP) Log", description: "Jadwal sanitasi tangki pipa dan pencatatan kepatuhan higienis." },
      { name: "Traceability Recall Simulasi", description: "Pelacakan mundur nomor lot bahan baku ke seluruh kardus barang jadi dalam hitungan menit." },
    ],
    processDiagramSteps: [
      { step: "01", title: "Batch Order Release", desc: "Penentuan jumlah batch sesuai kapasitas tangki mixing." },
      { step: "02", title: "Ingredient Staging (FEFO)", desc: "Pengeluaran bahan baku dari gudang pendingin berdasar tanggal expired." },
      { step: "03", title: "Processing & QC Check", desc: "Pencatatan parameter suhu, viskositas, dan uji lab in-process." },
      { step: "04", title: "Packaging & Expiry Print", desc: "Pengemasan dengan nomor batch dan tanggal kedaluwarsa resmi." },
    ],
    metricsTargeted: [
      { name: "Waktu Audit Traceability Lot", value: "< 60 Detik" },
      { name: "Pengurangan Waste Bahan Expired", value: "Hingga 45%" },
    ],
  },

  garment: {
    slug: "garment",
    name: "Garment & Tekstil",
    tagline: "Matriks Varian, Marker Cutting & Efisiensi Sewing",
    heroHeadline: "Pengendalian Bundle, Lintasan Jahit & Produktivitas Tenaga Kerja",
    heroDescription: "Dirancang khusus untuk industri konveksi dan garment: matriks ukuran/warna, marker pemotongan kain, line balancing sewing, dan pelacakan cacat jahitan.",
    pilotBadge: "Mitra Validasi Pilot",
    operationalFocus: [
      {
        title: "Matriks Ukuran (Size) & Warna (Color)",
        desc: "Manajemen satu kode model (Style) dengan puluhan kombinasi warna dan size (S, M, L, XL, XXL).",
      },
      {
        title: "Efisiensi Pola Potong (Cutting Marker)",
        desc: "Pencatatan panjang gelar kain (spreading), rasio sisa perca, dan pemisahan bundle potong.",
      },
      {
        title: "Lintasan Sewing & Line Balancing",
        desc: "Pemantauan output per stasiun jahit untuk mencegah penumpukan bundle setengah jadi.",
      },
      {
        title: "Pelacakan Cacat Jahitan (Defect Log)",
        desc: "Klasifikasi reject jahit: loncat setik, noda oli, atau sambungan miring untuk evaluasi operator.",
      },
    ],
    keyWorkflows: [
      { name: "Bundle Ticket Tracking", description: "Pemberian barcode pada setiap ikat bundle potongan kain untuk dipindai operator jahit." },
      { name: "Piece-Rate & Jam Kerja", description: "Perhitungan upah borongan atau jam kerja langsung berdasarkan target efisiensi lini." },
      { name: "Finishing & Ironing QC", description: "Inspeksi akhir sebelum pemasangan hangtag, label merk, dan packing plastik." },
    ],
    processDiagramSteps: [
      { step: "01", title: "Style & Matrix PO", desc: "Input pesanan buyer berdasarkan rincian breakdown size dan warna." },
      { step: "02", title: "Spreading & Cutting", desc: "Pencatatan konsumsi gulungan kain dan penomoran bundle." },
      { step: "03", title: "Sewing Line Operations", desc: "Pencatatan progres jahit per bundle di tiap stasiun kerja." },
      { step: "04", title: "Finishing & Carton Pack", desc: "Pemeriksaan jarum patah, setrika uap, dan pengemasan karton ekspor." },
    ],
    metricsTargeted: [
      { name: "Efisiensi Lintasan Sewing", value: "Peningkatan 15-20%" },
      { name: "Akurasi Bundle Fisik", value: "100% terlacak" },
    ],
  },

  "furniture-assembly": {
    slug: "furniture-assembly",
    name: "Furnitur & Assembly",
    tagline: "Multi-Level BOM, Job Order Custom & Biaya Rework",
    heroHeadline: "Struktur Komponen Bertingkat & Biaya Akurat per Pesanan Khusus",
    heroDescription: "Menjawab kerumitan manufaktur mebel dan perakitan kayu/logam: pesanan custom Make-to-Order, sub-assembly komponen kayu, finishing cat, dan kalkulasi biaya pengerjaan ulang.",
    pilotBadge: "Mitra Validasi Pilot",
    operationalFocus: [
      {
        title: "Struktur Multi-Level BOM",
        desc: "Daftar komponen kayu solid, papan olahan, busa, kain jok, cat pelapis, hingga sekrup engsel.",
      },
      {
        title: "Job Order Custom (MTO)",
        desc: "Penyesuaian dimensi dan finishing berdasarkan pesanan khusus proyek hotel atau ritel.",
      },
      {
        title: "Pencatatan Rework & Pengamplasan Ulang",
        desc: "Biaya bahan cat dan jam kerja tambahan akibat pengerjaan ulang tercatat ke nomor job order.",
      },
      {
        title: "Kalkulasi Biaya per Job Order",
        desc: "Mengetahui secara transparan apakah pesanan custom mebel menghasilkan laba atau merugi.",
      },
    ],
    keyWorkflows: [
      { name: "Penerimaan Kayu & Oven (Kiln Dry)", description: "Pencatatan kadar air kayu sebelum masuk mesin pemotongan." },
      { name: "Sub-Assembly Perakitan Rangka", description: "Perakitan kerangka dasar sebelum masuk ruang finishing semprot cat." },
      { name: "Upholstery & Finishing Hardware", description: "Pemasangan busa, jok kulit, dan aksesoris logam pada unit akhir." },
    ],
    processDiagramSteps: [
      { step: "01", title: "Custom Spec & Draf BOM", desc: "Perancangan spesifikasi teknis dan estimasi kebutuhan kayu/logam." },
      { step: "02", title: "Komponen Machining", desc: "Pemotongan, penyerutan, pembentukan profil, dan pengamplasan." },
      { step: "03", title: "Finishing & Coating", desc: "Pengecatan spray booth, pengeringan, dan inspeksi permukaan." },
      { step: "04", title: "Final Assembly & Fitting", desc: "Pemasangan hardware, pengepakan knock-down dengan panduan rakit." },
    ],
    metricsTargeted: [
      { name: "Akurasi Biaya Pesanan Custom", value: "100% per Job Order" },
      { name: "Pengurangan Waktu Rework", value: "Turun hingga 30%" },
    ],
  },

  batch: {
    slug: "batch",
    name: "Batch Manufacturing",
    tagline: "Formula, Konsumsi Kimia & Standar Mutu",
    heroHeadline: "Pengendalian Proses Kimia, Kosmetik & Manufaktur Berbasis Formula",
    heroDescription: "Dirancang untuk industri kimia, cat, pelapis, dan kosmetik yang mengandalkan resep pencampuran formula, waktu mixing, dan pengujian kualitas berkala.",
    operationalFocus: [
      {
        title: "Standarisasi Resep & Batas Toleransi",
        desc: "Penguncian rasio bahan aktif dan pelarut dengan batas toleransi berat yang ketat.",
      },
      {
        title: "Pelacakan Batch & Tangki Reaktor",
        desc: "Monitoring status pengisian tangki, suhu reaksi, dan kecepatan pengadukan.",
      },
    ],
    keyWorkflows: [
      { name: "Raw Chemical Dispensing", description: "Penimbangan bahan kimia dengan barcode scan untuk mencegah salah tuang." },
      { name: "In-Process QC Testing", description: "Pengambilan sampel berkala untuk uji viskositas dan densitas." },
    ],
    processDiagramSteps: [
      { step: "01", title: "Formula Scaling", desc: "Penyesuaian rasio formula sesuai kapasitas reaktor." },
      { step: "02", title: "Dispensing & Feeding", desc: "Pemasukan bahan baku bertahap sesuai urutan resep." },
      { step: "03", title: "Reaction & QC Lab", desc: "Pengujian parameter laboratorium kimia sebelum pengemasan." },
      { step: "04", title: "Filling & Drumming", desc: "Pengisian ke drum atau jeriken dengan label bahaya/spesifikasi." },
    ],
    metricsTargeted: [
      { name: "Konsistensi Kualitas Batch", value: "≥ 99,5%" },
    ],
  },

  discrete: {
    slug: "discrete",
    name: "Discrete Manufacturing",
    tagline: "Nomor Serial Komponen & Perakitan Presisi",
    heroHeadline: "Perakitan Elektronik, Komponen Logam & Otomotif",
    heroDescription: "Solusi untuk pabrik suku cadang logam, elektronik, dan perakitan mekanik dengan nomor seri komponen unik dan toleransi dimensi presisi tinggi.",
    operationalFocus: [
      {
        title: "Penomoran Serial Komponen",
        desc: "Pelacakan riwayat perakitan setiap unit berdasarkan nomor seri individual.",
      },
      {
        title: "Instruksi Kerja Digital per Workstation",
        desc: "Diagram perakitan dan torsi baut yang tampil di layar stasiun kerja.",
      },
    ],
    keyWorkflows: [
      { name: "Serial Scan Handover", description: "Pemindaian nomor seri di setiap pergantian workstation perakitan." },
      { name: "Calibration Log", description: "Kalibrasi berkala alat ukur presisi dan obeng torsi." },
    ],
    processDiagramSteps: [
      { step: "01", title: "Kit Staging", desc: "Penyiapan komponen perakitan lengkap (kitting) untuk stasiun kerja." },
      { step: "02", title: "Precision Assembly", desc: "Perakitan sesuai urutan dengan pencatatan nomor seri komponen." },
      { step: "03", title: "Functional Testing", desc: "Uji fungsi elektrikal dan mekanikal dengan pass/fail gate." },
      { step: "04", title: "Packing & Serial Registry", desc: "Pendaftaran sertifikat garansi dan pengepakan." },
    ],
    metricsTargeted: [
      { name: "Zero Defect Passing Rate", value: "≥ 99,8%" },
    ],
  },

  hybrid: {
    slug: "hybrid",
    name: "Hybrid Manufacturing",
    tagline: "Kombinasi Proses Kontinu & Perakitan Akhir",
    heroHeadline: "Sinergi Sempurna Proses Kontinu dan Make-to-Order",
    heroDescription: "Mengakomodasi pabrik yang memproduksi bahan dasar secara kontinu atau batch (misal: lembaran logam, rol plastik), lalu memotong dan merakitnya berdasarkan pesanan pelanggan khusus.",
    operationalFocus: [
      {
        title: "Pemisahan Tahap Kontinu vs MTO",
        desc: "Tahap 1 beroperasi dengan target volume, tahap 2 beroperasi dengan pesanan custom.",
      },
      {
        title: "Optimalisasi Stok Antara (Buffer Stock)",
        desc: "Pengendalian jumlah persediaan barang setengah jadi di antara kedua proses.",
      },
    ],
    keyWorkflows: [
      { name: "Master Reel/Coil Splitting", description: "Pemotongan gulungan induk menjadi strip sesuai spesifikasi order buyer." },
      { name: "Final Finishing on Demand", description: "Finishing akhir dilakukan saat pesanan konfirmasi diterima." },
    ],
    processDiagramSteps: [
      { step: "01", title: "Bulk Continuous Run", desc: "Produksi skala besar bahan setengah jadi baku." },
      { step: "02", title: "Intermediate Storage", desc: "Penyimpanan di gudang WIP dengan nomor batch induk." },
      { step: "03", title: "Custom Order Processing", desc: "Pemotongan dan kustomisasi sesuai Sales Order masuk." },
      { step: "04", title: "Final Dispatch", desc: "Pengiriman produk jadi ke konsumen." },
    ],
    metricsTargeted: [
      { name: "Pemanfaatan Kapasitas Mesin Induk", value: "≥ 85%" },
    ],
  },
};
