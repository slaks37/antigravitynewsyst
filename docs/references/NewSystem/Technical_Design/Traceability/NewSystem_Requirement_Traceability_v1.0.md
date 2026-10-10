# NewSystem — Requirements-to-Design Traceability v1.0

**Status:** automated coverage index based on Master PRD v1.0 requirement IDs; requires product-team review to sign off exact tests/API endpoints. No invented acceptance IDs.

| Domain | PRD IDs | UML/use cases | ERD bounded context | BPMN | UX category |
|---|---|---|---|---|---|
| CORE | 10 (CORE-001…CORE-010) | UC-01,02,18 | CORE | BP-01..BP-10 | Core |
| ERP | 13 (ERP-001…ERP-013) | UC-04,05,06 | ERP | BP-02,03 | ERP |
| MES | 13 (MES-001…MES-013) | UC-07 | MES | BP-03,07 | MES |
| QMS | 10 (QMS-001…QMS-010) | UC-08 | QMS_CMMS | BP-03,06 | Quality |
| MNT | 8 (MNT-001…MNT-008) | UC-09 | QMS_CMMS | BP-07 | Maintenance |
| HRIS | 13 (HRIS-001…HRIS-013) | UC-10 | HRIS | BP-04 | HRIS |
| CRM | 10 (CRM-001…CRM-010) | UC-03 | CRM | BP-01 | CRM |
| ACC | 14 (ACC-001…ACC-014) | UC-11 | ACCOUNTING | BP-01,02,04,05 | Accounting |
| AUT | 11 (AUT-001…AUT-011) | TBD | TBD | TBD | TBD |
| DMS | 13 (DMS-001…DMS-013) | UC-13,14 | WORKSPACE_CONNECT | BP-08 | Workspace |
| CON | 12 (CON-001…CON-012) | UC-15 | WORKSPACE_CONNECT | BP-08,09 | Connect |
| AI | 12 (AI-001…AI-012) | UC-16,17 | AI_ANALYTICS | BP-10 | Intelligence |

## Full requirement catalogue

