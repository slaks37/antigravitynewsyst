import { z } from "zod";

export const LeadSchema = z.object({
  formType: z.enum(["CONTACT", "DEMO_REQUEST", "DESIGN_PARTNER"]).default("DEMO_REQUEST"),
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  businessEmail: z.string().email("Format email tidak valid"),
  phoneNumber: z.string().optional(),
  company: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
  industry: z.string().optional().default("General Manufacturing"),
  plantCount: z.number().int().min(1).max(500).optional().default(1),
  employeeRange: z.string().optional(),
  productionType: z.string().optional(),
  businessProblem: z.string().optional(),
  sourcePage: z.string().optional().default("/"),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, "Persetujuan wajib dicentang"),
});

export type LeadInput = z.infer<typeof LeadSchema>;
