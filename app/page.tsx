import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Factory,
  Layers3,
  MoveUpRight,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Metadata } from "next";
import { ProductionPreview } from "@/components/marketing/ProductionPreview";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { LeadForm } from "@/components/marketing/LeadForm";
import { MODULES_MAP } from "@/lib/data/modules";
import { getLatestArticles } from "@/lib/data/blog-service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "NewSystem — Software ERP & MES Manufaktur Indonesia" },
  description:
    "Satukan perencanaan produksi, inventori, MES shop floor, dan HPP aktual dengan NewSystem. Jelajahi platform ERP manufaktur dan program Design Partner.",
  alternates: { canonical: "/" },
};

const faqs = [
  [
    "Apa itu NewSystem?",
    "NewSystem adalah platform bisnis dan manufaktur yang dirancang untuk menghubungkan ERP, MES, inventori, akuntansi, SDM, dokumen, dan AI dalam satu alur data. Pengembangannya dilakukan bertahap bersama Design Partner.",
  ],
  [
    "Apakah semua modul sudah tersedia?",
    "Kesiapan setiap modul berbeda. Label kematangan pada halaman modul menunjukkan statusnya, mulai dari perencanaan, pengembangan, prototipe, hingga pilot. Ruang lingkup dan ketersediaan perlu dikonfirmasi saat konsultasi.",
  ],
  [
    "Bisakah memulai dari inventori dan spreadsheet?",
    "Kebutuhan migrasi data dan alur kerja dapat dipetakan terlebih dahulu. Tim akan mendiskusikan modul awal, data yang perlu disiapkan, dan tahapan validasi sesuai kondisi pabrik.",
  ],
  [
    "Bagaimana cara mencoba NewSystem?",
    "Ajukan konsultasi atau bergabung dalam program Design Partner. Tim akan membahas kebutuhan operasional, kecocokan use case, dan ruang lingkup pilot sebelum implementasi.",
  ],
];

