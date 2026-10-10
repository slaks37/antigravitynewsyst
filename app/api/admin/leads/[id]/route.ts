import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { leads, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "leads:update")) {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const { status, notes } = await req.json();
    const db = getDatabase();

    await db
      .update(leads)
      .set({
        status: status || undefined,
        notes: notes !== undefined ? notes : undefined,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id));

    await db.insert(auditLogs).values({
      id: `audit-${crypto.randomUUID()}`,
      userId: user.userId,
      userEmail: user.email,
      action: "LEAD_UPDATED",
      targetType: "LEAD",
      targetId: id,
      notes: `Status prospek diperbarui menjadi "${status}" oleh ${user.email}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memperbarui prospek: " + (err as Error).message },
      { status: 500 }
    );
  }
}
