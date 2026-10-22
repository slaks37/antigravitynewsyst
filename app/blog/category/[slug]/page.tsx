import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, ChevronRight, BookOpen, ArrowLeft } from "lucide-react";
import {
  getAllCategories,
  getCategoryBySlug,
  getPublishedPosts,
} from "@/lib/data/blog-service";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Kategori Tidak Ditemukan | NewSystem" };
  }

  const catUrl = `${siteUrl}/blog/category/${slug}`;

  return {
    title: category.seoTitle || `${category.name} — Wawasan Manufaktur | NewSystem`,
    description: category.seoDescription || category.description,
    alternates: {
      canonical: catUrl,
    },
    openGraph: {
      title: category.seoTitle || `${category.name} — Wawasan Manufaktur | NewSystem`,
      description: category.seoDescription || category.description,
      url: catUrl,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { posts: categoryPosts } = await getPublishedPosts({
    categorySlug: category.slug,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Category Header */}
      <div className="max-w-3xl space-y-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Semua Artikel Blog</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-brand-blue">
          <span>Kategori Manufaktur</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {category.name}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Posts Grid */}
      {categoryPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">
            Belum Ada Artikel dalam Kategori Ini
          </h2>
          <p className="text-xs text-slate-500">
            Artikel baru untuk topik ini sedang dalam tahap peninjauan editorial.
          </p>
          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-block px-4 py-2 text-xs font-bold text-brand-blue bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
            >
              Jelajahi Artikel Lainnya
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoryPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-blue font-bold text-[11px] border border-blue-100">
                    {category.name}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTimeMinutes} mnt baca
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-2 leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">{post.authorName || "Tim NewSystem"}</span>
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
