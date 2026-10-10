import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, ChevronRight, BookOpen, User, Globe, Mail } from "lucide-react";
import { getDatabase } from "@/lib/db";
import { posts, authors, categories } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = getDatabase();

  const [author] = await db
    .select()
    .from(authors)
    .where(eq(authors.slug, slug))
    .limit(1);

  if (!author) {
    return { title: "Penulis Tidak Ditemukan" };
  }

  return {
    title: `${author.name} — Profil Penulis & Analis NewSystem`,
    description: author.bio || `Artikel dan publikasi oleh ${author.name} di NewSystem.`,
  };
}

export default async function BlogAuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const db = getDatabase();

  const [author] = await db
    .select()
    .from(authors)
    .where(eq(authors.slug, slug))
    .limit(1);

  if (!author) {
    notFound();
  }

  const authorPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
    .where(and(eq(posts.authorId, author.id), eq(posts.status, "PUBLISHED")))
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Author Header */}
      <div className="max-w-3xl bg-white p-8 rounded-2xl border border-slate-200 shadow-premium">
        <Link
          href="/blog"
          className="text-xs font-semibold text-brand-blue hover:underline mb-4 inline-block"
        >
          ← Kembali ke Semua Artikel Blog
        </Link>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
            <User className="w-8 h-8 text-slate-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {author.name}
            </h1>
            {author.role && (
              <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider">
                {author.role}
              </p>
            )}
            {author.bio && (
              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {author.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Publikasi & Artikel oleh {author.name} ({authorPosts.length})
        </h2>

        {authorPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Belum Ada Artikel Diterbitkan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Penulis ini belum memiliki artikel publik yang aktif.
            </p>
            <Link href="/blog" className="text-xs font-semibold text-brand-blue hover:underline">
              Jelajahi Artikel Lainnya
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {authorPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-premium flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {post.categoryName && (
                      <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {post.categoryName}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{post.readingTimeMinutes} min</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("id-ID") : "Baru"}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-semibold text-brand-blue flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    Baca Artikel
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
