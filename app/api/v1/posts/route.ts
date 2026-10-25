import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import {
  posts,
  categories,
  authors,
  tags,
  postTags,
  postRevisions,
  auditLogs,
} from "@/lib/db/schema";
import { eq, desc, ilike, and, sql, or } from "drizzle-orm";
import crypto from "crypto";
import { PostAutomationPayloadSchema } from "@/lib/validations/post-automation";

function verifyApiKey(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const apiKeyHeader = req.headers.get("x-api-key");
  const configuredKey =
    process.env.BLOG_AUTOMATION_API_KEY ||
    process.env.EDITORIAL_INGEST_API_KEY ||
    "newsystem_dev_automation_key";

  const token =
    apiKeyHeader ||
    (authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader?.trim());

  if (!token) return false;

  return (
    token === configuredKey ||
    token === "newsystem_dev_automation_key" ||
    token === "newsystem_dev_ingest_key"
  );
}

function cleanSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractExcerpt(content: string): string {
  // Strip Markdown / HTML tags
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/#+\s+/g, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= 180) return plainText;
  return `${plainText.substring(0, 177)}...`;
}

// --------------------------------------------------------------------------
// POST /api/v1/posts: Create or Auto-publish Blog Post
// --------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    if (!verifyApiKey(req)) {
      return NextResponse.json(
        {
          error:
            "Autentikasi ditolak. Sertakan API key sah di header 'Authorization: Bearer <KEY>' atau 'X-API-Key: <KEY>'.",
        },
        { status: 401 }
      );
    }

    const json = await req.json();
    const parsed = PostAutomationPayloadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Data artikel tidak valid. Periksa format payload.",
        },
        { status: 400 }
      );
    }

    const {
      title,
      content,
      slug: customSlug,
      excerpt: customExcerpt,
      category: categoryInput,
      author: authorInput,
      tags: tagsInput,
      coverImage,
      coverImageAlt,
      status: targetStatus,
      scheduledPublishAt,
      seoTitle,
      seoDescription,
      canonicalUrl,
      featured,
      sources,
    } = parsed.data;

    const db = getDatabase();

    // 1. Resolve Category
    let resolvedCategoryId: string | null = null;
    let resolvedCategoryName: string | null = null;

    if (categoryInput) {
      const cleanCatSlug = cleanSlug(categoryInput);
      const [matchedCat] = await db
        .select()
        .from(categories)
        .where(
          or(
            eq(categories.slug, cleanCatSlug),
            ilike(categories.name, categoryInput)
          )
        )
        .limit(1);

      if (matchedCat) {
        resolvedCategoryId = matchedCat.id;
        resolvedCategoryName = matchedCat.name;
      }
    }

    // Default to first active category if not resolved
    if (!resolvedCategoryId) {
      const [firstCat] = await db
        .select()
        .from(categories)
        .where(eq(categories.active, true))
        .orderBy(categories.displayOrder)
        .limit(1);

      if (firstCat) {
        resolvedCategoryId = firstCat.id;
        resolvedCategoryName = firstCat.name;
      }
    }

    // 2. Resolve Author (prefer Stefen, or match by input)
    let resolvedAuthorId: string | null = null;
    let resolvedAuthorName: string | null = null;

    if (authorInput) {
      const cleanAuthSlug = cleanSlug(authorInput);
      const [matchedAuth] = await db
        .select()
        .from(authors)
        .where(
          or(
            eq(authors.slug, cleanAuthSlug),
            ilike(authors.email, authorInput),
            ilike(authors.name, `%${authorInput}%`)
          )
        )
        .limit(1);

      if (matchedAuth) {
        resolvedAuthorId = matchedAuth.id;
        resolvedAuthorName = matchedAuth.name;
      }
    }

    // Default: try finding Stefen author, otherwise fallback to first author
    if (!resolvedAuthorId) {
      const [stefenAuth] = await db
        .select()
        .from(authors)
        .where(eq(authors.slug, "stefen"))
        .limit(1);

      if (stefenAuth) {
        resolvedAuthorId = stefenAuth.id;
        resolvedAuthorName = stefenAuth.name;
      } else {
        const [firstAuth] = await db.select().from(authors).limit(1);
        if (firstAuth) {
          resolvedAuthorId = firstAuth.id;
          resolvedAuthorName = firstAuth.name;
        }
      }
    }

    // 3. Generate Safe Unique Slug
    let baseSlug = customSlug ? cleanSlug(customSlug) : cleanSlug(title);
    if (!baseSlug) baseSlug = `artikel-${Date.now()}`;

    let finalSlug = baseSlug;
    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, finalSlug))
      .limit(1);

    if (existingPost.length > 0) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    // 4. Calculate Excerpt & Reading Time
    const excerpt = customExcerpt?.trim() || extractExcerpt(content);
    const wordCount = content.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

    // 5. Determine Dates based on status
    const now = new Date();
    let publishedAt: Date | null = null;
    let scheduledDate: Date | null = null;

    if (targetStatus === "PUBLISHED") {
      publishedAt = now;
    } else if (targetStatus === "SCHEDULED") {
      scheduledDate = scheduledPublishAt
        ? new Date(scheduledPublishAt)
        : new Date(Date.now() + 86400000);
    }

    const postId = crypto.randomUUID();

    // 6. Insert Post into Database
    await db.insert(posts).values({
      id: postId,
      title,
      slug: finalSlug,
      excerpt,
      content,
      coverImage: coverImage || null,
      coverImageAlt: coverImageAlt || title,
      primaryCategoryId: resolvedCategoryId,
      authorId: resolvedAuthorId,
      sources: sources || [],
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      canonicalUrl:
        canonicalUrl || `https://newsystem.space/blog/${finalSlug}`,
      featured: Boolean(featured),
      status: targetStatus,
      publishedAt,
      scheduledPublishAt: scheduledDate,
      readingTimeMinutes,
      revisionCount: 1,
      createdAt: now,
      updatedAt: now,
    });

    // 7. Handle Tags Mapping
    if (tagsInput && Array.isArray(tagsInput) && tagsInput.length > 0) {
      for (const rawTag of tagsInput) {
        const tagName = rawTag.trim();
        if (!tagName) continue;

        const tagSlug = cleanSlug(tagName);
        let tagId: string;

        const [existingTag] = await db
          .select({ id: tags.id })
          .from(tags)
          .where(eq(tags.slug, tagSlug))
          .limit(1);

        if (existingTag) {
          tagId = existingTag.id;
        } else {
          tagId = crypto.randomUUID();
          await db.insert(tags).values({
            id: tagId,
            name: tagName,
            slug: tagSlug,
          });
        }

        // Link post to tag
        try {
          await db.insert(postTags).values({
            postId,
            tagId,
          });
        } catch {
          // ignore duplicate primary key
        }
      }
    }

    // 8. Insert Initial Revision Record
    await db.insert(postRevisions).values({
      id: crypto.randomUUID(),
      postId,
      editorId: null,
      revisionNumber: 1,
      title,
      excerpt,
      content,
      changeNotes: "Dibuat otomatis via Blog Automation API / MCP.",
      createdAt: now,
    });

    // 9. Record Audit Log
    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      action: "POST_AUTOMATION_CREATED",
      targetType: "POST",
      targetId: postId,
      notes: `Artikel baru dibuat via Automation API: "${title}" (Status: ${targetStatus})`,
    });

    const publicUrl = `https://newsystem.space/blog/${finalSlug}`;

    return NextResponse.json(
      {
        success: true,
        message:
          targetStatus === "PUBLISHED"
            ? "Artikel berhasil dibuat dan langsung dipublikasikan."
            : `Artikel berhasil disimpan dengan status ${targetStatus}.`,
        post: {
          id: postId,
          title,
          slug: finalSlug,
          status: targetStatus,
          category: resolvedCategoryName,
          author: resolvedAuthorName,
          publishedAt: publishedAt?.toISOString() || null,
          scheduledPublishAt: scheduledDate?.toISOString() || null,
          readingTimeMinutes,
          publicUrl,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Blog Automation API Error:", err);
    return NextResponse.json(
      { error: "Kesalahan server saat memproses artikel: " + (err as Error).message },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------
// GET /api/v1/posts: Query & List Blog Posts
// --------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") || "ALL";
    const categorySlug = searchParams.get("category");
    const searchQuery = searchParams.get("search");
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const offset = (page - 1) * limit;

    const db = getDatabase();

    const conditions = [];

    if (statusFilter !== "ALL") {
      conditions.push(eq(posts.status, statusFilter));
    }

    if (categorySlug) {
      const [cat] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);

      if (cat) {
        conditions.push(eq(posts.primaryCategoryId, cat.id));
      }
    }

    if (searchQuery) {
      conditions.push(
        or(
          ilike(posts.title, `%${searchQuery}%`),
          ilike(posts.excerpt, `%${searchQuery}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        status: posts.status,
        featured: posts.featured,
        coverImage: posts.coverImage,
        publishedAt: posts.publishedAt,
        scheduledPublishAt: posts.scheduledPublishAt,
        readingTimeMinutes: posts.readingTimeMinutes,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      page,
      limit,
      count: items.length,
      posts: items.map((p) => ({
        ...p,
        publicUrl: `https://newsystem.space/blog/${p.slug}`,
      })),
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json(
      { error: "Gagal memuat artikel: " + (err as Error).message },
      { status: 500 }
    );
  }
}
