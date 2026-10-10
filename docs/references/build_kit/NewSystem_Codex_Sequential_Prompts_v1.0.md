# NewSystem — Codex Sequential Implementation Playbook v1.0

**Project:** NewSystem — One System. Every Process. Smarter Business.  
**Product:** Full-Suite AI-Powered Business & Manufacturing Operating System  
**Initial ICP:** General Manufacturing; validate with Furniture/Assembly, Garment, and F&B pilot datasets.  
**Source of truth:** `docs/references/` (PRD, UML, ERD, BPMN, UX, brand/design system, GTM); latest approved founder decisions supersede conflicting drafts.

## Cara menggunakannya

1. Buat repository **khusus** NewSystem, bukan repo New Hope. Letakkan `AGENTS.md` (file terlampir) di root repo.
2. Masukkan semua dokumen Drive ke `docs/references/`. Jika suatu dokumen tidak ada, Codex harus mengakuinya dan melaporkan gap, bukan mengarang isinya.
3. Kirim **PROMPT 00**. Setelah setiap fase, periksa hasil, jalankan tes, dan simpan commit/checkpoint yang tervalidasi.
4. Kirim prompt selanjutnya **hanya jika exit gate sebelumnya lulus**. Jika gagal, pakai prompt perbaikan pada akhir file.
5. Jangan memberi akses ke production credentials, customer real data, payroll production, external email sending, atau live payments hanya untuk demonstrasi.

> Semua suite R1 adalah **target komersial wajib**; urutan pengembangan tidak berarti modul setelah Prompt 09 boleh dihilangkan. Full Suite GA hanya bila seluruh acceptance gates telah lulus.

## Phase index

| No. | Fase | Ketergantungan/hasil pokok |
|---|---|---|
| 00 | Audit & architecture inventory | Evidence-based baseline, gap matrix, ADR |
| 01 | Repository foundation & visual design | Monorepo, CI, brand/design tokens, shell |
| 02 | Tenant/company/plant, IAM & RBAC | Secured organizations & scoped access |
| 03 | Domain contracts & shared master data | Typed contracts, event/outbox, master data |
| 04 | CRM & sales demand | Lead → quotation → confirmed sales order |
| 05 | ERP procurement, inventory, warehouse | PR/PO, receiving, stock ledger/reservation |
| 06 | ERP PPIC, BOM/routing, MRP | Production planning & released work orders |
| 07 | MES execution + QMS core | Job cards, output, labor, QC hold/release |
| 08 | Accounting kernel, AR/AP & costing | Double-entry, invoice, WIP/FG costing |
| 09 | End-to-end vertical slice acceptance | CRM → ERP → MES → QMS → GL & invoice |
| 10 | HRIS & payroll | Employee lifecycle, attendance, shift, pay |
| 11 | Complete accounting and finance | Bank, tax rules, close, reports, reconciliation |
| 12 | Industry packs, extended QMS & CMMS | General, F&B, Garment, Furniture, maintenance |
| 13 | Workflow Automation Studio | Visual builder, approvals, event actions |
| 14 | Workspace, DMS, hybrid editor | Business docs, files, archive, versioning |
| 15 | Connect, email/cloud and public APIs | Gmail/Outlook, Drive/OneDrive, webhooks |
| 16 | BI / semantic metrics | Verified cross-domain KPI & drill-down |
| 17 | Module Copilots & Company Copilot | Governed tools, RAG, analysis, action approval |
| 18 | Admin, portals, SaaS and public site | Entitlements, tenant admin, superadmin, GTM |
| 19 | Security, performance & 3 pilot gates | Verifiable Full Suite R1 candidate |

---

# Prompt siap kirim ke Codex — kirim satu per satu

## PROMPT 00 — Audit repository dan sumber dokumen

> Kirim ini pertama kali, setelah repository dan dokumen referensi disiapkan.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

ROLE: Act as Founding CTO and principal reviewer. Start with evidence, not assumptions.

