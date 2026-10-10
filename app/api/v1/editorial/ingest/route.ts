import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import {
  posts,
  categories,
  authors,
  contentIngestRecords,
  auditLogs,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

import { IngestPayloadSchema } from "@/lib/validations/ingest";

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const authHeader = req.headers.get("authorization");
    const configuredKey =
      process.env.EDITORIAL_INGEST_API_KEY || "newsystem_dev_ingest_key";

    if (
      !authHeader ||
      (!authHeader.includes(configuredKey) &&
        authHeader !== `Bearer ${configuredKey}`)
    ) {
      return NextResponse.json(
        { error: "Autentikasi ditolak. API key ingest tidak sah." },
        { status: 401 }
      );
    }

    const json = await req.json();
    const parsed = IngestPayloadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Payload tidak valid." },
        { status: 400 }
      );
    }

    const {
      sourceSystem,
      externalId,
      title,
      excerpt,
      content,
      categorySlug,
      authorSlug,
      sources,
    } = parsed.data;

    const db = getDatabase();
    const normalizedTitle = title.trim().toLowerCase();

    // 2. Duplicate detection check
    const existingIngest = await db
      .select()
      .from(contentIngestRecords)
      .where(eq(contentIngestRecords.normalizedTitle, normalizedTitle))
      .limit(1);

    const ingestId = `ingest-${crypto.randomUUID()}`;

    if (existingIngest.length > 0) {
      // Record duplicate attempt
      await db.insert(contentIngestRecords).values({
        id: ingestId,
        sourceSystem,
        externalId: externalId || null,
        normalizedTitle,
        rawPayload: json,
        status: "DUPLICATE",
        errorLog: "Ditolak: Judul artikel serupa sudah pernah di-ingest sebelumnya.",
      });

      return NextResponse.json(
        {
          success: false,
          status: "DUPLICATE",
          message: "Artikel serupa sudah pernah diterima dalam antrean.",
        },
        { status: 409 }
      );
    }

    // Resolve Category & Author
    let categoryId = null;
    if (categorySlug) {
      const [cat] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);
      if (cat) categoryId = cat.id;
    }

    let resolvedAuthorId = null;
    if (authorSlug) {
      const [auth] = await db
        .select()
        .from(authors)
        .where(eq(authors.slug, authorSlug))
        .limit(1);
      if (auth) resolvedAuthorId = auth.id;
    }

    // Default to first author if not resolved
    if (!resolvedAuthorId) {
      const [firstAuthor] = await db.select().from(authors).limit(1);
      if (firstAuthor) resolvedAuthorId = firstAuthor.id;
    }

    // Generate safe slug
    const slug = `${title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")}-${Date.now().toString().slice(-4)}`;

    const postId = `post-${crypto.randomUUID()}`;

    // 3. Save as IN_REVIEW post (Never auto-publish without review)
    await db.insert(posts).values({
      id: postId,
      title,
      slug,
      excerpt: excerpt || title,
      content,
      primaryCategoryId: categoryId,
      authorId: resolvedAuthorId,
      sources: sources || [],
      status: "IN_REVIEW", // Mandatory review queue default
      readingTimeMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
      revisionCount: 1,
    });

    // 4. Save Ingest Record
    await db.insert(contentIngestRecords).values({
      id: ingestId,
      sourceSystem,
      externalId: externalId || null,
      normalizedTitle,
      rawPayload: json,
      status: "PROCESSED",
      postId,
    });

    // 5. Audit Log
    await db.insert(auditLogs).values({
      id: `audit-${crypto.randomUUID()}`,
      action: "CONTENT_INGESTED",
      targetType: "POST",
      targetId: postId,
      notes: `Konten di-ingest dari ${sourceSystem}: "${title}" (Status: IN_REVIEW)`,
    });

    return NextResponse.json({
      success: true,
      ingestId,
      postId,
      status: "IN_REVIEW",
      message: "Konten berhasil diterima dan ditempatkan dalam antrean review editorial.",
    });
  } catch (err) {
    console.error("Ingest API error:", err);
    return NextResponse.json(
      { error: "Kesalahan internal: " + (err as Error).message },
      { status: 500 }
    );
  }
}
