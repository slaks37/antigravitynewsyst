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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  getPublishedPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/data/blog-service";
import { LeadForm } from "@/components/marketing/LeadForm";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";

// Generate static params so all articles are pre-rendered at build time
export async function generateStaticParams() {
  const { posts } = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Artikel Tidak Ditemukan | NewSystem" };
  }

  const postUrl = `${siteUrl}/blog/${slug}`;

  return {
    title: post.seoTitle || `${post.title} | Blog NewSystem`,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: post.canonicalUrl || postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: postUrl,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.authorName || "Tim NewSystem"],
      images: [
        {
          url: post.ogImage || "/brand/logo-with-tagline.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
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
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const relatedArticles = await getRelatedPosts(post.slug, post.primaryCategoryId, 3);

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Oktober 2026";

  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Structured Data Schema for Google (Article & Breadcrumbs)
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    author: {
      "@type": "Person",
      name: post.authorName || "Tim NewSystem",
      jobTitle: post.authorRole || "Manufacturing Systems Architect",
    },
    publisher: {
      "@type": "Organization",
      name: "NewSystem",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/logo-horizontal-light.png`,
      },
    },
    articleSection: post.categoryName || "Manufaktur",
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <div className="pb-24">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* Header Container */}
      <div className="bg-slate-900 text-white pt-12 pb-16 sm:pb-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            {post.categoryName && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link
                  href={`/blog?cat=${post.categorySlug}`}
                  className="hover:text-white transition-colors text-cyan-400"
                >
                  {post.categoryName}
                </Link>
              </>
            )}
          </nav>

          {/* Title & Excerpt */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] text-white">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          {/* Meta Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400">
                NS
              </div>
              <div>
                <p className="font-bold text-white text-sm">{post.authorName || "Tim NewSystem"}</p>
                <p className="text-[11px] text-slate-400">{post.authorRole || "Sistem Arsitektur Pabrik"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                {post.readingTimeMinutes} menit baca
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Table of Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Body */}
          <article className="lg:col-span-8 space-y-10">
            <div
              className="prose-newsystem text-base sm:text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderArticleContent(post.content) }}
            />

            {/* Social Share & Actions */}
            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Share2 className="w-4 h-4 text-brand-blue" />
                <span>Bagikan Artikel Ini:</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + postUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-sky-700 text-white text-xs font-semibold hover:bg-sky-800 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Twitter / X
                </a>
              </div>
            </div>

            {/* Author Profile Bio Box */}
            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-md">
                NS
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Ditulis oleh {post.authorName || "Tim NewSystem"}
                </h3>
                <p className="text-xs font-semibold text-brand-blue">
                  {post.authorRole || "Product & Architecture Team"}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Praktisi sistem operasional manufaktur, perancangan ERP/MES terdistribusi, dan otomasi industri modern untuk pabrik di Indonesia.
                </p>
              </div>
            </div>

            {/* In-Article Conversion Banner (Katana style) */}
            <div className="bg-navy rounded-2xl p-6 sm:p-8 text-white space-y-4 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
                Konsultasi Alur Pabrik Anda
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Ingin Mengeliminasi Selisih Stok dan Mengetahui HPP Riil?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tim NewSystem siap mendiskusikan pemetaan alur kerja shop floor dan mendemonstrasikan sistem operasi pabrik yang terintegrasi langsung dengan pembukuan Anda.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-md"
                >
                  <span>Jadwalkan Konsultasi Gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar: Table of Contents & Sticky Consultation Card */}
          <aside className="lg:col-span-4 space-y-6">
            {headings.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-28 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-brand-blue" />
                  <span>Daftar Isi Artikel</span>
                </p>
                <nav className="space-y-2">
                  {headings.map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.id}`}
                      className="block text-xs text-slate-600 hover:text-brand-blue hover:translate-x-1 transition-all py-1 border-l-2 border-transparent hover:border-brand-blue pl-2 leading-snug"
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-700"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Indeks Blog</span>
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Artikel Terkait Lainnya
            </h2>
            <Link
              href="/blog"
              className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-blue font-bold text-[10px] border border-blue-100">
                      {art.categoryName || "Manufaktur"}
                    </span>
                    <span className="text-[11px]">{art.readingTimeMinutes} mnt baca</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-2 leading-snug">
                    <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{art.authorName || "Tim NewSystem"}</span>
                  <Link
                    href={`/blog/${art.slug}`}
                    className="font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Baca</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
