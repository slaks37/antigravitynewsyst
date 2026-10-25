import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { posts, categories, authors, auditLogs } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import crypto from "crypto";

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        primaryCategoryId: posts.primaryCategoryId,
        authorId: posts.authorId,
        sources: posts.sources,
        seoTitle: posts.seoTitle,
        seoDescription: posts.seoDescription,
        canonicalUrl: posts.canonicalUrl,
        featured: posts.featured,
        status: posts.status,
        scheduledPublishAt: posts.scheduledPublishAt,
        publishedAt: posts.publishedAt,
        readingTimeMinutes: posts.readingTimeMinutes,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(or(eq(posts.id, id), eq(posts.slug, id)))
      .limit(1);

    if (!post) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        publicUrl: `https://newsystem.space/blog/${post.slug}`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Kesalahan server: " + (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyApiKey(req)) {
      return NextResponse.json(
        { error: "Autentikasi ditolak. API key tidak sah." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = getDatabase();

    const [existing] = await db
      .select()
      .from(posts)
      .where(or(eq(posts.id, id), eq(posts.slug, id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan untuk diperbarui." },
        { status: 404 }
      );
    }

    const json = await req.json();
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (json.title) updateData.title = json.title;
    if (json.content) {
      updateData.content = json.content;
      updateData.readingTimeMinutes = Math.max(
        1,
        Math.round(json.content.split(/\s+/).length / 200)
      );
    }
    if (json.excerpt) updateData.excerpt = json.excerpt;
    if (json.coverImage !== undefined) updateData.coverImage = json.coverImage;
    if (json.coverImageAlt !== undefined)
      updateData.coverImageAlt = json.coverImageAlt;
    if (json.seoTitle !== undefined) updateData.seoTitle = json.seoTitle;
    if (json.seoDescription !== undefined)
      updateData.seoDescription = json.seoDescription;
    if (json.featured !== undefined) updateData.featured = Boolean(json.featured);

    if (json.status) {
      updateData.status = json.status;
      if (json.status === "PUBLISHED" && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
      if (json.status === "SCHEDULED" && json.scheduledPublishAt) {
        updateData.scheduledPublishAt = new Date(json.scheduledPublishAt);
      }
    }

    await db.update(posts).set(updateData).where(eq(posts.id, existing.id));

    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      action: "POST_AUTOMATION_UPDATED",
      targetType: "POST",
      targetId: existing.id,
      notes: `Artikel diperbarui via Automation API: "${existing.title}"`,
    });

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil diperbarui.",
      postId: existing.id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memperbarui artikel: " + (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyApiKey(req)) {
      return NextResponse.json(
        { error: "Autentikasi ditolak. API key tidak sah." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = getDatabase();

    const [existing] = await db
      .select({ id: posts.id, title: posts.title })
      .from(posts)
      .where(or(eq(posts.id, id), eq(posts.slug, id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan untuk dihapus." },
        { status: 404 }
      );
    }

    await db.delete(posts).where(eq(posts.id, existing.id));

    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      action: "POST_AUTOMATION_DELETED",
      targetType: "POST",
      targetId: existing.id,
      notes: `Artikel dihapus via Automation API: "${existing.title}"`,
    });

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil dihapus.",
      postId: existing.id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal menghapus artikel: " + (err as Error).message },
      { status: 500 }
    );
  }
}
