import { getDatabase } from "@/lib/db";
import { posts, categories, authors, tags, postTags } from "@/lib/db/schema";
import { eq, desc, and, or, ilike, lte, inArray } from "drizzle-orm";
import {
  FALLBACK_POSTS,
  FALLBACK_CATEGORIES,
  FALLBACK_AUTHORS,
  FALLBACK_TAGS,
  BlogPost,
  BlogCategory,
  BlogAuthor,
  BlogTag,
} from "./blog-data";

// Curated articles support an unconfigured local checkout only. A configured
// production database is authoritative; an outage must not resurrect withdrawn posts.
function requireLocalFallback(error: unknown) {
  if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("user:password@localhost:5432")
  )
    throw error;
}

/**
 * Get all active categories (DB with safe fallback)
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  try {
    const db = getDatabase();
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        seoTitle: categories.seoTitle,
        seoDescription: categories.seoDescription,
        displayOrder: categories.displayOrder,
        active: categories.active,
      })
      .from(categories)
      .where(eq(categories.active, true))
      .orderBy(categories.displayOrder);

    if (result) {
      return result.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description || "",
        seoTitle: r.seoTitle || undefined,
        seoDescription: r.seoDescription || undefined,
        displayOrder: r.displayOrder,
        active: r.active,
      }));
    }
  } catch (err) {
    requireLocalFallback(err);
    // Graceful fallback if database is unseeded or table missing
  }

  return FALLBACK_CATEGORIES;
}

/**
 * Get single category by slug
 */
export async function getCategoryBySlug(
  slug: string,
): Promise<BlogCategory | null> {
  const allCats = await getAllCategories();
  return allCats.find((c) => c.slug === slug) || null;
}

/**
 * Get all authors
 */
export async function getAllAuthors(): Promise<BlogAuthor[]> {
  try {
    const db = getDatabase();
    const result = await db
      .select()
      .from(authors)
      .where(eq(authors.active, true));

    if (result) {
      return result.map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        email: a.email || "",
        role: a.role || "",
        bio: a.bio || "",
        avatarUrl: a.avatarUrl || "/brand/app-icon.png",
        active: a.active,
      }));
    }
  } catch (err) {
    requireLocalFallback(err);
    // Graceful fallback
  }

  return FALLBACK_AUTHORS;
}

/**
 * Get author by slug
 */
export async function getAuthorBySlug(
  slug: string,
): Promise<BlogAuthor | null> {
  const allAuthors = await getAllAuthors();
  return allAuthors.find((a) => a.slug === slug) || null;
}

/**
 * Get all tags
 */
export async function getAllTags(): Promise<BlogTag[]> {
  try {
    const db = getDatabase();
    const result = await db.select().from(tags);
    if (result) {
      return result.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
      }));
    }
  } catch (err) {
    requireLocalFallback(err);
    // Fallback
  }

  return FALLBACK_TAGS;
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string): Promise<BlogTag | null> {
  const all = await getAllTags();
  return all.find((t) => t.slug === slug) || null;
}

/**
 * Get all published posts with filtering, search, pagination, and fallback
 */
export async function getPublishedPosts(options?: {
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}): Promise<{ posts: BlogPost[]; totalCount: number }> {
  const {
    categorySlug,
    tagSlug,
    authorSlug,
    searchQuery,
    limit,
    offset = 0,
  } = options || {};

  try {
    const db = getDatabase();
    const conditions = [
      eq(posts.status, "PUBLISHED"),
      lte(posts.publishedAt, new Date()),
    ];

    if (tagSlug) {
      conditions.push(
        inArray(
          posts.id,
          db
            .select({ id: postTags.postId })
            .from(postTags)
            .innerJoin(tags, eq(postTags.tagId, tags.id))
            .where(eq(tags.slug, tagSlug)),
        ),
      );
    }

    if (categorySlug) {
      const cat = await getCategoryBySlug(categorySlug);
      if (!cat) return { posts: [], totalCount: 0 };
      if (cat) {
        conditions.push(eq(posts.primaryCategoryId, cat.id));
      }
    }

    if (authorSlug) {
      const author = await getAuthorBySlug(authorSlug);
      if (!author) return { posts: [], totalCount: 0 };
      if (author) {
        conditions.push(eq(posts.authorId, author.id));
      }
    }

    if (searchQuery && searchQuery.trim()) {
      const term = `%${searchQuery.trim()}%`;
      conditions.push(
        or(
          ilike(posts.title, term),
          ilike(posts.excerpt, term),
          ilike(posts.content, term),
        )!,
      );
    }

    const dbQuery = db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        coverImage: posts.coverImage,
        coverImageAlt: posts.coverImageAlt,
        primaryCategoryId: posts.primaryCategoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorId: posts.authorId,
        authorName: authors.name,
        authorSlug: authors.slug,
        authorRole: authors.role,
        authorAvatar: authors.avatarUrl,
        featured: posts.featured,
        status: posts.status,
        publishedAt: posts.publishedAt,
        updatedAt: posts.updatedAt,
        readingTimeMinutes: posts.readingTimeMinutes,
        seoTitle: posts.seoTitle,
        seoDescription: posts.seoDescription,
        canonicalUrl: posts.canonicalUrl,
        ogImage: posts.ogImage,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
      .leftJoin(authors, eq(posts.authorId, authors.id))
      .where(and(...conditions))
      .orderBy(desc(posts.publishedAt), desc(posts.id));

    const dbResults = await dbQuery;

    if (dbResults) {
      let filtered = dbResults.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage || undefined,
        coverImageAlt: p.coverImageAlt || undefined,
        primaryCategoryId: p.primaryCategoryId || "",
        categoryName: p.categoryName || undefined,
        categorySlug: p.categorySlug || undefined,
        authorId: p.authorId || "",
        authorName: p.authorName || undefined,
        authorSlug: p.authorSlug || undefined,
        authorRole: p.authorRole || undefined,
        authorAvatar: p.authorAvatar || undefined,
        featured: p.featured,
        status: (p.status as BlogPost["status"]) || "PUBLISHED",
        publishedAt: p.publishedAt
          ? new Date(p.publishedAt).toISOString()
          : new Date().toISOString(),
        updatedAt: p.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : undefined,
        readingTimeMinutes: p.readingTimeMinutes || 5,
        seoTitle: p.seoTitle || undefined,
        seoDescription: p.seoDescription || undefined,
        canonicalUrl: p.canonicalUrl || undefined,
        ogImage: p.ogImage || undefined,
      }));

      const totalCount = filtered.length;
      if (limit) {
        filtered = filtered.slice(offset, offset + limit);
      }
      return { posts: filtered, totalCount };
    }
  } catch (err) {
    requireLocalFallback(err);
    // Database query failed or table does not exist
  }

  // Fallback to in-memory curated data
  let filtered = FALLBACK_POSTS.filter(
    (p) => p.status === "PUBLISHED" && new Date(p.publishedAt) <= new Date(),
  ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  if (categorySlug) {
    filtered = filtered.filter((p) => p.categorySlug === categorySlug);
  }

  if (authorSlug) {
    filtered = filtered.filter((p) => p.authorSlug === authorSlug);
  }

  if (tagSlug) {
    filtered = filtered.filter((p) => p.tags?.includes(tagSlug));
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q),
    );
  }

  const totalCount = filtered.length;
  if (limit) {
    filtered = filtered.slice(offset, offset + limit);
  }

  return { posts: filtered, totalCount };
}

