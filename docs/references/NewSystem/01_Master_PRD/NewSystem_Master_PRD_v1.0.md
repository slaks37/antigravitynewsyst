# NewSystem — Master PRD v1.0

> Founding Draft · 10 Oktober 2026 · Confidential

General Manufacturing • Multi-Industry • Multi-Company • Multi-Plant • Multi-Module
| Dokumen | Status |
|---|---|
| Versi | 1.0  /  Draft untuk review pendiri, domain expert, engineering dan pilot partners |
| Tanggal | 10 Oktober 2026 |
| Owner | Founding Product / Engineering |
| Ruang lingkup | ERP, MES, HRIS, CRM, Accounting, QMS, Maintenance, Workflow Automation, BI/AI, Workspace/DMS, Connect/API, Admin |
| Validasi | 3 design partner: Furniture, Garment, F&B |
| Sasaran rilis | Full Suite R1: seluruh suite memiliki workflow operasional end-to-end yang diuji |

Dokumen ini adalah product baseline untuk disepakati, bukan klaim produk telah dibangun, tersertifikasi, atau terintegrasi dengan provider eksternal.
Status requirement: R1 = wajib untuk komitmen Full Suite R1; R1+ = kebutuhan lanjutan enterprise/vertical. Daftar capability di setiap suite adalah target produk lengkap; kedalaman R1 dibatasi oleh acceptance criteria serta architecture decisions.

---

# 0. Ringkasan eksekutif
NewSystem adalah unified Business & Manufacturing Operating System untuk digitalisasi pabrik kecil hingga enterprise, dimulai dari General Manufacturing. NewSystem memadukan ERP, MES, HRIS, CRM, Accounting, Automation, Intelligence, Workspace, DMS, dan integration hub dalam pengalaman yang sederhana bagi tiap peran. Core domain mendukung make-to-order, make-to-stock, batch, discrete, repetitive, dan hybrid production dengan industry templates.
North Star: verified end-to-end business process completion — persentase proses bisnis yang selesai dan dapat ditelusuri dari dokumen sumber, aksi operasional, transaksi keuangan, sampai KPI. System of record dan kontrol approval tidak boleh diambil alih AI.

## 0.1 Keputusan produk yang mengikat
| Area | Keputusan |
|---|---|
| Nama | NewSystem; menggantikan working name sebelumnya. |
| Scope | Seluruh suite fungsional dalam Full Suite R1: ERP, MES, HRIS, CRM, Accounting, Workflow, AI/BI; Quality, Maintenance, Workspace dan Connect terintegrasi. |
| Platform | Web desktop, tablet, mobile PWA; kapabilitas native/hybrid hanya bila diperlukan. |
| Industry | General Manufacturing sebagai segmentasi pilot; template F&B, Garment, Furniture/Assembly pada tiga design partner. |
| Architecture | Modular monolith transactional core dengan bounded contexts, outbox, async workers, reporting read models, optional industrial edge. |
| Copilots | Satu shared AI platform dengan per-module copilot, company copilot, permission-aware tools, traceable evidence dan approval. |
| Documents | Hybrid editor, managed file storage, versioning, PO/invoice sebagai transaksi resmi, external Drive/OneDrive link/copy/sync. |
| Release claim | Full Suite R1 hanya dinyatakan siap jika acceptance gates di seluruh suite, keamanan, rekonsiliasi dan pilot lulus. |


## 0.2 Produk bukan ini
- Bukan kumpulan tujuh UI dengan database saling bertentangan.
- Bukan AI chatbot bebas melakukan posting jurnal, pembayaran, pemutusan kerja, atau mengendalikan mesin.
- Bukan custom software yang di-fork khusus setiap pabrik.
- Bukan sekadar digitalisasi formulir tanpa stock, labor, costing, dan audit yang dapat direkonsiliasi.

## 0.3 Outcome bisnis dan indikator
| Outcome | KPI utama | Target awal (hipotesis) |
|---|---|---|
| Adopsi digital | Digital process completion untuk order pilot | ≥80% eligible orders |
| Integritas transaksi | Silent duplicate stock/financial postings | 0 |
| Laporan dapat dipercaya | Unexplained reconciliation differences | 0 pada sampel UAT |
| Konfigurabilitas | Workflow core yang tidak butuh customer code fork | ≥80% kebutuhan pilot |
| Manfaat bisnis | Lead time laporan, akurasi stok, actual HPP coverage | Baseline→improvement per pabrik |
| Commercial validation | Design partner yang lanjut ke penawaran | ≥2 dari 3 |


# 1. Product context, goals & boundaries

## 1.1 Persona dan ICP
ICP awal: pabrik 20–200 pekerja, satu hingga tiga plant, proses MTO/MTS/campuran, dengan pencatatan manual/spreadsheet atau aplikasi terfragmentasi. Ukuran ini adalah hipotesis rekrutmen, bukan pembatas platform.
| Persona | Goals | Daily workspace |
|---|---|---|
| CEO/Owner | Profit, delivery risk, capital planning | Company Overview + Company Copilot |
| COO/Plant Manager | Output, yield, utilization, orders | Plant Command Center |
| PPIC | Demand, MRP, resource scheduling | ERP Planning |
| Purchasing/Warehouse | Supplier, PO, stock flow | Procurement + Warehouse |
| Supervisor/Operator | Work instruction, execution, scrap, shift | MES Shop Floor |
| QA/QC | Accept/reject/rework, lot traceability | Quality Workspace |
| HR/Payroll | Employee, shift, attendance, payroll | HRIS |
| Sales/CS | Lead, order, delivery promise, complaint | CRM |
| Finance/CFO | AR/AP, journals, HPP, closing | Accounting |
| Admin/IT | Role, template, integrations, audit | NewSystem Admin |


## 1.2 Design principles
- Single system of record per business object; domain owners control write operations.
- Company/legal entity/plant/department context explicit in UI, API, event, AI, report dan file.
- Satu core multi-industry; konfigurasi mencakup template, data fields, routing, workflow, policy dan bukan fork per pelanggan.
- Immutable business posting atau reversal/correction yang diaudit; historis transaksi dan document final tidak di-overwrite.
- Offline support selective; server finalizes critical stock, payroll, QC release, accounting posting.
- Every AI suggestion has evidence, confidence/limitations, preview and approved action boundaries.
- Modular activation affects navigation/entitlement, bukan menghilangkan master data atau shared controls.

## 1.3 Full Suite R1 definition
R1 tidak berarti seluruh fitur niche enterprise matang di semua negara. R1 harus memiliki working vertical slice untuk setiap suite, semua posting kritis teruji, laporan keuangan dapat direkonsiliasi, serta QA end-to-end tiga pilot. Advanced extensions seperti finite capacity optimization, PLC control, complex multinational consolidation dan highly regulated vertical certifications merupakan R1+ kecuali diperlukan pilot tertentu.

## 1.4 Assumptions & dependencies
- Pabrik pilot memberi data awal dan time-series operasional minimum untuk validasi.
- Pemilik proses Finance/Payroll menandatangani accounting policy dan formula regulasi, bukan mengandalkan implementasi software saja.
- Koneksi Gmail/Google Drive/Microsoft 365 bergantung pada persetujuan tenant, OAuth scope dan provider API.
- AI forecasting and maintenance prediction hanya boleh masuk production apabila evaluasi kualitas data dan model lulus.
- Implementasi native phone apps tidak menjadi dependency R1; mobile PWA menjadi default.

# 2. System architecture & domain ownership
Arsitektur: UI workspaces → API/Auth → bounded domain services (ERP/MES/HRIS/CRM/Accounting/QMS/Maintenance/Workflow/DMS/Connect) → PostgreSQL transactional source → transactional outbox/queue → reporting read models → BI/AI. Workspace dan Connect menyimpan metadata, tidak mengganti kepemilikan transaksi domain.

## 2.1 Business objects & source of truth
| Business object | Domain owner | Consumers |
|---|---|---|
| Organization, legal entity, plant, access | Core/IAM | All |
| Customer, opportunity, quotation, sales order | CRM / Sales | ERP, Accounting, BI |
| Item, UOM, BOM revision, routing revision | ERP / Engineering Master | MES, Inventory, CRM |
| Production plan / order release | ERP/PPIC | MES, HRIS, Inventory |
| Shop-floor actual operation, labor usage | MES | ERP, Costing, HRIS |
| On-hand/reserved/blocked stock and movement | ERP/WMS | MES, CRM, Accounting |
| QC inspection and quality disposition | QMS | MES, Inventory, CRM |
| Employee master, contracts, payroll | HRIS | MES limited, Accounting |
| Inventory valuation, journal, AR/AP | Accounting | ERP, BI |
| Workflow definition, run, approvals | Automation | All authorized modules |
| File metadata, versions, retention | Workspace/DMS | All authorized modules |
| Connection settings, cursors, sync jobs | Connect | DMS, Email, Automation |
| KPI definition, derived insight, forecast | Intelligence | All authorized modules |