TASK:
1. Inspect `pwd`, Git status/branch, repository tree, package manifests, CI, database migrations, tests, `.env.example`, and deployments. Never reset or overwrite unrelated work.
2. Read all available NewSystem documents in `docs/references/`, including Master PRD (requirement IDs), UML, ERD, BPMN, 57-screen UX register, Brand/Design Guidelines, Marketing, and Sales Playbooks. Build exact file/source index. If absent, record `MISSING`; do not claim it was read.
3. Classify each module: NOT_STARTED / PARTIAL / WORKING / VERIFIED with evidence. Distinguish UI-only from actual business transactions.
4. Produce `docs/implementation/MASTER_PLAN.md`, `REQUIREMENTS_MATRIX.md`, `STATUS.md`, `DECISIONS_AND_GAPS.md`, `MODULE_DEPENDENCIES.md`, and `docs/adr/ADR-0001-architecture.md`.
5. Choose first implementable phase and its acceptance tests; avoid writing app code in this audit except necessary harmless scaffolding for diagnostics.

EXIT GATE:
- Every referenced artifact indexed or explicitly marked missing.
- A requirement→owner→implementation→test mapping exists.
- Dependency-aware phases agreed and technical risks documented.

REPORT: What exists, what is missing, blockers, concrete file links, exact verification commands, and readiness for Prompt 01.
```

## PROMPT 01 — Monorepo, CI, design system dan navigasi

> Kirim setelah exit gate tahap 00 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Implement NewSystem foundation according to the audited architecture, NOT a throwaway demo.

DELIVER:
- Structured applications/packages with TypeScript and modular backend (preserve correct existing code).
- Development setup with reproducible install, migrations, test scripts, lint, typecheck, build, `.env.example`, and CI checks.
- NewSystem official logo/assets and design tokens from `08_Brand_Identity_and_Design_System`; Inter, navy/blue/cyan/indigo; responsive accessible components.
- App shell with organization/plant context selectors, sidebar module placeholders clearly labeled NOT_IMPLEMENTED, loading/empty/error states, keyboard/focus/accessibility basics.
- OpenAPI generation and standard errors/responses; health checks; structured logging with trace IDs.
- Documented design component contracts: table, form, dialog, confirmation, status, toast, file picker, copilot panel.

RULES: No fake business functionality, global eager loading, or hardcoded KPI data. Use route-level code splitting. Do not deploy production.

EXIT GATE: Local boot/build/typecheck/lint pass; design tokens and navigation render on desktop/tablet/mobile; placeholder features cannot masquerade as working capabilities. Update STATUS and evidence.
```

## PROMPT 02 — Multi-tenant Core, organisasi dan keamanan

> Kirim setelah exit gate tahap 01 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Implement NewSystem Core and IAM with database-backed authorization.

DELIVER:
- Tenant → business group → legal entity → plant → department → warehouse/work center structural relationships.
- Tenant provisioning, memberships, invitation/deactivation, role templates, scopes per company/plant/department/record; permissions for VIEW/CREATE/EDIT/APPROVE/POST/REVERSE/EXPORT/SHARE/CONFIGURE.
- Auth integration using OIDC-compatible approach, session lifecycle, MFA policy for privileged users, server-side authorization enforcement.
- Tenant-aware database query boundaries; consider PostgreSQL RLS with a tested tenant context policy as defense in depth.
- App context switching and user/role administration screens; immutable audit log for security-sensitive changes.
- Prevent platform support roles reading business content absent authorized, time-limited support access.

NEGATIVE TESTS: Tenant A cannot read/write/export Tenant B; Plant A cannot mutate Plant B without scope; operator cannot post journals; cross-tenant file/query/cache/search access is denied.