| Requirement | Feature | Description | Primary design coverage |
|---|---|---|---|
| CORE-001 | Tenant/Company/Plant | Support group→legal entity→plant→warehouse/line/work center; enforce ownership. | CORE / Core |
| CORE-002 | IAM & MFA | SSO/OIDC where configured; MFA required for sensitive roles; invite & revoke. | CORE / Core |
| CORE-003 | RBAC + scope | Permission matrix by action, org/entity/plant/department/document classifications. | CORE / Core |
| CORE-004 | Segregation of duties | Block self-approval of sensitive documents, stock adjustments, payments and payroll. | CORE / Core |
| CORE-005 | Module Registry | Industry templates, activate/deactivate module; dependency validation. | CORE / Core |
| CORE-006 | Subscription & Entitlement | Plan, usage, plant/user limits, grace state; never silently erase data. | CORE / Core |
| CORE-007 | Audit service | Immutable actor, timestamp, origin, before/after reference and reason. | CORE / Core |
| CORE-008 | Policy & numbering | Company document number series, fiscal/calendar settings, locale and currency. | CORE / Core |
| CORE-009 | Support access | Time-bound delegated support access with approval, scope and audit. | CORE / Core |
| CORE-010 | Organization admin | Scoped admin for locations, users, access, templates and connector controls. | CORE / Core |
| ERP-001 | Item & UOM Master | Materials/WIP/finished goods, variants, conversion, track lot/serial/expiry by policy. | ERP / ERP |
| ERP-002 | Engineering BOM | Multilevel BOM and effective-dated revision, approved components/substitutes. | ERP / ERP |
| ERP-003 | Routing Master | Operations, standard time, work center, prerequisites, revision snapshot. | ERP / ERP |
| ERP-004 | Demand & MPS | Orders/forecast → net requirement and production plan with MTO/MTS modes. | ERP / ERP |
| ERP-005 | MRP Planner | Time-phased gross requirements, on-hand, reservation, incoming PO, yield, MOQ, safety stock. | ERP / ERP |
| ERP-006 | Capacity Check | Rough-cut work center availability and known shift/downtime constraints. | ERP / ERP |
| ERP-007 | Purchasing | PR/RFQ/comparison/PO/change order/approval and supplier performance basics. | ERP / ERP |
| ERP-008 | Goods Receiving | Partial receipt, inspection staging, discrepancy, supplier returns, supplier delivery docs. | ERP / ERP |
| ERP-009 | Warehouse Stock Ledger | Receive, putaway, move, reserve, issue, consume, return, adjust, cycle count. | ERP / ERP |
| ERP-010 | Traceability | Identify lot, batch, expiry, warehouse and upstream/downstream material events. | ERP / ERP |
| ERP-011 | Distribution | Pick, pack, dispatch, partial shipments, return and delivery confirmation. | ERP / ERP |
| ERP-012 | Interplant Transfer | Transfer orders, goods in transit, receiving and legal entity distinctions. | ERP / ERP |
| ERP-013 | Supplier & Asset Registry | Supplier contract details, equipment references, consumables/spare-part masters. | ERP / ERP |
| MES-001 | Multi-mode production | Process batch, discrete/job, repetitive, MTO/MTS, hybrid in one engine. | MES / MES |
| MES-002 | Work Order & Job Card | Release snapshot, assign resources, print/scan digital instructions and work cards. | MES / MES |
| MES-003 | Routing Execution | Validate predecessor operations, alternative routes, skip with authorized reason. | MES / MES |
| MES-004 | Shop-floor Mobile | Operator task list with start/pause/stop/complete and large touch targets. | MES / MES |
| MES-005 | WIP & Partial Output | Track accepted, under review, rejected and rework quantities per operation. | MES / MES |
| MES-006 | Material Actuals | Record issued vs consumed vs returned, quantity variance, lot genealogy. | MES / MES |
| MES-007 | Labor Actuals | Track productive time, waiting, downtime and cost objects; avoid duplicate clocking. | MES / MES |
| MES-008 | Production Batch/Serial | Split/merge/serial genealogy, co-product/by-product where configured. | MES / MES |
| MES-009 | Scrap & Rework | Reason codes, authorized disposition, rework routing and additional cost. | MES / MES |
| MES-010 | Equipment Downtime | Track planned/unplanned downtime, reason and maintenance request event. | MES / MES |
| MES-011 | Production Review | Closeout requires quantity reconciliation, QC outcomes and cost status. | MES / MES |
| MES-012 | Offline Draft Capture | Store selected job-card data offline with temp UUID and reconciliation on reconnect. | MES / MES |
| MES-013 | OEE & Throughput | Calculate measures only where cycle-time and machine signals are validated. | MES / MES |
| QMS-001 | Quality Standards | Checklist, tolerances, inspection plan, sampling plan with effective version. | QMS_CMMS / Quality |
| QMS-002 | Incoming QC | Review supplier receipts before stock release. | QMS_CMMS / Quality |
| QMS-003 | In-Process QC | Inspection gate by operation, operator/work center or rule. | QMS_CMMS / Quality |
| QMS-004 | Final QC | Formal acceptance required for configured products or batches. | QMS_CMMS / Quality |
| QMS-005 | Quality Hold | Quarantine by lot/serial/quantity and block stock allocation. | QMS_CMMS / Quality |
| QMS-006 | Defect/NCR | Record defect class, severity, cause, photo and linked business objects. | QMS_CMMS / Quality |
| QMS-007 | Rework/Scrap/Concession | Disposition requests requiring configured approval and cost impact. | QMS_CMMS / Quality |
| QMS-008 | CAPA | Create action plan, owner, due date, effectiveness check and closeout. | QMS_CMMS / Quality |
| QMS-009 | Traceability & Recall | Backward/forward lot search, suspected/affected goods identification. | QMS_CMMS / Quality |
| QMS-010 | Quality Docs | Certificates, reports, test evidence linked to stored immutable versions. | QMS_CMMS / Quality |
| MNT-001 | Asset & Equipment | Register machines, criticality, location, service history, ownership. | QMS_CMMS / Maintenance |
| MNT-002 | Preventive Maintenance | Calendar/runtime/cycle based maintenance triggers and schedules. | QMS_CMMS / Maintenance |
| MNT-003 | Corrective Work Order | Issue, assign, record actions, photos, parts, labor, close. | QMS_CMMS / Maintenance |
| MNT-004 | Spare Parts | Reserve and consume inventory using authorized stock transactions. | QMS_CMMS / Maintenance |
| MNT-005 | Downtime Linkage | MES stop reason and equipment incident linked to maintenance ticket. | QMS_CMMS / Maintenance |
| MNT-006 | Calibration | Certificate, due date, instrument lockout as policy. | QMS_CMMS / Maintenance |
| MNT-007 | Cost & Reliability | Maintenance cost, MTBF/MTTR with known definitions. | QMS_CMMS / Maintenance |
| MNT-008 | Safe Return-to-Service | Approvals/checklist before MES equipment marked available. | QMS_CMMS / Maintenance |
| HRIS-001 | Recruitment & Offer | Manpower request→recruitment pipeline→offer→approved onboarding. | HRIS / HRIS |
| HRIS-002 | Employee Master | PII, employment state, entity/department/plant/contract, document links. | HRIS / HRIS |
| HRIS-003 | Org & Positions | Reporting hierarchy, grades, department, skill matrix and certifications. | HRIS / HRIS |
| HRIS-004 | Attendance | Clock-in/out, corrections, shift mapping, exception and approval. | HRIS / HRIS |
| HRIS-005 | Shift & Rostering | Publish schedules, availability/skills/capacity and conflict checks. | HRIS / HRIS |
| HRIS-006 | Leave | Policy, accrual/entitlement, request, approval, balance. | HRIS / HRIS |
| HRIS-007 | Overtime | Request, preapproval, actual hours and rate calculation rules. | HRIS / HRIS |
| HRIS-008 | Payroll & Payslip | Earnings, deductions, statutory parameters, proration, finalized payslip. | HRIS / HRIS |
| HRIS-009 | BPJS & Tax Parameters | Configurable Indonesia payroll settings with effective dates and export/integration. | HRIS / HRIS |
| HRIS-010 | Performance & Development | Goals, appraisals, training, competency and certification renewal. | HRIS / HRIS |
| HRIS-011 | Employee Self Service | Employee-specific profile, leave, payslip, attendance and documents. | HRIS / HRIS |
| HRIS-012 | Payroll Accounting | Generate approved posting package by legal entity and period; reconcile. | HRIS / HRIS |
| HRIS-013 | Labor Cost Allocation | MES hours→cost center/WIP allocation without double counting wage expense. | HRIS / HRIS |
| CRM-001 | Lead & Account | Lead capture, dedupe, segmentation, consent and owner assignment. | CRM / CRM |
| CRM-002 | Opportunity Pipeline | Stage, probability, expected close, activity, forecast. | CRM / CRM |
| CRM-003 | Quotation & CPQ Lite | Price list, tax/discount, cost estimate, margin threshold and approval. | CRM / CRM |
| CRM-004 | ATP/CTP Estimate | Query ERP time-phased material/capacity/finished-stock before due-date promise. | CRM / CRM |
| CRM-005 | Sales Order | Confirmed demand, revision history, partial fulfillment, cancellation rules. | CRM / CRM |
| CRM-006 | Contracts & Documents | Agreement terms, price schedules, versioned attachments via Workspace. | CRM / CRM |
| CRM-007 | Customer Portal | Authenticated quote/order/shipment/invoice visibility by account. | CRM / CRM |
| CRM-008 | Account Correspondence | Link email thread, tasks, calls and documents to customer. | CRM / CRM |
| CRM-009 | Service & Returns | Ticket, RMA, QMS NCR/CAPA routing and resolution history. | CRM / CRM |
| CRM-010 | Revenue & Customer BI | Pipeline, repeat order, churn risk, realized margin and AR flags. | CRM / CRM |
| ACC-001 | COA & Dimensions | Company-specific chart, cost center, plant, segment, fiscal period. | ACCOUNTING / Accounting |
| ACC-002 | Double Entry GL | Balanced debit/credit, journal sources, posting rules, reversal. | ACCOUNTING / Accounting |
| ACC-003 | AR | Invoice, credit note, collection, receipt allocation and aging. | ACCOUNTING / Accounting |
| ACC-004 | AP | Supplier bill, credit/debit memo, 3-way match PO/receipt/invoice and aging. | ACCOUNTING / Accounting |
| ACC-005 | Bank & Cash | Bank accounts, payment batches, reconciliation, cash book. | ACCOUNTING / Accounting |
| ACC-006 | Inventory Valuation | Value ledger tied to quantity movement; configurable approved valuation methods. | ACCOUNTING / Accounting |
| ACC-007 | Manufacturing Cost | Planned/actual material, labor, overhead, WIP, FG, COGS, scrap/rework treatment. | ACCOUNTING / Accounting |
| ACC-008 | Payroll Accounting | Expense, accrued liability, settlement and WIP allocation reconciliation. | ACCOUNTING / Accounting |
| ACC-009 | Fixed Assets | Acquire, capitalize, depreciate, transfer, dispose and report. | ACCOUNTING / Accounting |
| ACC-010 | Budget & Cost Control | Budgets, approval, budget-vs-actual, cost-center analysis. | ACCOUNTING / Accounting |
| ACC-011 | Tax Rules | Configurable tax codes, PPN/PPh parameterization and compliant documentation paths. | ACCOUNTING / Accounting |
| ACC-012 | Period Closing | Accrual, adjustment, checklist, lock, reopen by approval. | ACCOUNTING / Accounting |
| ACC-013 | Financial Reports | Trial balance, GL details, P&L, balance sheet, cash flow. | ACCOUNTING / Accounting |
| ACC-014 | Intercompany & Consolidation | Intercompany reference, elimination and consolidated statements for supported structure. | ACCOUNTING / Accounting |
| AUT-001 | Visual Workflow Designer | Trigger-condition-branch-action nodes with drag/drop canvas. | TBD / TBD |
| AUT-002 | Dynamic Forms | Field validation, permissions, conditional sections, versioning. | TBD / TBD |
| AUT-003 | Event Registry | Subscribe to typed domain events with schema contracts. | TBD / TBD |
| AUT-004 | Rules Engine | Deterministic boolean, date, amount and threshold checks. | TBD / TBD |
| AUT-005 | Approval Engine | Role hierarchy, amount limit, step/parallel approval and SoD. | TBD / TBD |
| AUT-006 | Scheduler | Time-based runs, business-day calendar and timezone aware escalation. | TBD / TBD |
| AUT-007 | Actions | Only registered authorized domain commands; draft/preview mode. | TBD / TBD |
| AUT-008 | Notifications | In-app/email provider with delivery state and retry. | TBD / TBD |
| AUT-009 | External Actions | Connectors, webhooks, rate limiting, secrets. | TBD / TBD |
| AUT-010 | Runtime Monitoring | Run log, correlation IDs, replay, dead-letter, retry and error handling. | TBD / TBD |
| AUT-011 | Publishing Governance | Template/version approval, test simulation, staged enablement, rollback. | TBD / TBD |
| DMS-001 | Hybrid Document Editor | Native editor for letter, memo, report, SOP; Word/Google Docs deep link for complex edits. | WORKSPACE_CONNECT / Workspace |
| DMS-002 | Templates & Merge Fields | Kop surat, legal entity, variable placeholders, conditional content, branding. | WORKSPACE_CONNECT / Workspace |
| DMS-003 | Business Document Generator | PO and invoice generated from approved transaction records, not ad hoc editable PDFs. | WORKSPACE_CONNECT / Workspace |
| DMS-004 | Folders & Spaces | My Files, Team Files, Plant Files, Company Files, Archive, Connected Storage. | WORKSPACE_CONNECT / Workspace |
| DMS-005 | Managed File Storage | Upload/download/preview/search, dedupe/checksum, anti-malware scan, quota. | WORKSPACE_CONNECT / Workspace |
| DMS-006 | Version Control | Version IDs, revision comments, comparison, restore drafts; immutable finalized snapshots. | WORKSPACE_CONNECT / Workspace |
| DMS-007 | Document Approval & Signing | Role approval, witness metadata, provider signing adapter, non-editable final. | WORKSPACE_CONNECT / Workspace |
| DMS-008 | Business Record Attachments | Link to employee, machine, supplier, customer, PO, invoice, work order. | WORKSPACE_CONNECT / Workspace |
| DMS-009 | External Sharing | Time-limited, revocable links, watermark/policy, download restrictions. | WORKSPACE_CONNECT / Workspace |
| DMS-010 | Retention/Legal Hold | Policy by file class, legal hold, destruction request and audit. | WORKSPACE_CONNECT / Workspace |
| DMS-011 | Document Search | Name, metadata, full-text index only for authorized document scope. | WORKSPACE_CONNECT / Workspace |
| DMS-012 | AI Knowledge Retrieval | Permission-filtered RAG with source version and citation. | WORKSPACE_CONNECT / Workspace |
| DMS-013 | Link/Copy/Sync Modes | Explicit semantics and conflict handling for Drive/OneDrive assets. | WORKSPACE_CONNECT / Workspace |
| CON-001 | OAuth Connections | Gmail, Microsoft 365, Google Drive, OneDrive with least-privilege scope. | WORKSPACE_CONNECT / Connect |
| CON-002 | Email Workspace | Draft, send, receive permitted threads, attachment scanning and business linking. | WORKSPACE_CONNECT / Connect |
| CON-003 | Email-to-Workflow | Classify validated inbound mail and suggest action; no untrusted direct commands. | WORKSPACE_CONNECT / Connect |
| CON-004 | Google Drive | Browse permitted files/folders, link/copy/sync, change tokens, sharing rules. | WORKSPACE_CONNECT / Connect |
| CON-005 | OneDrive/SharePoint | Browse permitted sites/drives, delta sync, version and permission-aware links. | WORKSPACE_CONNECT / Connect |
| CON-006 | Integration Registry | Provider type, version, permissions, tenant/plant owner and health. | WORKSPACE_CONNECT / Connect |
| CON-007 | REST API / OpenAPI | Versioned resource & command API with RBAC and quotas. | WORKSPACE_CONNECT / Connect |
| CON-008 | Inbound Webhooks | Verify signature/timestamp, dedupe, sanitize payload and dispatch. | WORKSPACE_CONNECT / Connect |
| CON-009 | Outbound Webhooks | Signed events, retry/backoff, consumer idempotency guidance. | WORKSPACE_CONNECT / Connect |
| CON-010 | Data Mapping & Sync | Mapping UI, validation, incremental cursor, conflict queue, reconciliation. | WORKSPACE_CONNECT / Connect |
| CON-011 | Developer Portal | Sandbox, test keys, usage, error documentation, key rotation. | WORKSPACE_CONNECT / Connect |
| CON-012 | Integration Observability | Sync reports, error queue, secret rotation, audit and fallback. | WORKSPACE_CONNECT / Connect |
| AI-001 | Semantic KPI Layer | Governed metrics, units, time period, plant/legal entity and calculation versions. | AI_ANALYTICS / Intelligence |
| AI-002 | Department BI | Operational and finance dashboards with drill-down to source transactions. | AI_ANALYTICS / Intelligence |
| AI-003 | Company Copilot | Cross-module question answering filtered by actor permission, legal entity and plant. | AI_ANALYTICS / Intelligence |
| AI-004 | Module Copilots | ERP, MES, HRIS, CRM, Finance, QMS, Maintenance, Workspace and Automation specialists. | AI_ANALYTICS / Intelligence |
| AI-005 | Knowledge RAG | Permission-checked SOP, contracts, records and final approved version citations. | AI_ANALYTICS / Intelligence |
| AI-006 | Forecasting | Demand/inventory/cash/time-series predictions with historical backtest. | AI_ANALYTICS / Intelligence |
| AI-007 | Optimization & Simulation | What-if schedule, supplier, workforce and costing without posting operational changes. | AI_ANALYTICS / Intelligence |
| AI-008 | Anomaly Alerts | Rule/model-based thresholds, false-positive feedback and case workflow. | AI_ANALYTICS / Intelligence |
| AI-009 | Agent Tool Catalog | Typed read, draft, controlled execution tools with explicit risk levels. | AI_ANALYTICS / Intelligence |
| AI-010 | Approval & Action Log | Human checkpoints, execution receipts, actor, source, input/output traces. | AI_ANALYTICS / Intelligence |
| AI-011 | AI Evaluation & Monitoring | Hallucination/evidence rates, permission tests, accuracy, drift, costs and latency. | AI_ANALYTICS / Intelligence |
| AI-012 | AI Data Controls | PII minimization, tenant isolation, retention, model-provider usage policy. | AI_ANALYTICS / Intelligence |

## Sign-off matrix
| Milestone | Evidence required | Owner |
|---|---|---|
| PRD baseline | Requirement ID, expected business result and exception | Product |
| Architecture | Cross-domain ownership, commands, events, DDL migration and concurrency tests | Tech Lead |
| BPMN | 10 business-process flows, user approval, failure/compensation logic | Business Analyst |
| UX | Every route assigned screen owner, linked requirement, RBAC and empty/error/offline states | Design Lead |
| QA | Given/When/Then UAT, negative access, reconciliation and recovery | QA Lead |
| Pilot | Three plant baseline and outcome evidence; no undisclosed code forks | Product/Operations |

**Important:** UML/ERD/BPMN/UX remain design artifacts requiring review by manufacturing, accounting, HR/payroll, information security and implementation specialists. They are not a claim that the product has been built or regulator-certified.
