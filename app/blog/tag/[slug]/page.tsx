export const dynamic = "force-dynamic";

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  Clock,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Tag as TagIcon,
} from "lucide-react";
import {
  getAllTags,
  getTagBySlug,
  getPublishedPosts,
} from "@/lib/data/blog-service";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { title: "Tag Tidak Ditemukan | NewSystem" };
  }

  const tagUrl = `${siteUrl}/blog/tag/${slug}`;

  return {
    title: `Artikel Tag #${tag.name} | NewSystem Blog`,
    description: `Koleksi artikel, panduan teknis, dan analisis seputar topik #${tag.name} di NewSystem.`,
    alternates: {
      canonical: tagUrl,
    },
    openGraph: {
      title: `Artikel Tag #${tag.name} | NewSystem Blog`,
      description: `Koleksi artikel, panduan teknis, dan analisis seputar topik #${tag.name}.`,
      url: tagUrl,
      type: "website",
    },
  };
}

export default async function BlogTagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const { posts: tagPosts } = await getPublishedPosts({
    tagSlug: tag.slug,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Semua Artikel Blog</span>
        </Link>

        <div className="flex items-center gap-2 pt-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-brand-blue flex items-center justify-center">
            <TagIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Topik Tag
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          #{tag.name}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Koleksi artikel dan wawasan operasional yang berkaitan dengan topik{" "}
          {tag.name}.
        </p>
      </div>

      {/* Posts */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        {tagPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-3">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-600">
              Belum ada artikel yang menggunakan tag ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tagPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-blue font-bold text-[11px] border border-blue-100">
                      {post.categoryName || "Manufaktur"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTimeMinutes} mnt baca
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px]">
                    {post.authorName || "Tim NewSystem"}
                  </span>
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
    </div>
  );
}
