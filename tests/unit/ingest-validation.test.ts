import { describe, it, expect } from "vitest";
import { IngestPayloadSchema } from "@/lib/validations/ingest";

describe("Content Ingestion Schema Suite", () => {
  it("accepts a well-formed webhook ingest payload", () => {
    const payload = {
      sourceSystem: "n8n_manufacturing_feed",
      externalId: "ext-doc-9842",
      title: "Optimasi Alur Produksi Kemasan Menggunakan Sistem Kanban Digital",
      excerpt: "Cara pabrik FMCG memangkas waktu tunggu bahan pembantu dari 4 jam menjadi 25 menit.",
      content:
        "Penerapan Kanban digital mengintegrasikan workstation cetak, plong, dan lem secara sekuensial. Sistem memastikan buffer persediaan tidak menumpuk di lantai produksi dan operator mendapat sinyal visual seketika.",
      categorySlug: "mes-shop-floor-control",
      authorSlug: "budi-santoso",
      sources: [
        {
          title: "Studi Penerapan Lean di Industri Kemasan Fleksibel",
          url: "https://example.com/lean-packaging",
        },
      ],
    };

    const res = IngestPayloadSchema.safeParse(payload);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.sourceSystem).toBe("n8n_manufacturing_feed");
      expect(res.data.sources?.length).toBe(1);
    }
  });

  it("fails if content is too short (< 20 characters)", () => {
    const payload = {
      sourceSystem: "make_com",
      title: "Judul Panjang Cukup",
      content: "Terlalu pendek",
    };

    const res = IngestPayloadSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it("fails if sourceSystem is missing", () => {
    const payload = {
      title: "Judul Cukup Panjang",
      content: "Konten yang panjangnya lebih dari dua puluh karakter sehingga valid.",
    };

    const res = IngestPayloadSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });
});
