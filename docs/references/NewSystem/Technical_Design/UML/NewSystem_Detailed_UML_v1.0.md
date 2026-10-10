# NewSystem — Detailed UML Specification v1.0

**Reference:** NewSystem Master PRD v1.0 | **Date:** 10 Oktober 2026 | **Status:** Pre-implementation design, subject to architecture sign-off.

## 1. Design intent & notation
UML here is a modeling contract, not executable code. Diagrams use editable Mermaid syntax. Commands mutate the owning domain; events announce committed changes; queries are permission-filtered. All state transitions are server-authoritative. Trace IDs and tenant/entity/plant scopes must propagate end-to-end.

## 2. Use-case catalogue
| ID | Actor | Use case | Owning suites | Security / invariant |
|---|---|---|---|---|
| UC-01 | Owner/CEO | Choose company/plant and view consolidated KPIs | Core, BI | Scope-filtered KPIs only; finance data by legal entity |
| UC-02 | Tenant Admin | Activate industry pack, production mode, and module entitlement | Core | Prerequisites met before activation |
| UC-03 | Sales | Create quotation, request ATP/CTP, confirm order | CRM, ERP | Confirmation reserves approved commercial version |
| UC-04 | PPIC | Net material requirements and release work orders | ERP, MES | BOM/routing snapshot immutable after release |
| UC-05 | Purchasing | Create PR, approve RFQ comparison, issue PO | ERP, Workflow | Maker-checker and spending limits |
| UC-06 | Warehouse | Receive, put away, reserve, transfer and issue lots | ERP Inventory | Posting exactly-once by idempotency key |
| UC-07 | Operator | Start/pause/complete assigned job card | MES | Only assigned plant/work center; duplicate output rejected |
| UC-08 | QC Inspector | Inspect, hold, reject, release/rework | QMS | No shipment of held stock; SoD release |
| UC-09 | Maintenance | Record breakdown, repair, test, release equipment | Maintenance | Safe machine release approval |
| UC-10 | HR Manager | Manage employment/shift/leave/payroll | HRIS | Confidential PII separated from MES |
| UC-11 | Finance | 3-way-match AP, post GL, AR, close periods | Accounting | Balanced journals, locked periods immutable |
| UC-12 | Department Admin | Configure workflow rules/forms and publish versions | Automation | Simulate + approve before activation |
| UC-13 | Employee | Create or upload business documents/files | Workspace | DMS ACL, malware scan, versioning |
| UC-14 | Document Approver | Approve and finalize official document | Workspace | Final version immutable; authority check |
| UC-15 | Integration Admin | Authorize email/Drive/OneDrive and map fields | Connect | Least-privilege OAuth; health/audit |
| UC-16 | Module Copilot User | Ask, analyze, simulate, create drafts | AI | Permission-aware retrieval and tool use |
| UC-17 | CEO/Authorized Manager | Ask Company Copilot for cross-suite diagnosis | AI, BI | Entity scope, data freshness, auditable evidence |
| UC-18 | Platform Ops | Provision tenant, monitor platform health | Control Center | No default tenant business-data access |

### UML actor-to-domain view
```mermaid
flowchart LR
 CEO[Owner / CEO] --> BI[Company AI & BI]
 SALES[Sales] --> CRM[CRM & Sales Orders]
 PPIC[PPIC] --> ERP[ERP Planning / Inventory]
 OP[Operator] --> MES[MES Shop Floor]
 QC[QC Officer] --> QMS[QMS]
 HR[HR Manager] --> HRIS[HRIS]
 FIN[Finance] --> ACC[Accounting]
 ADMIN[Org Admin] --> CORE[Core & Workflow]
 ALL[Authorized Users] --> DMS[Workspace & Connect]
 BI --> CORE
 CRM --> ERP
 ERP --> MES
 MES --> QMS
 QMS --> ACC
 HRIS --> ACC
 DMS --> CORE
```

