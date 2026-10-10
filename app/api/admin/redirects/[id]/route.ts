import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { redirects, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const redirectSchema = z.object({
  sourcePath: z.string().startsWith("/", "Source path harus dimulai dengan /"),
  targetPath: z.string().min(1, "Target path harus diisi"),
  statusCode: z.number().int().refine((val) => val === 301 || val === 302),
  active: z.boolean(),
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

    if (!hasPermission(user.role, "redirects:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = redirectSchema.parse(body);

    const db = getDatabase();
    const [updated] = await db
      .update(redirects)
      .set({
        sourcePath: validated.sourcePath,
        targetPath: validated.targetPath,
        statusCode: validated.statusCode,
        active: validated.active,
      })
      .where(eq(redirects.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Aturan redirect tidak ditemukan" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "REDIRECT_UPDATED",
      targetType: "REDIRECT",
      targetId: id,
      notes: `Aturan redirect ${validated.sourcePath} diperbarui oleh ${user.email}`,
    });

    return NextResponse.json({ redirect: updated });
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

    if (!hasPermission(user.role, "redirects:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDatabase();
    await db.delete(redirects).where(eq(redirects.id, id));

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "REDIRECT_DELETED",
      targetType: "REDIRECT",
      targetId: id,
      notes: `Aturan redirect ${id} dihapus oleh ${user.email}`,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
