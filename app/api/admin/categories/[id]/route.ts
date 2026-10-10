import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { categories, posts, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateCategorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter").regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
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

    if (!hasPermission(user.role, "categories:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = updateCategorySchema.parse(body);

    const db = getDatabase();

    const [updated] = await db
      .update(categories)
      .set({
        name: validated.name,
        slug: validated.slug,
        description: validated.description || null,
        seoTitle: validated.seoTitle || null,
        seoDescription: validated.seoDescription || null,
        displayOrder: validated.displayOrder,
        active: validated.active,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "CATEGORY_UPDATED",
      targetType: "CATEGORY",
      targetId: id,
      notes: `Kategori ${validated.name} diperbarui oleh ${user.email}`,
    });

    return NextResponse.json({ category: updated });
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

    if (!hasPermission(user.role, "categories:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDatabase();

    // Check if any posts are linked to this category
    const linkedPosts = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.primaryCategoryId, id))
      .limit(1);

    if (linkedPosts.length > 0) {
      return NextResponse.json(
        { error: "Kategori tidak dapat dihapus karena masih digunakan oleh artikel aktif." },
        { status: 400 }
      );
    }

    await db.delete(categories).where(eq(categories.id, id));

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "CATEGORY_DELETED",
      targetType: "CATEGORY",
      targetId: id,
      notes: `Kategori ${id} dihapus oleh ${user.email}`,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