/**
 * Get single post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db = getDatabase();
    const [dbPost] = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        coverImage: posts.coverImage,
        coverImageAlt: posts.coverImageAlt,
        primaryCategoryId: posts.primaryCategoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorId: posts.authorId,
        authorName: authors.name,
        authorSlug: authors.slug,
        authorRole: authors.role,
        authorAvatar: authors.avatarUrl,
        featured: posts.featured,
        status: posts.status,
        publishedAt: posts.publishedAt,
        updatedAt: posts.updatedAt,
        readingTimeMinutes: posts.readingTimeMinutes,
        seoTitle: posts.seoTitle,
        seoDescription: posts.seoDescription,
        canonicalUrl: posts.canonicalUrl,
        ogImage: posts.ogImage,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.primaryCategoryId, categories.id))
      .leftJoin(authors, eq(posts.authorId, authors.id))
      .where(
        and(
          eq(posts.slug, slug),
          eq(posts.status, "PUBLISHED"),
          lte(posts.publishedAt, new Date()),
        ),
      )
      .limit(1);

    if (dbPost) {
      return {
        id: dbPost.id,
        title: dbPost.title,
        slug: dbPost.slug,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        coverImage: dbPost.coverImage || undefined,
        coverImageAlt: dbPost.coverImageAlt || undefined,
        primaryCategoryId: dbPost.primaryCategoryId || "",
        categoryName: dbPost.categoryName || undefined,
        categorySlug: dbPost.categorySlug || undefined,
        authorId: dbPost.authorId || "",
        authorName: dbPost.authorName || undefined,
        authorSlug: dbPost.authorSlug || undefined,
        authorRole: dbPost.authorRole || undefined,
        authorAvatar: dbPost.authorAvatar || undefined,
        featured: dbPost.featured,
        status: "PUBLISHED",
        publishedAt: dbPost.publishedAt
          ? new Date(dbPost.publishedAt).toISOString()
          : new Date().toISOString(),
        updatedAt: dbPost.updatedAt
          ? new Date(dbPost.updatedAt).toISOString()
          : undefined,
        readingTimeMinutes: dbPost.readingTimeMinutes || 5,
        seoTitle: dbPost.seoTitle || undefined,
        seoDescription: dbPost.seoDescription || undefined,
        canonicalUrl: dbPost.canonicalUrl || undefined,
        ogImage: dbPost.ogImage || undefined,
      };
    }
    return null;
  } catch (err) {
    requireLocalFallback(err);
  }

  const fallback = FALLBACK_POSTS.find(
    (p) =>
      p.slug === slug &&
      p.status === "PUBLISHED" &&
      new Date(p.publishedAt) <= new Date(),
  );
  return fallback || null;
}

/**
 * Get featured post
 */
export async function getFeaturedPost(): Promise<BlogPost | null> {
  const { posts: allPosts } = await getPublishedPosts({ limit: 10 });
  return allPosts.find((p) => p.featured) || allPosts[0] || null;
}

/**
 * Get latest articles (e.g. for homepage)
 */
export async function getLatestArticles(
  limit: number = 3,
): Promise<BlogPost[]> {
  const { posts: allPosts } = await getPublishedPosts({ limit });
  return allPosts;
}

/**
 * Get related posts for an article
 */
export async function getRelatedPosts(
  currentSlug: string,
  categoryId?: string,
  limit: number = 3,
): Promise<BlogPost[]> {
  const { posts: allPosts } = await getPublishedPosts({ limit: 10 });
  const otherPosts = allPosts.filter((p) => p.slug !== currentSlug);

  if (categoryId) {
    const sameCategory = otherPosts.filter(
      (p) => p.primaryCategoryId === categoryId,
    );
    if (sameCategory.length >= limit) {
      return sameCategory.slice(0, limit);
    }
    const remainder = otherPosts.filter(
      (p) => p.primaryCategoryId !== categoryId,
    );
    return [...sameCategory, ...remainder].slice(0, limit);
  }

  return otherPosts.slice(0, limit);
}
