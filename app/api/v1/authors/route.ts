import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { authors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDatabase();
    const list = await db
      .select({
        id: authors.id,
        name: authors.name,
        slug: authors.slug,
        email: authors.email,
        role: authors.role,
        bio: authors.bio,
      })
      .from(authors)
      .where(eq(authors.active, true));

    return NextResponse.json({
      success: true,
      authors: list,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memuat penulis: " + (err as Error).message },
      { status: 500 }
    );
  }
}
