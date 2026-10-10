import { z } from "zod";

export const IngestPayloadSchema = z.object({
  sourceSystem: z.string().min(1, "sourceSystem wajib diisi"),
  externalId: z.string().optional(),
  title: z.string().min(5, "title minimal 5 karakter"),
  excerpt: z.string().optional(),
  content: z.string().min(20, "content minimal 20 karakter"),
  categorySlug: z.string().optional(),
  authorSlug: z.string().optional(),
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

export type IngestPayload = z.infer<typeof IngestPayloadSchema>;
