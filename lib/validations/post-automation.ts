import { z } from "zod";

export const PostAutomationPayloadSchema = z.object({
  title: z.string().min(3, "Judul artikel minimal 3 karakter."),
  content: z.string().min(10, "Isi konten artikel minimal 10 karakter."),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  category: z.string().optional(), // Can be slug or name (e.g. "erp-core" or "ERP Core")
  author: z.string().optional(), // Can be slug, email, or name (e.g. "stefen", "stefen@newsystem.space")
  tags: z.array(z.string()).optional(), // Array of tag names/slugs
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  status: z
    .enum(["PUBLISHED", "DRAFT", "SCHEDULED", "IN_REVIEW"])
    .default("PUBLISHED"),
  scheduledPublishAt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  featured: z.boolean().default(false),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),
});

export type PostAutomationPayload = z.infer<typeof PostAutomationPayloadSchema>;
