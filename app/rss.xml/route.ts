import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { posts, authors, categories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.id";
  const db = getDatabase();

  const publishedPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      authorName: authors.name,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(authors, eq(posts.authorId, authors.id))
    .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
    .where(eq(posts.status, "PUBLISHED"))
    .orderBy(desc(posts.publishedAt))
    .limit(50);

  const rssItems = publishedPosts
    .map((post) => {
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();
      const link = `${siteUrl}/blog/${post.slug}`;

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${post.authorName || "Tim NewSystem"}]]></author>
      <category><![CDATA[${post.categoryName || "Manufaktur"}]]></category>
    </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NewSystem Blog &amp; Wawasan Manufaktur</title>
    <link>${siteUrl}/blog</link>
    <description>Artikel dan wawasan operasional sistem manufaktur modern, ERP, MES, dan kalkulasi HPP aktual dari NewSystem.</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
