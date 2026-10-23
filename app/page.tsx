import Link from "next/link";
import { ArrowRight, ArrowUpRight, MoveUpRight, Workflow } from "lucide-react";
import type { Metadata } from "next";
import { AnimatedHero } from "@/components/enterprise/AnimatedHero";
import { DisconnectedCompany } from "@/components/enterprise/DisconnectedCompany";
import { EnterpriseStorytelling } from "@/components/enterprise/EnterpriseStorytelling";
import { ConnectedProductShowcase } from "@/components/enterprise/ConnectedProductShowcase";
import { ServiceJourney } from "@/components/enterprise/ServiceJourney";
import { LeadForm } from "@/components/marketing/LeadForm";
import { getLatestArticles } from "@/lib/data/blog-service";
import "./enterprise.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "NewSystem — Your Entire Business. Working as One." },
  description:
    "Seluruh perusahaan. Satu sistem yang terhubung. Jelajahi hubungan Sales, ERP, MES, HR, keuangan, dokumen, dan AI dalam platform bisnis dan manufaktur NewSystem.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NewSystem — Your Entire Business. Working as One.",
    description:
      "Dari pelanggan dan tim, hingga operasional, keuangan, dokumen, dan keputusan bisnis. NewSystem dirancang untuk menghubungkan semuanya.",
    url: "/",
  },
  twitter: {
    title: "NewSystem — Your Entire Business. Working as One.",
    description:
      "Sistem operasi bisnis & manufaktur yang dirancang untuk menghubungkan seluruh perusahaan.",
  },
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
    <div className="enterprise-site">
      <AnimatedHero />
      <DisconnectedCompany />
      <div className="enterprise-story-intro enterprise-shell">
        <p className="enterprise-kicker">THE COMPANY IN MOTION</p>
        <p>
          Ikuti satu pesanan.
          <br />
          <strong>Lihat perusahaan bekerja bersama.</strong>
        </p>
        <span>
          PT Arunika Ruang · SO-1042 · seluruh skenario dan data adalah fiktif.
        </span>
      </div>
      <EnterpriseStorytelling />
      <ConnectedProductShowcase />
      <section className="enterprise-industries enterprise-shell">
        <div>
          <p className="enterprise-kicker">DIRANCANG DARI KONTEKS NYATA</p>
          <h2>
            Manufaktur sebagai titik awal.
            <br />
            <em>Perusahaan sebagai keseluruhan.</em>
          </h2>
          <p>
            Arsitektur NewSystem menghubungkan fungsi perusahaan. Pendalaman use
            case awal berfokus pada kebutuhan operasional manufaktur Indonesia.
          </p>
        </div>
        <div>
          {[
            ["General Manufacturing", "general-manufacturing"],
            ["Food & Beverage", "food-beverage"],
            ["Garment & Tekstil", "garment"],
            ["Furnitur & Assembly", "furniture-assembly"],
          ].map(([name, slug]) => (
            <Link href={`/solutions/${slug}`} key={slug}>
              {name}
              <ArrowUpRight size={18} />
            </Link>
          ))}
          <Link href="/solutions">
            Seluruh solusi industri
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="enterprise-services enterprise-shell">
        <ServiceJourney />
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

      <section className="enterprise-conversion" id="consultation-form">
        <div className="enterprise-shell enterprise-conversion-grid">
          <div>
            <p className="enterprise-kicker">12 / BUILD WHAT COMES NEXT</p>
            <h2>
              Bangun perusahaan
              <br />
              <em>yang lebih terhubung.</em>
            </h2>
            <p>
              Mulai dari satu tantangan nyata. Petakan prosesnya. Tentukan
              prioritasnya. Bangun masa depan operasional perusahaan Anda
              bersama NewSystem.
            </p>
            <div className="enterprise-actions">
              <Link href="/design-partner" className="enterprise-primary">
                Jadilah Design Partner
                <ArrowUpRight size={16} />
              </Link>
              <Link href="/contact" className="enterprise-secondary">
                Konsultasikan Kebutuhan Anda
                <ArrowUpRight size={16} />
              </Link>
            </div>
            <p className="enterprise-conversion-note">
              NewSystem sedang dikembangkan dan divalidasi bersama Design
              Partner. Kesiapan setiap modul dan ruang lingkup pilot perlu
              dikonfirmasi.
            </p>
            <p className="enterprise-official-tagline">
              One System. Every Process. Smarter Business.
            </p>
          </div>
          <div className="enterprise-form">
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
