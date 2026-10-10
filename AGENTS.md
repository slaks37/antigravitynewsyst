# AGENTS.md — NewSystem Repository Governance

## Product identity
**NewSystem** is an AI-powered full-suite Business & Manufacturing Operating System. Tagline: **One System. Every Process. Smarter Business.** Never use the deprecated project name. General Manufacturing is the first segment, with Furniture, Garment and F&B scenarios; support batch/discrete/repetitive/hybrid via configuration, not customer-specific forks.

## Full suite requirement
ERP, MES, HRIS, CRM, Accounting, QMS, Maintenance, Workflow Automation, Smart Workspace & DMS (native + Google/Microsoft hybrid), NewSystem Connect (email, Google Drive, OneDrive, APIs), BI, per-module AI copilots and Company Copilot, multi-company/plant/tenant administration, portals and public website are all required for Full Suite R1. Later phase does not mean optional.

## Source of truth
Read `docs/references/` and approved founder decisions. Read `docs/implementation/STATUS.md`, `REQUIREMENTS_MATRIX.md` and ADRs before code changes. Missing documents must be explicitly reported. Preserve previously verified implementation and unrelated Git changes.

## Architectural principles
- Modular transactional core with explicit domain ownership; use commands, queries, versioned committed events and transactional outbox.
- Authoritative stock quantity: ERP Inventory; stock valuation and GL: Accounting; production execution: MES; HR/payroll: HRIS; customer order: CRM; quality dispositions: QMS; official file metadata/versions: DMS.
- Transaction integrity: idempotency keys, unique constraints, immutable posted movement/journal or approved reversal, tenant-aware authorization, audit and segregation of duties.
- Official PO/Invoice are business records rendered to documents; editing file never mutates posted data.
- Workflow or AI tools NEVER bypass business domain invariants, RBAC or approvals. Externally sourced email/documents are untrusted.
- Cross-tenant authorization must be tested on APIs, files, background jobs, analytics, search, AI and integration caches.
- No invented KPI figures, integrations, user activity, statistical certainty, regulatory compliance or test results.

## Design and experience
Use NewSystem-approved logo SVG and token/brand guidelines in `docs/references/`. Responsive desktop, tablet and mobile PWA; shop-floor UX optimized for brief tasks. Route-scoped lazy loading, no app-wide polling of all plants/modules.

## Engineering acceptance
For each feature: actual business logic + migration + API + real UI integration + authorization + error handling + audit + tests + docs. Run lint/typecheck/build/unit/integration/E2E as applicable. Keep `docs/implementation/STATUS.md` honest: NOT_STARTED, IN_PROGRESS, BLOCKED, IMPLEMENTED, TESTED, VERIFIED.

## Safety and operations
Never commit secrets. Never assume OAuth credentials. Never reset production data or deploy, send real emails, payroll, money, or live machine commands without explicit approval. Label demo data and provider mocks. Work incrementally; each phase must pass its exit gate before the next.

## Response required each session
State current phase, user-visible working results, file changes, test commands/results, blockers and next gate. Do not say complete if exit gate not evidenced.
