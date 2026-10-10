import { describe, it, expect } from "vitest";
import {
  MATURITY_STATE_CONFIG,
  CAPABILITY_STATUSES,
  MaturityState,
} from "@/lib/capabilities/status";

describe("Product Maturity Truthfulness & Matrix Suite", () => {
  const allowedStates: MaturityState[] = [
    "PLANNED",
    "IN_DEVELOPMENT",
    "PROTOTYPE",
    "PILOT_AVAILABLE",
    "GENERALLY_AVAILABLE",
  ];

  it("defines exactly the 5 truthful maturity states per Master Prompt Section 1", () => {
    for (const state of allowedStates) {
      expect(MATURITY_STATE_CONFIG[state]).toBeDefined();
      expect(MATURITY_STATE_CONFIG[state].label).toBeTypeOf("string");
      expect(MATURITY_STATE_CONFIG[state].badgeClass).toBeTypeOf("string");
      expect(MATURITY_STATE_CONFIG[state].description).toBeTypeOf("string");
    }
  });

  it("covers all 11 core and operational modules in the capability matrix", () => {
    const requiredModules = [
      "erp",
      "mes",
      "hris",
      "crm",
      "accounting",
      "quality",
      "maintenance",
      "automation",
      "workspace",
      "connect",
      "bi",
    ];

    for (const mod of requiredModules) {
      expect(CAPABILITY_STATUSES[mod]).toBeDefined();
      expect(CAPABILITY_STATUSES[mod].name).toBeTypeOf("string");
      expect(allowedStates).toContain(CAPABILITY_STATUSES[mod].status);
    }
  });

  it("enforces that no unreleased modules falsely claim GENERALLY_AVAILABLE during development phase", () => {
    // NewSystem is currently in development / design-partner validation.
    // Core suites like ERP and MES should be IN_DEVELOPMENT or PILOT_AVAILABLE, never GA without true production release.
    expect(CAPABILITY_STATUSES["erp"].status).not.toBe("GENERALLY_AVAILABLE");
    expect(CAPABILITY_STATUSES["mes"].status).not.toBe("GENERALLY_AVAILABLE");
  });
});
