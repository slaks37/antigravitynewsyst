import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { newsletterSubscribers, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const NewsletterSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  sourcePage: z.string().optional().default("/blog"),
  consent: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = NewsletterSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Email tidak valid." },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const email = parsed.data.email.toLowerCase().trim();

    // Check duplicate
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email));

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Email Anda sudah terdaftar dalam buletin wawasan manufaktur kami.",
      });
    }

    const subscriberId = crypto.randomUUID();

    await db.insert(newsletterSubscribers).values({
      id: subscriberId,
      email,
      consent: parsed.data.consent,
      status: "SUBSCRIBED",
      sourcePage: parsed.data.sourcePage,
    });

    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      action: "NEWSLETTER_SUBSCRIBED",
      targetType: "NEWSLETTER",
      targetId: subscriberId,
      notes: `Pendaftaran buletin dari ${email}`,
    });

    return NextResponse.json({
      success: true,
      message: "Terima kasih telah berlangganan buletin berkala NewSystem.",
    });
  } catch (err) {
    console.error("Error subscribing newsletter:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
