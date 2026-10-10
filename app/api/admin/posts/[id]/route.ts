import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { posts, postRevisions, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak sah." }, { status: 401 });
    }

    const db = getDatabase();
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!existingPost) {
      return NextResponse.json({ error: "Artikel tidak ditemukan." }, { status: 404 });
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
      status,
      scheduledPublishAt,
      changeNotes,
    } = json;

    // Check publishing permission
    let targetStatus = status || existingPost.status;
    if (
      targetStatus === "PUBLISHED" &&
      existingPost.status !== "PUBLISHED" &&
      !hasPermission(user.role, "posts:publish")
    ) {
      return NextResponse.json(
        { error: "Peran Anda tidak memiliki izin untuk mempublikasikan artikel secara langsung." },
        { status: 403 }
      );
    }

    const newRevisionNumber = (existingPost.revisionCount || 1) + 1;

    // 1. Update Post
    await db
      .update(posts)
      .set({
        title: title || existingPost.title,
        slug: slug ? slug.toLowerCase().trim().replace(/\s+/g, "-") : existingPost.slug,
        excerpt: excerpt || existingPost.excerpt,
        content: content || existingPost.content,
        coverImage: coverImage !== undefined ? coverImage : existingPost.coverImage,
        coverImageAlt: coverImageAlt !== undefined ? coverImageAlt : existingPost.coverImageAlt,
        primaryCategoryId: primaryCategoryId !== undefined ? primaryCategoryId : existingPost.primaryCategoryId,
        authorId: authorId !== undefined ? authorId : existingPost.authorId,
        featured: featured !== undefined ? Boolean(featured) : existingPost.featured,
        status: targetStatus,
        publishedAt:
          targetStatus === "PUBLISHED" && !existingPost.publishedAt
            ? new Date()
            : existingPost.publishedAt,
        scheduledPublishAt: scheduledPublishAt ? new Date(scheduledPublishAt) : null,
        readingTimeMinutes: content
          ? Math.max(1, Math.round(content.split(/\s+/).length / 200))
          : existingPost.readingTimeMinutes,
        revisionCount: newRevisionNumber,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));

    // 2. Save Revision History
    if (content || title) {
      await db.insert(postRevisions).values({
        id: `rev-${crypto.randomUUID()}`,
        postId: id,
        editorId: user.userId,
        revisionNumber: newRevisionNumber,
        title: title || existingPost.title,
        excerpt: excerpt || existingPost.excerpt,
        content: content || existingPost.content,
        changeNotes: changeNotes || `Pembaruan revisi ke-${newRevisionNumber}`,
      });
    }

    // 3. Audit Log
    await db.insert(auditLogs).values({
      id: `audit-${crypto.randomUUID()}`,
      userId: user.userId,
      userEmail: user.email,
      action: "POST_UPDATED",
      targetType: "POST",
      targetId: id,
      notes: `Artikel diperbarui: "${title || existingPost.title}" (Status: ${targetStatus}, Revisi: ${newRevisionNumber})`,
    });

    return NextResponse.json({
      success: true,
      revisionNumber: newRevisionNumber,
      status: targetStatus,
    });
  } catch (err) {
    console.error("Error updating post:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui artikel: " + (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "posts:delete")) {
      return NextResponse.json(
        { error: "Peran Anda tidak memiliki izin untuk menghapus artikel." },
        { status: 403 }
      );
    }

    const db = getDatabase();
    await db.delete(posts).where(eq(posts.id, id));

    await db.insert(auditLogs).values({
      id: `audit-${crypto.randomUUID()}`,
      userId: user.userId,
      userEmail: user.email,
      action: "POST_DELETED",
      targetType: "POST",
      targetId: id,
      notes: `Artikel dengan ID ${id} dihapus oleh ${user.email}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting post:", err);
    return NextResponse.json(
      { error: "Gagal menghapus artikel: " + (err as Error).message },
      { status: 500 }
    );
  }
}
