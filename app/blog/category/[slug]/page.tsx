import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, ChevronRight, BookOpen } from "lucide-react";
import { getDatabase } from "@/lib/db";
import { posts, categories, authors } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = getDatabase();

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (!category) {
    return { title: "Kategori Tidak Ditemukan" };
  }

  return {
    title: category.seoTitle || `${category.name} — Wawasan Manufaktur`,
    description: category.seoDescription || category.description,
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const db = getDatabase();

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (!category) {
    notFound();
  }

  const categoryPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      authorName: authors.name,
    })
    .from(posts)
    .leftJoin(authors, eq(posts.authorId, authors.id))
    .where(and(eq(posts.primaryCategoryId, category.id), eq(posts.status, "PUBLISHED")))
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Category Header */}
      <div className="max-w-3xl">
        <Link
          href="/blog"
          className="text-xs font-semibold text-brand-blue hover:underline mb-2 inline-block"
        >
          ← Kembali ke Semua Artikel Blog
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Kategori: {category.name}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Posts Grid */}
      {categoryPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Belum Ada Artikel dalam Kategori Ini
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Artikel baru untuk topik ini sedang dalam tahap peninjauan editorial.
          </p>
          <Link href="/blog" className="text-xs font-semibold text-brand-blue hover:underline">
            Jelajahi Artikel Lainnya
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoryPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-premium flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-blue font-medium border border-blue-100">
                    {category.name}
                  </span>
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
                <span>{post.authorName || "Tim NewSystem"}</span>
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
  );
}
