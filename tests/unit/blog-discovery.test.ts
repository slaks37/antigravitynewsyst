import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { NextRequest } from "next/server";
import { POST as subscribe } from "@/app/api/newsletter/route";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/db/schema";

const context = vi.hoisted(() => ({ database: null as any }));
vi.mock("@/lib/db", () => ({ getDatabase: () => context.database }));
import { initializeDatabase } from "@/lib/db/init";
import { getPublishedPosts, getPostBySlug } from "@/lib/data/blog-service";
import { FALLBACK_POSTS } from "@/lib/data/blog-data";

let client: PGlite;
beforeAll(async () => {
  client = new PGlite();
  context.database = drizzle(client, { schema });
  await initializeDatabase();
}, 20000);
afterAll(async () => {
  await client.close();
});
afterEach(() => {
  vi.unstubAllEnvs();
});
beforeEach(async () => {
  await client.exec(
    "TRUNCATE post_tags, posts, tags, authors, categories CASCADE",
  );
});

async function insertPost(id: string, values = {}) {
  await context.database.insert(schema.posts).values({
    id,
    slug: id,
    title: `Article ${id}`,
    excerpt: "Manufacturing guide",
    content: "## Guide\n\nUseful content.",
    status: "PUBLISHED",
    publishedAt: new Date("2020-01-01"),
    ...values,
  });
}

describe("public blog discovery uses committed publication state", () => {
  it("keeps an empty database and zero-match search empty", async () => {
    expect(await getPublishedPosts()).toEqual({ posts: [], totalCount: 0 });
    await insertPost("visible");
    expect(await getPublishedPosts({ searchQuery: "not-in-any-post" })).toEqual(
      { posts: [], totalCount: 0 },
    );
  });
  it("withdraws a fallback-named article from both index and detail", async () => {
    const slug = FALLBACK_POSTS[0].slug;
    await insertPost(slug);
    expect((await getPostBySlug(slug))?.slug).toBe(slug);
    await context.database
      .update(schema.posts)
      .set({ status: "DRAFT" })
      .where(eq(schema.posts.slug, slug));
    expect(await getPostBySlug(slug)).toBeNull();
    expect((await getPublishedPosts()).posts).toEqual([]);
  });
  it("excludes drafts and future publications", async () => {
    await insertPost("visible");
    await insertPost("draft", { status: "DRAFT" });
    await insertPost("future", { publishedAt: new Date("2999-01-01") });
    expect((await getPublishedPosts()).posts.map((p) => p.slug)).toEqual([
      "visible",
    ]);
    expect(await getPostBySlug("future")).toBeNull();
  });
  it("filters tags in the database and preserves actual update dates", async () => {
    await context.database
      .insert(schema.tags)
      .values({ id: "tag-1", name: "MES", slug: "mes" });
    const updatedAt = new Date("2020-02-01");
    await insertPost("tagged", { updatedAt });
    await insertPost("other");
    await context.database
      .insert(schema.postTags)
      .values({ postId: "tagged", tagId: "tag-1" });
    const result = await getPublishedPosts({ tagSlug: "mes" });
    expect(result.posts.map((p) => p.slug)).toEqual(["tagged"]);
    expect(result.posts[0].updatedAt).toBe(updatedAt.toISOString());
    expect((await getPublishedPosts({ tagSlug: "missing" })).posts).toEqual([]);
  });
  it("does not fabricate fallback articles when a configured database fails", async () => {
    const database = context.database;
    context.database = {
      select: () => {
        throw new Error("database unavailable");
      },
    };
    vi.stubEnv("DATABASE_URL", "postgres://fixture.invalid/test");
    try {
      await expect(getPublishedPosts()).rejects.toThrow("database unavailable");
      await expect(getPostBySlug(FALLBACK_POSTS[0].slug)).rejects.toThrow(
        "database unavailable",
      );
    } finally {
      context.database = database;
    }
  });
});


describe("blog newsletter persistence", () => {
  it("accepts a subscription and persists an audit entry with schema-valid IDs", async () => {
    const request = () => new NextRequest("http://localhost/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "seo-fixture@example.invalid", consent: true, sourcePage: "/blog" }) });
    const response = await subscribe(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true });
    const rows = await context.database.select().from(schema.newsletterSubscribers);
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe("seo-fixture@example.invalid");
    expect(rows[0].id.length).toBeLessThanOrEqual(36);
    const audit = await context.database.select().from(schema.auditLogs);
    expect(audit).toHaveLength(1);
    expect(audit[0].action).toBe("NEWSLETTER_SUBSCRIBED");
    expect((await subscribe(request())).status).toBe(200);
    expect(await context.database.select().from(schema.newsletterSubscribers)).toHaveLength(1);
  });
});
