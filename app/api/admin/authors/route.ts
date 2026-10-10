import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { authors, auditLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";

const authorSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter").regex(/^[a-z0-9-]+$/),
  email: z.string().email().optional().nullable(),
  role: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const allAuthors = await db.select().from(authors).orderBy(desc(authors.createdAt));

    return NextResponse.json({ authors: allAuthors });
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

    if (!hasPermission(user.role, "authors:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = authorSchema.parse(body);

    const db = getDatabase();
    const id = `auth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const [newAuthor] = await db
      .insert(authors)
      .values({
        id,
        name: validated.name,
        slug: validated.slug,
        email: validated.email || null,
        role: validated.role || null,
        bio: validated.bio || null,
        avatarUrl: validated.avatarUrl || null,
        active: validated.active,
      })
      .returning();

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "AUTHOR_CREATED",
      targetType: "AUTHOR",
      targetId: id,
      notes: `Penulis ${validated.name} ditambahkan oleh ${user.email}`,
    });

    return NextResponse.json({ author: newAuthor }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
