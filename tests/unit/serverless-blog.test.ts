import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("fs", () => ({ default: {
  existsSync: () => false,
  mkdirSync: () => { throw Object.assign(new Error("read-only deployment filesystem"), { code: "EROFS" }); },
} }));
afterEach(() => { vi.unstubAllEnvs(); });

describe("public blog on a read-only serverless filesystem", () => {
  it("imports lazily and serves curated content without trying to create a database during module import", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const database = await import("@/lib/db");
    expect(database.getDatabase).toBeTypeOf("function");
    const { getPublishedPosts, getPostBySlug } = await import("@/lib/data/blog-service");
    const result = await getPublishedPosts();
    expect(result.posts.length).toBeGreaterThan(0);
    expect(await getPostBySlug(result.posts[0].slug)).toMatchObject({ slug: result.posts[0].slug });
  });
});