EXIT GATE: RBAC positive/negative integration tests; actual persisted org tree; auth-aware APIs; no cross-tenant leakage; documentation and migrations validated.
```

## PROMPT 03 — Master data, shared contracts dan event foundation

> Kirim setelah exit gate tahap 02 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Implement shared domain primitives and business event infrastructure.

DELIVER:
- Product/material/item, SKU and variant, UOM and safe conversions, currency, business calendar, customer/supplier party reference, warehouse, work center, cost center.
- Versioned BOM/recipe and routing definitions with approval/effective date and change history; ensure snapshots can be referenced by released orders.
- Typed business commands/queries/events with versioned schemas, domain ownership, idempotency keys, actor and tenant context, event ID/correlation/causation fields.
- Transactional outbox, asynchronous dispatcher, dedupe/inbox for consumers, retries, dead-letter queue, structured logs.
- Minimal reusable policy/approval kernel (not full graphical automation yet), with approval thresholds and separation-of-duties hooks.
- Seed THREE isolated synthetic tenant fixtures, no real employee/customer data.

TEST: Concurrent updates, duplicate event delivery, stale revision, invalid UOM conversion, optimistic-lock conflict, cross-tenant replay, outbox durability after failure.

EXIT GATE: Shared primitives persist and validate, outbox events are emitted only after commit, duplicate consumers do not duplicate side effects, contracts/versioning documented.
```

## PROMPT 04 — CRM dan sales order sebagai pemicu demand

> Kirim setelah exit gate tahap 03 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Implement functional NewSystem CRM scope needed for Lead-to-Cash, with extensible architecture for advanced CRM.

DELIVER:
- Customer/accounts/contacts, leads, opportunities/pipeline, activities, quotation and line items, price list, discounts/approval, sales order, amendment history, reason codes.
- Sales order state machine: draft → approval if needed → confirmed → partial fulfillment → fulfilled/cancelled; preserve commercial revisions.
- Structured demand publication via `SalesOrderConfirmed`, `SalesOrderAmended`, not direct writes to PPIC/inventory.
- Provisional available-to-promise API contract with ERP; when capability incomplete, explicitly show `UNAVAILABLE` rather than promise a delivery date.
- Real CRM screens, scope-based RBAC, audit, integration tests, realistic synthetic data.

EDGE CASES: duplicate confirmation, quotation expiry, multi-currency handling, quantity revision after WO release, partial fulfillment, cancellations, unauthorized discounts.

EXIT GATE: One lead can become approved quotation and confirmed order persisted and queryable; domain event emitted once; ERP demand contract tested. Document known production gaps.
```

## PROMPT 05 — ERP procurement + inventory ledger

> Kirim setelah exit gate tahap 04 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Build procurement and inventory as the source of truth for stock quantities and movements.

DELIVER:
- PR → approval → RFQ/supplier quotation (where applicable) → PO → partial goods receipt → incoming hold/release → supplier return, with audit and statuses.
- Multi-warehouse/location stock ledger, receipt, reservation, allocation, issue, return, transfer, adjustment, and cycle count.
- On-hand vs reserved vs hold vs available; item/lot/serial/expiry policy and FEFO where appropriate; safe UOM conversion.
- Stock posting via atomic command with idempotency and immutable movement/reversal, never balance changes solely from frontend.
- One goods receipt must not be booked twice by retries; PO creation cannot change stock; QC hold blocks issue.
- Integrate with Core and event infrastructure; expose contract for MRP and Accounting inventory valuation.

TEST: race for last units, over-reservation, negative-stock policy, duplicate receipt, partial receipt, adjustments requiring approval, transfers and returns, tenant isolation.

EXIT GATE: Reconcile expected balance to ledger for all fixtures with no unexplained difference and zero duplicate movement; all functional screens connected to real API.
```

## PROMPT 06 — ERP PPIC, BOM/routing dan MRP

> Kirim setelah exit gate tahap 05 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Implement planning and execution handoff for all configurable production modes.

