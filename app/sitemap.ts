import { MetadataRoute } from "next";
import { MODULES_MAP } from "@/lib/data/modules";
import { SOLUTIONS_MAP } from "@/lib/data/solutions";
import {
  getPublishedPosts,
  getAllCategories,
  getAllAuthors,
  getAllTags,
} from "@/lib/data/blog-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";
  const currentDate = new Date();

  // 1. Static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: currentDate, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/platform`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/copilot`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/modules`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/solutions`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: currentDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/design-partner`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/privacy`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  // 2. Dynamic modules
  const moduleRoutes: MetadataRoute.Sitemap = Object.keys(MODULES_MAP).map((slug) => ({
    url: `${siteUrl}/modules/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Dynamic solutions
  const solutionRoutes: MetadataRoute.Sitemap = Object.keys(SOLUTIONS_MAP).map((slug) => ({
    url: `${siteUrl}/solutions/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 4. Dynamic blog articles, categories, authors, and tags
  try {
    const [{ posts: allPosts }, allCategories, allAuthors, allTags] = await Promise.all([
      getPublishedPosts(),
      getAllCategories(),
      getAllAuthors(),
      getAllTags(),
    ]);

    const articleRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((cat) => ({
      url: `${siteUrl}/blog/category/${cat.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const authorRoutes: MetadataRoute.Sitemap = allAuthors.map((author) => ({
      url: `${siteUrl}/blog/author/${author.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

    const tagRoutes: MetadataRoute.Sitemap = allTags.map((tag) => ({
      url: `${siteUrl}/blog/tag/${tag.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...moduleRoutes,
      ...solutionRoutes,
      ...articleRoutes,
      ...categoryRoutes,
      ...authorRoutes,
      ...tagRoutes,
    ];
  } catch (err) {
    console.error("Error generating dynamic routes for sitemap:", err);
    return [...staticRoutes, ...moduleRoutes, ...solutionRoutes];
  }
}
