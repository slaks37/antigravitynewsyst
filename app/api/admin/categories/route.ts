import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { categories, auditLogs } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan strip"),
  description: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.displayOrder));

    return NextResponse.json({ categories: allCategories });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user.role, "categories:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = categorySchema.parse(body);

    const db = getDatabase();
    const id = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const [newCategory] = await db
      .insert(categories)
      .values({
        id,
        name: validated.name,
        slug: validated.slug,
        description: validated.description || null,
        seoTitle: validated.seoTitle || null,
        seoDescription: validated.seoDescription || null,
        displayOrder: validated.displayOrder,
        active: validated.active,
      })
      .returning();

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "CATEGORY_CREATED",
      targetType: "CATEGORY",
      targetId: id,
      notes: `Kategori ${validated.name} dibuat oleh ${user.email}`,
    });

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
