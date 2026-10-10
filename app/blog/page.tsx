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
} from "lucide-react";
import { getDatabase } from "@/lib/db";
import { posts, categories, authors } from "@/lib/db/schema";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";
import { LeadForm } from "@/components/marketing/LeadForm";

export const metadata: Metadata = {
  title: "Blog & Wawasan Operasional Manufaktur",
  description:
    "Artikel edukatif, panduan mendalam ERP & MES, kalkulasi HPP aktual, dan analisis operasional pabrik modern dari tim arsitek NewSystem.",
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
  const pageSize = 6;
  const offset = (currentPage - 1) * pageSize;

  const db = getDatabase();

  // Fetch all active categories for the filter bar
  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .where(eq(categories.active, true))
    .orderBy(categories.displayOrder);

  // Build filter conditions
  const conditions = [eq(posts.status, "PUBLISHED")];

  if (cat) {
    const selectedCat = allCategories.find((c) => c.slug === cat);
    if (selectedCat) {
      conditions.push(eq(posts.primaryCategoryId, selectedCat.id));
    }
  }

  if (q && q.trim()) {
    const term = `%${q.trim()}%`;
    conditions.push(
      or(
        ilike(posts.title, term),
        ilike(posts.excerpt, term),
        ilike(posts.content, term)
      )!
    );
  }

  // Fetch posts with author & category details
  const blogPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      featured: posts.featured,
      publishedAt: posts.publishedAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      categoryName: categories.name,
      categorySlug: categories.slug,
      authorName: authors.name,
      authorSlug: authors.slug,
      authorAvatar: authors.avatarUrl,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
    .leftJoin(authors, eq(posts.authorId, authors.id))
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt))
    .limit(pageSize)
    .offset(offset);

  // Featured article (only on page 1 without active search)
  const featuredArticle =
    !q && !cat && currentPage === 1
      ? blogPosts.find((p) => p.featured) || blogPosts[0]
      : null;

  const regularPosts = featuredArticle
    ? blogPosts.filter((p) => p.id !== featuredArticle.id)
    : blogPosts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Blog Hero Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
          Pusat Wawasan Manufaktur
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Wawasan Teknis & Panduan Proses Pabrik
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Artikel orisinal, analisis alur ERP & MES, metodologi HPP aktual, dan strategi transisi digital pabrik dari tim arsitek sistem NewSystem.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form method="GET" action="/blog" className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Cari artikel tentang HPP, ERP, MES, alur kerja, inventori..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all"
            />
            {cat && <input type="hidden" name="cat" value={cat} />}
          </div>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-blue hover:bg-blue-600 rounded-lg transition-colors flex-shrink-0"
          >
            Cari
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <Link
            href="/blog"
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              !cat
                ? "bg-brand-blue text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua Kategori
          </Link>
          {allCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog?cat=${c.slug}`}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
                cat === c.slug
                  ? "bg-brand-blue text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Article Box */}
      {featuredArticle && (
        <div className="bg-navy text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-0.5 rounded-full font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                ARTIKEL PILIHAN
              </span>
              <span className="text-slate-400">
                {featuredArticle.categoryName || "Manufaktur"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {featuredArticle.readingTimeMinutes} mnt baca
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="hover:text-brand-cyan transition-colors"
              >
                {featuredArticle.title}
              </Link>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3">
              {featuredArticle.excerpt}
            </p>

            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Oleh {featuredArticle.authorName || "Tim NewSystem"}
              </span>
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-cyan hover:text-white transition-colors"
              >
                <span>Baca Artikel Penuh</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Regular Articles Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {q
            ? `Hasil Pencarian untuk "${q}"`
            : cat
            ? `Artikel dalam Kategori Terpilih`
            : `Artikel Terbaru`}
        </h2>

        {regularPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tidak Ada Artikel Ditemukan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
            </p>
            <Link
              href="/blog"
              className="text-xs font-semibold text-brand-blue hover:underline"
            >
              Kembali ke Semua Artikel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-premium flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <Link
                      href={`/blog/category/${post.categorySlug}`}
                      className="px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-blue font-medium border border-blue-100 hover:bg-blue-100"
                    >
                      {post.categoryName || "Manufaktur"}
                    </Link>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTimeMinutes} mnt baca
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">{post.authorName || "Tim NewSystem"}</span>
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
      </div>

      {/* Newsletter Signup in Blog */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">
          Dapatkan Wawasan Operasional Pabrik Langsung di Email
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-6">
          Kajian proses bisnis, studi kasus mitigasi selisih stok, dan teknik kalkulasi HPP dari tim arsitek NewSystem. Tanpa spam.
        </p>
        <form
          method="POST"
          action="/api/newsletter"
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Alamat email bisnis Anda"
            className="flex-1 px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
          />
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold bg-brand-cyan text-navy hover:bg-cyan-300 rounded-lg transition-colors font-bold"
          >
            Berlangganan
          </button>
        </form>
      </div>
    </div>
  );
}