## 2.2 Communications contract
| Interaction | Semantics | Control |
|---|---|---|
| Command | Request to responsible domain; can reject | Authorization, validation, idempotency_key |
| Event | Fact AFTER source transaction committed | Event ID, correlation, schema version, outbox, replay |
| Query | Read-only authorized lookup / projection | Tenant/plant filtering, data freshness, limit |
| Automation action | Approved domain command from workflow | Service principal + origin actor + policy + approvals |
| AI tool invocation | Read/draft/execute according to capability | Tool allowlist, RBAC, approval, audit, evidence |


## 2.3 Invariants global
- Tidak boleh terjadi stock movement atau GL posting ganda meskipun request/event di-retry.
- Posting ke legal entity lain membutuhkan explicit intercompany rules and permission.
- Timestamp disimpan UTC dengan plant-local timezone untuk UI/report; document number segmented by entity/type/period.
- Document PDF bukan system of record keuangan: data invoice/PO sumber berasal dari Accounting/Procurement.
- Work order release membekukan BOM/routing version snapshot; revision berdampak lewat engineering change control.
- Customer/cost/payroll data terisolasi secara tenant+role; Company Copilot bukan universal superadmin.
- Real-time operational KPI dan closed-period financial KPI tidak disamakan.

# 3. Detailed functional requirements by domain

## 3.1 NewSystem Core & Administration
Tujuan: Multi-tenant backbone, legal entity, plant structure, identity, RBAC, module entitlement, audit and subscription.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Tenant, legal entity, plant, user, membership, role, entitlement, audit policy |
| Input dari modul lain | Subscription state, identity provider signals |
| Output/event utama | TenantCreated, PlantActivated, UserRoleChanged, ModuleEnabled |
| State penting | Tenant: trial/active/suspended/closed; Membership: invited/active/disabled |
| Dependensi | Authentication, configuration store, secrets, audit trail |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| CORE-001 | Tenant/Company/Plant | Support group→legal entity→plant→warehouse/line/work center; enforce ownership. |
| CORE-002 | IAM & MFA | SSO/OIDC where configured; MFA required for sensitive roles; invite & revoke. |
| CORE-003 | RBAC + scope | Permission matrix by action, org/entity/plant/department/document classifications. |
| CORE-004 | Segregation of duties | Block self-approval of sensitive documents, stock adjustments, payments and payroll. |
| CORE-005 | Module Registry | Industry templates, activate/deactivate module; dependency validation. |
| CORE-006 | Subscription & Entitlement | Plan, usage, plant/user limits, grace state; never silently erase data. |
| CORE-007 | Audit service | Immutable actor, timestamp, origin, before/after reference and reason. |
| CORE-008 | Policy & numbering | Company document number series, fiscal/calendar settings, locale and currency. |
| CORE-009 | Support access | Time-bound delegated support access with approval, scope and audit. |
| CORE-010 | Organization admin | Scoped admin for locations, users, access, templates and connector controls. |


### Business rules & invariants
- Tenant_id mandatory in all tenant-scoped objects, with server-side enforcement and automated cross-tenant tests.
- Disabling a module retains historical records and financial obligations; hidden menus do not bypass audit and retention.
- Platform admin does not inherit business data access by default; support requires explicit delegated access.

### AI Copilot
NewSystem Setup Copilot can interview admin, propose org hierarchy, configure templates, prepare user-import draft and identify missing settings; role or policy mutations require authorized confirmation.

### Exception handling
Suspended tenants retain recovery/read access according to policy; invitation replay, lost MFA, conflicted role, and partially provisioned plant require resilient recovery.

## 3.2 NewSystem ERP
Tujuan: Enterprise resource planning, MRP, procurement, warehouse, distribution, engineering masters, planning and inventory.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Item/UOM, BOM/routing master, production plan/release, PO, inventory stock ledger, reservations |
| Input dari modul lain | CRM demand/ATP, MES consumption & output, QMS disposition, finance valuation, maintenance spare parts |
| Output/event utama | SalesDemandAccepted, MaterialShortageDetected, PurchaseOrderApproved, GoodsReceived, StockMoved, WorkOrderReleased |
| State penting | PO: draft→approved→ordered→partial/full received→closed; stock: available/reserved/held/in-transit |
| Dependensi | Core, CRM demand, QMS, MES, Accounting |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| ERP-001 | Item & UOM Master | Materials/WIP/finished goods, variants, conversion, track lot/serial/expiry by policy. |
| ERP-002 | Engineering BOM | Multilevel BOM and effective-dated revision, approved components/substitutes. |
| ERP-003 | Routing Master | Operations, standard time, work center, prerequisites, revision snapshot. |
| ERP-004 | Demand & MPS | Orders/forecast → net requirement and production plan with MTO/MTS modes. |
| ERP-005 | MRP Planner | Time-phased gross requirements, on-hand, reservation, incoming PO, yield, MOQ, safety stock. |
| ERP-006 | Capacity Check | Rough-cut work center availability and known shift/downtime constraints. |
| ERP-007 | Purchasing | PR/RFQ/comparison/PO/change order/approval and supplier performance basics. |
| ERP-008 | Goods Receiving | Partial receipt, inspection staging, discrepancy, supplier returns, supplier delivery docs. |
| ERP-009 | Warehouse Stock Ledger | Receive, putaway, move, reserve, issue, consume, return, adjust, cycle count. |
| ERP-010 | Traceability | Identify lot, batch, expiry, warehouse and upstream/downstream material events. |
| ERP-011 | Distribution | Pick, pack, dispatch, partial shipments, return and delivery confirmation. |
| ERP-012 | Interplant Transfer | Transfer orders, goods in transit, receiving and legal entity distinctions. |
| ERP-013 | Supplier & Asset Registry | Supplier contract details, equipment references, consumables/spare-part masters. |


### Business rules & invariants
- Available = on-hand minus blocked and reserved (with dates, allocation policy); ATP/CTP is a time-phased promise, not current stock alone.
- PO approval does not add physical inventory; goods receipt is posted by authorized WMS process, with QMS hold where required.
- Material issuance must reference source, location, lot, work order or cost object and produce auditable movement.
- Stock adjustments create offsetting movement, require reason and configured approval, never edit balances in place.
- MRP produces recommendations; no auto-purchasing without explicit automation policy, approval and idempotency.

### AI Copilot
ERP Copilot: explain shortages, compare approved supplier options, suggest purchase requisitions, evaluate stock/lead-time risk, simulate delivery promise and draft resource plans; execute only authorized commands.

### Exception handling
Handle partial PO, backorders, incoming lots on hold, alternate UOM, split shipments, expired material, substitute material approval, late supplier and negative-stock prevention.

## 3.3 NewSystem MES
Tujuan: Shop-floor execution and actual production traceability for batch, discrete, repetitive, job and hybrid manufacturing.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Operation execution, job card, machine state, production output, actual labor and material consumption signals |
| Input dari modul lain | Released production orders/BOM/routing, inventory availability, HRIS shift/skills, QMS approvals |
| Output/event utama | JobStarted, OperationCompleted, ProductionOutputRecorded, DowntimeRecorded, MaterialConsumed, ProductionCompleted |
| State penting | Work order: draft/planned/released/in_progress/paused/QC_review/completed/closed/cancelled with guarded transitions |
| Dependensi | ERP/PPIC, Warehouse, HRIS workforce, QMS, Costing |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| MES-001 | Multi-mode production | Process batch, discrete/job, repetitive, MTO/MTS, hybrid in one engine. |
| MES-002 | Work Order & Job Card | Release snapshot, assign resources, print/scan digital instructions and work cards. |
| MES-003 | Routing Execution | Validate predecessor operations, alternative routes, skip with authorized reason. |
| MES-004 | Shop-floor Mobile | Operator task list with start/pause/stop/complete and large touch targets. |
| MES-005 | WIP & Partial Output | Track accepted, under review, rejected and rework quantities per operation. |
| MES-006 | Material Actuals | Record issued vs consumed vs returned, quantity variance, lot genealogy. |
| MES-007 | Labor Actuals | Track productive time, waiting, downtime and cost objects; avoid duplicate clocking. |
| MES-008 | Production Batch/Serial | Split/merge/serial genealogy, co-product/by-product where configured. |
| MES-009 | Scrap & Rework | Reason codes, authorized disposition, rework routing and additional cost. |
| MES-010 | Equipment Downtime | Track planned/unplanned downtime, reason and maintenance request event. |
| MES-011 | Production Review | Closeout requires quantity reconciliation, QC outcomes and cost status. |
| MES-012 | Offline Draft Capture | Store selected job-card data offline with temp UUID and reconciliation on reconnect. |
| MES-013 | OEE & Throughput | Calculate measures only where cycle-time and machine signals are validated. |


