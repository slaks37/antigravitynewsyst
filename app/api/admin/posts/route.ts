import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { posts, postRevisions, auditLogs } from "@/lib/db/schema";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak sah." }, { status: 401 });
    }

    if (!hasPermission(user.role, "posts:create")) {
      return NextResponse.json(
        { error: "Peran Anda tidak memiliki izin untuk membuat artikel." },
        { status: 403 }
      );
    }

    const json = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      coverImageAlt,
      primaryCategoryId,
      authorId,
      featured,
      status = "DRAFT",
      scheduledPublishAt,
    } = json;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Judul, slug, dan isi konten artikel wajib diisi." },
        { status: 400 }
      );
    }

    // Role-based publishing check: Author cannot directly set to PUBLISHED
    let targetStatus = status;
    if (targetStatus === "PUBLISHED" && !hasPermission(user.role, "posts:publish")) {
      targetStatus = "IN_REVIEW";
    }

    const db = getDatabase();
    const postId = `post-${crypto.randomUUID()}`;

    // 1. Insert Post
    await db.insert(posts).values({
      id: postId,
      title,
      slug: slug.toLowerCase().trim().replace(/\s+/g, "-"),
      excerpt: excerpt || title,
      content,
      coverImage: coverImage || null,
      coverImageAlt: coverImageAlt || null,
      primaryCategoryId: primaryCategoryId || null,
      authorId: authorId || null,
      featured: Boolean(featured),
      status: targetStatus,
      publishedAt: targetStatus === "PUBLISHED" ? new Date() : null,
      scheduledPublishAt: scheduledPublishAt ? new Date(scheduledPublishAt) : null,
      readingTimeMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
      revisionCount: 1,
    });

    // 2. Insert Initial Revision
    await db.insert(postRevisions).values({
      id: `rev-${crypto.randomUUID()}`,
      postId,
      editorId: user.userId,
      revisionNumber: 1,
      title,
      excerpt: excerpt || title,
      content,
      changeNotes: "Pembuatan draf awal artikel.",
    });

    // 3. Audit Log
    await db.insert(auditLogs).values({
      id: `audit-${crypto.randomUUID()}`,
      userId: user.userId,
      userEmail: user.email,
      action: "POST_CREATED",
      targetType: "POST",
      targetId: postId,
      notes: `Artikel baru dibuat: "${title}" (Status: ${targetStatus})`,
    });

    return NextResponse.json({
      success: true,
      postId,
      status: targetStatus,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan artikel ke database: " + (err as Error).message },
      { status: 500 }
    );
  }
}
