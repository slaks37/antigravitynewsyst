import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { media, auditLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const mediaItems = await db.select().from(media).orderBy(desc(media.createdAt));

    return NextResponse.json({ media: mediaItems });
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

    if (!hasPermission(user.role, "media:upload")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const attribution = (formData.get("attribution") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan dalam request" }, { status: 400 });
    }

    // Prepare uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitize filename
    const ext = path.extname(file.name) || ".bin";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${baseName}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Write file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;
    const mediaId = `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const db = getDatabase();
    const [inserted] = await db
      .insert(media)
      .values({
        id: mediaId,
        filename: uniqueFilename,
        originalName: file.name,
        fileUrl,
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
        altText: altText || null,
        caption: caption || null,
        attribution: attribution || null,
        uploaderId: user.userId,
      })
      .returning();

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "MEDIA_UPLOADED",
      targetType: "MEDIA",
      targetId: mediaId,
      notes: `Media ${file.name} diunggah oleh ${user.email} (${Math.round(file.size / 1024)} KB)`,
    });

    return NextResponse.json({ media: inserted }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