### Business rules & invariants
- Operator output does not automatically become available finished goods; QMS disposition and inventory receipt decide availability.
- Input lot-to-output lot transformation must be traceable with validated quantities and UOM.
- Production order already released retains approved BOM/routing snapshot; change order is explicit and auditable.
- Offline cannot approve QC/stock posting/critical production closeout without server validation.
- Closeout must reconcile input quantities, output, scrap/rework/WIP and accumulated costs, with exception workflow if differences.

### AI Copilot
MES Copilot: work-instruction retrieval, job-card assistance, contextual root-cause for downtime/yield, recommended schedule adjustments, line performance summaries; cannot control PLC/SCADA safety operations.

### Exception handling
No material, partial finish, broken machine, wrong batch, barcode mismatch, shift transfer, QC rework loop, duplicate mobile sync and cancellation of partially consumed work orders.

## 3.4 NewSystem Quality (QMS)
Tujuan: Formal inspection, release, non-conformance, corrective actions and production/supplier quality traceability.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Inspection plan/results, hold/release/reject, NCR, CAPA, sample and evidence record |
| Input dari modul lain | Goods receipt, MES execution, customer complaint, lot/serial, document SOP versions |
| Output/event utama | InspectionPassed, QualityHoldPlaced, LotReleased, MaterialRejected, NCRCreated, CAPAClosed |
| State penting | Inspection: scheduled/in_progress/pass/hold/reject; NCR: open/investigation/action/verification/closed |
| Dependensi | MES, Inventory, Workspace/DMS, CRM |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| QMS-001 | Quality Standards | Checklist, tolerances, inspection plan, sampling plan with effective version. |
| QMS-002 | Incoming QC | Review supplier receipts before stock release. |
| QMS-003 | In-Process QC | Inspection gate by operation, operator/work center or rule. |
| QMS-004 | Final QC | Formal acceptance required for configured products or batches. |
| QMS-005 | Quality Hold | Quarantine by lot/serial/quantity and block stock allocation. |
| QMS-006 | Defect/NCR | Record defect class, severity, cause, photo and linked business objects. |
| QMS-007 | Rework/Scrap/Concession | Disposition requests requiring configured approval and cost impact. |
| QMS-008 | CAPA | Create action plan, owner, due date, effectiveness check and closeout. |
| QMS-009 | Traceability & Recall | Backward/forward lot search, suspected/affected goods identification. |
| QMS-010 | Quality Docs | Certificates, reports, test evidence linked to stored immutable versions. |


### Business rules & invariants
- QC disposition controls inventory usability, not just UI labels.
- Inspection evidence version and inspector identity remain auditable; self-release can be disallowed.
- Retest after rework does not erase initial failure, reason or cost.

### AI Copilot
QMS Copilot: classify and summarize nonconformances, draft CAPA, highlight rising defect patterns, retrieve SOP versions, trace potentially affected batches and draft supplier notice for review.

### Exception handling
Partial lot rejection, expired test equipment, missing inspection record, failed retest, late sampling, supplier dispute and recalled lot already shipped.

## 3.5 NewSystem Maintenance
Tujuan: Maintain equipment uptime, maintenance history, spare parts and controlled return to service.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Equipment condition, service requests, work orders, maintenance schedule and repair results |
| Input dari modul lain | MES downtime, ERP spare-parts inventory, employee skill/availability, QMS calibration constraints |
| Output/event utama | MachineDown, MaintenanceRequested, WorkOrderCompleted, MachineReleased |
| State penting | Service ticket: requested/triaged/assigned/in_progress/testing/closed |
| Dependensi | ERP assets/inventory, MES, HRIS, DMS |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| MNT-001 | Asset & Equipment | Register machines, criticality, location, service history, ownership. |
| MNT-002 | Preventive Maintenance | Calendar/runtime/cycle based maintenance triggers and schedules. |
| MNT-003 | Corrective Work Order | Issue, assign, record actions, photos, parts, labor, close. |
| MNT-004 | Spare Parts | Reserve and consume inventory using authorized stock transactions. |
| MNT-005 | Downtime Linkage | MES stop reason and equipment incident linked to maintenance ticket. |
| MNT-006 | Calibration | Certificate, due date, instrument lockout as policy. |
| MNT-007 | Cost & Reliability | Maintenance cost, MTBF/MTTR with known definitions. |
| MNT-008 | Safe Return-to-Service | Approvals/checklist before MES equipment marked available. |


### Business rules & invariants
- AI/automation cannot directly start/stop or override safety-critical machinery.
- Maintenance consumption must use WMS stock posting and unique cost object.
- Critical asset return requires authorized testing and closeout.

### AI Copilot
Maintenance Copilot: detect repeat breakdown patterns, recommend inspections/spares using records, prepare work-order draft and forecast failure risk only when sufficient data supports it.

### Exception handling
No parts available, service outside plant, partially repaired equipment, invalid calibration and safety lockout.

## 3.6 NewSystem HRIS
Tujuan: Full employee lifecycle, time attendance, scheduling, payroll, performance and workforce allocation linked to manufacturing.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Employee master, employment contracts, attendance, leave/overtime, payroll, benefits and personal data |
| Input dari modul lain | MES time/skills utilization, organization roles, approved policies, Accounting journal status |
| Output/event utama | EmployeeActivated, ShiftPublished, LeaveApproved, OvertimeApproved, PayrollFinalized |
| State penting | Employment: candidate/onboarding/active/leave/offboarded; Payroll: draft/review/approved/finalized/posted |
| Dependensi | Core/IAM, MES, Accounting, Workspace, local HR regulation rules |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| HRIS-001 | Recruitment & Offer | Manpower request→recruitment pipeline→offer→approved onboarding. |
| HRIS-002 | Employee Master | PII, employment state, entity/department/plant/contract, document links. |
| HRIS-003 | Org & Positions | Reporting hierarchy, grades, department, skill matrix and certifications. |
| HRIS-004 | Attendance | Clock-in/out, corrections, shift mapping, exception and approval. |
| HRIS-005 | Shift & Rostering | Publish schedules, availability/skills/capacity and conflict checks. |
| HRIS-006 | Leave | Policy, accrual/entitlement, request, approval, balance. |
| HRIS-007 | Overtime | Request, preapproval, actual hours and rate calculation rules. |
| HRIS-008 | Payroll & Payslip | Earnings, deductions, statutory parameters, proration, finalized payslip. |
| HRIS-009 | BPJS & Tax Parameters | Configurable Indonesia payroll settings with effective dates and export/integration. |
| HRIS-010 | Performance & Development | Goals, appraisals, training, competency and certification renewal. |
| HRIS-011 | Employee Self Service | Employee-specific profile, leave, payslip, attendance and documents. |
| HRIS-012 | Payroll Accounting | Generate approved posting package by legal entity and period; reconcile. |
| HRIS-013 | Labor Cost Allocation | MES hours→cost center/WIP allocation without double counting wage expense. |


### Business rules & invariants
- Only HR/payroll authorized roles see individual compensation and sensitive employee details.
- Attendance hours, payable hours and productive MES hours are separate measures.
- Final payroll immutable except controlled reversal/adjustment; tax/BPJS parameters versioned by period.
- Employee deactivation revokes access without deleting historical production/labor records.

### AI Copilot
HRIS Copilot: propose shifts respecting skill, leave and work-hour constraints; summarize staffing gaps, draft HR letters and onboarding tasks; sensitive recommendations need fairness review and human HR decision.

### Exception handling
Missing attendance, multiple shifts, cross-plant workers, off-cycle payroll, retroactive adjustment, absence dispute, terminated employee with unclosed task.

## 3.7 NewSystem CRM
Tujuan: B2B sales lifecycle from lead to after-sales and realistic production-aware commitment.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Customer accounts/contacts, lead, opportunity, quote, sales order, customer correspondence, service ticket |
| Input dari modul lain | ERP ATP/CTP, production order progress, inventory availability, invoice/payment status |
| Output/event utama | LeadQualified, QuotationApproved, SalesOrderConfirmed, SalesOrderRevised, ComplaintOpened |
| State penting | Lead: new/qualified/disqualified; Opportunity: open/won/lost; Sales Order: draft/confirmed/partial/fulfilled/closed/cancelled |
| Dependensi | Core/contacts, ERP planning, Accounting billing, Connect email |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| CRM-001 | Lead & Account | Lead capture, dedupe, segmentation, consent and owner assignment. |
| CRM-002 | Opportunity Pipeline | Stage, probability, expected close, activity, forecast. |
| CRM-003 | Quotation & CPQ Lite | Price list, tax/discount, cost estimate, margin threshold and approval. |
| CRM-004 | ATP/CTP Estimate | Query ERP time-phased material/capacity/finished-stock before due-date promise. |
| CRM-005 | Sales Order | Confirmed demand, revision history, partial fulfillment, cancellation rules. |
| CRM-006 | Contracts & Documents | Agreement terms, price schedules, versioned attachments via Workspace. |
| CRM-007 | Customer Portal | Authenticated quote/order/shipment/invoice visibility by account. |
| CRM-008 | Account Correspondence | Link email thread, tasks, calls and documents to customer. |
| CRM-009 | Service & Returns | Ticket, RMA, QMS NCR/CAPA routing and resolution history. |
| CRM-010 | Revenue & Customer BI | Pipeline, repeat order, churn risk, realized margin and AR flags. |


