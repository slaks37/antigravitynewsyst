import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  Clock,
  Calendar,
  Share2,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  User,
  CheckCircle2,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import { getDatabase } from "@/lib/db";
import { posts, categories, authors, tags, postTags } from "@/lib/db/schema";
import { eq, desc, ne, and } from "drizzle-orm";
import { LeadForm } from "@/components/marketing/LeadForm";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = getDatabase();

  const [post] = await db
    .select({
      title: posts.title,
      excerpt: posts.excerpt,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      canonicalUrl: posts.canonicalUrl,
      ogImage: posts.ogImage,
    })
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "PUBLISHED")))
    .limit(1);

  if (!post) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: post.canonicalUrl || `https://newsystem.space/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.ogImage || "/brand/logo-with-tagline.png"],
    },
  };
}

// Helper to extract H2 headings for Table of Contents
function extractHeadings(content: string) {
  const headingRegex = /^##\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text });
  }

  return headings;
}

// Basic markdown to HTML renderer for standard article blocks
function renderArticleContent(content: string) {
  // Convert ## Heading 2 into anchorable sections
  let html = content.replace(/^##\s+(.+)$/gm, (_, title) => {
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return `<h2 id="${id}">${title}</h2>`;
  });

  // Convert ### Heading 3
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");

  // Convert bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert italics *text*
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert inline code `code`
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Convert blockquotes > quote
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Convert bullet points - item
  html = html.replace(/^-\s+(.+)$/gm, "<li>$1</li>");

  // Convert horizontal rules ---
  html = html.replace(/^---$/gm, "<hr />");

  // Wrap lines in paragraphs if not headings or list items
  const lines = html.split("\n\n");
  const parsed = lines
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h2") ||
        trimmed.startsWith("<h3") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<hr")
      ) {
        return trimmed;
      }
      if (trimmed.startsWith("<li>")) {
        return `<ul>${trimmed}</ul>`;
      }
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return parsed;
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const db = getDatabase();

  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImage: posts.coverImage,
      coverImageAlt: posts.coverImageAlt,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      primaryCategoryId: posts.primaryCategoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      authorName: authors.name,
      authorSlug: authors.slug,
      authorBio: authors.bio,
      authorRole: authors.role,
      authorAvatar: authors.avatarUrl,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
    .leftJoin(authors, eq(posts.authorId, authors.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "PUBLISHED")))
    .limit(1);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "10 Oktober 2026";

  // Query related articles in the same category or latest
  const relatedArticles = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      readingTimeMinutes: posts.readingTimeMinutes,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
    .where(and(ne(posts.id, post.id), eq(posts.status, "PUBLISHED")))
    .orderBy(desc(posts.publishedAt))
    .limit(2);

  // Article JSON-LD Schema
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName || "Tim NewSystem",
    },
    publisher: {
      "@type": "Organization",
      name: "NewSystem",
      logo: {
        "@type": "ImageObject",
        url: "https://newsystem.space/brand/logo-horizontal-light.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://newsystem.space/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <article className="pb-24 pt-8 sm:pt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-blue">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/blog" className="hover:text-brand-blue">
              Blog
            </Link>
            {post.categoryName && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link
                  href={`/blog/category/${post.categorySlug}`}
                  className="hover:text-brand-blue"
                >
                  {post.categoryName}
                </Link>
              </>
            )}
          </nav>

          {/* Article Header */}
          <div className="space-y-4 border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {post.categoryName && (
                <Link
                  href={`/blog/category/${post.categorySlug}`}
                  className="px-3 py-1 rounded-full font-semibold bg-blue-50 text-brand-blue border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {post.categoryName}
                </Link>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTimeMinutes} menit baca
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {post.excerpt}
            </p>

            {/* Author Byline */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-sm">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{post.authorName || "Tim NewSystem"}</p>
                <p className="text-xs text-slate-500">{post.authorRole || "Sistem Manufaktur"}</p>
              </div>
            </div>
          </div>

          {/* Table of Contents (Automatic from Headings) */}
          {headings.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 my-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-brand-blue" />
                Daftar Isi Artikel
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="hover:text-brand-blue transition-colors flex items-center gap-2"
                    >
                      <span className="text-slate-400">›</span>
                      <span>{h.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Article Content */}
          <div
            className="prose-newsystem"
            dangerouslySetInnerHTML={{ __html: renderArticleContent(post.content) }}
          />

          {/* Author Biography Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mt-12 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-blue border border-blue-200 flex items-center justify-center flex-shrink-0 font-bold text-base">
              NS
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider mb-1">
                Tentang Penulis
              </p>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {post.authorName || "Tim Engineering & Produk NewSystem"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {post.authorBio ||
                  "Praktisi sistem operasional manufaktur, arsitektur ERP/MES terdistribusi, dan otomasi industri modern."}
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-12 border-t border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Artikel Terkait Lainnya</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-brand-blue px-2 py-0.5 rounded-full bg-blue-50 mb-2 inline-block">
                        {rel.categoryName || "Manufaktur"}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">
                        <Link href={`/blog/${rel.slug}`} className="hover:text-brand-blue">
                          {rel.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>
                    <Link
                      href={`/blog/${rel.slug}`}
                      className="text-xs font-bold text-brand-blue flex items-center gap-1"
                    >
                      <span>Baca Artikel</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Consultation Call-to-Action */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4 my-12">
            <h3 className="text-2xl font-bold">
              Ingin Menerapkan Alur Operasi Ini di Pabrik Anda?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Diskusikan pemetaan proses bisnis, integrasi modul, atau partisipasi dalam program Design Partner bersama tim arsitek NewSystem.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Diskusikan Pabrik Anda
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
