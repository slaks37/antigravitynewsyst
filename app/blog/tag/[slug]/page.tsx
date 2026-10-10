import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, ChevronRight, BookOpen, Tag as TagIcon } from "lucide-react";
import { getDatabase } from "@/lib/db";
import { posts, tags, postTags, authors, categories } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = getDatabase();

  const [tag] = await db
    .select()
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);

  if (!tag) {
    return { title: "Tag Tidak Ditemukan" };
  }

  return {
    title: `Artikel dengan Tag #${tag.name} — NewSystem Blog`,
    description: `Koleksi artikel, analisis, dan panduan manufaktur bertag #${tag.name} di NewSystem.`,
  };
}

export default async function BlogTagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const db = getDatabase();

  const [tag] = await db
    .select()
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);

  if (!tag) {
    notFound();
  }

  const tagPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      categoryName: categories.name,
      categorySlug: categories.slug,
      authorName: authors.name,
    })
    .from(postTags)
    .innerJoin(posts, eq(postTags.postId, posts.id))
    .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
    .leftJoin(authors, eq(posts.authorId, authors.id))
    .where(and(eq(postTags.tagId, tag.id), eq(posts.status, "PUBLISHED")))
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Tag Header */}
      <div className="max-w-3xl">
        <Link
          href="/blog"
          className="text-xs font-semibold text-brand-blue hover:underline mb-2 inline-block"
        >
          ← Kembali ke Semua Artikel Blog
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <TagIcon className="w-5 h-5 text-brand-blue" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tag: #{tag.name}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Kumpulan {tagPosts.length} artikel dan analisis berfokus pada topik #{tag.name}.
        </p>
      </div>

      {/* Posts Grid */}
      {tagPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Belum Ada Artikel untuk Tag Ini
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Artikel baru untuk tag ini belum diterbitkan ke publik.
          </p>
          <Link href="/blog" className="text-xs font-semibold text-brand-blue hover:underline">
            Jelajahi Artikel Lainnya
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tagPosts.map((post) => (
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
                  {post.authorName || "Tim Redaksi NewSystem"}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-brand-blue flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Baca Selengkapnya
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
