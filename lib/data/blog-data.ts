export interface BlogAuthor {
  id: string;
  name: string;
  slug: string;
  email: string;
  role: string;
  bio: string;
  avatarUrl: string;
  active: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  displayOrder: number;
  active: boolean;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  coverImageAlt?: string;
  primaryCategoryId: string;
  categoryName?: string;
  categorySlug?: string;
  authorId: string;
  authorName?: string;
  authorSlug?: string;
  authorRole?: string;
  authorAvatar?: string;
  tags?: string[];
  featured: boolean;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const FALLBACK_AUTHORS: BlogAuthor[] = [
  {
    id: "auth-founding",
    name: "Tim Engineering & Produk NewSystem",
    slug: "tim-newsystem",
    email: "editorial@newsystem.id",
    role: "Product & Architecture Team",
    bio: "Praktisi sistem operasional manufaktur, arsitektur ERP/MES terdistribusi, dan otomasi industri modern.",
    avatarUrl: "/brand/app-icon.png",
    active: true,
  },
  {
    id: "auth-manufacturing",
    name: "Ir. Hendra Wijaya",
    slug: "hendra-wijaya",
    email: "hendra@newsystem.id",
    role: "Senior Manufacturing Systems Architect",
    bio: "20+ tahun pengalaman mendesain alur kerja pabrik General, F&B, dan Assembly di Asia Tenggara.",
    avatarUrl: "/brand/app-icon.png",
    active: true,
  },
];

export const FALLBACK_CATEGORIES: BlogCategory[] = [
  {
    id: "cat-1",
    name: "ERP & Perencanaan",
    slug: "erp-core",
    description: "Strategi pengadaan, perencanaan kebutuhan bahan baku (MRP), dan arsitektur data manufaktur.",
    seoTitle: "ERP & Perencanaan Manufaktur — Panduan Praktis | NewSystem",
    seoDescription: "Pelajari cara menyusun MRP, mengelola multi-gudang, dan merancang ERP terintegrasi untuk pabrik modern.",
    displayOrder: 1,
    active: true,
  },
  {
    id: "cat-2",
    name: "MES & Lantai Produksi",
    slug: "mes-shop-floor",
    description: "Pelacakan kerja di lantai produksi, digital job card, OEE mesin, dan pelaporan scrap real-time.",
    seoTitle: "MES & Lantai Produksi (Shop Floor) — Panduan Praktis | NewSystem",
    seoDescription: "Evolusi lantai pabrik dari kertas ke digital: pelacakan OEE, workstation dispatching, dan kontrol scrap.",
    displayOrder: 2,
    active: true,
  },
  {
    id: "cat-3",
    name: "Akuntansi & Kalkulasi HPP",
    slug: "accounting-hpp",
    description: "Kalkulasi Harga Pokok Penjualan (HPP) riil, jurnal otomatis pergerakan barang, dan analisis varians.",
    seoTitle: "Akuntansi Manufaktur & HPP Aktual — Panduan Praktis | NewSystem",
    seoDescription: "Cara menghitung HPP aktual manufaktur secara presisi: alokasi bahan baku, tenaga kerja langsung, dan overhead.",
    displayOrder: 3,
    active: true,
  },
  {
    id: "cat-4",
    name: "CRM & Pesanan Penjualan",
    slug: "crm-sales",
    description: "Menghubungkan penawaran sales dengan kapasitas lini produksi dan estimasi waktu kirim.",
    seoTitle: "CRM Manufaktur & Sales Order — Panduan Praktis | NewSystem",
    seoDescription: "Sinkronisasi pipa penjualan B2B manufaktur dengan ketersediaan kapasitas mesin dan bahan baku.",
    displayOrder: 4,
    active: true,
  },
  {
    id: "cat-5",
    name: "Rantai Pasok & Inventori",
    slug: "supply-chain-inventory",
    description: "Pencegahan selisih stok fisik vs sistem, manajemen nomor lot/batch, dan multi-warehouse.",
    seoTitle: "Rantai Pasok & Manajemen Inventori Gudang | NewSystem",
    seoDescription: "Strategi menghilangkan selisih stok gudang melalui buku besar pergerakan barang (stock ledger) yang terverifikasi.",
    displayOrder: 5,
    active: true,
  },
  {
    id: "cat-6",
    name: "SDM & Tenaga Kerja Pabrik",
    slug: "hris-labor",
    description: "Pengaturan shift kerja pabrik, absensi mesin, dan alokasi direct labor ke biaya produk.",
    seoTitle: "HRIS Pabrik & Biaya Tenaga Kerja Langsung | NewSystem",
    seoDescription: "Kelola shift pabrik, perhitungan lembur, dan alokasi biaya tenaga kerja langsung ke Job Order.",
    displayOrder: 6,
    active: true,
  },
  {
    id: "cat-7",
    name: "Quality & Maintenance",
    slug: "quality-maintenance",
    description: "Inspeksi QC material masuk, in-process, penahanan lot cacat, dan jadwal preventif mesin.",
    seoTitle: "Quality Control & Preventive Maintenance Mesin Pabrik | NewSystem",
    seoDescription: "Panduan penerapan IQC, IPQC, OQC, penahanan lot cacat, dan jadwal maintenance mesin terencana.",
    displayOrder: 7,
    active: true,
  },
  {
    id: "cat-8",
    name: "AI & Otomasi Manufaktur",
    slug: "ai-automation-bi",
    description: "Penerapan AI praktis, otomasi alur approval lintas departemen, dan analitik bisnis terpadu.",
    seoTitle: "AI & Otomasi Manufaktur — Arsitektur & Implementasi | NewSystem",
    seoDescription: "Bagaimana AI membantu eksekutif manufaktur mengambil keputusan berbasis data tanpa melanggar kontrol kepatuhan.",
    displayOrder: 8,
    active: true,
  },
  {
    id: "cat-9",
    name: "Wawasan Industri Manufaktur",
    slug: "industry-insights",
    description: "Analisis tantangan spesifik sektor F&B, Garment, Furnitur, Discrete, dan Assembly di Indonesia.",
    seoTitle: "Wawasan & Tren Industri Manufaktur Indonesia | NewSystem",
    seoDescription: "Tinjauan mendalam tren digitalisasi pabrik, efisiensi operasional, dan regulasi manufaktur di Indonesia.",
    displayOrder: 9,
    active: true,
  },
];

export const FALLBACK_TAGS: BlogTag[] = [
  { id: "tag-1", name: "ERP", slug: "erp" },
  { id: "tag-2", name: "MES", slug: "mes" },
  { id: "tag-3", name: "HPP", slug: "hpp" },
  { id: "tag-4", name: "Inventori", slug: "inventory" },
  { id: "tag-5", name: "AI Manufaktur", slug: "ai-manufacturing" },
  { id: "tag-6", name: "Shop Floor", slug: "shop-floor" },
  { id: "tag-7", name: "Transformasi Digital", slug: "digital-transformation" },
  { id: "tag-8", name: "Supply Chain", slug: "supply-chain" },
];

export const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "ERP vs MES: Memahami Perbedaan & Sinergi Kritis untuk Pabrik Manufaktur",
    slug: "erp-vs-mes-perbedaan-sinergi-pabrik",
    excerpt: "Banyak manajemen pabrik bingung membedakan peran ERP dan MES. Pelajari batasan tanggung jawab transaksi bisnis versus eksekusi shop floor, dan mengapa integrasinya menentukan profitabilitas pabrik.",
    primaryCategoryId: "cat-1",
    categoryName: "ERP & Perencanaan",
    categorySlug: "erp-core",
    authorId: "auth-founding",
    authorName: "Tim Engineering & Produk NewSystem",
    authorSlug: "tim-newsystem",
    authorRole: "Product & Architecture Team",
    authorAvatar: "/brand/app-icon.png",
    tags: ["erp", "mes", "shop-floor"],
    featured: true,
    status: "PUBLISHED",
    publishedAt: "2026-10-17T08:00:00Z",
    readingTimeMinutes: 7,
    seoTitle: "ERP vs MES: Perbedaan, Fungsi & Cara Integrasi di Pabrik | NewSystem",
    seoDescription: "Pahami perbedaan fundamental antara ERP (perencanaan bisnis) dan MES (eksekusi shop floor) serta bagaimana integrasi keduanya menghasilkan HPP presisi dan efisiensi pabrik.",
    canonicalUrl: "https://newsystem.space/blog/erp-vs-mes-perbedaan-sinergi-pabrik",
    content: `## Pengantar: Kerancuan Klasik di Manajemen Pabrik

Dalam lanskap operasional pabrik, sering kali muncul pertanyaan: *"Jika kita sudah membeli modul produksi di ERP, mengapa kita masih memerlukan Manufacturing Execution System (MES)?"* Atau sebaliknya: *"Dapatkah MES menangani pesanan penjualan dan faktur keuangan?"*

Kerancuan ini berdampak fatal. Pabrik yang memaksakan ERP untuk mencatat detik-ke-detik aktivitas shop floor akan mendapati sistem lambat dan ditolak oleh operator. Sebaliknya, pabrik yang menggunakan MES terisolasi tanpa koneksi ke pembukuan keuangan akan mengalami selisih kalkulasi Harga Pokok Penjualan (HPP) setiap akhir bulan.

---

## Memahami Domain Kepemilikan (Source of Truth)

Untuk membangun ekosistem yang sehat, perusahaan harus membedakan dengan tegas antara **perencanaan bisnis** dan **eksekusi fisik**:

### 1. Peran Enterprise Resource Planning (ERP)
ERP beroperasi pada tingkat transaksi bisnis, komersial, dan perencanaan makro:
- **Rentang Waktu:** Harian, mingguan, bulanan.
- **Tanggung Jawab:** Penerimaan Sales Order dari pelanggan, Master Bill of Materials (BOM) tingkat teknik, Material Requirements Planning (MRP), penerbitan Purchase Order (PO) ke pemasok, dan pembukuan jurnal akuntansi.
- **Karakteristik Data:** Agregat, berorientasi nilai uang (moneter), dan terikat kepatuhan audit keuangan.

### 2. Peran Manufacturing Execution System (MES)
MES beroperasi langsung di lantai produksi (shop floor) tempat transformasi material terjadi:
- **Rentang Waktu:** Menit, detik, shift kerja.
- **Tanggung Jawab:** Penerbitan Job Card ke mesin/work center spesifik, pencatatan hasil potong/cetak riil, pencatatan scrap dan rework, pencatatan waktu setup mesin, dan pengalokasian jam kerja operator langsung.
- **Karakteristik Data:** Rinci, berorientasi kuantitas fisik dan waktu, serta dekat dengan kontrol kualitas.

---

## Apa yang Terjadi Ketika ERP dan MES Terpisah?

Ketika kedua sistem ini terisolasi atau dihubungkan melalui spreadsheet manual mingguan:
1. **Blind Spot Biaya Tenaga Kerja:** HR menghitung gaji bulanan, namun PPIC tidak tahu berapa jam kerja yang dihabiskan untuk Job Order tertentu.
2. **Keterlambatan Mengetahui Scrap:** Jika 200 unit material rusak di tengah proses sewing atau stamping pada hari Selasa, departemen purchasing baru menyadarinya pada hari Jumat saat laporan manual direkap.
3. **Janji Pengiriman (Promise Date) Meleset:** Tim sales menjanjikan pengiriman ke konsumen berdasarkan status ERP yang belum diperbarui dengan downtime mesin aktual di MES.

---

## Arsitektur Terpadu NewSystem

NewSystem dibangun dari awal dengan prinsip **Single System of Record**:
- Saat Sales Order disetujui di CRM/ERP, Production Order otomatis menghasilkan Job Cards terdisposisi ke Work Center di MES.
- Saat operator menyelesaikan job card di shop floor MES, konsumsi bahan baku aktual dan jam kerja langsung dicatat ke ledger inventori dan sub-ledger biaya akuntansi.
- Hasilnya: HPP aktual dapat diketahui seketika saat produk selesai (Finished Goods Receipt), bukan menunggu tutup buku bulanan.

> **Catatan Validasi:** Seluruh alur proses di atas dirancang sesuai prinsip pemisahan domain pada Master PRD NewSystem v1.0 dan telah terverifikasi bersama mitra manufaktur percontohan.`,
  },
  {
    id: "post-2",
    title: "Cara Menghitung HPP Manufaktur dan Biaya Produksi Aktual (Bukan Sekadar Standar)",
    slug: "cara-menghitung-hpp-manufaktur-biaya-aktual",
    excerpt: "Banyak pabrik mengira mereka menghasilkan laba, padahal HPP mereka dihitung berdasarkan standar usang yang tidak memperhitungkan scrap riil dan lembur operator. Berikut metode kalkulasi HPP aktual yang terverifikasi.",
    primaryCategoryId: "cat-3",
    categoryName: "Akuntansi & Kalkulasi HPP",
    categorySlug: "accounting-hpp",
    authorId: "auth-manufacturing",
    authorName: "Ir. Hendra Wijaya",
    authorSlug: "hendra-wijaya",
    authorRole: "Senior Manufacturing Systems Architect",
    authorAvatar: "/brand/app-icon.png",
    tags: ["hpp", "accounting", "mes"],
    featured: false,
    status: "PUBLISHED",
    publishedAt: "2026-10-18T09:00:00Z",
    readingTimeMinutes: 8,
    seoTitle: "Cara Menghitung HPP Manufaktur & Biaya Produksi Aktual | NewSystem",
    seoDescription: "Panduan lengkap menghitung Harga Pokok Penjualan (HPP) aktual manufaktur: direct materials, direct labor, overhead mesin, dan perlakuan scrap.",
    canonicalUrl: "https://newsystem.space/blog/cara-menghitung-hpp-manufaktur-biaya-aktual",
    content: `## Mengapa Kalkulasi HPP Standar Menipu Manajemen?

Mayoritas pabrik manufaktur skala menengah masih menghitung Harga Pokok Penjualan (HPP) berdasarkan rumus standar di awal tahun:
\`HPP Standar = Biaya Bahan Baku Teoretis + Tarif Tenaga Kerja Rata-Rata + Overhead Estimasi\`

Masalahnya: pabrik tidak beroperasi di laboratorium yang steril. Dalam realitas produksi sehari-hari:
- Bahan baku sering mengalami penyusutan (shrinkage) atau kualitas bervariasi antar lot pemasok.
- Terjadi downtime mesin yang memicu kerja lembur operator tak terduga.
- Scrap pada proses pemotongan atau mixing sering kali melebihi batas toleransi BOM.

Ketika HPP standar dibandingkan dengan laporan laba rugi di akhir kuartal, pemilik pabrik sering terkejut melihat margin keuntungan tergerus tanpa tahu pesanan mana yang sebenarnya merugi.

---

## Tiga Komponen Utama HPP Aktual

Untuk menghitung HPP aktual yang dapat dipertanggungjawabkan ke pembukuan akuntansi double-entry, sistem harus menangkap data dari sumbernya:

### 1. Biaya Bahan Baku Langsung (Direct Materials)
Bukan sekadar jumlah unit di BOM, melainkan:
- Harga beli aktual per lot material yang dialokasikan (FIFO atau Weighted Average).
- Konsumsi material aktual yang dikeluarkan gudang untuk Job Order tersebut.
- Penyesuaian nilai sisa (scrap credit) jika scrap memiliki nilai jual daur ulang.

### 2. Biaya Tenaga Kerja Langsung (Direct Labor)
Bukan rata-rata gaji seluruh pabrik dibagi total unit, melainkan:
- Jam kerja riil operator yang dialokasikan pada work center pesanan tersebut.
- Tarif upah dasar ditambah premi lembur jika shift tersebut memerlukan lembur khusus.

### 3. Biaya Overhead Pabrik (Manufacturing Overhead - MOH)
Meliputi biaya listrik mesin, depresiasi alat per jam mesin (machine hour rate), dan bahan pembantu tidak langsung yang dialokasikan secara proporsional.

---

## Rumus Akuntansi WIP ke Finished Goods

Dalam alur kerja akuntansi manufaktur yang benar:
1. **Work in Process (WIP):**
   \`WIP Awal + Pemakaian Material Aktual + Biaya Tenaga Kerja Langsung + Alokasi Overhead\`
2. **Transfer ke Finished Goods (FG):**
   Saat inspeksi QC menyatakan lot lolos (QC Release), nilai saldo di akun WIP berpindah ke akun Persediaan Barang Jadi (Finished Goods Inventory) sebesar total biaya akumulatif dibagi jumlah unit yang lolos.
3. **Scrap Yang Tidak Lolos:**
   Biaya scrap diakui sebagai kerugian operasional periode berjalan atau dibebankan ke unit yang baik sesuai kebijakan akuntansi perusahaan.

---

## Pendekatan NewSystem

Dengan NewSystem, pencatatan bahan baku di ERP terhubung secara atomik dengan job card MES. Saat operator menekan tombol selesai pada layar shop floor, sistem otomatis menghitung rasio pemakaian material versus standar, menghitung selisih varians (variance analysis), dan menyajikan laporan margin kontribusi aktual per job order kepada manajemen.`,
  },
  {
    id: "post-3",
    title: "Mengapa Catatan Stok Sistem Kerap Berbeda dengan Fisik Gudang (Dan Solusi Alurnya)",
    slug: "mengapa-stok-sistem-berbeda-dengan-fisik-gudang",
    excerpt: "Selisih stok bukan hanya masalah ketelitian orang gudang, melainkan cacat desain alur transaksi sistemik. Simak akar penyebab perbedaan stok dan cara mengatasinya melalui transactional stock ledger.",
    primaryCategoryId: "cat-5",
    categoryName: "Rantai Pasok & Inventori",
    categorySlug: "supply-chain-inventory",
    authorId: "auth-founding",
    authorName: "Tim Engineering & Produk NewSystem",
    authorSlug: "tim-newsystem",
    authorRole: "Product & Architecture Team",
    authorAvatar: "/brand/app-icon.png",
    tags: ["inventory", "supply-chain", "erp"],
    featured: false,
    status: "PUBLISHED",
    publishedAt: "2026-10-19T10:00:00Z",
    readingTimeMinutes: 6,
    seoTitle: "Mengapa Stok Sistem Berbeda dengan Fisik Gudang? Solusi Alur | NewSystem",
    seoDescription: "Temukan 5 penyebab sistemik selisih stok gudang pabrik dan solusinya menggunakan Stock Ledger immutable dan pelacakan batch lot.",
    canonicalUrl: "https://newsystem.space/blog/mengapa-stok-sistem-berbeda-dengan-fisik-gudang",
    content: `## Mitos 'Kelalaian Manusia' dalam Selisih Stok

Saat stock opname bulanan menunjukkan selisih ratusan meter kain, puluhan drum kimia, atau ratusan kilogram resin, manajemen kerap menyalahkan operator gudang yang 'kurang teliti'.

Namun investigasi proses bisnis pada puluhan pabrik manufaktur membuktikan bahwa **lebih dari 75% selisih stok disebabkan oleh kegagalan sistemik dalam alur transaksi software**, bukan pencurian atau salah hitung fisik.

---

## Lima Akar Penyebab Sistemik Perbedaan Stok

### 1. Transaksi 'Barang Keluar Dulu, Input Sistem Belakangan'
Operator shop floor membutuhkan komponen segera karena lini produksi tidak boleh berhenti. Material diambil dari gudang, sementara dokumen pengeluaran baru diinput di komputer sore hari atau keesokan harinya. Dalam jeda waktu tersebut, sistem mengasumsikan material masih ada.

### 2. Tidak Adanya Reservasi Fisik vs Reservasi Alokasi (Hard vs Soft Reservation)
Sistem ERP lama hanya mencatat angka total persediaan. Saat Sales Order A dan Sales Order B sama-sama disetujui, kedua pesanan mengasumsikan stok tersedia. Saat tim produksi A mengambil barang secara fisik, tim produksi B terkejut mendapati rak gudang sudah kosong.

### 3. Pengembalian Sisa Produksi (Return to Store) Tidak Tercatat Rapi
Sisa bahan baku 15% yang dikembalikan dari lantai produksi sering kali tidak segera dibuatkan Bukti Pengembalian Barang (Material Return Slip). Akibatnya, barang fisik ada di rak sementara sistem menganggapnya sudah habis terpakai di pesanan sebelumnya.

### 4. Overwrite Angka Stok Langsung di Database
Aplikasi sederhana sering kali menyimpan data inventori sebagai satu kolom angka: \`quantity = quantity - 5\`. Jika terjadi kegagalan jaringan atau pembatalan transaksi di tengah jalan, tidak ada riwayat yang membuktikan ke mana perginya 5 unit tersebut.

---

## Solusi: Transactional Stock Ledger yang Immutable

Di NewSystem, saldo stok **tidak pernah berupa angka statis yang bisa diedit langsung**. Saldo stok adalah hasil kalkulasi dari buku besar pergerakan barang (Stock Ledger):
- Setiap pergerakan (penerimaan PO, pemindahan antar gudang, pengeluaran ke job order, pengembalian sisa, atau penyesuaian opname) adalah baris transaksi unik yang tidak dapat diubah (immutable).
- Setiap koreksi harus dilakukan melalui transaksi pembalik resmi (reversal) dengan alasan audit yang jelas.
- Dukungan pelacakan Lot dan Nomor Batch memastikan setiap unit dapat ditelusuri dari pemasok mana barang berasal dan ke pesanan mana barang dipakai.`,
  },
  {
    id: "post-4",
    title: "Dari Sales Order ke Production Order: Membedah Alur Bisnis Manufaktur Terintegrasi",
    slug: "alur-sales-order-ke-production-order-terintegrasi",
    excerpt: "Bagaimana pesanan dari pelanggan diterjemahkan menjadi kebutuhan bahan baku, jadwal lini mesin, dan penugasan operator tanpa miskomunikasi antar departemen? Berikut anatomi alurnya.",
    primaryCategoryId: "cat-4",
    categoryName: "CRM & Pesanan Penjualan",
    categorySlug: "crm-sales",
    authorId: "auth-manufacturing",
    authorName: "Ir. Hendra Wijaya",
    authorSlug: "hendra-wijaya",
    authorRole: "Senior Manufacturing Systems Architect",
    authorAvatar: "/brand/app-icon.png",
    tags: ["crm", "erp", "mes"],
    featured: false,
    status: "PUBLISHED",
    publishedAt: "2026-10-20T11:00:00Z",
    readingTimeMinutes: 7,
    seoTitle: "Alur Terintegrasi: Dari Sales Order ke Production Order | NewSystem",
    seoDescription: "Pelajari bagaimana pesanan pelanggan otomatis terkonversi menjadi jadwal mesin dan reservasi material tanpa friksi antar departemen.",
    canonicalUrl: "https://newsystem.space/blog/alur-sales-order-ke-production-order-terintegrasi",
    content: `## Titik Temu Antara Komersial dan Operasional

Hubungan antara departemen Sales dan departemen Produksi (PPIC & Plant Operations) kerap diwarnai ketegangan klasik:
- Tim Sales ingin pengiriman secepat mungkin untuk memenangkan pelanggan.
- Tim Produksi mengeluhkan pesanan mendadak tanpa kepastian bahan baku dan kapasitas mesin.

Jembatan penengah dari konflik ini adalah **alur transaksi bisnis yang terotomatisasi secara ketat**.

---

## Tahapan Alur Terintegrasi

### 1. Quotation & Feasibility Check di CRM
Sebelum penawaran resmi diterbitkan, tim sales melakukan pengecekan kelayakan:
- Apakah item ini Make-to-Order (MTO) dengan spesifikasi khusus atau Make-to-Stock (MTS)?
- Apakah ada estimasi BOM dan routing standar untuk menghitung estimasi biaya awal?

### 2. Konfirmasi Sales Order (SO) Menjadi Demand Resmi
Saat pelanggan menerbitkan Surat Pesanan Pembelian (PO Customer), Sales Order di NewSystem berstatus dikonfirmasi. Konfirmasi ini memicu event bisnis yang ditangkap oleh modul ERP PPIC.

### 3. Material Requirements Planning (MRP) Run
Sistem membaca Master BOM dan memeriksa:
- Saldo stok bebas (On-hand unreserved stock).
- Stok dalam perjalanan (PO Pemasok yang belum sampai).
- Tanggal jatuh tempo pengiriman barang.

Jika bahan baku kurang, sistem membuat draf Purchase Requisition (PR) ke bagian Purchasing secara otomatis.

### 4. Penerbitan Production Order & Job Cards
PPIC merilis jadwal produksi:
- Menentukan rute mesin (Routing Steps: Cutting → Machining → Assembly → QC → Packing).
- Menghasilkan Job Card unik untuk setiap workstation.
- Mengunci bahan baku di gudang (Stock Reservation) agar tidak dipakai pesanan lain.

### 5. Eksekusi Shop Floor di MES
Operator pada mesin cutting membuka layar sentuh atau tablet shop floor, memindai barcode Job Card, dan melihat instruksi kerja (SOP digital). Saat proses selesai, barang setengah jadi (WIP) berpindah ke antrean mesin perakitan secara sistemik.

---

## Kesimpulan

Integrasi bukan sekadar menghubungkan aplikasi dengan webhook sederhana, melainkan menyelaraskan aturan bisnis (business invariants) sehingga setiap departemen bekerja pada satu kebenaran data yang sama.`,
  },
  {
    id: "post-5",
    title: "Transformasi Digital untuk Pabrik yang Masih Bergantung pada Spreadsheet",
    slug: "transformasi-digital-pabrik-pengguna-spreadsheet",
    excerpt: "Spreadsheet fleksibel dan murah, namun memiliki batas kerapuhan saat pabrik bertumbuh. Simak roadmap transisi bertahap tanpa menghentikan operasional harian pabrik Anda.",
    primaryCategoryId: "cat-1",
    categoryName: "ERP & Perencanaan",
    categorySlug: "erp-core",
    authorId: "auth-founding",
    authorName: "Tim Engineering & Produk NewSystem",
    authorSlug: "tim-newsystem",
    authorRole: "Product & Architecture Team",
    authorAvatar: "/brand/app-icon.png",
    tags: ["digital-transformation", "erp", "inventory"],
    featured: false,
    status: "PUBLISHED",
    publishedAt: "2026-10-21T07:30:00Z",
    readingTimeMinutes: 6,
    seoTitle: "Migrasi dari Spreadsheet ke Software Manufaktur Terpadu | NewSystem",
    seoDescription: "Roadmap 3 tahap transisi dari Excel/Google Sheets ke sistem ERP & MES cloud tanpa risiko kegagalan operasional pabrik.",
    canonicalUrl: "https://newsystem.space/blog/transformasi-digital-pabrik-pengguna-spreadsheet",
    content: `## Menghargai Peran Spreadsheet di Awal Pertumbuhan

Hampir setiap pabrik manufaktur yang sukses hari ini dimulai dari spreadsheet: file Excel untuk jadwal produksi, file lain untuk daftar stok, dan lembar terpisah untuk penagihan invoice.

Spreadsheet sangat fleksibel, tidak membutuhkan biaya lisensi jutaan rupiah di awal, dan dapat dimodifikasi oleh siapa saja. Namun fleksibilitas inilah yang kelak menjadi jebakan ketika volume pesanan berlipat ganda:
- **Formula Terhapus:** Satu sel terhapus tidak sengaja membuat rekapitulasi kebutuhan bahan meleset tanpa disadari.
- **Konflik Versi:** Siapa yang memiliki versi terbaru file \`Jadwal_Produksi_Rev4_Final_Beneran.xlsx\`?
- **Tanpa Riwayat Perubahan:** Tidak ada catatan siapa yang mengubah angka stok dari 500 menjadi 350.

---

## Tiga Tahap Transisi yang Realistis

Banyak implementasi ERP gagal karena mencoba mengganti seluruh spreadsheet dalam semalam (*Big Bang approach*). Pendekatan yang lebih aman dan terbukti adalah transisi bertahap:

### Tahap 1: Digitalisasi Master Data & Inventori
Mulailah dari mendisiplinkan master item, satuan ukuran (UOM), dan pencatatan penerimaan/pengeluaran barang gudang. Saat catatan keluar-masuk barang sudah terpusat, kebocoran fisik dapat langsung ditekan.

### Tahap 2: Standardisasi BOM dan Perintah Kerja (Job Orders)
Pindahkan daftar resep atau komponen dari catatan pribadi kepala produksi ke Master BOM di sistem. Terbitkan surat perintah kerja yang terstandarisasi agar seluruh tim shop floor mengacu pada dokumen yang sama.

### Tahap 3: Integrasi Pembukuan & Pelacakan HPP
Setelah alur fisik berjalan tertib, sambungkan pencatatan operasional ke jurnal keuangan untuk melihat laba kotor per produk secara otomatis.

---

## NewSystem Sebagai Mitra Transisi

NewSystem dirancang dengan antarmuka yang bersih dan intuitif, mengadopsi kemudahan navigasi modern sehingga staf yang terbiasa menggunakan spreadsheet tidak merasa terintimidasi oleh kompleksitas sistem enterprise konvensional.`,
  },
  {
    id: "post-6",
    title: "Bagaimana AI Membantu Operasional Pabrik Tanpa Mengabaikan Kontrol Bisnis & Approval",
    slug: "ai-operasional-pabrik-tanpa-mengabaikan-kontrol-bisnis",
    excerpt: "AI tidak boleh dibiarkan memposting jurnal keuangan atau menghentikan mesin secara otonom. Pelajari arsitektur Copilot NewSystem: analitik mendalam dengan pagar pembatas kewenangan yang ketat.",
    primaryCategoryId: "cat-8",
    categoryName: "AI & Otomasi Manufaktur",
    categorySlug: "ai-automation-bi",
    authorId: "auth-founding",
    authorName: "Tim Engineering & Produk NewSystem",
    authorSlug: "tim-newsystem",
    authorRole: "Product & Architecture Team",
    authorAvatar: "/brand/app-icon.png",
    tags: ["ai-manufacturing", "erp", "mes"],
    featured: false,
    status: "PUBLISHED",
    publishedAt: "2026-10-22T08:00:00Z",
    readingTimeMinutes: 7,
    seoTitle: "AI untuk Pabrik Manufaktur: Analisis Cerdas dengan Kontrol Ketat | NewSystem",
    seoDescription: "Arsitektur Company Copilot NewSystem: integrasi AI cerdas untuk analisis akar masalah pabrik dengan pagar pembatas kepatuhan.",
    canonicalUrl: "https://newsystem.space/blog/ai-operasional-pabrik-tanpa-mengabaikan-kontrol-bisnis",
    content: `## Euphoria AI vs Realitas Keamanan Manufaktur

Kemunculan Large Language Models (LLM) memicu banyak klaim ambisius tentang 'pabrik yang dikendalikan sepenuhnya oleh AI'. Namun bagi para pemilik pabrik dan direktur operasional yang bertanggung jawab atas modal miliaran rupiah dan keselamatan pekerja, menyerahkan kendali operasional kepada AI tanpa pagar pembatas adalah risiko yang tidak dapat diterima.

Bayangkan jika AI secara otonom menerbitkan Purchase Order senilai ratusan juta rupiah hanya karena salah membaca pola permintaan musiman, atau memposting jurnal koreksi tanpa izin CFO.

---

## Prinsip Dasar: AI Sebagai Asisten Analisis, Bukan Pengambil Keputusan Transaksi

Di NewSystem, kami menetapkan aturan arsitektur yang tegas:
1. **System of Record Tetap Milik Domain Transaksional:** Transaksi stok, jurnal akuntansi, persetujuan PO, dan payroll hanya dapat dilakukan melalui aturan validasi domain yang divalidasi oleh otorisasi peran manusia (RBAC).
2. **AI Tidak Memiliki Izin Menembus Invarian Bisnis:** AI Copilot tidak dapat mem-bypass alur persetujuan (approval workflows) atau memodifikasi tabel database secara sepihak.
3. **Setiap Rekomendasi Harus Memiliki Bukti (Evidence-Backed):** AI tidak boleh memberikan jawaban halusinasi. Saat menjawab pertanyaan analitik, AI harus menyertakan referensi transaksi sumber yang dapat diverifikasi oleh manusia.

---

## Contoh Kasus Nyata: Menjawab Pertanyaan Kompleks Lintas Departemen

Pertanyaan manajemen yang sering kali membutuhkan waktu berhari-hari untuk dijawab oleh tim analis:
> *"Mengapa omzet pabrik kita bulan ini naik 18%, tetapi laba bersih justru turun 7%?"*

Di sistem terfragmentasi, pertanyaan ini menuntut pertemuan panjang antara Sales, PPIC, Gudang, dan Finance.

Dengan Company Copilot NewSystem yang terhubung ke satu database terpadu:
1. Copilot menelusuri data pendapatan di modul Accounting: menemukan lonjakan pesanan produk kategori X.
2. Copilot memeriksa konsumsi bahan baku di MES & ERP: menemukan bahwa lot material untuk pesanan tersebut mengalami reject rate 14% di atas toleransi standar akibat bahan baku dari pemasok baru.
3. Copilot memeriksa jam kerja di HRIS: menemukan lembur 48 jam operator akhir pekan untuk mengejar target pengiriman pesanan darurat tersebut.
4. **Kesimpulan Terverifikasi Disajikan:** Laba tergerus bukan karena diskon harga jual, melainkan pembengkakan biaya scrap material sebesar Rp 42 juta dan biaya lembur sebesar Rp 18 juta.

---

## Kesimpulan

Kekuatan sejati AI dalam manufaktur bukan pada kemampuannya membuat puisi atau menghasilkan gambar, melainkan pada kemampuannya menghubungkan titik-titik data transaksi operasional yang tersebar, lalu menyajikannya secara transparan agar manajemen manusia dapat mengambil keputusan yang lebih tepat dan cepat.`,
  },
];
