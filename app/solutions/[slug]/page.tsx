import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Factory,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/marketing/LeadForm";
import { SOLUTIONS_MAP } from "@/lib/data/solutions";
import { getDatabase } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sol = SOLUTIONS_MAP[slug];

  if (!sol) {
    return { title: "Solusi Industri Tidak Ditemukan" };
  }

  return {
    title: `Solusi ${sol.name} — ${sol.tagline}`,
    description: sol.heroDescription,
    openGraph: {
      title: `Solusi ${sol.name} | NewSystem`,
      description: sol.heroHeadline,
    },
  };
}

export default async function IndustrySolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const sol = SOLUTIONS_MAP[slug];

  if (!sol) {
    notFound();
  }

  // Fetch relevant blog articles
  let relevantArticles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    readingTimeMinutes: number;
  }> = [];

  try {
    const db = getDatabase();
    relevantArticles = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        readingTimeMinutes: posts.readingTimeMinutes,
      })
      .from(posts)
      .where(eq(posts.status, "PUBLISHED"))
      .orderBy(desc(posts.publishedAt))
      .limit(2);
  } catch (err) {
    console.error("Failed to fetch articles:", err);
  }

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-50/40 via-white to-slate-50 pt-12 pb-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                Solusi Sektor Manufaktur
              </span>
              {sol.pilotBadge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-brand-blue border border-blue-200">
                  {sol.pilotBadge}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {sol.name}
            </h1>

            <p className="text-lg sm:text-xl font-bold text-slate-800 leading-snug mb-4">
              {sol.heroHeadline}
            </p>

            <p className="text-base text-slate-600 leading-relaxed mb-8">
              {sol.heroDescription}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#consultation-section" variant="primary" size="lg">
                Diskusikan Operasi {sol.name}
              </Button>
              <Button href="/design-partner" variant="outline" size="lg">
                Program Validasi Pilot
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL FOCUS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Fokus Operasional Khusus
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tantangan Khas {sol.name} yang Ditangani Sistem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sol.operationalFocus.map((of, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-premium"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">{of.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{of.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. KEY WORKFLOWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Standard Operating Procedures
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Alur Kerja Inti dalam Industri Ini
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sol.keyWorkflows.map((kw, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex flex-col justify-between"
            >
              <div>
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-brand-blue font-bold text-xs flex items-center justify-center mb-4">
                  0{idx + 1}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{kw.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{kw.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROCESS DIAGRAM STEPS */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-2 block">
              Peta Proses Operasional
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tahapan Alur dari Permintaan hingga Pengiriman
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sol.processDiagramSteps.map((step) => (
              <div
                key={step.step}
                className="bg-slate-800/90 rounded-xl p-6 border border-slate-700/80"
              >
                <span className="text-xs font-mono font-bold text-brand-cyan block mb-2">
                  Langkah {step.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. METRICS TARGETED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Indikator Efisiensi yang Divalidasi
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Target terukur yang diverifikasi bersama pabrik mitra percontohan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {sol.metricsTargeted.map((m, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm"
              >
                <p className="text-xs text-slate-500 font-medium mb-1">{m.name}</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-brand-blue">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. RELEVANT BLOG ARTICLES */}
      {relevantArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            Artikel Terkait Sektor {sol.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relevantArticles.map((art) => (
              <article
                key={art.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
              >
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  <Link href={`/blog/${art.slug}`} className="hover:text-brand-blue">
                    {art.title}
                  </Link>
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {art.excerpt}
                </p>
                <Link
                  href={`/blog/${art.slug}`}
                  className="text-xs font-bold text-brand-blue flex items-center gap-1"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 7. CONSULTATION FORM */}
      <section id="consultation-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1 block">
              Konsultasi Alur Pabrik
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Petakan Operasional Pabrik {sol.name} Anda
            </h3>
            <p className="text-sm text-slate-600">
              Isi formulir di bawah untuk menjadwalkan sesi diskusi pemetaan proses dan validasi pilot.
            </p>
          </div>

          <LeadForm
            variant="DEMO_REQUEST"
            defaultIndustry={sol.name}
            sourcePage={`/solutions/${sol.slug}`}
          />
        </div>
      </section>
    </div>
  );
}