## 3. Key UML class / aggregate diagram
```mermaid
classDiagram
 class Organization {+uuid id; +string name; +status}
 class LegalEntity {+uuid id; +currency; +taxRegion}
 class Plant {+uuid id; +productionModes[]}
 class Item {+uuid id; +sku; +uom}
 class BOMVersion {+uuid id; +version; +approvalStatus}
 class RoutingVersion {+uuid id; +version; +operations}
 class SalesOrder {+uuid id; +status; +revision}
 class ProductionOrder {+uuid id; +status; +bomSnapshotId; +routingSnapshotId}
 class OperationExecution {+uuid id; +actualQty; +actualTime; +status}
 class InventoryMovement {+uuid id; +quantity; +lotId; +postingState}
 class Inspection {+uuid id; +disposition; +evidence}
 class CostEntry {+uuid id; +type; +amount; +sourceRef}
 class JournalEntry {+uuid id; +periodId; +postedAt}
 class DocumentVersion {+uuid id; +sha256; +finalizedAt}
 Organization "1" --> "*" LegalEntity : controls
 LegalEntity "1" --> "*" Plant : operates
 Item "1" --> "*" BOMVersion : definedBy
 Item "1" --> "*" RoutingVersion : routedBy
 SalesOrder "0..1" --> "*" ProductionOrder : drives
 ProductionOrder "1" --> "*" OperationExecution : tracks
 ProductionOrder "1" --> "*" InventoryMovement : references
 ProductionOrder "1" --> "*" Inspection : checkedBy
 ProductionOrder "1" --> "*" CostEntry : accumulates
 CostEntry "*" --> "0..1" JournalEntry : accountedIn
 SalesOrder "1" --> "*" DocumentVersion : generatedDocs
```

## 4. State models and guarded transitions
Each transition requires explicit actor permission, expected resource version, validation, and audit. An event is published only after persistence succeeds.

### 4.1 Sales Order
```mermaid
stateDiagram-v2
 [*] --> Draft
 Draft --> Submitted : submit
 Submitted --> Approved : approve commercial terms
 Submitted --> Draft : request changes
 Approved --> Confirmed : customer confirms
 Confirmed --> PartiallyFulfilled : ship partial
 Confirmed --> Fulfilled : ship all
 PartiallyFulfilled --> Fulfilled : ship remainder
 Confirmed --> AmendmentPending : request revision
 AmendmentPending --> Confirmed : revalidate/reserve
 Draft --> Cancelled : cancel
 Confirmed --> Cancelled : authorized closeout
 Fulfilled --> Closed : invoice/reconcile
 Cancelled --> [*]
 Closed --> [*]
```

### 4.2 Purchase Order
```mermaid
stateDiagram-v2
 [*] --> Draft
 Draft --> Submitted : submit
 Submitted --> Approved : approval per authority
 Submitted --> Rejected : reject
 Approved --> Issued : send official PO
 Issued --> PartiallyReceived : partial GRN
 Issued --> Received : full GRN
 PartiallyReceived --> Received : final GRN
 Issued --> AmendmentPending : vendor change
 AmendmentPending --> Issued : approved version
 Received --> Closed : match/settle
 Draft --> Cancelled : cancel
 Issued --> Cancelled : controlled cancellation
 Closed --> [*]
```

### 4.3 Production Order
```mermaid
stateDiagram-v2
 [*] --> Draft
 Draft --> Planned : BOM+capacity validated
 Planned --> Released : material + authority check
 Released --> InProgress : start operation
 InProgress --> Paused : downtime or shortage
 Paused --> InProgress : resolved
 InProgress --> QualityReview : submit output
 QualityReview --> InProgress : rework
 QualityReview --> Completed : accepted output
 Completed --> CostReconciliation : costs calculated
 CostReconciliation --> Closed : sign-off
 Draft --> Cancelled
 Planned --> Cancelled
 Released --> Cancelled : controlled closeout
 Closed --> [*]
```

