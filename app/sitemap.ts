import { MetadataRoute } from "next";
import { MODULES_MAP } from "@/lib/data/modules";
import { SOLUTIONS_MAP } from "@/lib/data/solutions";
import {
  getPublishedPosts,
  getAllCategories,
  getAllAuthors,
  getAllTags,
} from "@/lib/data/blog-service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";

  // 1. Static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/platform`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/copilot`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/modules`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/solutions`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${siteUrl}/design-partner`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // 2. Dynamic modules
  const moduleRoutes: MetadataRoute.Sitemap = Object.keys(MODULES_MAP).map(
    (slug) => ({
      url: `${siteUrl}/modules/${slug}`,

      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  // 3. Dynamic solutions
  const solutionRoutes: MetadataRoute.Sitemap = Object.keys(SOLUTIONS_MAP).map(
    (slug) => ({
      url: `${siteUrl}/solutions/${slug}`,

      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  // 4. Dynamic blog articles, categories, authors, and tags
  try {
    const [{ posts: allPosts }, allCategories, allAuthors, allTags] =
      await Promise.all([
        getPublishedPosts(),
        getAllCategories(),
        getAllAuthors(),
        getAllTags(),
      ]);

    const articleRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : new Date(post.publishedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((cat) => ({
      url: `${siteUrl}/blog/category/${cat.slug}`,

      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const authorRoutes: MetadataRoute.Sitemap = allAuthors.map((author) => ({
      url: `${siteUrl}/blog/author/${author.slug}`,

      changeFrequency: "monthly",
      priority: 0.5,
    }));

    const tagRoutes: MetadataRoute.Sitemap = allTags.map((tag) => ({
      url: `${siteUrl}/blog/tag/${tag.slug}`,

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
    throw err;
  }
}