### Business rules & invariants
- Sales order confirmation is a demand signal, not automatic production if finished-stock/other supply available.
- A revised quote/order creates controlled new version; downstream commitments are re-evaluated rather than silently overwritten.
- Invoice posting and received payment remain Accounting-owned; CRM reads their status.

### AI Copilot
CRM Copilot: draft proposals/quotations/email, explain promised delivery based on ERP, prioritize pipeline, analyze customer margins/retention, create follow-up tasks with consent/approval.

### Exception handling
Price amendment after approval, customer credit hold, urgent order, partial deliveries, contract terms, warranty claim and duplicate customer leads.

## 3.8 NewSystem Accounting & Finance
Tujuan: Financial source of truth for legal entities: double-entry ledger, AR/AP, inventory valuation, manufacturing costing, tax and closing.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Chart of accounts, journal lines, AR/AP documents, cash/bank, valuation, financial periods, reports |
| Input dari modul lain | CRM billing triggers, ERP PO/receipt/movement, MES costing facts, HRIS finalized payroll |
| Output/event utama | InvoicePosted, SupplierBillApproved, PaymentMatched, JournalPosted, PeriodClosed |
| State penting | Journal: draft/validated/approved/posted/reversed; Period: open/soft_close/locked |
| Dependensi | Core legal entity, CRM, ERP, MES, HRIS, banking/tax providers |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| ACC-001 | COA & Dimensions | Company-specific chart, cost center, plant, segment, fiscal period. |
| ACC-002 | Double Entry GL | Balanced debit/credit, journal sources, posting rules, reversal. |
| ACC-003 | AR | Invoice, credit note, collection, receipt allocation and aging. |
| ACC-004 | AP | Supplier bill, credit/debit memo, 3-way match PO/receipt/invoice and aging. |
| ACC-005 | Bank & Cash | Bank accounts, payment batches, reconciliation, cash book. |
| ACC-006 | Inventory Valuation | Value ledger tied to quantity movement; configurable approved valuation methods. |
| ACC-007 | Manufacturing Cost | Planned/actual material, labor, overhead, WIP, FG, COGS, scrap/rework treatment. |
| ACC-008 | Payroll Accounting | Expense, accrued liability, settlement and WIP allocation reconciliation. |
| ACC-009 | Fixed Assets | Acquire, capitalize, depreciate, transfer, dispose and report. |
| ACC-010 | Budget & Cost Control | Budgets, approval, budget-vs-actual, cost-center analysis. |
| ACC-011 | Tax Rules | Configurable tax codes, PPN/PPh parameterization and compliant documentation paths. |
| ACC-012 | Period Closing | Accrual, adjustment, checklist, lock, reopen by approval. |
| ACC-013 | Financial Reports | Trial balance, GL details, P&L, balance sheet, cash flow. |
| ACC-014 | Intercompany & Consolidation | Intercompany reference, elimination and consolidated statements for supported structure. |


### Business rules & invariants
- Every posted journal balances per entity/currency; posted entries immutable and reversed/adjusted explicitly.
- Invoices are transactional records; rendered PDFs are certified snapshots, not editable financial truth.
- Inventory quantity belongs to ERP, inventory valuation and GL to Accounting; reconcile by transaction/cost event ID.
- Recognize revenue, taxes, liabilities and costs according to approved entity-level accounting policy, not based on UI convenience.
- Period locking blocks late posts unless authorized reopening workflow exists.

### AI Copilot
Finance Copilot: draft reconciliation explanation, identify invoice duplicates, analyze variance and margin bridge, assist closing checklist and cash forecast. No unapproved journal posting, payment execution or tax filing.

### Exception handling
Exchange rate, negative inventory cost, month-end late receipts, supplier invoice mismatch, rejected payment, payroll reversal, revenue deferral and intercompany elimination.

## 3.9 NewSystem Automate
Tujuan: No/low-code business workflows across suites with policy-driven commands, human approvals and runtime observability.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Workflow templates/versions, definitions, executions, approvals, scheduling rules |
| Input dari modul lain | Business events and approved connectors |
| Output/event utama | WorkflowStarted, ApprovalRequested, WorkflowSucceeded, WorkflowFailed, Escalated |
| State penting | Definition: draft/test/published/disabled/retired; Run: pending/running/waiting_approval/succeeded/failed/compensated |
| Dependensi | Core policy/RBAC, all domain APIs, Connect, Notifications |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| AUT-001 | Visual Workflow Designer | Trigger-condition-branch-action nodes with drag/drop canvas. |
| AUT-002 | Dynamic Forms | Field validation, permissions, conditional sections, versioning. |
| AUT-003 | Event Registry | Subscribe to typed domain events with schema contracts. |
| AUT-004 | Rules Engine | Deterministic boolean, date, amount and threshold checks. |
| AUT-005 | Approval Engine | Role hierarchy, amount limit, step/parallel approval and SoD. |
| AUT-006 | Scheduler | Time-based runs, business-day calendar and timezone aware escalation. |
| AUT-007 | Actions | Only registered authorized domain commands; draft/preview mode. |
| AUT-008 | Notifications | In-app/email provider with delivery state and retry. |
| AUT-009 | External Actions | Connectors, webhooks, rate limiting, secrets. |
| AUT-010 | Runtime Monitoring | Run log, correlation IDs, replay, dead-letter, retry and error handling. |
| AUT-011 | Publishing Governance | Template/version approval, test simulation, staged enablement, rollback. |


### Business rules & invariants
- An automation cannot mutate other domain tables directly and cannot elevate actor permissions.
- Events may be delivered more than once; actions require idempotency keys.
- Cycle detection, max recursion/timeouts, backoff and circuit breaking required.
- AI-generated workflow draft must pass static validations and authorized publishing.

### AI Copilot
Automation Copilot converts natural language into a reviewable workflow DAG, explains each step, suggests guardrails, runs tests and diagnoses failed executions.

### Exception handling
Approval expired, user removed, connector disconnected, provider 429, partial external action, poison event, workflow version updated during run.

## 3.10 NewSystem Workspace & DMS
Tujuan: Hybrid document creation, managed file storage, team workspaces and official transaction document lifecycle.
| Dimensi | Spesifikasi |
|---|---|
| System of record | File metadata, file versions, folder permissions, templates, final document render, retention policies |
| Input dari modul lain | CRM quote, ERP PO, Accounting invoice, HR contracts, MES SOP, QMS evidence |
| Output/event utama | FileUploaded, DocumentDrafted, DocumentApproved, OfficialVersionFinalized, FileArchived |
| State penting | Document: draft/review/approved/final/archived; File: active/quarantined/deleted/retained |
| Dependensi | Core access, domain records, object storage, Connect Google/Microsoft, approval engine |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| DMS-001 | Hybrid Document Editor | Native editor for letter, memo, report, SOP; Word/Google Docs deep link for complex edits. |
| DMS-002 | Templates & Merge Fields | Kop surat, legal entity, variable placeholders, conditional content, branding. |
| DMS-003 | Business Document Generator | PO and invoice generated from approved transaction records, not ad hoc editable PDFs. |
| DMS-004 | Folders & Spaces | My Files, Team Files, Plant Files, Company Files, Archive, Connected Storage. |
| DMS-005 | Managed File Storage | Upload/download/preview/search, dedupe/checksum, anti-malware scan, quota. |
| DMS-006 | Version Control | Version IDs, revision comments, comparison, restore drafts; immutable finalized snapshots. |
| DMS-007 | Document Approval & Signing | Role approval, witness metadata, provider signing adapter, non-editable final. |
| DMS-008 | Business Record Attachments | Link to employee, machine, supplier, customer, PO, invoice, work order. |
| DMS-009 | External Sharing | Time-limited, revocable links, watermark/policy, download restrictions. |
| DMS-010 | Retention/Legal Hold | Policy by file class, legal hold, destruction request and audit. |
| DMS-011 | Document Search | Name, metadata, full-text index only for authorized document scope. |
| DMS-012 | AI Knowledge Retrieval | Permission-filtered RAG with source version and citation. |
| DMS-013 | Link/Copy/Sync Modes | Explicit semantics and conflict handling for Drive/OneDrive assets. |