### 4.4 Invoice
```mermaid
stateDiagram-v2
 [*] --> Draft
 Draft --> Validated : tax and invoice rules
 Validated --> Approved : finance approval
 Approved --> Posted : balanced AR/revenue journal
 Posted --> PartiallyPaid : payment applied
 Posted --> Paid : fully paid
 PartiallyPaid --> Paid : remaining paid
 Posted --> CreditNoteIssued : authorized correction
 Paid --> Closed : reconciliation
 CreditNoteIssued --> Closed : reconcile
 Draft --> Void : before posting
 Closed --> [*]
```

### 4.5 Workflow Version
```mermaid
stateDiagram-v2
 [*] --> Draft
 Draft --> Simulated : syntax and policy checks
 Simulated --> Review : validation passed
 Review --> Published : authorized publish
 Review --> Draft : revise
 Published --> Deprecated : supersede
 Published --> Suspended : abuse or incident
 Suspended --> Published : authorized restore
 Deprecated --> Archived
 Archived --> [*]
```

### 4.6 Official Document
```mermaid
stateDiagram-v2
 [*] --> Draft
 Draft --> InReview : submit
 InReview --> RevisionRequired : changes requested
 RevisionRequired --> Draft : edit draft
 InReview --> Approved : maker-checker
 Approved --> Finalized : render+hash immutable version
 Finalized --> Distributed : approved destination
 Distributed --> Archived : retention begins
 Finalized --> Superseded : corrected business transaction
 Superseded --> Archived
 Archived --> [*]
```

### 4.7 Offline Transaction
```mermaid
stateDiagram-v2
 [*] --> LocalDraft
 LocalDraft --> PendingSync : user submits
 PendingSync --> ServerValidated : accepted and idempotent
 PendingSync --> Conflict : stale version / invalid quantity
 PendingSync --> RetryQueued : offline/provider error
 RetryQueued --> PendingSync : retry with same key
 Conflict --> Resolved : user correction
 Resolved --> PendingSync
 ServerValidated --> Posted : server posts
 Posted --> [*]
```

## 5. Sequence diagrams — boundary contracts

### SQ-01 Lead-to-Cash
```mermaid
sequenceDiagram
 autonumber
 actor Customer
 participant CRM
 participant ERP as ERP/PPIC
 participant MES
 participant QMS
 participant INV as Inventory
 participant ACC as Accounting
 participant BI
 Customer->>CRM: Accept quotation
 CRM->>ERP: Request ATP and production demand
 ERP-->>CRM: Promise and available supply
 CRM->>CRM: Confirm SalesOrder(vN)
 ERP->>MES: Release WO(BOM/routing snapshots)
 MES->>INV: Command IssueMaterials(idempotencyKey)
 INV-->>MES: Posted movement
 MES->>QMS: Submit output for QC
 QMS-->>INV: Release accepted lot
 INV-->>CRM: Ship confirmed goods
 CRM->>ACC: Request invoice under billing policy
 ACC-->>CRM: InvoicePosted / AR ref
 ACC-->>BI: JournalPosted (outbox event)
 BI-->>Customer: No direct output (authorized portal only)
```

### SQ-02 Procure-to-Pay
```mermaid
sequenceDiagram
 autonumber
 participant MRP
 participant PRO as Procurement
 participant WF as Automate
 participant WH as Warehouse
 participant QC as QMS
 participant ACC as Accounting
 MRP->>PRO: Draft purchase requisition
 PRO->>WF: Request approval
 WF-->>PRO: Approved by authorized manager
 PRO->>PRO: Issue versioned purchase order
 PRO->>WH: Expected receipt
 WH->>QC: Incoming inspection request
 QC-->>WH: Accept / hold / reject
 WH->>ACC: GoodsReceived + PO reference
 PRO->>ACC: SupplierInvoice received
 ACC->>ACC: 3-way match quantity/price/tolerance
 alt matched
 ACC->>WF: Payment approval
 WF-->>ACC: Authorized approval
 ACC->>ACC: Post AP and payment
 else mismatch
 ACC-->>PRO: Exception resolution task
 end
```

