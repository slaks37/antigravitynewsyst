import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { posts, auditLogs } from "@/lib/db/schema";
import { eq, and, lte } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Cron secret verification
    const authHeader = req.headers.get("authorization");
    const configuredSecret = process.env.CRON_SECRET || "newsystem_dev_cron_secret_key";

    if (
      !authHeader ||
      (!authHeader.includes(configuredSecret) &&
        authHeader !== `Bearer ${configuredSecret}`)
    ) {
      return NextResponse.json(
        { error: "Autentikasi cron runner ditolak." },
        { status: 401 }
      );
    }

    const db = getDatabase();
    const now = new Date();

    // 2. Query all scheduled posts that have reached their scheduled time
    const duePosts = await db
      .select()
      .from(posts)
      .where(and(eq(posts.status, "SCHEDULED"), lte(posts.scheduledPublishAt, now)));

    const publishedIds: string[] = [];

    // 3. Publish each post
    for (const post of duePosts) {
      await db
        .update(posts)
        .set({
          status: "PUBLISHED",
          publishedAt: now,
          updatedAt: now,
        })
        .where(eq(posts.id, post.id));

      await db.insert(auditLogs).values({
        id: `audit-${crypto.randomUUID()}`,
        action: "POST_SCHEDULED_PUBLISHED",
        targetType: "POST",
        targetId: post.id,
        notes: `Artikel terjadwal otomatis dipublikasikan oleh cron runner: "${post.title}"`,
      });

      publishedIds.push(post.id);
    }

    return NextResponse.json({
      success: true,
      publishedCount: publishedIds.length,
      publishedIds,
      executedAt: now.toISOString(),
    });
  } catch (err) {
    console.error("Cron publish runner error:", err);
    return NextResponse.json(
      { error: "Gagal menjalankan publikasi terjadwal: " + (err as Error).message },
      { status: 500 }
    );
  }
}