### Business rules & invariants
- Official PO/invoice file is a render of verified business transaction; edits require revision in owning domain.
- External file deletion does not silently delete FactoryOS official archive or its audit reference.
- No cross-tenant search index leakage; every file read/embedding retrieval rechecks permission.
- Large/CAD files may use preview fallback; storage quota/accounting per tenant must be transparent.

### AI Copilot
Workspace Copilot can draft letters, compare supplier offers, find SOP/contracts, summarize QC records, create management report draft and store it to authorized folder; no silent approval/send.

### Exception handling
File virus detected, permission revoked, collaborative editor conflicts, missing cloud file, storage quota exceeded, legal hold, signature rejected, duplicate merge-field name.

## 3.11 NewSystem Connect & Communication
Tujuan: External APIs, email mailbox workflows, Drive/OneDrive storage connectors and secure integration execution.
| Dimensi | Spesifikasi |
|---|---|
| System of record | Connection metadata, OAuth grants, cursors, webhook subscriptions, sync jobs, logs |
| Input dari modul lain | Domain events, DMS change requests, CRM/ERP/Accounting messages |
| Output/event utama | ConnectorConnected, EmailReceived, SyncCompleted, SyncFailed, WebhookReceived |
| State penting | Connection: pending/active/degraded/expired/revoked; Sync: queued/running/succeeded/conflict/failed |
| Dependensi | Provider APIs, OAuth/secret vault, Workspace, Automate |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| CON-001 | OAuth Connections | Gmail, Microsoft 365, Google Drive, OneDrive with least-privilege scope. |
| CON-002 | Email Workspace | Draft, send, receive permitted threads, attachment scanning and business linking. |
| CON-003 | Email-to-Workflow | Classify validated inbound mail and suggest action; no untrusted direct commands. |
| CON-004 | Google Drive | Browse permitted files/folders, link/copy/sync, change tokens, sharing rules. |
| CON-005 | OneDrive/SharePoint | Browse permitted sites/drives, delta sync, version and permission-aware links. |
| CON-006 | Integration Registry | Provider type, version, permissions, tenant/plant owner and health. |
| CON-007 | REST API / OpenAPI | Versioned resource & command API with RBAC and quotas. |
| CON-008 | Inbound Webhooks | Verify signature/timestamp, dedupe, sanitize payload and dispatch. |
| CON-009 | Outbound Webhooks | Signed events, retry/backoff, consumer idempotency guidance. |
| CON-010 | Data Mapping & Sync | Mapping UI, validation, incremental cursor, conflict queue, reconciliation. |
| CON-011 | Developer Portal | Sandbox, test keys, usage, error documentation, key rotation. |
| CON-012 | Integration Observability | Sync reports, error queue, secret rotation, audit and fallback. |


### Business rules & invariants
- Emails, attachments and external documents are untrusted data; prompt injection and unauthorized instruction never become domain commands.
- OAuth tokens encrypted and scoped, refresh/revoke supported; connect does not imply universal folder/mail access.
- All sync actions specify link/copy/sync semantics, ownership and conflict resolution; official finalized docs never overwritten.
- API/webhook actions must be verifiable and idempotent or safely retryable.

### AI Copilot
Connect Copilot: classify permitted email/attachments, draft reply, detect supplier ETA changes, recommend mapping rules, explain integration errors, create safe draft workflows with approval.

### Exception handling
Rate limit, OAuth consent revoked, shared-drive permission removed, email spoofing, attachment malware, webhook replay, duplicate provider callbacks, mailbox quota and sync divergence.

## 3.12 NewSystem Intelligence & AI Copilots
Tujuan: BI, permission-aware analytics, domain copilots, cross-company copilot, forecasting and governed agent-assisted work.
| Dimensi | Spesifikasi |
|---|---|
| System of record | KPI catalogue, semantic models, forecast, evidence, model evaluation, agent/tool logs |
| Input dari modul lain | All permitted domain query APIs, DMS knowledge and approved events |
| Output/event utama | InsightGenerated, AlertRaised, RecommendationCreated, ActionApprovalRequested |
| State penting | AI action: suggest/draft/pending_approval/executed/rejected; model: testing/validated/active/suspended |
| Dependensi | Read models/warehouse, IAM, tool registry, Workflow, DMS |


### Functional requirements
| ID | Capability | Logic / acceptance condition |
|---|---|---|
| AI-001 | Semantic KPI Layer | Governed metrics, units, time period, plant/legal entity and calculation versions. |
| AI-002 | Department BI | Operational and finance dashboards with drill-down to source transactions. |
| AI-003 | Company Copilot | Cross-module question answering filtered by actor permission, legal entity and plant. |
| AI-004 | Module Copilots | ERP, MES, HRIS, CRM, Finance, QMS, Maintenance, Workspace and Automation specialists. |
| AI-005 | Knowledge RAG | Permission-checked SOP, contracts, records and final approved version citations. |
| AI-006 | Forecasting | Demand/inventory/cash/time-series predictions with historical backtest. |
| AI-007 | Optimization & Simulation | What-if schedule, supplier, workforce and costing without posting operational changes. |
| AI-008 | Anomaly Alerts | Rule/model-based thresholds, false-positive feedback and case workflow. |
| AI-009 | Agent Tool Catalog | Typed read, draft, controlled execution tools with explicit risk levels. |
| AI-010 | Approval & Action Log | Human checkpoints, execution receipts, actor, source, input/output traces. |
| AI-011 | AI Evaluation & Monitoring | Hallucination/evidence rates, permission tests, accuracy, drift, costs and latency. |
| AI-012 | AI Data Controls | PII minimization, tenant isolation, retention, model-provider usage policy. |


### Business rules & invariants
- Every financial answer distinguishes posted/closed financials from live unclosed operational estimates.
- Tool execution enforces original user permission; model confidence never grants authorization.
- High-risk financial/personnel/stock actions need human approvals; safety-critical control cannot be directly performed via chat.
- Predictive feature advertised as live only after minimum data sufficiency and model accuracy gate is satisfied.

### AI Copilot
Company Copilot is a multi-domain orchestrator that synthesizes CRM demand, ERP/MES execution, HR cost, and Accounting profit; produces evidence-linked diagnosis and coordinated proposals, never unrestricted admin access.

### Exception handling
Partial dataset, stale BI read model, contradictory period close, AI model outage, adversarial document prompt, permission changes mid-session and ungrounded predictive result.

# 4. Cross-suite business process specifications
Source domain harus memvalidasi command; event diterbitkan setelah commit. Automations and AI mengusulkan aksi, tidak dapat mengubah tabel domain secara langsung. Status dokumen dan transaksi utama harus tetap dapat dirunut saat partial processing atau retried events.

## BP-01 Lead-to-Cash
| Item | Spesifikasi |
|---|---|
| Trigger | CRM lead→quote→SalesOrderConfirmed |
| Orkestrasi lintas suite | ERP ATP/CTP & production demand; MES/QMS & WMS fulfill; Accounting invoice+AR→payment; CRM after-sales |
| Exception | SO revision triggers re-plan; split delivery; credit hold; down payment; late material |
| Final success condition | Quote promise traceable; AR only after proper financial posting. |


## BP-02 Procure-to-Pay
| Item | Spesifikasi |
|---|---|
| Trigger | MRP shortage / approved purchase request |
| Orkestrasi lintas suite | ERP RFQ→PO→receipt→incoming QC→inventory; Accounting 3-way-match→AP→payment |
| Exception | Part receipt, invoice-before-receipt, price/quantity variance, return |
| Final success condition | PO does not add stock; AP balances reconcile. |


## BP-03 Plan-to-Produce
| Item | Spesifikasi |
|---|---|
| Trigger | Sales demand/MPS/forecast |
| Orkestrasi lintas suite | ERP MRP/BOM/routing→released order; MES work cards/consume/output→QMS→FG receipt→costing |
| Exception | Material shortage, yield loss, rework, sub lot, operator offline |
| Final success condition | Actual material/quality/output/cost complete and traceable. |


## BP-04 Hire-to-Payroll-to-Cost
| Item | Spesifikasi |
|---|---|
| Trigger | Approved employee + shift/workforce plan |
| Orkestrasi lintas suite | HRIS attendance/leave/overtime→MES labor actuals→HRIS payroll→Accounting journal→WIP labor allocation |
| Exception | Shift changes, attendance dispute, retro payroll, offboarding |
| Final success condition | Payroll and WIP labor cost not double counted. |


## BP-05 Record-to-Report
| Item | Spesifikasi |
|---|---|
| Trigger | Period close request |
| Orkestrasi lintas suite | ERP/CRM/HRIS cost events→Accounting journals→reconcile→close→finance BI |
| Exception | Late receipt, closed period, unmatched bank payment |
| Final success condition | Balanced journals, no unexplained delta, locked reporting. |