### SQ-03 Plan-to-Produce
```mermaid
sequenceDiagram
 autonumber
 participant PPIC
 participant INV as Inventory
 participant MES
 participant HR as Workforce
 participant QMS
 participant COST as Costing
 PPIC->>INV: Query available material by required date
 INV-->>PPIC: availability + holds + reservations
 PPIC->>MES: Release WO with BOM/routing version
 MES->>HR: Query qualified assigned workers
 HR-->>MES: assignment eligibility only
 MES->>INV: Reserve / issue specific material lots
 INV-->>MES: stock posting receipt
 MES->>MES: Record operation output, reject, downtime
 MES->>QMS: Inspect lot/serial
 QMS-->>MES: disposition
 MES->>COST: Post material/labor/output events
 COST-->>PPIC: Actual vs standard cost and variance
```

### SQ-04 Hire-to-Payroll-to-Cost
```mermaid
sequenceDiagram
 autonumber
 participant HRIS
 participant MES
 participant PAY as Payroll
 participant ACC as Accounting
 participant WF as Automate
 HRIS->>MES: Publish shifts and eligible workers
 MES-->>HRIS: Report production labor time
 HRIS->>WF: Validate attendance/overtime approvals
 WF-->>HRIS: approvals or exceptions
 HRIS->>PAY: Calculate controlled payroll batch
 PAY->>ACC: Request payroll journal posting
 ACC-->>PAY: Posted journal reference
 MES->>ACC: Request direct labor allocation
 ACC->>ACC: Reconcile payroll clearing vs WIP allocations
```

### SQ-05 Official Document & Email
```mermaid
sequenceDiagram
 autonumber
 actor User
 participant DOMAIN as Procurement/Accounting
 participant DMS as Workspace
 participant WF as Automate
 participant CON as Connect
 participant EXT as Email/Drive/OneDrive
 User->>DOMAIN: Request official PO/invoice
 DOMAIN->>DOMAIN: Validate and approve transaction
 DOMAIN->>DMS: Render from approved snapshot
 DMS->>WF: Request signature/approval if required
 WF-->>DMS: approval result
 DMS->>DMS: Finalize version + checksum
 DMS->>CON: Send/export approved version
 CON->>EXT: Provider API call (scoped OAuth)
 alt success
 EXT-->>CON: provider delivery/file ID
 CON-->>DMS: Delivery status + audit
 else failure
 CON->>CON: retry same job ID / dead-letter
 CON-->>User: Alert and manual retry action
 end
```

### SQ-06 Email-to-Draft
```mermaid
sequenceDiagram
 autonumber
 participant EXT as Inbound Email
 participant CON as Connect
 participant SEC as Security Gate
 participant AI as Document Copilot
 participant PRO as Procurement/CRM
 participant WF as Automate
 EXT->>CON: Signed verified webhook
 CON->>SEC: Sender, attachment, content validation
 alt verified as untrusted data
 SEC->>AI: Sanitized content reference, read-only
 AI-->>PRO: Proposed change/draft, evidence link
 PRO->>WF: Business owner approval
 WF-->>PRO: approved action authorization
 PRO->>PRO: Revalidate and execute command
 else invalid or malicious
 SEC-->>CON: Quarantine and audit
 end
```

### SQ-07 Company Copilot-to-Action
```mermaid
sequenceDiagram
 autonumber
 actor CEO
 participant AG as AI Gateway
 participant SEM as Governed Semantic Layer
 participant ERP
 participant HR as HRIS
 participant ACC as Accounting
 participant WF as Automate
 CEO->>AG: Why did margin decline?
 AG->>SEM: Authorized KPI query by scope
 SEM->>ERP: Materials and production variance
 SEM->>HR: Aggregated labor vs shifts
 SEM->>ACC: GL/COGS reconciliation
 SEM-->>AG: Evidence + freshness + limitations
 AG-->>CEO: Diagnosis, scenarios and proposed actions
 CEO->>WF: Approve selected proposal
 WF->>ERP: Typed business command (policy checked)
 ERP-->>WF: Committed / rejected result
 WF-->>CEO: Actual result with audit ID
```

