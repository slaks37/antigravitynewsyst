# NewSystem — Detailed BPMN Business Process Catalogue v1.0

**Reference:** NewSystem Master PRD v1.0 | **Date:** 10 Oktober 2026 | **Modeling convention:** one process with lane-based tasks and explicit exceptions; editable BPMN 2.0 XML accompanies each process. The diagram definition includes positional BPMN DI for graphical BPMN editors.

## 1. BPMN modeling rules
- Start events are business triggers, not arbitrary UI clicks.
- Tasks are assigned to responsible lanes; service tasks must call domain commands rather than write foreign tables.
- Exclusive gateways determine conditional branches, and rejected paths lead to resolution instead of silently succeeding.
- Each process has explicit completion and exception end states, SLA timers/overdue reminders when applicable, audit and correlation IDs.
- Long-running processes must persist state and use compensating steps; never keep one DB transaction open during human review.

## 2. Complete BP catalogue

### BP-01 — Lead-to-Cash

**Start trigger:** Business event / authorized request for lead-to-cash.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | CRM | Qualify lead and approve quotation | Step log / business reference #1 |
| 02 | ERP/PPIC | Check ATP and capacity | Step log / business reference #2 |
| 03 | CRM | Confirm sales order | Step log / business reference #3 |
| 04 | ERP/PPIC | Fulfill from stock or release WO | Step log / business reference #4 |
| 05 | MES/QMS | Produce and release accepted goods | Step log / business reference #5 |
| 06 | Warehouse | Ship and confirm delivery | Step log / business reference #6 |
| 07 | Accounting | Post invoice and allocate payment | Step log / business reference #7 |
| 08 | CRM | Close order and after-sales | Step log / business reference #8 |

**Exception branch:** Customer changes terms / material shortage / partial shipment / credit hold.

**Successful end condition:** Order version, shipment proof, invoice journal and payment application reconciled.

**Model:** `BP-01_Lead_to_Cash.bpmn` (open in a BPMN 2.0 modeler).

### BP-02 — Procure-to-Pay

**Start trigger:** Business event / authorized request for procure-to-pay.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | ERP/PPIC | Identify material shortage | Step log / business reference #1 |
| 02 | Procurement | Draft PR and compare supplier | Step log / business reference #2 |
| 03 | Automate | Apply spend approval | Step log / business reference #3 |
| 04 | Procurement | Issue approved PO | Step log / business reference #4 |
| 05 | Warehouse/QMS | Receive and inspect material | Step log / business reference #5 |
| 06 | Accounting | Three-way match PO/GRN/bill | Step log / business reference #6 |
| 07 | Treasury | Authorize supplier payment | Step log / business reference #7 |
| 08 | Accounting | Reconcile and close AP | Step log / business reference #8 |

**Exception branch:** Rejected incoming lot / invoice mismatch / duplicate bill / partial receipt.

**Successful end condition:** No duplicate payable; stock and inventory value reconcile.

**Model:** `BP-02_Procure_to_Pay.bpmn` (open in a BPMN 2.0 modeler).

### BP-03 — Plan-to-Produce

**Start trigger:** Business event / authorized request for plan-to-produce.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | Sales/PPIC | Capture demand and planning version | Step log / business reference #1 |
| 02 | ERP/PPIC | Calculate MRP and capacity | Step log / business reference #2 |
| 03 | ERP/PPIC | Approve and release production order | Step log / business reference #3 |
| 04 | Warehouse | Reserve and issue materials | Step log / business reference #4 |
| 05 | MES | Execute routing and record output/time | Step log / business reference #5 |
| 06 | QMS | Accept, rework, reject or hold | Step log / business reference #6 |
| 07 | Inventory | Post accepted finished goods | Step log / business reference #7 |
| 08 | Costing | Reconcile WIP and actual cost | Step log / business reference #8 |

**Exception branch:** Machine downtime / shortage / rework loop / partial quantity.

**Successful end condition:** WO closed with verified output, lot genealogy, material and cost.

**Model:** `BP-03_Plan_to_Produce.bpmn` (open in a BPMN 2.0 modeler).

### BP-04 — Hire-to-Payroll-to-Cost