## BP-06 Quality Incident-to-Resolution
| Item | Spesifikasi |
|---|---|
| Trigger | Failed incoming/in-process/final inspection |
| Orkestrasi lintas suite | QMS hold→NCR/CAPA→MES rework or supplier return→WMS disposition→Accounting cost→CRM notification |
| Exception | Recall, affected shipped items, partial lot |
| Final success condition | Blocked stock cannot be shipped; genealogy complete. |


## BP-07 Breakdown-to-Recovery
| Item | Spesifikasi |
|---|---|
| Trigger | MES downtime / maintenance schedule |
| Orkestrasi lintas suite | Maintenance job→ERP parts→HRIS technician→test→machine release→PPIC replan |
| Exception | Machine not safely released; missing parts |
| Final success condition | No AI direct machine actuation; downtime documented. |


## BP-08 Document-to-Archive
| Item | Spesifikasi |
|---|---|
| Trigger | User creates doc or domain emits official doc request |
| Orkestrasi lintas suite | DMS template/version→review/approve→final PDF→Connect send/copy/sync→audit/archive |
| Exception | Editable external copy, invalid signature, provider offline |
| Final success condition | Immutable authoritative document version preserved. |


## BP-09 Email-to-Business-Task
| Item | Spesifikasi |
|---|---|
| Trigger | Validated inbound supplier/customer email |
| Orkestrasi lintas suite | Connect scan/auth metadata→AI extraction draft→business owner review→domain command/response |
| Exception | Spoofed sender, malicious attachment, prompt injection |
| Final success condition | No inbound content can autonomously post PO/invoice. |


## BP-10 Company AI-to-Action
| Item | Spesifikasi |
|---|---|
| Trigger | CEO/Manager prompt |
| Orkestrasi lintas suite | AI cross-domain evidence & simulation→draft plan→Workflow approvals→authorized domain commands→execution feedback |
| Exception | Insufficient data, role permission, agent outage |
| Final success condition | Every recommended and executed action traceable. |


# 5. Event and command contracts
All events carry event_id, type, version, tenant_id, legal_entity_id, plant_id where applicable, aggregate_id, occurred_at UTC, actor, correlation_id, causation_id, and payload_schema_version. Sensitive data minimized. Consumers own replay/deduplication.
| Event | Producer | Consumers | Minimum payload |
|---|---|---|---|
| SalesOrderConfirmed | CRM | ERP Planning, BI | SO reference, lines, promised date |
| SalesOrderRevised | CRM | ERP, MES, Accounting | change version and material effect |
| ProductionRequirementCreated | ERP | PPIC, Workflow | demand-to-plan reference |
| MaterialShortageDetected | ERP | Procurement, AI, Workflow | item, required date, shortage |
| PurchaseOrderApproved | ERP | Supplier communication, BI | supplier, lines, terms, ID |
| GoodsReceived | ERP | QMS, Accounting | receipt, lot, accepted/staged qty |
| QualityHoldPlaced | QMS | ERP Inventory, MES, CRM | lot/serial, hold quantity |
| LotReleased | QMS | ERP Inventory, MES | lot/serial and disposition |
| WorkOrderReleased | ERP | MES, Workforce, BI | WO, BOM/routing snapshot |
| JobStarted | MES | BI, Workflow | job, work center, operator scope |
| MaterialConsumed | MES | ERP Inventory, Accounting | WO, item/lot, quantity |
| ProductionOutputRecorded | MES | QMS, BI | WO, accepted candidate output |
| ProductionCompleted | MES | ERP, Accounting, CRM | WO output and closeout status |
| GoodsShipped | ERP | CRM, Accounting | shipment lines and terms |
| CustomerInvoicePosted | Accounting | CRM, Workflow, BI | invoice ID, due date, AR |
| PaymentMatched | Accounting | CRM, BI | invoice/payments applied |
| ShiftPublished | HRIS | MES, BI | plant, shift, assigned eligible roles |
| OvertimeApproved | HRIS | Payroll, MES, BI | employee, shift, hours |
| PayrollFinalized | HRIS | Accounting, BI | payroll batch reference, totals |
| JournalPosted | Accounting | BI | journal ID, entity, period |
| PeriodClosed | Accounting | BI, Core | entity, accounting period |
| NCRCreated | QMS | MES, CRM, Workflow | NCR, linked lot, severity |
| MachineDown | MES | Maintenance, PPIC | equipment, stop reason |
| MachineReleased | Maintenance | MES, PPIC | equipment, certified status |
| DocumentApproved | DMS | Relevant Domain, Connect | doc version, approval |
| FileUploaded | DMS | Index, Workflow | file ID, classification |
| EmailReceived | Connect | CRM, Procurement, DMS, AI | thread metadata and safe ref |
| SyncFailed | Connect | Admin, Workflow | connector/job, reason |
| ApprovalRequested | Automation | Approver, Notifications | resource, rule, deadline |
| AIActionApproved | Automation | Owning Domain | approved command + actor trace |


## 5.1 Typed command examples
- CreatePurchaseRequisition → ERP Procurement
- ReleaseProductionOrder → ERP PPIC
- RecordOperationOutput → MES
- ApproveQualityRelease → QMS
- PostInvoice → Accounting
- FinalizePayroll → HRIS
- PublishWorkflowVersion → Automate
- FinalizeOfficialDocument → DMS
- SendApprovedDocument → Connect

## 5.2 Consistency & recovery
- Use atomic transactions for single-domain write + transactional outbox.
- Never assume exactly-once event delivery; use idempotent consumer with inbox table/deduplication.
- Cross-domain long-running workflows use explicit saga state; no distributed transaction held across user approval.
- External provider failures are recorded with retry/backoff, circuit breaker, dead-letter and operator resolution.
- Correlation_id ties sales order → work order → invoice → document → AI decision end-to-end.

# 6. Role-based access control / governance
Permissions evaluate actor + service identity + tenant + legal entity + plant + department + resource classification + action + approval policy. Role determines baseline; attribute-scoped rules narrow rather than widen access.
| Role | Typical write actions | Sensitive restrictions |
|---|---|---|
| CEO/Owner | Executive approval; policy as delegated | No unrestricted payroll/PII by title alone |
| Plant Manager | Approve plant planning and production exceptions | No own QC override when segregation of duties applies |
| PPIC | Create/release plan within plant | No unauthorized stock/GL posting |
| Purchasing | PR/RFQ/PO drafts; approvals within limit | No supplier payment posting |
| Warehouse | Receive/move/pick/issue stock | Adjust stock requires separate approval |
| Supervisor | Execute/assign work orders, manage shift operations | No salary access; no arbitrary QC release |
| Operator | Assigned job cards; self-service HR | No other workers files or broad material ledger |
| QC | Inspection/NCR/release within delegated scope | Self-approval controls by policy |
| HR/Payroll | Employee/leave/payroll processing | No unrestricted non-HR commercial/accounting access |
| Sales | Leads/quotes/orders/customer correspondence | No posting financial invoice or GL |
| Finance | Invoice, AP/AR, journals, closing | Maker-checker for payments/payroll/closing |
| Tenant IT Admin | User, connector, template and permission admin | No implicit access to confidential company docs |
| Platform Superadmin | Tenant provisioning/support operational tools | No default tenant business-data reads |
| Company AI Copilot | Read/draft/approved tools as delegated user | Never bypass RBAC, SoD or machine safety |

> **Catatan:** Susunan role di atas adalah baseline. Implementasi final menggunakan permission matrix granular per action/resource dan test negative access di semua API. Peran dapat dipisah menjadi role khusus Payroll, Treasury, Auditor, QC Approver, dan Integration Admin.

# 7. Information architecture & user experience

## 7.1 Navigation

```text
/app/{tenant}/overview
/app/{tenant}/copilot
/app/{tenant}/companies/{entityId}/plants/{plantId}/erp
/app/{tenant}/companies/{entityId}/plants/{plantId}/mes
/app/{tenant}/companies/{entityId}/hris
/app/{tenant}/companies/{entityId}/crm
/app/{tenant}/companies/{entityId}/accounting
/app/{tenant}/companies/{entityId}/quality
/app/{tenant}/companies/{entityId}/maintenance
/app/{tenant}/automation
/app/{tenant}/intelligence
/app/{tenant}/workspace/{spaceId}
/app/{tenant}/connect
/app/{tenant}/admin
/platform/control-center   [platform personnel only]
```

## 7.2 Workspace-by-role
| Device | Primary surfaces | Interaction model |
|---|---|---|
| PC Desktop | Finance, PPIC, HRIS, CRM, ERP planning, DMS editor, admin | Tables, dashboards, bulk operations, keyboard shortcuts |
| Tablet | MES shop floor, QC, maintenance, warehouse | Scanner input, large controls, work instructions, camera/photo |
| Mobile PWA | Job card, approvals, attendance, status, employee self-service | Task-first, minimal data entry, offline draft status |