### SQ-08 Offline Shop Floor Sync
```mermaid
sequenceDiagram
 autonumber
 actor Operator
 participant PWA
 participant API
 participant MES
 participant INV as Inventory
 Operator->>PWA: Record 25 good, 2 reject offline
 PWA->>PWA: Save local event + client_uuid
 PWA->>API: Submit batch upon reconnection
 API->>MES: Command with idempotency key and expected version
 alt server validation passes
 MES->>INV: Consume material if rule requires
 INV-->>MES: ledger movement ID
 MES-->>API: Committed authoritative status
 API-->>PWA: Ack + server version
 else conflict or insufficient stock
 MES-->>API: Validation error and current version
 API-->>PWA: Conflict for user resolution
 end
```

### SQ-09 Breakdown-to-Recovery
```mermaid
sequenceDiagram
 autonumber
 participant MES
 participant MT as Maintenance
 participant INV as Inventory
 participant PPIC
 participant WF as Automate
 MES->>MT: MachineDown event
 MT->>INV: Request spare parts availability
 INV-->>MT: stock / ETA
 MT->>WF: Maintenance task and technician approval
 WF-->>MT: authorized assignment
 MT->>MT: Repair, inspection and safe test
 MT->>MES: MachineReleased with evidence
 MES->>PPIC: Machine capacity available
 PPIC->>PPIC: Replan affected WO
```

## 6. Failure and compensation patterns
| Failure | Required behavior | Owning service | Recovery check |
|---|---|---|---|
| Event delivered twice | Inbox/event_id de-dup; same business result | Consumer domain | Posted stock, invoice or labor entry appears once |
| Long-running saga fails | Persist state and compensating steps; no partial hidden success | Automate orchestrator | Human-visible failed/compensated status |
| QC hold after output | Prevent allocation/shipment of affected quantity | QMS + Inventory | ATP excludes held stock |
| Sales order changed after WO release | Version amendment and impact analysis; never mutate WO snapshot silently | CRM + PPIC | Reconciliation of previous material reservation |
| Provider upload/email fails | Retry with same logical job; escalation and dead-letter | Connect | Official document remains finalized independent of delivery |
| Offline client repeats POST | Same client_uuid + expected version; server authoritative | MES API | Single output event and movement ledger |
| Payroll vs MES hours disagree | Attendance and production time differentiated; create variance task | HRIS + Finance | Clearing cost bridge reconciles |
| AI tool suggests restricted action | Deny at gateway and owner command boundary | AI + Core | Audit denied attempt; no mutation |

## 7. Authorization sequence
```mermaid
sequenceDiagram
 actor User
 participant UI
 participant API
 participant POLICY as Policy Engine
 participant DOMAIN as Domain Service
 participant DB
 User->>UI: Submit domain action
 UI->>API: Command + tenant + expected_version
 API->>POLICY: Evaluate identity, org/entity/plant/resource/action
 alt allow
 POLICY-->>API: permission grant
 API->>DOMAIN: Typed validated command
 DOMAIN->>DB: Atomic write + outbox
 DB-->>DOMAIN: committed ID/version
 DOMAIN-->>UI: authoritative result + trace ID
 else deny
 POLICY-->>API: denied
 API-->>UI: safe 403 + audit correlation
 end
```

## 8. Implementation checks
- No changes to inventory or GL through a UI-only field edit; require valid domain command.
- Post-once invariant enforced with unique idempotency keys scoped by tenant and action.
- Workflow and document versions never retroactively mutate approved resource snapshots.
- All AI actions receive a policy decision separate from natural-language model suggestions.
- Use-case coverage: UC-01..UC-18; end-to-end sequence coverage SQ-01..SQ-09; source process coverage BP-01..BP-10.

## 9. Open decisions for sign-off
- Precise states for production partial close and controlled cancellation (depends on costing policy).
- Customer billing milestones and Indonesian tax integration provider/approval model.
- Inventory valuation approach per legal entity and WIP reconciliation intervals.
- Ability to execute hybrid batch and discrete steps within one work order vs linked orders.
