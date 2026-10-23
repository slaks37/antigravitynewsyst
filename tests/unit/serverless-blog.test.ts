import { afterEach, describe, expect, it, vi } from "vitest";

const failure = vi.hoisted(() => ({ code: "ENOENT" }));
vi.mock("fs", () => ({
  default: {
    existsSync: () => false,
    mkdirSync: () => {
      throw Object.assign(new Error("deployment data directory unavailable"), {
        code: failure.code,
      });
    },
  },
}));
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("public blog on a serverless filesystem", () => {
  it.each(["ENOENT", "EROFS"])(
    "imports lazily and serves curated content after %s",
    async (code) => {
      failure.code = code;
      vi.stubEnv("DATABASE_URL", "");
      const database = await import("@/lib/db");
      expect(database.getDatabase).toBeTypeOf("function");
      const { getPublishedPosts, getPostBySlug } =
        await import("@/lib/data/blog-service");
      const result = await getPublishedPosts();
      expect(result.posts.length).toBeGreaterThan(0);
      expect(await getPostBySlug(result.posts[0].slug)).toMatchObject({
        slug: result.posts[0].slug,
      });
    },
  );
});
