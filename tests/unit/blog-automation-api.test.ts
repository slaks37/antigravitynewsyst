import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/lib/db/schema";
import { NextRequest } from "next/server";
import { initializeDatabase } from "@/lib/db/init";

const context = vi.hoisted(() => ({ database: null as any }));
vi.mock("@/lib/db", () => ({ getDatabase: () => context.database }));

let client: PGlite;

beforeAll(async () => {
  client = new PGlite();
  context.database = drizzle(client, { schema });
  await initializeDatabase();

  // Seed sample category and author for testing
  await context.database.insert(schema.categories).values({
    id: "cat-mes-test",
    name: "MES Shop Floor",
    slug: "mes-shop-floor",
    description: "Shop floor management",
    displayOrder: 1,
    active: true,
  });

  await context.database.insert(schema.authors).values({
    id: "auth-stefen-test",
    name: "Stefen",
    slug: "stefen",
    email: "stefen@newsystem.space",
    role: "Solution Architect",
    active: true,
  });
}, 20000);

afterAll(async () => {
  await client.close();
});

describe("Blog Automation API (/api/v1/posts)", () => {
  it("rejects unauthorized requests without valid API key", async () => {
    const { POST } = await import("@/app/api/v1/posts/route");
    const req = new NextRequest("http://localhost/api/v1/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Tanpa Key",
        content: "Konten artikel testing.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain("Autentikasi ditolak");
  });

  it("successfully creates and auto-publishes an article via POST /api/v1/posts", async () => {
    const { POST } = await import("@/app/api/v1/posts/route");
    const req = new NextRequest("http://localhost/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer newsystem_dev_automation_key",
      },
      body: JSON.stringify({
        title: "Otomasi Shop Floor Manufaktur 2026",
        content: "## Alur Otomasi\n\nMenghubungkan sensor mesin dan work order secara real-time.",
        category: "mes-shop-floor",
        author: "Stefen",
        tags: ["MES", "Otomasi", "Pabrik"],
        status: "PUBLISHED",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.post.title).toBe("Otomasi Shop Floor Manufaktur 2026");
    expect(data.post.status).toBe("PUBLISHED");
    expect(data.post.publicUrl).toContain("otomasi-shop-floor-manufaktur-2026");
  });

  it("lists posts via GET /api/v1/posts", async () => {
    const { GET } = await import("@/app/api/v1/posts/route");
    const req = new NextRequest("http://localhost/api/v1/posts?status=PUBLISHED");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.count).toBeGreaterThanOrEqual(1);
  });

  it("lists categories via GET /api/v1/categories", async () => {
    const { GET } = await import("@/app/api/v1/categories/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.categories.length).toBeGreaterThan(0);
  });

  it("lists authors via GET /api/v1/authors", async () => {
    const { GET } = await import("@/app/api/v1/authors/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.authors.length).toBeGreaterThan(0);
  });
});