## 7.3 Manual-to-digital onboarding
- Guided interview identifies industry, production mode, legal entity, plant structure, warehouses, chart of accounts and fiscal settings.
- Excel/CSV importer maps customers, suppliers, item/UOM, BOM, opening stock, employees, chart of accounts with dry run and error log.
- AI can propose mapping and classify documents; user confirms preview before any financial or stock opening balance posts.
- Progressive activation: shadow/parallel run, initial balance sign-off, staged controlled production use, monitored switch-over.
- All modules visible by role and entitlement; unconfigured modules show actionable setup checklist, never a misleading operational dashboard.

# 8. AI platform specification & evaluation

## 8.1 Copilot design
| Copilot | Examples | Authorized tools |
|---|---|---|
| ERP Copilot | Purchase shortage, supplier comparison, MRP scenarios | query_mrp, get_stock, draft_pr |
| MES Copilot | Operator SOP, downtime, productivity variance | get_work_order, retrieve_sop, draft_exception |
| HR Copilot | Shift roster, leave impact, HR letter | get_availability, draft_roster, generate_letter |
| CRM Copilot | Quotation, pipeline, promise dates | get_atp, draft_quotation, create_followup_draft |
| Finance Copilot | Margin bridge, AR collections, bank reconciliation | query_gl, get_cost_breakdown, draft_reconciliation |
| Quality Copilot | Defect trends, CAPA, lot search | trace_lot, draft_capa, query_inspections |
| Maintenance Copilot | Downtime patterns, service task draft | get_machine_history, draft_maintenance |
| Document Copilot | Contract compare, official letter, SOP lookup | search_file_acl, draft_document, compare_versions |
| Automation Copilot | Workflow natural language build and tests | draft_workflow, validate_workflow |
| Company Copilot | Cross-domain diagnosis/simulation/action plan | approved aggregated queries + proposal workflows |


## 8.2 AI capability levels
| Level | Behavior | Execution policy |
|---|---|---|
| L1 Understand | Answer and retrieve source document/transaction | Read-only, ACL filtered, citation required |
| L2 Diagnose | Explain variance, exceptions, root causes | Evidence with limitations; no mutation |
| L3 Predict | Forecast demand, stockout, downtime, cash | Data sufficiency, backtests, calibrated uncertainty |
| L4 Recommend | Optimize what-if, draft operational proposals | Human reviews assumptions and tradeoffs |
| L5 Act | Execute approved constrained domain tools | Policy engine, role, risk tier, audit receipt |


## 8.3 Agent safeguards
- Permission checks at retrieval, tool planning and domain command execution; do not rely on model prompt alone.
- Every answer includes scope (tenant/entity/plant), as-of date, KPI definition, drill-down and uncertainty where relevant.
- Draft is distinct from Posted/Approved/Sent; AI must not claim an action succeeded before domain execution confirms it.
- External email/files are untrusted. Prompt injection, malicious tool arguments, cross-tenant leakage and exfiltration are red-team scenarios.
- Provider abstraction with tenant-level opt-in/model/data-retention controls and cost observability.
- Safety-critical industrial equipment commands are never accessible to conversational agents.

## 8.4 Evaluation metrics
| Dimension | Measure | Proposed pilot gate |
|---|---|---|
| Grounding | Evidence-supported factual answer rate | ≥95% on curated validation set |
| Permission | Cross-role/tenant restricted data leakage | 0 across red-team suite |
| Tool correctness | Valid typed arguments, no unauthorized action | 100% on critical tests |
| Prediction | Error vs naive historical baseline | Must outperform selected baseline before promoted |
| Human acceptability | Approved draft rate / edit rate | Baseline and monitor by module |
| Cost/Latency | Token and tool spend per accepted task, p95 | Threshold determined by price/unit economics |


# 9. Non-functional requirements
| Category | Requirement / testable target |
|---|---|
| Performance | For defined pilot load/network, target p95 standard interactive read ≤2s; posting response ≤3s excluding external provider; measure separately by operation. |
| Availability | Indicative SaaS R1 target 99.5% service uptime, subject to tested operations/SLA. |
| Integrity | 0 silent duplicate stock/GL postings; reconciliation tests include retries, concurrent users, offline replay. |
| Recovery | Initial target RPO ≤1 hour, RTO ≤4 hours after proven restore tests; set by tier. |
| Security | MFA sensitive roles, least privilege, encrypt at rest/transit, secret vault, audit and pen test prior to production. |
| Privacy | Design for Indonesia PDP obligations, data minimization, retention, access rights, processor agreements, scoped exports. |
| Data locality | Tenant data residency and cross-border processing reviewed per client contract and applicable law. |
| Offline | Only approved offline draft flows; conflict UX and sync status mandatory, no uncontrolled irreversible posting. |
| Observability | Tracing by correlation ID, health and queue dashboards, alerting, error budgets. |
| Accessibility | High contrast, readable type, keyboard access in office UI, large touch targets for operators. |
| Internationalization | Bahasa Indonesia default, English optional; currency, plant timezone, UOM, number/date format. |
| Scalability | Pagination/lazy-loaded modules and scoped reads; analytics async; avoid all-tenant polling. |
| Compliance | Review tax, accounting, payroll, signatures and industry obligations by specialist; no unverified certification claims. |


## 9.1 Critical production quality gates
- No open P0 security, financial data integrity or stock integrity defects at release.
- Every critical posting action has replay/idempotency/concurrency tests.
- All system-generated official financial docs trace to approved transactional source.
- Permission negative tests cover normal UI, API, webhooks, asynchronous workers, AI and attachments.
- Load testing includes multi-plant navigation and shop-floor tablet with intermittent network.
- Disaster recovery restore and reprocessing of events must be rehearsed with evidence.

# 10. Pilot validation: three real factories
Design partners are prospective, not yet recruited. General Manufacturing platform tested using three distinct modes. Three pilots run parallel bookkeeping/stock reconciliation before switchover.
| Partner profile | Production mode | Unique demands | Cross-suite run |
|---|---|---|---|
| A — Furniture/custom assembly | Discrete MTO / routing | Job BOM, cutting, assembly, finishing, labor, rework | CRM quote→ERP→MES/QC→Accounting→HRIS→Workspace |
| B — Garment | Repetitive/discrete | Size/color variants, cutting bundles, sewing line, output by shift | Demand→line execution→attendance/payroll→cost→invoice |
| C — F&B processing | Batch/process | Recipe, lot, expiry, yield, incoming/final QC | Forecast→PR/PO→batch→lot genealogy→cost/financials |


## 10.1 Pilot stages
1. Recruit 12–15 prospects; score pain, data availability, champion, management sponsorship, WTP.
1. Observe AS-IS and baseline, map exception paths, approve data-sharing and pilot agreement.
1. Configure same core with three templates; train a bounded operation/order cohort.
1. Run controlled UAT and shadow/parallel reconciliation for stock, payroll and finance.
1. Evaluate technical reliability, active adoption, data completeness, business outcomes and paid conversion.

## 10.2 Target gates (hypotheses)
| Metric | Gate | Evidence |
|---|---|---|
| Eligible order digitization | ≥80% completed pilot orders | Transaction coverage report |
| Mandatory data completeness | ≥95% required fields | Audit / field validation |
| Inventory sampled accuracy | ≥98% by sampled SKU/location | Cycle counts |
| Critical integrity | 0 unexplainable stock/GL discrepancy | Reconciliation ledger |
| Cross-industry reuse | ≥80% shared configuration/no fork | Change request + repo audit |
| Commercial signal | ≥2/3 credible paid continuation | Signed proposal/commitment |
| AI safety | 0 policy violations in test suite | Red-team traces |