**Start trigger:** Business event / authorized request for hire-to-payroll-to-cost.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | HRIS | Activate employee and pay policy | Step log / business reference #1 |
| 02 | HRIS | Schedule shift and attendance | Step log / business reference #2 |
| 03 | MES | Assign qualified operator | Step log / business reference #3 |
| 04 | MES | Capture shop floor labor minutes | Step log / business reference #4 |
| 05 | HRIS | Validate leave and overtime | Step log / business reference #5 |
| 06 | Payroll | Calculate and approve payroll | Step log / business reference #6 |
| 07 | Accounting | Post payroll liability | Step log / business reference #7 |
| 08 | Costing | Allocate direct labor to WIP | Step log / business reference #8 |

**Exception branch:** Overtime approval missing / disputed attendance / GL mismatch.

**Successful end condition:** Payroll and WIP allocation reconciled without double expense.

**Model:** `BP-04_Hire_to_Payroll_to_Cost.bpmn` (open in a BPMN 2.0 modeler).

### BP-05 — Record-to-Report

**Start trigger:** Business event / authorized request for record-to-report.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | Accounting | Collect authorized source events | Step log / business reference #1 |
| 02 | Accounting | Post and classify journals | Step log / business reference #2 |
| 03 | Accounting | Match cash/bank and subledgers | Step log / business reference #3 |
| 04 | Costing | Reconcile inventory and WIP | Step log / business reference #4 |
| 05 | Finance | Review period adjustments | Step log / business reference #5 |
| 06 | Finance | Run trial balance and close checks | Step log / business reference #6 |
| 07 | Controller | Approve period close | Step log / business reference #7 |
| 08 | BI | Publish final financial reports | Step log / business reference #8 |

**Exception branch:** Unbalanced journal / late invoice / locked period / posting race.

**Successful end condition:** Period cannot close with unresolved mandatory controls.

**Model:** `BP-05_Record_to_Report.bpmn` (open in a BPMN 2.0 modeler).

### BP-06 — Quality Incident-to-Resolution

**Start trigger:** Business event / authorized request for quality incident-to-resolution.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | QC | Detect non-conformance | Step log / business reference #1 |
| 02 | QMS | Place lot/quantity on hold | Step log / business reference #2 |
| 03 | QMS | Create NCR and classify severity | Step log / business reference #3 |
| 04 | MES | Investigate causes and trace lots | Step log / business reference #4 |
| 05 | QMS | Propose rework/scrap/release | Step log / business reference #5 |
| 06 | Automate | Review disposition approval | Step log / business reference #6 |
| 07 | Inventory/MES | Execute authorized disposition | Step log / business reference #7 |
| 08 | QMS | Verify CAPA effectiveness and close | Step log / business reference #8 |

**Exception branch:** Shipped affected lot / missing genealogy / rework failed.

**Successful end condition:** No held stock shipped; corrective action and trace complete.

**Model:** `BP-06_Quality_Incident_to_Resolution.bpmn` (open in a BPMN 2.0 modeler).

### BP-07 — Breakdown-to-Recovery

**Start trigger:** Business event / authorized request for breakdown-to-recovery.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | MES | Detect equipment down | Step log / business reference #1 |
| 02 | Maintenance | Create work request | Step log / business reference #2 |
| 03 | ERP Inventory | Check and reserve spare parts | Step log / business reference #3 |
| 04 | HRIS | Assign authorized technician | Step log / business reference #4 |
| 05 | Maintenance | Repair and record evidence | Step log / business reference #5 |
| 06 | Maintenance | Test and safety-release equipment | Step log / business reference #6 |
| 07 | MES/PPIC | Reopen equipment and replan orders | Step log / business reference #7 |
| 08 | BI | Update downtime and MTTR | Step log / business reference #8 |

**Exception branch:** Safety clearance failed / parts late / recurring fault.

**Successful end condition:** Machine only operational after verified release.

**Model:** `BP-07_Breakdown_to_Recovery.bpmn` (open in a BPMN 2.0 modeler).

### BP-08 — Document-to-Archive

