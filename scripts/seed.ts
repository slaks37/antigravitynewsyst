import bcrypt from "bcryptjs";
import { getDatabase } from "../lib/db/index";
import { initializeDatabase } from "../lib/db/init";
import {
  users,
  authors,
  categories,
  tags,
  posts,
  leads,
  siteSettings,
} from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function runSeed() {
  console.log("🚀 Initializing NewSystem database schema...");
  await initializeDatabase();
  const db = getDatabase();

  console.log("🌱 Seeding Users & RBAC roles...");
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash("NewSystemAdmin2026!", salt);
  const editorPasswordHash = await bcrypt.hash("NewSystemEditor2026!", salt);
  const reviewerPasswordHash = await bcrypt.hash("NewSystemReviewer2026!", salt);
  const marketingPasswordHash = await bcrypt.hash("NewSystemMarketing2026!", salt);

  const initialUsers = [
    {
      id: "usr-superadmin",
      email: "admin@newsystem.id",
      passwordHash: adminPasswordHash,
      name: "Founder & Chief Architect",
      role: "SUPERADMIN",
      active: true,
    },
    {
      id: "usr-editor",
      email: "editor@newsystem.id",
      passwordHash: editorPasswordHash,
      name: "Editorial Lead",
      role: "EDITOR",
      active: true,
    },
    {
      id: "usr-reviewer",
      email: "reviewer@newsystem.id",
      passwordHash: reviewerPasswordHash,
      name: "Technical Reviewer",
      role: "REVIEWER",
      active: true,
    },
    {
      id: "usr-marketing",
      email: "marketing@newsystem.id",
      passwordHash: marketingPasswordHash,
      name: "Growth & Lead Lead",
      role: "MARKETING_LEAD_MANAGER",
      active: true,
    },
  ];

  for (const u of initialUsers) {
    const existing = await db.select().from(users).where(eq(users.id, u.id));
    if (existing.length === 0) {
      await db.insert(users).values(u);
    }
  }

  console.log("🌱 Seeding Authors...");
  const initialAuthors = [
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

  for (const a of initialAuthors) {
    const existing = await db.select().from(authors).where(eq(authors.id, a.id));
    if (existing.length === 0) {
      await db.insert(authors).values(a);
    }
  }

  console.log("🌱 Seeding 11 Initial Categories...");
  const initialCategories = [
    {
      id: "cat-1",
      name: "Digital Transformation & Industry 4.0",
      slug: "digital-transformation",
      description: "Panduan strategis modernisasi pabrik, integrasi OT/IT, dan fase adopsi teknologi.",
      displayOrder: 1,
    },
    {
      id: "cat-2",
      name: "Manufacturing Operations",
      slug: "manufacturing-operations",
      description: "Praktik terbaik shop floor, efisiensi lintasan kerja, OEE, dan eliminasi waste.",
      displayOrder: 2,
    },
    {
      id: "cat-3",
      name: "ERP & Business Management",
      slug: "erp-business-management",
      description: "Sentralisasi proses bisnis inti: pengadaan, master data, dan perencanaan sumber daya.",
      displayOrder: 3,
    },
    {
      id: "cat-4",
      name: "MES & Production Intelligence",
      slug: "mes-production-intelligence",
      description: "Eksekusi manufaktur real-time, job cards, dispatching, dan pelacakan workstation.",
      displayOrder: 4,
    },
    {
      id: "cat-5",
      name: "Supply Chain & Inventory",
      slug: "supply-chain-inventory",
      description: "Akurasi saldo stok, pelacakan lot/batch, multi-gudang, dan rekonsiliasi opname.",
      displayOrder: 5,
    },
    {
      id: "cat-6",
      name: "Finance, HPP & Profitability",
      slug: "finance-hpp-profitability",
      description: "Perhitungan HPP aktual, alokasi biaya tenaga kerja langsung, overhead, dan margin order.",
      displayOrder: 6,
    },
    {
      id: "cat-7",
      name: "Workforce & HR Management",
      slug: "workforce-hr-management",
      description: "Manajemen shift pabrik, produktivitas tenaga kerja, absensi, dan integrasi biaya labor.",
      displayOrder: 7,
    },
    {
      id: "cat-8",
      name: "Quality & Maintenance",
      slug: "quality-maintenance",
      description: "Inspeksi QC material masuk, in-process, penahanan lot cacat, dan jadwal preventif mesin.",
      displayOrder: 8,
    },
    {
      id: "cat-9",
      name: "AI, Automation & Business Intelligence",
      slug: "ai-automation-bi",
      description: "Penerapan AI praktis, otomasi alur approval lintas departemen, dan analitik bisnis terpadu.",
      displayOrder: 9,
    },
    {
      id: "cat-10",
      name: "Manufacturing Industry Insights",
      slug: "industry-insights",
      description: "Analisis tantangan spesifik sektor F&B, Garment, Furnitur, Discrete, dan Assembly.",
      displayOrder: 10,
    },
    {
      id: "cat-11",
      name: "NewSystem Product Updates",
      slug: "product-updates",
      description: "Perkembangan arsitektur, catatan rilis prototipe, dan validasi mitra desain NewSystem.",
      displayOrder: 11,
    },
  ];

  for (const c of initialCategories) {
    const existing = await db.select().from(categories).where(eq(categories.id, c.id));
    if (existing.length === 0) {
      await db.insert(categories).values(c);
    }
  }

  console.log("🌱 Seeding Tags...");
  const initialTags = [
    { id: "tag-1", name: "ERP", slug: "erp" },
    { id: "tag-2", name: "MES", slug: "mes" },
    { id: "tag-3", name: "HPP", slug: "hpp" },
    { id: "tag-4", name: "Inventory", slug: "inventory" },
    { id: "tag-5", name: "AI Manufacturing", slug: "ai-manufacturing" },
    { id: "tag-6", name: "Shop Floor", slug: "shop-floor" },
  ];

  for (const t of initialTags) {
    const existing = await db.select().from(tags).where(eq(tags.id, t.id));
    if (existing.length === 0) {
      await db.insert(tags).values(t);
    }
  }

  console.log("🌱 Seeding 6 Original Evergreen Articles...");
  const seedArticles = [
    {
      id: "post-1",
      title: "ERP vs MES: Memahami Perbedaan & Sinergi Kritis untuk Pabrik Manufaktur",
      slug: "erp-vs-mes-perbedaan-sinergi-pabrik",
      excerpt: "Banyak manajemen pabrik bingung membedakan peran ERP dan MES. Pelajari batasan tanggung jawab transaksi bisnis versus eksekusi shop floor, dan mengapa integrasinya menentukan profitabilitas pabrik.",
      primaryCategoryId: "cat-3",
      authorId: "auth-founding",
      featured: true,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
      readingTimeMinutes: 7,
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

> **Catatan Validasi:** Seluruh alur proses di atas dirancang sesuai prinsip pemisahan domain pada Master PRD NewSystem v1.0 dan sedang divalidasi bersama mitra manufaktur percontohan.`,
    },
    {
      id: "post-2",
      title: "Cara Menghitung HPP Manufaktur dan Biaya Produksi Aktual (Bukan Sekadar Standar)",
      slug: "cara-menghitung-hpp-manufaktur-biaya-aktual",
      excerpt: "Banyak pabrik mengira mereka menghasilkan laba, padahal HPP mereka dihitung berdasarkan standar usang yang tidak memperhitungkan scrap riil dan lembur operator. Berikut metode kalkulasi HPP aktual yang terverifikasi.",
      primaryCategoryId: "cat-6",
      authorId: "auth-manufacturing",
      featured: false,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      readingTimeMinutes: 8,
      content: `## Mengapa Kalkulasi HPP Standar Menipu Manajemen?

Mayoritas pabrik manufaktur skala menengah masih menghitung Harga Pokok Penjualan (HPP) berdasarkan rumus standar di awal tahun:
\`HPP Standar = Biaya Bahan Baku Teoretis + Tarif Tenaga Kerja Rata-Rata + Overhead Estimasi\`

Masalahnya: pabrik tidak beroperasi di laboratorium yang steril. Dalam realitas produksi sehari-hari:
- Bahan baku sering mengalami penyusutan (shrinkage) atau kualitas bervariasi.
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
      authorId: "auth-founding",
      featured: false,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      readingTimeMinutes: 6,
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
      authorId: "auth-manufacturing",
      featured: false,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      readingTimeMinutes: 7,
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
      authorId: "auth-founding",
      featured: false,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      readingTimeMinutes: 6,
      content: `## Menghargai Peran Spreadsheet di Awal Pertumbuhan

Hampir setiap pabrik manufaktur yang sukses hari ini dimulai dari spreadsheet: file Excel untuk jadwal produksi, file lain untuk daftar stok, dan lembar terpisah untuk penagihan invoice.

Spreadsheet sangat fleksibel, tidak membutuhkan biaya lisensi jutaan rupiah di awal, dan dapat dimodifikasi oleh siapa saja. Namun fleksibilitas inilah yang kelak menjadi jebakan ketika volume pesanan berlipat ganda:
- **Formula Terhapus:** Satu sel terhapus tidak sengaja membuat rekapitulasi kebutuhan bahan meleset tanpa disadari.
- **Konflik Versi:** Siapa yang memiliki versi terbaru file \`Jadwal_Produksi_Rev4_Final_Beneran.xlsx\`?
- **Tanpa Riwayat Perubahan:** Tidak ada catatan siapa yang mengubah angka stok dari 500 menjadi 350.

---

## Tiga Tahap Transisi yang Realistis

Banyak implementasi ERP gagal karena mencoba mengganti seluruh spreadsheet dalam semalam (Big Bang approach). Pendekatan yang lebih aman dan terbukti adalah transisi bertahap:

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
      primaryCategoryId: "cat-9",
      authorId: "auth-founding",
      featured: false,
      status: "PUBLISHED",
      publishedAt: new Date(),
      readingTimeMinutes: 7,
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

  for (const post of seedArticles) {
    const existing = await db.select().from(posts).where(eq(posts.id, post.id));
    if (existing.length === 0) {
      await db.insert(posts).values(post);
    }
  }

  console.log("🌱 Seeding Sample Leads...");
  const initialLeads = [
    {
      id: "lead-1",
      formType: "DESIGN_PARTNER",
      fullName: "Budi Santoso",
      businessEmail: "budi@suryafurnitur.co.id",
      phoneNumber: "081234567890",
      company: "PT Surya Furnitur Indonesia",
      industry: "Furniture & Assembly",
      plantCount: 2,
      employeeRange: "50-100",
      productionType: "Make-to-Order & Assembly",
      businessProblem: "Kesulitan melacak HPP aktual per pesanan custom dan sering terjadi selisih stok kayu di gudang.",
      sourcePage: "/design-partner",
      status: "NEW",
      notes: "Tertarik mengikuti uji coba pilot modul MES dan Costing.",
    },
    {
      id: "lead-2",
      formType: "DEMO_REQUEST",
      fullName: "Ratna Sari",
      businessEmail: "ratna@nusantararasa.com",
      phoneNumber: "081987654321",
      company: "CV Nusantara Rasa Pangan",
      industry: "Food & Beverage",
      plantCount: 1,
      employeeRange: "20-50",
      productionType: "Batch Manufacturing",
      businessProblem: "Memerlukan sistem pencatatan batch produksi, tanggal kedaluwarsa bahan baku, dan kontrol kualitas inspeksi.",
      sourcePage: "/modules/mes",
      status: "CONTACTED",
      notes: "Telah dihubungi via email untuk jadwal diskusi proses produksi.",
    },
  ];

  for (const l of initialLeads) {
    const existing = await db.select().from(leads).where(eq(leads.id, l.id));
    if (existing.length === 0) {
      await db.insert(leads).values(l);
    }
  }

  console.log("🌱 Seeding Site Settings...");
  const initialSettings = [
    {
      key: "general",
      value: {
        siteName: "NewSystem",
        tagline: "One System. Every Process. Smarter Business.",
        supportEmail: "contact@newsystem.id",
        companyName: "PT NewSystem Teknologi Indonesia",
        primaryMarket: "Indonesia Manufacturing",
        primaryCtaText: "Diskusikan Pabrik Anda",
        secondaryCtaText: "Pelajari Platform",
      },
    },
  ];

  for (const s of initialSettings) {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, s.key));
    if (existing.length === 0) {
      await db.insert(siteSettings).values(s);
    }
  }

  console.log("✅ Database seeding completed successfully!");
}

runSeed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
