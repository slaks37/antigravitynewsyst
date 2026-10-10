import { describe, it, expect } from "vitest";
import { hasPermission, getRoleBadgeClass, UserRole } from "@/lib/auth/rbac";

describe("RBAC Permissions Suite", () => {
  it("SUPERADMIN has all permissions including system management and leads", () => {
    expect(hasPermission("SUPERADMIN", "posts:publish")).toBe(true);
    expect(hasPermission("SUPERADMIN", "leads:view")).toBe(true);
    expect(hasPermission("SUPERADMIN", "site_settings:manage")).toBe(true);
    expect(hasPermission("SUPERADMIN", "redirects:manage")).toBe(true);
    expect(hasPermission("SUPERADMIN", "audit_logs:view")).toBe(true);
  });

  it("CONTENT_MANAGER can publish and manage content but cannot change site settings", () => {
    expect(hasPermission("CONTENT_MANAGER", "posts:publish")).toBe(true);
    expect(hasPermission("CONTENT_MANAGER", "categories:manage")).toBe(true);
    expect(hasPermission("CONTENT_MANAGER", "authors:manage")).toBe(true);
    expect(hasPermission("CONTENT_MANAGER", "site_settings:manage")).toBe(false);
    expect(hasPermission("CONTENT_MANAGER", "users:manage")).toBe(false);
  });

  it("EDITOR cannot publish directly without reviewer/manager approval", () => {
    expect(hasPermission("EDITOR", "posts:create")).toBe(true);
    expect(hasPermission("EDITOR", "posts:edit_any")).toBe(true);
    expect(hasPermission("EDITOR", "posts:submit_review")).toBe(true);
    expect(hasPermission("EDITOR", "posts:publish")).toBe(false);
    expect(hasPermission("EDITOR", "leads:view")).toBe(false);
  });

  it("REVIEWER can review and approve, but cannot publish directly", () => {
    expect(hasPermission("REVIEWER", "posts:review_approve")).toBe(true);
    expect(hasPermission("REVIEWER", "posts:publish")).toBe(false);
    expect(hasPermission("REVIEWER", "leads:view")).toBe(false);
  });

  it("AUTHOR can only create and submit review for own drafts", () => {
    expect(hasPermission("AUTHOR", "posts:create")).toBe(true);
    expect(hasPermission("AUTHOR", "posts:edit_own")).toBe(true);
    expect(hasPermission("AUTHOR", "posts:edit_any")).toBe(false);
    expect(hasPermission("AUTHOR", "posts:publish")).toBe(false);
    expect(hasPermission("AUTHOR", "leads:view")).toBe(false);
  });

  it("MARKETING_LEAD_MANAGER can view, update, and export leads but cannot edit editorial posts", () => {
    expect(hasPermission("MARKETING_LEAD_MANAGER", "leads:view")).toBe(true);
    expect(hasPermission("MARKETING_LEAD_MANAGER", "leads:update")).toBe(true);
    expect(hasPermission("MARKETING_LEAD_MANAGER", "leads:export")).toBe(true);
    expect(hasPermission("MARKETING_LEAD_MANAGER", "newsletter:view")).toBe(true);
    expect(hasPermission("MARKETING_LEAD_MANAGER", "posts:create")).toBe(false);
    expect(hasPermission("MARKETING_LEAD_MANAGER", "posts:publish")).toBe(false);
  });

  it("getRoleBadgeClass returns valid styling classes for all defined roles", () => {
    const roles: UserRole[] = [
      "SUPERADMIN",
      "CONTENT_MANAGER",
      "EDITOR",
      "REVIEWER",
      "AUTHOR",
      "MARKETING_LEAD_MANAGER",
    ];
    for (const role of roles) {
      const cls = getRoleBadgeClass(role);
      expect(cls).toBeTypeOf("string");
      expect(cls.length).toBeGreaterThan(0);
    }
  });
});