DELIVER:
- Demand aggregation from confirmed Sales Orders and MTS forecasts; BOM/recipe explode by revision, net requirements with dated stock, reservations, blocked lots, scheduled receipts, supplier lead time, yield/scrap assumptions.
- Work center calendar, capacity visibility, priority and due dates; plan and production order creation.
- Production Order state machine draft → planned → approved/released; snapshot BOM and routing revision on release.
- Shortage exceptions and request for procurement; hold/release status, partial quantities, MTO vs MTS without product-specific hardcodes.
- Plant- and version-scoped UX for planner; events (`ProductionOrderReleased`, shortage detection) to MES and Procurement.

TEST: plan with sufficient/insufficient stock, revised BOM during active order, competing reservations, due-date shortage, production quantity amendment, inactive work center.

EXIT GATE: Given confirmed demand and initial stock, system consistently produces explainable dated material requirements and valid released work orders; tests, audit and docs updated.
```

## PROMPT 07 — MES shop floor, labor capture dan QMS gate

> Kirim setelah exit gate tahap 06 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Implement operational manufacturing execution and quality core with tablet/mobile-first operator UX.

DELIVER:
- Accept released WO, job cards per routing operation, work-center/operator assignments, start/pause/resume/complete, actual output and reject, downtime reason codes, WIP, material issues/consumption, direct labor time.
- Incoming/in-process/final QC inspection templates, pass/hold/reject/rework dispositions, quality release gates.
- Output/consumption event contracts to Inventory and Accounting; stock cannot be released for shipping until QC policy permits.
- Selective offline draft capture for eligible shop-floor data: client UUID, explicit pending/synced/conflict/failed, server validation; no unsafe offline final postings.
- Real mobile/tablet screens, audit and line-manager scopes.

TEST: partial output, rework loop, backflush vs actual issue policy, material shortfall, work center downtime, QC hold, duplicate mobile retry, different WO revisions.

EXIT GATE: Work order executes from released to QC accepted with traceable labor/material/output, correct inventory effect and no duplicate postings; automated integration tests pass.
```

## PROMPT 08 — Accounting core: double-entry, AR/AP dan HPP

> Kirim setelah exit gate tahap 07 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Implement the real Accounting transaction backbone early, before claims of complete cross-module integration.

DELIVER:
- Legal-entity chart of accounts, journals, balanced posting/reversal, period locks, financial dimensions/cost centers, precise decimal types.
- Inventory valuation, material→WIP, labor/overhead allocation inputs, WIP→finished goods, cost of goods sold with documented costing policy.
- Customer invoice drafts/posted invoices and AR subledger from eligible sales/fulfillment; supplier bill/AP matching with PO and receipt; basic receipts/payments as authorized transactions.
- Events for financial postings; only Accounting owns GL and financial balances, not MES or Inventory.
- Explain actual vs estimated vs reconciled manufacturing cost; avoid double counting payroll later.
- Basic trial balance, order costing and AR/AP drill-down to source documents.

TEST: debit=credit, reversal, closed period, duplicate event, receipt/invoice mismatch, QC hold and no COGS before defined recognition event, tenant/legal entity isolation.

EXIT GATE: Reconcile test ledger and cost movements without unexplained differences; invoice and supplier bill workflows persist and enforce approvals.
```

## PROMPT 09 — GATE: satu siklus bisnis end-to-end benar-benar berfungsi

> Kirim setelah exit gate tahap 08 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Do NOT build a new splash page or unrelated feature in this phase. Conduct an end-to-end proof of real integrated transactions.

SCENARIO (synthetic Furniture pilot): Lead → opportunity → quotation → confirmed SO → dated MRP → PR/PO if shortage → goods receipt → QC release → stock reservation → released WO → MES job cards, material and labor capture → final QC → finished goods stock → picking/shipment → posted customer invoice → cash allocation → COGS/WIP/GL reports.

DELIVER:
- Automated E2E suite plus integration tests through persistent database; no isolated mocks for business steps.
- Evidence table: transaction IDs, event IDs, stock balance, WIP, FG quantity, GL postings, AR state, CRM order state.
- Simulate exceptions: partial delivery, QC rejection/rework, return/cancellation, retry/double-click, timeouts, wrong tenant/role.
- Fix broken cross-domain contracts, duplicate event processing, and UI/DB inconsistencies found in this milestone. Update requirement traceability.

EXIT GATE: A user can complete the transaction through UI and API; stock and accounting reconcile; no cross-tenant access, no silent duplicate posting; document exact pass/fail and blockers.

STOP RULE: If exit gate fails, DO NOT proceed to Phase 10. Repair and rerun evidence first.
```

