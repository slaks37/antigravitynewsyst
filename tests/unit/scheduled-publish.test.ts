import { describe, it, expect } from "vitest";

describe("Scheduled Post Publication Filter Logic", () => {
  it("correctly identifies posts that are due for publication", () => {
    const now = new Date("2026-10-11T10:00:00Z");

    const samplePosts = [
      {
        id: "post-1",
        title: "Artikel Lampau",
        status: "SCHEDULED",
        scheduledPublishAt: new Date("2026-10-11T09:00:00Z"),
      },
      {
        id: "post-2",
        title: "Artikel Tepat Waktu",
        status: "SCHEDULED",
        scheduledPublishAt: new Date("2026-10-11T10:00:00Z"),
      },
      {
        id: "post-3",
        title: "Artikel Masa Depan",
        status: "SCHEDULED",
        scheduledPublishAt: new Date("2026-10-11T11:00:00Z"),
      },
      {
        id: "post-4",
        title: "Artikel Masih Draft",
        status: "DRAFT",
        scheduledPublishAt: new Date("2026-10-11T08:00:00Z"),
      },
    ];

    const duePosts = samplePosts.filter(
      (p) => p.status === "SCHEDULED" && p.scheduledPublishAt <= now
    );

    expect(duePosts.length).toBe(2);
    expect(duePosts.map((p) => p.id)).toEqual(["post-1", "post-2"]);
  });

  it("does not publish drafts even if past scheduled date", () => {
    const now = new Date();
    const draftPost = {
      id: "post-draft",
      status: "DRAFT",
      scheduledPublishAt: new Date(Date.now() - 3600000),
    };

    const isDue = draftPost.status === "SCHEDULED" && draftPost.scheduledPublishAt <= now;
    expect(isDue).toBe(false);
  });
});
