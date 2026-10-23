import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/data/blog-service";

export const dynamic = "force-dynamic";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
const cdata = (value: string) => value.replace(/\]\]>/g, "]]]]><![CDATA[>");

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";

  const { posts: publishedPosts } = await getPublishedPosts({ limit: 50 });

  const rssItems = publishedPosts
    .map((post) => {
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();
      const link = `${siteUrl}/blog/${post.slug}`;

      return `
    <item>
      <title><![CDATA[${cdata(post.title)}]]></title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description><![CDATA[${cdata(post.excerpt)}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${cdata(post.authorName || "Tim NewSystem")}]]></author>
      <category><![CDATA[${cdata(post.categoryName || "Manufaktur")}]]></category>
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