## PROMPT 10 — HRIS lengkap + attendance, shift dan payroll

> Kirim setelah exit gate tahap 09 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Build HRIS with actual labor/payroll rules and separation from MES production time.

DELIVER:
- Employee lifecycle, positions/contracts, recruiting/onboarding/offboarding, teams, skills and training, attendance/shift, leave and overtime approval, employee self-service.
- Versioned payroll configurations and pay components, pay periods, calculation preview, approval, finalization, payslip and payroll liability/journal event to Accounting.
- Indonesian regulation settings for BPJS and PPh 21 as effective-dated policies subject to domain expert verification; do not hardcode current rates without validated references and tests.
- MES workforce linking by employee ID/shift; MES direct labor time allocated to jobs, but private salary not disclosed to supervisors.
- Strict payroll roles, segregation of duties, redaction and access audit.

TEST: employee scope, leave/shift conflicts, overtime review, retro adjustments, duplicate payroll posting, direct vs indirect labor, privacy, payroll reconciliation.

EXIT GATE: Complete test payroll period processed in isolated data with approved journal integration and zero unexplained payroll-cost double counts.
```

## PROMPT 11 — Accounting lengkap, rekonsiliasi dan reporting

> Kirim setelah exit gate tahap 10 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Expand Accounting into an operational finance suite rather than a lightweight cost dashboard.

DELIVER:
- AR/AP aging and credit/debit notes, customer/supplier settlements, cash/bank journal, bank statement imports and reconciliation, fixed assets/depreciation, budgets, cost center reporting, accounting period close, tax code engine, multiple legal entities and intercompany flows when relevant.
- Financial reports: trial balance, P&L, balance sheet, cash flow, manufacturing cost and inventory valuation, with source drill-down.
- Check and correct payroll→GL and MES labor→WIP interactions so labor cost is not expensed twice.
- Versioned tax/jurisdiction rules; Indonesian compliance calculations flagged pending expert sign-off until verified.
- Finance approval matrix, irreversible posted audit with reversals/corrections.

TEST: cash/bank reconciliation, period close/reopen authorization, balanced reporting, partial payment, refund/credit note, fixed assets and payroll allocation.

EXIT GATE: Synthetic legal entity closes one period, reports reconcile and all source postings are traceable; no invalid claims of statutory certification.
```

## PROMPT 12 — General Manufacturing templates, QMS lanjutan & Maintenance

> Kirim setelah exit gate tahap 11 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Prove one shared manufacturing core supports distinct workflows and extend critical plant capabilities.

DELIVER:
- General Manufacturing configurability: job/discrete, batch/process, repetitive, hybrid, plant/product-specific routing and work center configuration; safe versioned templates.
- Three no-fork industry packs: (A) Furniture custom job, multi-level BOM and assembly, (B) Garment style/size/color cutting/sewing/finishing, (C) F&B formula/batch/lot/expiry/yield.
- QMS extension: NCR, CAPA, inspections/sampling plans, evidence, traceability, controlled scrap/rework/recall handling when applicable.
- CMMS/Maintenance: equipment registry, preventive/corrective work orders, spare parts, technician labor, machine downtime, calibration, maintenance cost.
- MES→CMMS→PPIC impact events; Maintenance usage of Inventory stock with audit.

TEST: same generic domain APIs and schema operate all three data sets, no plant-specific code forks; lot genealogy, QC hold, route variants, maintenance spare parts and downtime planning integration.

