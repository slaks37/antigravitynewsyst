import { describe, it, expect } from "vitest";
import { LeadSchema } from "@/lib/validations/lead";

describe("Lead Submission Validation Suite", () => {
  it("accepts a valid DEMO_REQUEST payload", () => {
    const validData = {
      formType: "DEMO_REQUEST",
      fullName: "Bambang Wijaya",
      businessEmail: "bambang@pabriksukses.co.id",
      company: "PT Pabrik Sukses Sejahtera",
      industry: "Discrete Manufacturing",
      plantCount: 2,
      consent: true,
    };

    const result = LeadSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Bambang Wijaya");
      expect(result.data.plantCount).toBe(2);
      expect(result.data.sourcePage).toBe("/");
    }
  });

  it("accepts a valid DESIGN_PARTNER registration payload", () => {
    const partnerData = {
      formType: "DESIGN_PARTNER",
      fullName: "Siti Rahmawati",
      businessEmail: "siti@garmenttekstil.com",
      company: "PT Citra Garment Mandiri",
      industry: "Garment Manufacturing",
      plantCount: 1,
      businessProblem: "Inefisiensi pemotongan kain dan pelacakan output operator manual",
      consent: true,
      utmSource: "linkedin",
    };

    const result = LeadSchema.safeParse(partnerData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.formType).toBe("DESIGN_PARTNER");
      expect(result.data.utmSource).toBe("linkedin");
    }
  });

  it("fails when consent is false", () => {
    const invalidConsent = {
      fullName: "Bambang Wijaya",
      businessEmail: "bambang@pabrik.com",
      company: "PT Pabrik",
      consent: false,
    };

    const result = LeadSchema.safeParse(invalidConsent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Persetujuan");
    }
  });

  it("fails when email is improperly formatted", () => {
    const invalidEmail = {
      fullName: "Bambang Wijaya",
      businessEmail: "bambang-bukan-email",
      company: "PT Pabrik",
      consent: true,
    };

    const result = LeadSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("email");
    }
  });

  it("fails when company name is too short", () => {
    const invalidCompany = {
      fullName: "Bambang",
      businessEmail: "bambang@pabrik.com",
      company: "A",
      consent: true,
    };

    const result = LeadSchema.safeParse(invalidCompany);
    expect(result.success).toBe(false);
  });
});
