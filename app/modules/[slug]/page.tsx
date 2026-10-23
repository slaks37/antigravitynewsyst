import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Bot,
  Workflow,
  Sparkles,
  Layers,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { SimulatedBadge } from "@/components/ui/SimulatedBadge";
import { LeadForm } from "@/components/marketing/LeadForm";
import { MODULES_MAP } from "@/lib/data/modules";
import { getDatabase } from "@/lib/db";
import { posts, categories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mod = MODULES_MAP[slug];

  if (!mod) {
    return { title: "Modul Tidak Ditemukan" };
  }

  return {
    alternates: { canonical: `/modules/${slug}` },
    title: `${mod.name} — ${mod.fullName}`,
    description: mod.heroProblem,
    openGraph: {
      title: `${mod.name} | NewSystem`,
      description: mod.heroDescription,
    },
  };
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const mod = MODULES_MAP[slug];

  if (!mod) {
    notFound();
  }

  // Fetch relevant blog articles from DB
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
    console.error("Failed to fetch relevant articles for module:", err);
  }

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. HERO EXPLAINING CORE PROBLEM */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 pt-12 pb-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                Modul NewSystem
              </span>
              <span className="text-slate-300">•</span>
              <MaturityBadge status={mod.status} showDescription={true} />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {mod.fullName}
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-700 leading-relaxed mb-6">
              {mod.heroProblem}
            </p>

            <p className="text-base text-slate-600 leading-relaxed mb-8">
              {mod.heroDescription}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#consultation-form" variant="primary" size="lg">
                Uji Coba Modul {mod.name}
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Jadwalkan Konsultasi Alur
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEMS THE MODULE ADDRESSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
            Tantangan Operasional
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Masalah Nyata Pabrik yang Diselesaikan oleh {mod.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mod.coreProblems.map((prob, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-premium flex gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                !
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                  {prob.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{prob.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MAIN BUSINESS CAPABILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Fitur & Kapabilitas
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kemampuan Inti {mod.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mod.capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-premium"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {cap.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-7">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WORKFLOW DIAGRAM */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-2 block">
              Alur Kerja Standar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Langkah Eksekusi {mod.name} dalam Operasi Harian
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mod.workflowSteps.map((ws) => (
              <div
                key={ws.step}
                className="bg-slate-800/90 rounded-xl p-6 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-brand-cyan block mb-2">
                    Tahap {ws.step}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">{ws.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{ws.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CROSS-MODULE INTEGRATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            Keterhubungan Sistem
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bagaimana {mod.name} Terhubung dengan Modul Lain
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mod.crossModuleIntegrations.map((cmi, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
                Terhubung dengan {cmi.module}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{cmi.flow}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. RELATED MODULE COPILOT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{mod.copilotHighlight.name}</h3>
                <p className="text-xs text-slate-400">{mod.copilotHighlight.description}</p>
              </div>
            </div>
            <SimulatedBadge label="Simulasi Copilot Modul" />
          </div>

          <div className="space-y-4 max-w-3xl">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400 font-mono mb-1">PERTANYAAN OPERATOR / STAF:</p>
              <p className="text-sm font-semibold text-white">
                &ldquo;{mod.copilotHighlight.sampleQuery}&rdquo;
              </p>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700/80">
              <p className="text-xs text-brand-cyan font-mono mb-1">RESPONS TERVERIFIKASI SISTEM:</p>
              <p className="text-sm text-slate-200 leading-relaxed">
                {mod.copilotHighlight.sampleResponse}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 & 8. USE CASES & EXPECTED OUTCOMES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Use Cases */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Skenario Penerapan Nyata
            </h3>
            <div className="space-y-4">
              {mod.useCases.map((uc, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-1">
                    {uc.industry}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{uc.scenario}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Outcomes to Validate */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Target Dampak yang Divalidasi
            </h3>
            <div className="space-y-4">
              {mod.expectedOutcomes.map((eo, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    {eo.metric}
                  </span>
                  <p className="text-base font-bold text-emerald-700">{eo.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. RELEVANT BLOG ARTICLES */}
      {relevantArticles.length > 0 && (
        <section className="bg-slate-50 py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Panduan Terkait {mod.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relevantArticles.map((art) => (
                <article
                  key={art.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
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
                    <span>Baca Artikel</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. DESIGN PARTNER / DEMO CTA */}
      <section id="consultation-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1 block">
              Validasi Modul {mod.name}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Diskusikan Alur Pabrik Anda Bersama Kami
            </h3>
            <p className="text-sm text-slate-600">
              Isi data di bawah untuk menjadwalkan sesi pemetaan alur dan demonstrasi prototipe modul {mod.name}.
            </p>
          </div>

          <LeadForm
            variant="DEMO_REQUEST"
            sourcePage={`/modules/${mod.slug}`}
          />
        </div>
      </section>
    </div>
  );
}
