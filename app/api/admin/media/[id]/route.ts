import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { media, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

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

    if (!hasPermission(user.role, "media:delete")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDatabase();
    const [existing] = await db.select().from(media).where(eq(media.id, id)).limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Media tidak ditemukan" }, { status: 404 });
    }

    // Attempt to unlink local file if in /uploads/
    if (existing.fileUrl.startsWith("/uploads/")) {
      const localPath = path.join(process.cwd(), "public", existing.fileUrl);
      try {
        await fs.unlink(localPath);
      } catch {
        // file might not exist or already removed
      }
    }

    await db.delete(media).where(eq(media.id, id));

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "MEDIA_DELETED",
      targetType: "MEDIA",
      targetId: id,
      notes: `Media ${existing.filename} dihapus oleh ${user.email}`,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