EXIT GATE: Three pilot simulations pass; differences are handled by configuration/approved extensions, not duplicated applications.
```

## PROMPT 13 — Automation Studio & configurable workflows

> Kirim setelah exit gate tahap 12 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Complete central workflow automation around the approvals/event foundation built earlier.

DELIVER:
- Visual workflow and forms builder, triggers, schedules, conditions, branching, role-based approvals, escalation, notifications, connector calls, business command actions.
- Draft/test/publish/version/retire workflow lifecycle; preserve running version. Provide test runner / dry-run before publish.
- Execution monitoring, retry/backoff, dead-letter and manual replay, correlation IDs, anti-loop detection and service-principal policy enforcement.
- Example workflows: high-value PO approval, stock shortage PR draft, QC failure investigation, overtime approval, overdue invoice task.
- AI-compatible structured workflow description API, but no unapproved AI publishing or external actions.

TEST: duplicate trigger, infinite loop attempt, revoked permission, failed connector, rejected approval, reused workflow versions, multi-tenant isolation.

EXIT GATE: Non-developer admin can create, safely validate and publish workflow through UI; business invariants cannot be bypassed by workflow rules.
```

## PROMPT 14 — NewSystem Workspace, file manager dan DMS hybrid

> Kirim setelah exit gate tahap 13 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Build enterprise Smart Workspace as a first-class domain, not a generic upload dialog.

DELIVER:
- Native business document editor for letters/memos/proposals/SOPs, template engine, numbered official outputs, dynamic fields sourced from authorized domain APIs, version history, comments, review/approval, PDF/DOCX output where supported.
- PO documents generated from Procurement PO; customer invoices generated from Accounting posted invoice; editing a PDF never mutates the source transaction.
- My/Team/Plant/Company Files, archive, folder/tree, upload, search, metadata/tags, preview, file linking to business records, retention/legal hold, share policies, expiring links.
- Internal private object storage, upload validation, antivirus/scanning integration point, signed downloads and tenant-scoped ACLs.
- External editor abstraction: Link/Copy/Sync semantics for Google Docs and Microsoft Word (real connectors in next phase); cannot overwrite finalized official document revisions.

TEST: document release, revision conflict, access denied on payroll file, malware-disallowed upload, signed-link expiry, legal hold prevents deletion, PO/Invoice source-link correctness.

EXIT GATE: Document lifecycle and managed storage are functional with real persistence, RBAC, audit and backups policy documented.
```

## PROMPT 15 — NewSystem Connect: email, Drive, OneDrive & APIs

> Kirim setelah exit gate tahap 14 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Implement production-minded connector architecture with safe nonproduction testing.

DELIVER:
- Connector registry, connection manager, OAuth scopes and consent flows, token refresh/revoke, encrypted secrets, provider adapters, sync cursor/retry/conflict handling, webhook verification and replay prevention.
- Gmail and Outlook: authorized inbox/thread linking, drafts, approved sending, attachments, delivery/error tracking when provider supports.
- Google Drive and OneDrive: browse/attach, Link/Copy/Sync, version metadata, permission-aware search, handling moved/deleted external files.
- External REST API and webhooks with OpenAPI docs, scopes, rate limits, API access logs; provider simulation adapters for test mode.
- Email→AI extraction limited to untrusted data, never automatic privileged commands; anti prompt-injection + human approval.

RULE: Do not invent provider credentials or assert a live connection until real OAuth succeeds. Without connection, finish adapter code and provider sandbox tests, then label it BLOCKED_BY_CREDENTIALS.

EXIT GATE: Automated provider-mock and webhook security tests pass; any real connector verified explicitly and documented as connected/not connected.
```

## PROMPT 16 — Business Intelligence & semantic metrics layer

> Kirim setelah exit gate tahap 15 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Implement trusted operational analytics and company-wide reporting.

DELIVER:
- Canonical KPI definitions (formula, entity/plant scope, period, currency, timezone, freshness, source lineage), semantic metrics services and authorization filters.
- Read models/materialized summaries separated from operational posting, including incremental/rebuild strategy and reconciliation checks.
- Executive dashboard plus scoped ERP, MES, HRIS, CRM, Finance, Quality and Maintenance dashboards.
- Drill-down from KPI to authorized source transaction; estimated vs reconciled cost and real-time vs period-close data clearly labeled.
- Reporting exports, flexible filters, plant comparisons with normalized definitions, scheduled internal report drafts where permissions allow.