# 11. UAT scenarios & end-to-end acceptance
| ID | Scenario | Pass condition |
|---|---|---|
| UAT-01 | Multi-tenant separation | User from company A cannot query/read tenant B via UI/API/AI/file ID. |
| UAT-02 | Multi-plant role | Supervisor Plant A denied modifying Plant B work order. |
| UAT-03 | CRM to capacity | Confirm demand, show ATP/CTP estimation and planned dates. |
| UAT-04 | Order revision | Change confirmed SO quantity; downstream impact visible and controlled. |
| UAT-05 | MRP | BOM+on-hand+reserved+open PO yields time-phased shortage. |
| UAT-06 | PO approval | Create PO, maker-checker, email supplier after approved. |
| UAT-07 | Partial receipt and QC hold | Receive less than ordered; hold lot not usable in MRP issue. |
| UAT-08 | Production work order | Release snapshot BOM/routing and issue material. |
| UAT-09 | Production partials | Operator posts partial output, waste and rework with reconciliation. |
| UAT-10 | Offline duplicate | Replay same client UUID twice; only one authoritative posting. |
| UAT-11 | QC acceptance | Reject partial lot; available FG excludes rejected quantity. |
| UAT-12 | Lot genealogy | Trace finished lot back to material lots and affected shipment. |
| UAT-13 | Downtime to maintenance | Machine stop triggers maintenance request; authorized release only. |
| UAT-14 | Labor to costing | MES hours plus HRIS shift and payroll applied once to cost. |
| UAT-15 | Payroll | Approve payroll; posted journal balances; employee sees own payslip. |
| UAT-16 | AP 3-way match | Price/quantity discrepancy routed approval, no silent overpayment. |
| UAT-17 | AR invoice | Invoice posts after configured trigger; PDF traces transactional amount. |
| UAT-18 | Accounting close | Unbalanced or late transaction rejected; close locks period. |
| UAT-19 | Document finalization | Edited cloud copy does not overwrite approved PO or invoice version. |
| UAT-20 | Drive/OneDrive sync | Link/copy/sync and permission revocation produce expected state. |
| UAT-21 | Email prompt injection | Malicious external email cannot approve payment or create confirmed PO. |
| UAT-22 | Workflow retry | Event duplicate/retry cannot create two PRs or journal records. |
| UAT-23 | AI company copilot | Cross-module margin explanation gives source links, scope and as-of date. |
| UAT-24 | AI authority | User without Finance approval cannot command AI to post journal. |
| UAT-25 | Industry template swap | Configure F&B/garment/furniture without separate data model fork. |
| UAT-26 | Audit & reversal | Correct posted transaction via approved reversal preserving original. |
| UAT-27 | Restore | Disaster restore + outbox reprocessing maintains reconciliation. |
| UAT-28 | Navigation & performance | Switch active plant/module without loading unrelated plants/modules. |


# 12. Delivery strategy & product release gates
A complete R1 across seven main suites plus supporting domains requires parallel workstreams but not uncontrolled parallel releases. Funding/team estimates must be generated from engineering decomposition; indicative delivery horizon 18–24 months with adequate team, risk reserve and legal specialists.
| Gate | Product milestone | Blocking proof |
|---|---|---|
| G0 | Founding scope & architecture | Signed owner list, domain contracts, workflow and financial policies |
| G1 | Shared core & prototype | Tenant/plant RBAC, item/BOM, docs architecture, mock integration APIs |
| G2 | Transaction vertical slices | Order→plan→produce→QC→FG→invoice and PR→PO→AP |
| G3 | All-suite functional beta | Working HRIS/payroll, CRM, ERP, MES, Accounting, Workflow, BI/AI, DMS/Connect |
| G4 | 3-factory controlled pilot | Parallel reconciliation and critical UAT pass, support readiness |
| G5 | Full Suite R1 GA | No P0 defects; privacy/security/finance reviews; release notes & SLA approved |


## 12.1 Workstreams
- Platform/IAM & shared master
- ERP+MES+QMS+Maintenance
- HRIS/payroll
- CRM/sales and customer portal
- Accounting & manufacturing costing
- Automate + Workspace/DMS + Connect
- BI/AI and testing
- Implementation/onboarding & customer success

## 12.2 Monetization hypothesis
Subscription tiered by plant, modules/capabilities, management seats and connector/AI usage, plus paid onboarding/integration. Operator-only use should remain commercially accessible to drive accurate floor-level data. Final tier/price must follow discovery and quantified implementation cost.

# 13. Dependencies, risk register & unresolved decisions
| Risk / open decision | Why it matters | Required next decision |
|---|---|---|
| Accounting policy per sector/entity | Valuation, WIP, revenue, taxes differ | Finance expert reviews COA/cost methods and journals |
| Payroll Indonesia compliance | Rates/entitlements and tax change | HR/payroll legal expert sets effective-dated formulas |
| Scope depth R1 vs enterprise R1+ | Full suite breadth can exceed team capacity | Sign off submodule acceptance gates and release tiers |
| Template variation | Industry differences drive custom forks | Approve 3 pilot templates and extensibility limits |
| Batch/serial cost genealogy | Co-products, split/merge complicate costing | Traceability and allocation policy review |
| Document signing provider | Legal authority and trust vary | Choose supported e-sign adapter and archived evidence |
| Data residency & AI providers | Sensitive client/employee data | Customer contract, processor terms, LLM retention policy |
| Google/Microsoft licensing | Provider scopes & tenant admin consent | Connector product requirement and approval matrix |
| Enterprise API/OT integration | Industrial networks have high safety/security stakes | Define read-only edge gateway spec and segmentation |
| Implementation staffing/budget | Complete R1 is substantial | Estimate engineering backlog and build-vs-integrate |


# 14. Product glossary
| Term | Definition |
|---|---|
| System of Record | Only authoritative source responsible for posting or owning a business object. |
| BOM / Recipe | Approved components/formula and quantities for production. |
| Routing | Sequence and resource/work center requirements of manufacturing operations. |
| MES | System recording and controlling execution in shop-floor. |
| MRP | Time-phased plan calculating net material requirements. |
| WIP | Work-in-process, partly completed goods and allocated manufacturing costs. |
| ATP / CTP | Available-/capable-to-promise against inventory and capacity over time. |
| QMS | Quality processes controlling inspection, release, rejection and CAPA. |
| RBAC / SoD | Role-based access control / segregation of duties. |
| Transactional Outbox | Atomic recording of business state and outbound event for reliable eventual delivery. |
| Idempotency | Repeated identical request produces same logical posted outcome. |
| DMS | Document management system: storage, file versioning, approval and retention. |
| Copilot | AI interface invoking permissioned read/draft/action tools. |
| R1 / R1+ | Full Suite initial commercial release / advanced enterprise/vertical extension. |


# 15. References & regulatory review notes
- ISA-95 Series of Standards (Manufacturing/ERP-MES boundaries) — https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
- ISA-95 2025 update — https://www.isa.org/news-press-releases/2025/april/update-to-isa-95-standard-addresses-integration-of
- GS1 Global Traceability Standard — https://www.gs1.org/standards/gs1-global-traceability-standard/current-standard
- NIST AI Risk Management Framework — https://www.nist.gov/itl/ai-risk-management-framework
- Indonesia UU 27/2022 Pelindungan Data Pribadi — https://peraturan.go.id/id/uu-no-27-tahun-2022
- Google Drive: Manage file changes — https://developers.google.com/workspace/drive/api/guides/manage-changes
- Microsoft Graph driveItem delta — https://learn.microsoft.com/graph/api/driveitem-delta
> **Catatan:** Referensi ini digunakan sebagai konteks desain; NewSystem belum mengklaim pemenuhan sertifikasi standar, persetujuan integrasi pemerintah atau pengujian compliance. Kewajiban pajak, ketenagakerjaan, e-sign dan privasi perlu legal/regulatory review sebelum rilis.

# Appendix A — Illustrative integration event contract

```text
{
  "event_id": "evt_uuid",
  "event_type": "ProductionCompleted",
  "event_version": 1,
  "tenant_id": "tenant_uuid",
  "legal_entity_id": "entity_uuid",
  "plant_id": "plant_uuid",
  "aggregate_id": "work_order_uuid",
  "occurred_at": "2026-10-10T09:00:00Z",
  "actor": {"type":"user", "id":"user_uuid"},
  "correlation_id": "sales_order_uuid",
  "causation_id": "command_uuid",
  "payload": {
    "finished_item_id": "sku_uuid",
    "produced_quantity": "100",
    "unit": "PCS",
    "qms_status": "PENDING_REVIEW"
  }
}
```
Payload is illustrative. Numeric values are strings to avoid floating-point ambiguity in transport; services validate decimals, UOM and source state. Events are not permission grants.

# Appendix B — Proposed API conventions
- Versioned REST API: /api/v1/{domain}/{resources}; typed commands for state-changing operations.
- Required request metadata: authorization, tenant context, correlation ID, idempotency key where relevant.
- Use 409 on state/version conflict, 403 on forbidden scope, 422 on business validation, 429 for limit, 5xx for retryable server faults.
- All mutable approved transactional records carry revision/version token; unauthorized update cannot downgrade validation.
- Webhooks signed and timestamped; delivery at-least-once with consumer dedupe.
- Async generated reports/docs return job ID with status & immutable source references.

# Appendix C — Founding sign-off checklist
- [ ] Founder signs product positioning, target industries and release depth.
- [ ] Domain owners approve Core, ERP, MES, QMS, Maintenance, HRIS, CRM, Accounting, Automate, Workspace, Connect, Intelligence.
- [ ] Finance validates WIP/stock valuation and payroll journal treatment.
- [ ] Legal/privacy reviews staff data, external integrations, signing, tax channels.
- [ ] Engineering approves domain contracts and high-risk transactional invariants.
- [ ] QA approves UAT matrix, negative test suite and release stop criteria.
- [ ] Pilot partners sign AS-IS/TO-BE, data provision, baseline KPIs and usage terms.
- [ ] Commercial team approves pricing hypothesis, onboarding scope, support and SLA policy.
