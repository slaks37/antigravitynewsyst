# NewSystem Technical Design Package v1.0

Prepared: 10 Oktober 2026. Source: NewSystem Master PRD v1.0.

## Package inventory
- `UML/NewSystem_Detailed_UML_v1.0`: use cases (18), class diagram, seven state diagrams and nine sequence diagrams. Individual Mermaid diagram sources under `UML/diagrams/`.
- `ERD/NewSystem_Detailed_ERD_Data_Dictionary_v1.0`: six Mermaid ER models, nine data domains, ~80 entity definitions, shared invariants, indexes and ownership.
- `BPMN/NewSystem_Detailed_BPMN_Process_Catalogue_v1.0`: ten end-to-end processes with lanes, exception paths and completion conditions; ten editable BPMN 2.0 XML models under `BPMN/models/`.
- `UX/NewSystem_Screen_by_Screen_UX_Spec_v1.0`: 57 screens, per-screen route, role, layout, action, errors, AI, sources and acceptance; JSON registry and browsable static HTML atlas.
- `Traceability/NewSystem_Requirement_Traceability_v1.0`: 139 extracted functional requirements cross-referenced to design workstreams.

## Usage
- Open `.docx` for design review or `.md` for implementation backlog and editable Mermaid diagrams.
- Open `.bpmn` in BPMN 2.0 modeler; diagram file is a design model, not deployed automation.
- Open `NewSystem_Interactive_Screen_Atlas_v1.0.html` locally for navigable prototype (no real API connections).
- Production DDL, API schemas, Figma UI components, payroll/tax policies and integrations need separate implementation and sign-off.

## Non-negotiable principles
Tenant-scoped authorizations, domain-owned commands, immutable financial/inventory postings, no silent duplicate side effects, official document versioning, security-scoped connectors, AI human approval for risk-bearing actions, and company AI with citations and data freshness.
