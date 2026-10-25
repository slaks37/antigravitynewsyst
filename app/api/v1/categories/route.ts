import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDatabase();
    const list = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        seoTitle: categories.seoTitle,
        seoDescription: categories.seoDescription,
        displayOrder: categories.displayOrder,
      })
      .from(categories)
      .where(eq(categories.active, true))
      .orderBy(categories.displayOrder);

    return NextResponse.json({
      success: true,
      categories: list,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memuat kategori: " + (err as Error).message },
      { status: 500 }
    );
  }
}