export default async function HomePage() {
  const articles = await getLatestArticles(3);
  return (
    <div className="marketing-home">
      <section className="home-hero">
        <div className="hero-grid shell">
          <div className="hero-copy">
            <Link href="/design-partner" className="hero-announcement">
              <span />
              Dibangun bersama pabrik Indonesia
              <ArrowUpRight size={14} />
            </Link>
            <h1>
              Setiap proses.
              <br />
              Saling terhubung.
              <br />
              <em>Bisnis lebih cerdas.</em>
            </h1>
            <p className="hero-description">
              Dari pesanan pertama sampai produk jadi. Satukan ERP, produksi,
              inventori, dan biaya dalam satu sistem operasi manufaktur.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="action-primary">
                Diskusikan pabrik Anda
                <ArrowUpRight size={18} />
              </Link>
              <a href="#platform-preview" className="action-text">
                Jelajahi platform
                <ArrowRight size={17} />
              </a>
            </div>
            <p className="hero-note">
              One System. Every Process. Smarter Business.
            </p>
          </div>
          <div className="hero-product">
            <div className="product-orbit orbit-one" />
            <div className="product-orbit orbit-two" />
            <ProductionPreview />
            <div className="connected-note">
              <span className="connection-icon">
                <Workflow size={18} />
              </span>
              <div>
                Satu alur. Satu sumber data.
                <small>Sales → Produksi → Inventori → Akuntansi</small>
              </div>
            </div>
          </div>
        </div>
        <div className="industry-strip shell">
          <span>
            DIRANCANG UNTUK
            <br />
            CARA PABRIK ANDA BEKERJA
          </span>
          {[
            ["General Manufacturing", "general-manufacturing"],
            ["Food & Beverage", "food-beverage"],
            ["Garment & Tekstil", "garment"],
            ["Furnitur & Assembly", "furniture-assembly"],
          ].map(([name, slug]) => (
            <Link key={slug} href={`/solutions/${slug}`}>
              {name}
              <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </section>

      <section id="platform-preview" className="home-section shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DARI TERPISAH MENJADI TERPADU</span>
            <h2>
              Berhenti mengejar data.
              <br />
              Mulai melihat keseluruhannya.
            </h2>
          </div>
          <p>
            Ketika penjualan, gudang, dan lantai produksi berbicara dalam bahasa
            yang sama, keputusan punya dasar yang lebih jelas.
          </p>
        </div>
        <div className="benefit-grid">
          {[
            {
              icon: Boxes,
              n: "01",
              title: "Material lebih terkendali.",
              text: "Lihat hubungan kebutuhan bahan, BOM, dan stok antar-gudang sebelum merencanakan produksi.",
              href: "/modules/erp",
              label: "Inventori & MRP",
              visual: "inventory",
            },
            {
              icon: Factory,
              n: "02",
              title: "Lantai produksi terlihat.",
              text: "Hubungkan instruksi kerja, progres pesanan, dan pencatatan hasil dalam alur MES yang terstruktur.",
              href: "/modules/mes",
              label: "Shop floor & MES",
              visual: "factory",
            },
            {
              icon: Layers3,
              n: "03",
              title: "Biaya punya cerita.",
              text: "Telusuri komponen material, tenaga kerja, dan overhead untuk memahami biaya setiap pesanan.",
              href: "/modules/accounting",
              label: "Akuntansi & HPP",
              visual: "cost",
            },
          ].map((item) => (
            <article className="benefit-card" key={item.n}>
              <div
                className={`benefit-visual ${item.visual}`}
                aria-hidden="true"
              >
                <item.icon strokeWidth={1} size={64} />
                <span>{item.n}</span>
                <div className="visual-lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="benefit-copy">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link href={item.href}>
                  {item.label}
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flow-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BUKAN SEKADAR KUMPULAN MODUL</span>
              <h2>
                Satu pesanan.
                <br />
                Menggerakkan seluruh proses.
              </h2>
            </div>
            <Link href="/platform" className="action-text">
              Kenali arsitekturnya
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="flow-grid">
            {[
              [
                "01",
                "Pesanan masuk",
                "CRM & Sales",
                "Kebutuhan pelanggan menjadi titik awal perencanaan.",
              ],
              [
                "02",
                "Material disiapkan",
                "ERP & MRP",
                "BOM dan persediaan menjadi dasar kebutuhan produksi.",
              ],
              [
                "03",
                "Produksi berjalan",
                "MES & Quality",
                "Instruksi, hasil kerja, dan inspeksi terhubung.",
              ],
              [
                "04",
                "Biaya ditelusuri",
                "Accounting & BI",
                "Pergerakan operasional menjadi dasar informasi biaya.",
              ],
            ].map(([n, title, module, text]) => (
              <div key={n} className="flow-step">
                <div className="flow-number">
                  {n}
                  <ArrowRight size={20} />
                </div>
                <small>{module}</small>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <p className="flow-footnote">
            Ilustrasi alur yang dirancang · ketersediaan mengikuti status tiap
            modul.
          </p>
        </div>
      </section>

      <section className="home-section shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SATU SISTEM OPERASI BISNIS</span>
            <h2>
              Mulai dari kebutuhan Anda.
              <br />
              Tumbuh bersama bisnis Anda.
            </h2>
          </div>
          <Link href="/modules" className="action-text">
            Semua modul
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="module-grid">
          {Object.values(MODULES_MAP).map((mod) => (
            <Link
              className="module-tile"
              href={`/modules/${mod.slug}`}
              key={mod.slug}
            >
              <div>
                <MaturityBadge status={mod.status} />
                <ArrowUpRight size={18} />
              </div>
              <h3>{mod.name}</h3>
              <p>{mod.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="copilot-section shell">
        <div className="copilot-copy">
          <span className="eyebrow">
            <Sparkles size={15} />
            KECERDASAN DENGAN KONTEKS
          </span>
          <h2>
            Pertanyaan lebih baik.
            <br />
            Keputusan lebih terarah.
          </h2>
          <p>
            Company Copilot dirancang untuk membantu membaca hubungan
            antarproses. Dengan konteks bisnis, batas akses, dan persetujuan
            yang tetap di tangan Anda.
          </p>
          <Link href="/copilot" className="action-primary">
            Kenali AI Copilot
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="copilot-example">
          <span className="preview-label">
            ILUSTRASI PERCAKAPAN · BUKAN AI LIVE
          </span>
          <div className="question">
            Apa yang perlu dicek sebelum menjadwalkan produksi?
          </div>
          <div className="answer">
            <Sparkles size={20} />
            <div>
              <strong>Mulai dari tiga hal yang saling terkait.</strong>
              <p>
                Ketersediaan bahan, kapasitas work center, dan tanggal kebutuhan
                pesanan.
              </p>
              <div className="source-chips">
                <span>Inventori</span>
                <span>Rencana produksi</span>
                <span>Sales order</span>
              </div>
            </div>
          </div>
          <p className="copilot-disclaimer">
            Contoh penjelasan alur, bukan hasil analisis data pabrik.
          </p>
        </div>
      </section>

      <section className="home-section shell blog-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">NEWSYSTEM JOURNAL</span>
            <h2>
              Wawasan untuk
              <br />
              operasional yang lebih baik.
            </h2>
          </div>
          <Link href="/blog" className="action-text">
            Jelajahi blog
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="journal-grid">
          {articles.map((article, i) => (
            <article className="journal-card" key={article.slug}>
              <Link href={`/blog/${article.slug}`}>
                <div className={`journal-cover cover-${i}`} aria-hidden="true">
                  <span>FIELD NOTES / 0{i + 1}</span>
                  <Workflow size={72} strokeWidth={0.8} />
                  <span>
                    NEWSYSTEM JOURNAL
                    <MoveUpRight size={18} />
                  </span>
                </div>
                <div className="journal-meta">
                  {article.categoryName || "Manufaktur"}
                  <span>{article.readingTimeMinutes} menit baca</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <span className="read-article">
                  Baca artikel
                  <ArrowRight size={16} />
                </span>
              </Link>
            </article>
          ))}
        </div>
        {articles.length === 0 && (
          <p>
            Artikel terbaru akan tersedia di{" "}
            <Link href="/blog">blog NewSystem</Link>.
          </p>
        )}
      </section>

      <section className="faq-section shell">
        <div>
          <span className="eyebrow">SEBELUM MEMULAI</span>
          <h2>
            Yang sering
            <br />
            ditanyakan.
          </h2>
          <Link href="/contact" className="action-text">
            Bicarakan kebutuhan Anda
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div>
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="consultation-section" id="consultation-form">
        <div className="shell consultation-grid">
          <div>
            <span className="eyebrow">LANGKAH BERIKUTNYA</span>
            <h2>
              Pabrik Anda punya cara kerja sendiri.
              <br />
              <em>Mari mulai dari sana.</em>
            </h2>
            <p>
              Ceritakan proses, tantangan, dan prioritas Anda. Kita petakan
              kebutuhan serta ruang lingkup pilot bersama.
            </p>
            <Link href="/design-partner" className="action-text">
              Tentang program Design Partner
              <ArrowUpRight size={18} />
            </Link>
            <p className="maturity-note">
              NewSystem sedang dikembangkan dan divalidasi bersama Design
              Partner. Ilustrasi di halaman ini menggunakan data contoh.
            </p>
          </div>
          <div className="consultation-form">
            <LeadForm sourcePage="/" />
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(([name, text]) => ({
              "@type": "Question",
              name,
              acceptedAnswer: { "@type": "Answer", text },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
