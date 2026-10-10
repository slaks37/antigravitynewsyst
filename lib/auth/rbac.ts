/**
 * NewSystem Editorial RBAC (Role-Based Access Control)
 * Reference: Section 12 — Editorial RBAC
 */

export type UserRole =
  | "SUPERADMIN"
  | "CONTENT_MANAGER"
  | "EDITOR"
  | "REVIEWER"
  | "AUTHOR"
  | "MARKETING_LEAD_MANAGER";

export type CmsAction =
  | "posts:create"
  | "posts:edit_own"
  | "posts:edit_any"
  | "posts:submit_review"
  | "posts:review_approve"
  | "posts:publish"
  | "posts:delete"
  | "categories:manage"
  | "authors:manage"
  | "media:upload"
  | "media:delete"
  | "leads:view"
  | "leads:update"
  | "leads:export"
  | "newsletter:view"
  | "site_settings:manage"
  | "users:manage"
  | "audit_logs:view"
  | "ingest:manage"
  | "redirects:manage";

const ROLE_PERMISSIONS: Record<UserRole, CmsAction[]> = {
  SUPERADMIN: [
    "posts:create",
    "posts:edit_own",
    "posts:edit_any",
    "posts:submit_review",
    "posts:review_approve",
    "posts:publish",
    "posts:delete",
    "categories:manage",
    "authors:manage",
    "media:upload",
    "media:delete",
    "leads:view",
    "leads:update",
    "leads:export",
    "newsletter:view",
    "site_settings:manage",
    "users:manage",
    "audit_logs:view",
    "ingest:manage",
    "redirects:manage",
  ],
  CONTENT_MANAGER: [
    "posts:create",
    "posts:edit_own",
    "posts:edit_any",
    "posts:submit_review",
    "posts:review_approve",
    "posts:publish",
    "posts:delete",
    "categories:manage",
    "authors:manage",
    "media:upload",
    "media:delete",
    "leads:view",
    "newsletter:view",
    "audit_logs:view",
    "ingest:manage",
    "redirects:manage",
  ],
  EDITOR: [
    "posts:create",
    "posts:edit_own",
    "posts:edit_any",
    "posts:submit_review",
    "media:upload",
    "categories:manage",
  ],
  REVIEWER: [
    "posts:review_approve",
    "posts:edit_any",
    "audit_logs:view",
  ],
  AUTHOR: [
    "posts:create",
    "posts:edit_own",
    "posts:submit_review",
    "media:upload",
  ],
  MARKETING_LEAD_MANAGER: [
    "leads:view",
    "leads:update",
    "leads:export",
    "newsletter:view",
  ],
};

export function hasPermission(role: UserRole, action: CmsAction): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(action);
}

export function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case "SUPERADMIN":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "CONTENT_MANAGER":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "EDITOR":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REVIEWER":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "AUTHOR":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "MARKETING_LEAD_MANAGER":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}