TEST: Aggregated metrics reconcile to synthetic source transactions; no unauthorized financial/payroll leakage through BI; report queries don't block stock posting in test workload.

EXIT GATE: At least one executive cross-domain report reconciles to Sales, Production, Inventory and GL; no fake or hardcoded KPI data.
```

## PROMPT 17 — AI Module Copilots + Company Copilot

> Kirim setelah exit gate tahap 16 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Build a governed AI platform on tested business APIs and semantic metrics. NOT unrelated chatbot widgets.

DELIVER:
- Model gateway/provider abstraction, session/user/tenant scope, prompt+tool versioning, observed token costs, model fallbacks, approval-aware tool executor, structured error responses and audit.
- Specialized copilots: ERP, MES, HRIS, CRM, Finance, QMS, Maintenance, Workspace, Automation.
- Company Copilot: cross-domain analytical query → scoped retrieval → KPI and source evidence → constraints → recommendation/simulation → proposal → approval-required action.
- DMS RAG with access-filtered retrieval; document content, email and external pages treated as untrusted. Tools limited by least privilege, no arbitrary SQL or unsafe workflow bypass.
- Forecasting/optimization where measurable data suffices; use statistical/solver models for numeric predictions and constraints, not language-model guesses.
- Eval harness with factual grounding, permission leak attempts, prompt-injection, hallucination tests, workflow action correctness and cost budget.

TEST: CEO permitted multi-plant analysis, supervisor denied private payroll, malicious email cannot cause PO/payroll/payment action, every AI action is traceable and high-risk gated.

EXIT GATE: At least one verified end-to-end module copilot and Company Copilot scenario pass with evidence, RBAC, safe tool calls and approval path; other capabilities accurately labeled by implementation status.
```

## PROMPT 18 — Tenant/Admin, portals, subscription dan website

> Kirim setelah exit gate tahap 17 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Finish production-facing user experiences and business administration.

DELIVER:
- Organization Admin: legal entities, plants, teams, roles, policies, module entitlements, workflows, connector settings, storage quota, audit reviews.
- Platform Control Center: tenants, plans, subscriptions, billing status (safe test adapter), feature flags, usage/AI spend, operations health, restricted support access.
- Customer portal: order and document status subject to explicit customer permissions; Supplier portal: PO, responses, delivery status; Employee self-service portal for HRIS.
- Public website respecting official NewSystem brand, clear product status, full suite overview, industries, demo request, design partner application, marketing-approved copy and lead routing to CRM.
- Implement responsive flows for 57-screen UX register with loading, empty, error, validation and permissions states; gap audit with screenshots/tests.

RULE: No fake testimonials, certifications, integrations, metrics or unvalidated prices. Avoid collecting leads without consent, access controls and data policy.

EXIT GATE: Organization administration and external portals function with scoped data; website does not misrepresent maturity; screen register mapped to implemented/tested/blocked.
```

## PROMPT 19 — Hardening, tiga pilot UAT dan release gate R1

> Kirim setelah exit gate tahap 18 lulus.

```text
**ATURAN EKSEKUSI WAJIB UNTUK SETIAP PROMPT**
- Baca `AGENTS.md`, `docs/implementation/STATUS.md`, requirement IDs dan dokumen referensi terkait; jangan mengasumsikan file yang tidak bisa diakses.
- Jangan mengubah keputusan produk, logo, arsitektur atau data historis secara diam-diam. Pertahankan perubahan Git pengguna. Jangan reset DB, mengirim email nyata, melakukan pembayaran, atau deploy produksi tanpa izin eksplisit.
- Implementasikan kode dan test; jangan berhenti hanya membuat README/mockup. Jika keterbatasan waktu/akses, selesaikan satu slice koheren dan laporkan yang belum selesai secara jujur.
- Jalankan pemeriksaan relevan (lint, typecheck, unit, integration, migrations, E2E). Tidak ada fitur VERIFIED tanpa bukti. Setiap screenshot/preview demo harus diberi label bila berisi synthetic data.
- Update `REQUIREMENTS_MATRIX.md`, `STATUS.md`, ADR yang terdampak, serta daftar perubahan. Laporkan file yang berubah, perintah dan hasil tes, blokir, risiko, dan kesiapan fase selanjutnya.

