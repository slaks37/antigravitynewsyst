import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { siteSettings, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CAPABILITY_STATUSES } from "@/lib/capabilities/status";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const settingsList = await db.select().from(siteSettings);

    const settingsMap: Record<string, unknown> = {};
    for (const item of settingsList) {
      settingsMap[item.key] = item.value;
    }

    return NextResponse.json({
      settings: settingsMap,
      defaultCapabilities: CAPABILITY_STATUSES,
    });
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

    if (!hasPermission(user.role, "site_settings:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Kunci pengaturan (key) wajib diisi" }, { status: 400 });
    }

    const db = getDatabase();
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value });
    }

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "SETTINGS_UPDATED",
      targetType: "SITE_SETTINGS",
      targetId: key,
      notes: `Pengaturan [${key}] diperbarui oleh ${user.email}`,
      metadata: typeof value === "object" ? (value as Record<string, unknown>) : { value },
    });

    return NextResponse.json({ success: true, key, value });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
