import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { authors, posts, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateAuthorSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter").regex(/^[a-z0-9-]+$/),
  email: z.string().email().optional().nullable(),
  role: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user.role, "authors:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = updateAuthorSchema.parse(body);

    const db = getDatabase();

    const [updated] = await db
      .update(authors)
      .set({
        name: validated.name,
        slug: validated.slug,
        email: validated.email || null,
        role: validated.role || null,
        bio: validated.bio || null,
        avatarUrl: validated.avatarUrl || null,
        active: validated.active,
        updatedAt: new Date(),
      })
      .where(eq(authors.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Penulis tidak ditemukan" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "AUTHOR_UPDATED",
      targetType: "AUTHOR",
      targetId: id,
      notes: `Profil penulis ${validated.name} diperbarui oleh ${user.email}`,
    });

    return NextResponse.json({ author: updated });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user.role, "authors:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDatabase();

    const linkedPosts = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.authorId, id))
      .limit(1);

    if (linkedPosts.length > 0) {
      return NextResponse.json(
        { error: "Penulis tidak dapat dihapus karena memiliki artikel terhubung." },
        { status: 400 }
      );
    }

    await db.delete(authors).where(eq(authors.id, id));

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "AUTHOR_DELETED",
      targetType: "AUTHOR",
      targetId: id,
      notes: `Penulis ${id} dihapus oleh ${user.email}`,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
