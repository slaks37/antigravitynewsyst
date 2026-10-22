import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, ChevronRight, BookOpen, ArrowLeft, Mail, User } from "lucide-react";
import {
  getAllAuthors,
  getAuthorBySlug,
  getPublishedPosts,
} from "@/lib/data/blog-service";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({
    slug: author.slug,
  }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return { title: "Penulis Tidak Ditemukan | NewSystem" };
  }

  const authorUrl = `${siteUrl}/blog/author/${slug}`;

  return {
    title: `${author.name} — Profil Penulis & Analis | NewSystem`,
    description: author.bio || `Artikel dan publikasi oleh ${author.name} di NewSystem.`,
    alternates: {
      canonical: authorUrl,
    },
    openGraph: {
      title: `${author.name} — Profil Penulis & Analis | NewSystem`,
      description: author.bio,
      url: authorUrl,
      type: "profile",
    },
  };
}

export default async function BlogAuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const { posts: authorPosts } = await getPublishedPosts({
    authorSlug: author.slug,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Author Profile Header */}
      <div className="max-w-3xl space-y-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Semua Artikel Blog</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
            NS
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {author.name}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-brand-blue mt-0.5">
              {author.role}
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-2">
          {author.bio}
        </p>
      </div>

      {/* Posts by this author */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          Artikel yang Ditulis oleh {author.name} ({authorPosts.length})
        </h2>

        {authorPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-3">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-600">
              Belum ada artikel yang dipublikasikan oleh penulis ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {authorPosts.map((post) => (
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
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Oktober 2026"}
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