Perform full-suite verification. Do not mark FULL_SUITE_R1=READY by assertion alone.

DELIVER:
- Full requirement→implementation→test traceability across ERP, MES, HRIS, CRM, Accounting, QMS, Maintenance, Workspace, Connect, Automation, BI, Module Copilots, Company Copilot.
- Security penetration-oriented checks (tenant isolation, IDOR, privilege escalation, OAuth scopes, file sharing, prompt injection, data leakage), backup/restore drill, audit retention, accessibility review.
- Performance tests with stated synthetic load and p95 latency budgets; mobile/offline retry and multi-plant datasets.
- UAT for 3 isolated pilot factories: Furniture job order; Garment repetitive variants; F&B batch/lot/expiry, plus shared full-suite business flows.
- Financial and inventory reconciliation; payroll correctness reviewed by domain experts; AI evaluation and human action gates; DMS document finalization and connector reliability tests.
- `docs/implementation/R1_RELEASE_READINESS.md` with pass/fail per gate, known defects, severity, unresolved blockers, rollback and incident response.

NO-GO: Any critical security/privacy issue, silent duplicate stock or financial postings, unexplained GL/stock reconciliation, fake module completion, or unapproved payroll/statutory logic.

EXIT GATE: Only recommend R1 candidate if ALL mandatory gates are evidenced; otherwise return exact blocker list and remediation order.
```

---

# Prompt perbaikan jika suatu fase gagal

```text
Jangan melanjutkan ke fase berikutnya. Audit fase yang terakhir dikerjakan dan baca AGENTS.md, STATUS.md, serta acceptance criteria fase itu.
Identifikasi semua failing tests dan unmet exit gates. Reproduksi error secara deterministik, temukan root cause, buat perbaikan terkecil yang koheren, jalankan ulang tes lintas-domain yang terdampak, dan perbarui STATUS.md dengan hasil nyata. Jangan mengubah seed/test agar lulus secara palsu. Berikan daftar failure awal, file yang diperbaiki, hasil tes, risiko residual, serta keputusan PASS/BLOCKED. Jangan lanjut otomatis ke fase selanjutnya.
```

# Prompt melanjutkan sesi Codex yang terputus

```text
Lanjutkan pekerjaan NewSystem yang terakhir secara aman. Baca AGENTS.md, docs/implementation/MASTER_PLAN.md, REQUIREMENTS_MATRIX.md, STATUS.md, Git status, dan test logs. Tunjukkan fase terakhir yang benar-benar VERIFIED serta fase in-progress. Lanjutkan satu incomplete vertical slice pada fase saat ini tanpa mengulang code yang valid. Jalankan pengujian, perbarui progress dengan evidence, dan jangan melompat ke fase berikutnya sebelum exit gate lulus.
```

# Format laporan Codex setelah tiap fase

```text
PHASE: <number and title>
STATUS: PASS / PARTIAL / BLOCKED
REQUIREMENTS COMPLETED: <IDs>
IMPLEMENTED: <working flows, not UI-only>
FILES CHANGED: <paths>
MIGRATIONS: <names and outcomes>
TEST COMMANDS + RESULTS: <exact>
INTEGRATION EVIDENCE: <transaction or event identifiers>
SECURITY CHECKS: <positive/negative>
KNOWN DEFECTS: <severity>
BLOCKERS: <missing inputs or access>
NEXT APPROVED PHASE: <number or NONE>
```