**Start trigger:** Business event / authorized request for document-to-archive.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | User/Domain | Create source business record or draft | Step log / business reference #1 |
| 02 | DMS | Select template and generate content | Step log / business reference #2 |
| 03 | DMS | Edit/version and run policy checks | Step log / business reference #3 |
| 04 | Automate | Route approval/signature | Step log / business reference #4 |
| 05 | DMS | Finalize immutable PDF/version hash | Step log / business reference #5 |
| 06 | Connect | Send/share/sync approved copy | Step log / business reference #6 |
| 07 | Connect | Capture provider status and failure | Step log / business reference #7 |
| 08 | DMS | Archive per retention policy | Step log / business reference #8 |

**Exception branch:** Approval rejected / external file edited / email fails / legal hold.

**Successful end condition:** Official version immutable and retrievable regardless of external copy.

**Model:** `BP-08_Document_to_Archive.bpmn` (open in a BPMN 2.0 modeler).

### BP-09 — Email-to-Business-Task

**Start trigger:** Business event / authorized request for email-to-business-task.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | Connect | Receive signed provider event | Step log / business reference #1 |
| 02 | Security | Verify sender, content and attachment | Step log / business reference #2 |
| 03 | Connect | Deduplicate and classify thread | Step log / business reference #3 |
| 04 | AI | Extract proposal from untrusted email | Step log / business reference #4 |
| 05 | Department | Review linked purchase/customer record | Step log / business reference #5 |
| 06 | Automate | Request authorized approval | Step log / business reference #6 |
| 07 | Domain | Execute typed domain command | Step log / business reference #7 |
| 08 | Connect | Send controlled reply and audit | Step log / business reference #8 |

**Exception branch:** Spoofing / prompt injection / malicious file / unexpected entity.

**Successful end condition:** No inbound email directly posts financial/stock changes.

**Model:** `BP-09_Email_to_Business_Task.bpmn` (open in a BPMN 2.0 modeler).

### BP-10 — Company AI-to-Action

**Start trigger:** Business event / authorized request for company ai-to-action.

| Step | Responsible lane | BPMN activity | Expected artifact |
|---|---|---|---|
| 01 | Employee/CEO | Ask scoped business question | Step log / business reference #1 |
| 02 | AI Gateway | Authenticate, apply tenant and role | Step log / business reference #2 |
| 03 | BI | Read governed metrics and source evidence | Step log / business reference #3 |
| 04 | AI | Diagnose and simulate alternatives | Step log / business reference #4 |
| 05 | User | Review evidence and select proposal | Step log / business reference #5 |
| 06 | Automate | Apply business approval policies | Step log / business reference #6 |
| 07 | Domain | Execute authorized typed command | Step log / business reference #7 |
| 08 | AI Gateway | Return verified action receipt | Step log / business reference #8 |

**Exception branch:** Sparse data / permission denied / stale KPI / unsafe proposed action.

**Successful end condition:** Every answer cited to data and every mutation logged/approved.

**Model:** `BP-10_Company_AI_to_Action.bpmn` (open in a BPMN 2.0 modeler).

## 3. Cross-process handoffs
| From process | Event/record | To process | Constraint |
|---|---|---|---|
| BP-01 | `SalesOrderConfirmed` | BP-03 | Demand revision and ATP must remain consistent |
| BP-03 | `MaterialShortageDetected` | BP-02 | Purchase draft is not posted stock |
| BP-03 | `ProductionOutputRecorded` | BP-06 | QC hold prevents ATP/shipment |
| BP-04 | `PayrollFinalized` | BP-05 | Payroll journal and direct labor clearing must reconcile |
| BP-07 | `MachineReleased` | BP-03 | Safety test evidence required before schedule resumes |
| BP-08 | `DocumentFinalized` | BP-01/BP-02/BP-05 | Official version locked; external delivery asynchronous |
| BP-09 | `DraftBusinessChangeProposed` | BP-02/BP-01 | User review required; email content untrusted |
| BP-10 | `AIActionApproved` | Any | Domain policy evaluated again at execution |

## 4. BPMN execution rules for implementation
- `process_instance_id`, `correlation_id`, `tenant_id`, `source_aggregate_ref`, owner and timeout belong to each workflow instance.
- User task assignment and escalation are persisted; approval delegation cannot bypass spending or financial SoD constraints.
- Boundary errors/exception branches require manual reconciliation tasks with clear audit and retry eligibility.
- BPMN files are functional business-process models, not a production-ready executable workflow engine. Technical service-task bindings must be specified later.
