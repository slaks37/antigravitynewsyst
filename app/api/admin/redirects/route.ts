import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDatabase } from "@/lib/db";
import { redirects, auditLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";

const redirectSchema = z.object({
  sourcePath: z.string().startsWith("/", "Source path harus dimulai dengan /"),
  targetPath: z.string().min(1, "Target path harus diisi"),
  statusCode: z.number().int().refine((val) => val === 301 || val === 302, {
    message: "Status code harus 301 (Permanent) atau 302 (Temporary)",
  }),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const rules = await db.select().from(redirects).orderBy(desc(redirects.createdAt));

    return NextResponse.json({ redirects: rules });
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

    if (!hasPermission(user.role, "redirects:manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = redirectSchema.parse(body);

    const db = getDatabase();
    const id = `red_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const [rule] = await db
      .insert(redirects)
      .values({
        id,
        sourcePath: validated.sourcePath,
        targetPath: validated.targetPath,
        statusCode: validated.statusCode,
        active: validated.active,
      })
      .returning();

    await db.insert(auditLogs).values({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      userEmail: user.email,
      action: "REDIRECT_CREATED",
      targetType: "REDIRECT",
      targetId: id,
      notes: `Aturan redirect ${validated.sourcePath} -> ${validated.targetPath} (${validated.statusCode}) dibuat oleh ${user.email}`,
    });

    return NextResponse.json({ redirect: rule }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
