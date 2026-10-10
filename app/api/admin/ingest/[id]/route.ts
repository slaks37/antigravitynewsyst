import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { contentIngestRecords, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["QUEUED", "PROCESSED", "REJECTED", "DUPLICATE"]),
  notes: z.string().optional(),
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

    if (!hasPermission(user.role, "ingest:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = updateSchema.parse(body);

    const db = getDatabase();
    const [updated] = await db
      .update(contentIngestRecords)
      .set({
        status: validated.status,
      })
      .where(eq(contentIngestRecords.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Catatan ingest tidak ditemukan" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "INGEST_STATUS_UPDATED",
      targetType: "CONTENT_INGEST",
      targetId: id,
      notes: `Catatan ingest ${updated.normalizedTitle} diubah menjadi ${validated.status} oleh ${user.email}`,
    });

    return NextResponse.json({ record: updated });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
