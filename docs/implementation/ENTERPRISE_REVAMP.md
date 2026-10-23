# Enterprise scroll storytelling — implementation record

Phases 1–5: TESTED locally. Hosted Preview acceptance is reported separately in the task delivery report. Production release: NOT_STARTED. Branch: `feat/enterprise-scroll-storytelling`.

## Baseline and boundaries

Production deployment `dpl_8rvtCVXLr2G5uTrmf1tNqYxcGdfa` serves main commit `46d4c43dcbd1a5e7003a0243e69ca3e50369bbda`; origin/main was fetched before branching. Baseline screenshot saved in task outputs as enterprise-before-desktop.png. Stack: Next 15.5.27 / React 19 / TypeScript / Tailwind; existing motion was primarily CSS entry, hover and progressive view-timeline effects. Homepage focused on manufacturing, a small product board and module tiles rather than company-wide cause/effect.

Read AGENTS.md, STATUS.md, WEBSITE_REDESIGN.md, Master PRD, brand tokens and module/capability catalogs. REQUIREMENTS_MATRIX.md and implementation ADRs remain absent. Brand tokens and approved SVG logo retained. CRM/ERP/MES/Accounting are PILOT_AVAILABLE; HRIS/Quality/Maintenance/Connect are IN_DEVELOPMENT; Workspace/Automation/BI/AI Copilot are PROTOTYPE. No status is upgraded by this marketing implementation.

Existing blog routes, schema, robots, sitemap, lead/Design Partner forms, editorial/auth and APIs are retained. Production database persistence is a known baseline limitation; no DB/env changes are authorized or performed. Lead API inspection also identified oversized UUID-prefixed IDs against VARCHAR(36), repaired and validated against real local PGlite PostgreSQL constraints for CONTACT, DEMO_REQUEST and DESIGN_PARTNER, with notification email mocked. This does not resolve production persistence configuration.

Observed Fulcrum effects: large type paired with layered product UI, an angled tablet composition entering on scroll, restrained motion/depth and full-width visual section transitions. We do not assert which library Fulcrum uses. Our chosen implementation is GSAP ScrollTrigger plus native sticky positioning, SVG connection paths, CSS type entry and transform/opacity transitions; no borrowed branded artwork, WebGL, scroll hijacking or smooth-scroll library.

## Creative system and scene specification

Direction: Your Entire Business. Working as One. Indonesian primary narrative; one fictitious company PT Arunika Ruang and order SO-1042 for 120 desks. All transactions, documents, figures, delays and AI output visibly simulated. Persistent sample-data labels on hero and canvas. Central canvas shows parallel People/Assets, Finance and Documents dependencies, not a strictly linear workflow.

| Scene | Story and interaction | Motion / fallback |
| --- | --- | --- |
| 01 | Connected enterprise hero; approved branding, central workspace and department previews | Staggered type, layered perspective; all content SSR |
| 02 | Disconnected CRM, spreadsheets, HR, inventory, reports and approval records | Meaningful disconnected-to-connected composition; readable text |
| 03 | Inquiry → opportunity → quotation → human approval → SO-1042 | Canvas highlights Sales, Planning, Finance; transaction preview |
| 04 | Order affects materials, procurement, resources, capacity and estimated cost | Connected paths and planning panel |
| 05 | People, shift responsibilities and asset readiness | Parallel HR/Maintenance support; actual maturity badges |
| 06 | WO-0214 activation, dispatch, example output, QC/rework | Work progress and checkpoint view; no live execution |
| 07 | Supplier delay ripples to inventory, planning, operations, people, sales and finance | Interactive delay/reset, dependency network and causal explanations; all actions are human review |
| 08 | PO → receipt → delivery → invoice → journal/audit | Document sequence and cost components; files do not mutate posted transactions |
| 09 | Executive view with source-referenced illustrative AI explanation | Connected sources; prototype and human-approval boundaries |
| 10 | Five module families; all 11 module routes plus Copilot | Accessible interactive tabs, contextual visual and maturity sourced from existing catalog |
| 11 | Discover / Implement / Connect / Grow | Four-phase journey and dedicated /services; proposed packages, no delivery/price promise |
| 12 | Design Partner and consultation conversion | Existing LeadForm and routes preserved; clear maturity context |

Desktop: narrative articles beside one sticky canvas; shared GSAP timeline progresses the SVG paths and workspace depth. Mobile/tablet: unpinned articles with inline scene previews, all causal details visible. Reduced motion: no GSAP loading, no transform animation or pin dependency. No JavaScript: all narrative, modules' semantic links, services and simulation disclaimers remain available in initial HTML.

## Validation and delivery

- `pnpm typecheck`: PASS; `pnpm lint`: PASS, no warnings/errors (Next emits its lint-command deprecation notice).
- `pnpm build`: PASS, Next 15.5.27. Homepage first-load JS estimate 123 kB, shared 103 kB; /services 110 kB. GSAP controller is dynamically loaded only near the story at desktop widths with motion enabled.
- `pnpm test`: 8 files / 31 tests PASS, including three real local PostgreSQL/PGlite lead persistence cases and audit linkage. Email adapter mocked; synthetic fixtures only.
- `PLAYWRIGHT_TEST_BASE_URL=http://127.0.0.1:3001 pnpm test:e2e --workers=2`: 14 tests PASS against the production build. Covers existing routes, scene sync, ripple reset/no network writes, keyboard tabs, services, mobile menu/overflow, no-JS narrative/module fallback, mobile/desktop reduced motion and runtime errors.
- `SEO_BASE_URL=http://127.0.0.1:3001 node scripts/check-seo.mjs`: PASS for all 55 sitemap URLs, six articles, raw HTML H1/canonical/metadata, BlogPosting JSON-LD, robots, RSS, search noindex and pagination canonical.
- Browser visual review: desktop 1280×720 and mobile 390×844; hero, story, ripple and services. Initial E2E run found three stale/incorrect test selectors (phase element, mobile menu label, existing F&B wording); corrected, full suite rerun PASS.
- Local lab single-sample metrics, no network/CPU throttling: desktop 1440px LCP 108 ms / CLS 0; mobile 390px LCP 112 ms / CLS 0. These are local smoke observations, not Lighthouse scores, production Core Web Vitals or field INP. No real-visitor INP measurement exists for this redesign.

Known boundaries: production DB/CMS/lead writes and email delivery remain unverified and depend on persistent PostgreSQL/provider configuration. Product previews and AI answers are illustrative, not live product operations. Services are explicitly proposed, not confirmed commercial offerings. Google crawling eligibility is checked; indexing cannot be guaranteed. REQUIREMENTS_MATRIX.md and implementation ADRs were absent. Historical v1.0 claims are not revalidated by this marketing task. Production release requires fresh explicit approval for this revamp.
