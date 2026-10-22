import { MetadataRoute } from "next";
import { getDatabase } from "@/lib/db";
import { posts, categories, authors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { MODULES_MAP } from "@/lib/data/modules";
import { SOLUTIONS_MAP } from "@/lib/data/solutions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";
  const currentDate = new Date();

  // Static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: currentDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/platform`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/copilot`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/modules`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/solutions`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/design-partner`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: currentDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/privacy`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic modules
  const moduleRoutes: MetadataRoute.Sitemap = Object.keys(MODULES_MAP).map((slug) => ({
    url: `${siteUrl}/modules/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic solutions
  const solutionRoutes: MetadataRoute.Sitemap = Object.keys(SOLUTIONS_MAP).map((slug) => ({
    url: `${siteUrl}/solutions/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Query articles from PostgreSQL
  let articleRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const db = getDatabase();
    const publishedArticles = await db
      .select({ slug: posts.slug, updatedAt: posts.updatedAt })
      .from(posts)
      .where(eq(posts.status, "PUBLISHED"));

    articleRoutes = publishedArticles.map((art) => ({
      url: `${siteUrl}/blog/${art.slug}`,
      lastModified: art.updatedAt || currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const activeCategories = await db
      .select({ slug: categories.slug })
      .from(categories)
      .where(eq(categories.active, true));

    categoryRoutes = activeCategories.map((c) => ({
      url: `${siteUrl}/blog/category/${c.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const activeAuthors = await db
      .select({ slug: authors.slug })
      .from(authors)
      .where(eq(authors.active, true));

    const authorRoutes: MetadataRoute.Sitemap = activeAuthors.map((a) => ({
      url: `${siteUrl}/blog/author/${a.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

    return [
      ...staticRoutes,
      ...moduleRoutes,
      ...solutionRoutes,
      ...articleRoutes,
      ...categoryRoutes,
      ...authorRoutes,
    ];
  } catch (err) {
    console.error("Error generating sitemap dynamic routes:", err);
  }

  return [...staticRoutes, ...moduleRoutes, ...solutionRoutes, ...articleRoutes, ...categoryRoutes];
}
