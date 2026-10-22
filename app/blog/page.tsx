import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Clock,
  Calendar,
  Search,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Tag,
  Filter,
  Rss,
  Mail,
  Sparkles,
} from "lucide-react";
import {
  getAllCategories,
  getPublishedPosts,
} from "@/lib/data/blog-service";
import { LeadForm } from "@/components/marketing/LeadForm";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";

export const metadata: Metadata = {
  title: "Blog & Wawasan Operasional Manufaktur Modern | NewSystem",
  description:
    "Pusat pengetahuan manufaktur: panduan praktis ERP, MES shop floor, cara kalkulasi HPP aktual, manajemen inventori lot/batch, dan AI industri dari tim arsitek NewSystem.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Blog & Wawasan Operasional Manufaktur Modern | NewSystem",
    description:
      "Panduan mendalam ERP, MES shop floor, dan kalkulasi HPP riil untuk pabrik manufaktur di Indonesia.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: ["/brand/logo-with-tagline.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Wawasan Operasional Manufaktur Modern | NewSystem",
    description:
      "Panduan mendalam ERP, MES shop floor, dan kalkulasi HPP riil untuk pabrik modern.",
    images: ["/brand/logo-with-tagline.png"],
  },
};

interface BlogIndexProps {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    page?: string;
  }>;
}

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const { q, cat, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 9;
  const offset = (currentPage - 1) * pageSize;

  const [allCategories, { posts: blogPosts, totalCount }] = await Promise.all([
    getAllCategories(),
    getPublishedPosts({
      categorySlug: cat,
      searchQuery: q,
      limit: pageSize,
      offset,
    }),
  ]);

  // Featured article (only on page 1 without active search)
  const featuredArticle =
    !q && !cat && currentPage === 1
      ? blogPosts.find((p) => p.featured) || blogPosts[0]
      : null;

  const regularPosts = featuredArticle
    ? blogPosts.filter((p) => p.id !== featuredArticle.id)
    : blogPosts;

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Blog Hero Header (Katana MRP / Fulcrum style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-brand-blue mb-4">
            <BookOpen className="w-3.5 h-3.5 text-brand-blue" />
            <span>Pusat Pengetahuan Manufaktur</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Wawasan Teknis & Panduan Operasional Pabrik
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Artikel orisinal, analisis alur ERP & MES, metodologi HPP aktual, dan strategi transisi digital pabrik dari tim arsitek sistem NewSystem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/rss.xml"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-brand-blue hover:border-slate-300 transition-colors shadow-sm"
          >
            <Rss className="w-4 h-4 text-amber-500" />
            <span>RSS Feed</span>
          </Link>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <form method="GET" action="/blog" className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Cari topik HPP, ERP, MES, alur kerja, inventori, scrap..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
            {cat && <input type="hidden" name="cat" value={cat} />}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-bold text-white bg-brand-blue hover:bg-blue-600 rounded-xl transition-colors shrink-0 shadow-sm"
          >
            Cari
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <Link
            href="/blog"
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap border ${
              !cat
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Semua Topik
          </Link>
          {allCategories.map((c) => {
            const isSelected = cat === c.slug;
            return (
              <Link
                key={c.id}
                href={`/blog?cat=${c.slug}`}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap border ${
                  isSelected
                    ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Hero Article (Katana MRP style) */}
      {featuredArticle && (
        <section className="bg-gradient-to-br from-slate-900 via-navy to-slate-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-brand-blue text-white font-bold text-[11px] shadow-sm">
                ARTIKEL PILIHAN
              </span>
              <span className="text-cyan-400 font-semibold">{featuredArticle.categoryName || "ERP & MES"}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {featuredArticle.readingTimeMinutes} mnt baca
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug hover:text-cyan-300 transition-colors">
              <Link href={`/blog/${featuredArticle.slug}`}>
                {featuredArticle.title}
              </Link>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl line-clamp-3">
              {featuredArticle.excerpt}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                  NS
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{featuredArticle.authorName || "Tim NewSystem"}</p>
                  <p className="text-[11px] text-slate-400">
                    {featuredArticle.publishedAt
                      ? new Date(featuredArticle.publishedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Oktober 2026"}
                  </p>
                </div>
              </div>

              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-md"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Articles Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {cat
              ? `Artikel Topik: ${allCategories.find((c) => c.slug === cat)?.name || cat}`
              : q
              ? `Hasil Pencarian: "${q}"`
              : "Semua Artikel Terbaru"}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Menampilkan {blogPosts.length} dari {totalCount} artikel
          </span>
        </div>

        {regularPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
            <p className="text-base text-slate-600">
              Tidak ada artikel yang sesuai dengan filter atau kata kunci Anda.
            </p>
            <Link
              href="/blog"
              className="inline-block px-5 py-2 text-xs font-bold text-brand-blue bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
            >
              Reset Filter
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <Link
                      href={`/blog?cat=${post.categorySlug}`}
                      className="px-2.5 py-1 rounded-full bg-blue-50 text-brand-blue font-bold text-[11px] border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      {post.categoryName || "Manufaktur"}
                    </Link>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTimeMinutes} mnt baca
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-5">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-brand-blue">
                      NS
                    </div>
                    <span className="font-medium text-slate-700">{post.authorName || "Tim NewSystem"}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Baca</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter / Insights Subscription Card (Katana style) */}
      <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-3xl p-8 sm:p-12 border border-blue-100 shadow-sm">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dapatkan Wawasan Operasional Manufaktur Mingguan
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Bergabunglah dengan praktisi manufaktur, manajer pabrik, dan arsitek sistem yang menerima pembaruan berkala tentang kalkulasi HPP, efisiensi shop floor, dan otomatisasi industri.
          </p>

          <form action="/api/newsletter" method="POST" className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              required
              placeholder="Masukkan email kantor Anda..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-md"
            >
              Langganan
            </button>
          </form>
          <p className="text-[11px] text-slate-400">
            Tanpa spam. Anda dapat berhenti berlangganan kapan saja dengan satu klik.
          </p>
        </div>
      </section>
    </div>
  );
}
