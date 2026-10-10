# NewSystem — Official Corporate Website, Blog & CMS

> **One System. Every Process. Smarter Business.**  
> *AI-Powered Business & Manufacturing Operating System.*

The official public-facing marketing platform, technical blog, and editorial content management system (CMS) for **NewSystem**, built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM.

---

## 1. Business & Brand Overview

NewSystem is designed as a unified enterprise operating system connecting manufacturing operations, shop floor execution, workforce, customer pipeline, finance, documents, workflow automation, and business intelligence.

### Official Brand Tokens
- **Deep Navy:** `#0B1730`
- **NewSystem Blue:** `#005BFF`
- **Electric Cyan:** `#12C9F5`
- **Intelligence Indigo:** `#6366F1`
- **Background / Surface:** `#F8FAFC` / `#FFFFFF`
- **Typography:** Inter (Display, Headings, Body, Code)

### Product Maturity & Transparency Charter
In accordance with NewSystem's core engineering values, this marketing platform strictly adheres to **Product Maturity Rules**:
- Every capability and module is tagged with its verified maturity state:
  - `PLANNED`: In architecture and design specification.
  - `IN_DEVELOPMENT`: Actively being engineered.
  - `PROTOTYPE`: Interactive UX flow validated.
  - `PILOT_AVAILABLE`: Ready for evaluation with Design Partners.
  - `GENERALLY_AVAILABLE`: Released for general production use.
- **Zero fake testimonials**, fictitious customer logos, or simulated traction.
- Prototype screenshots and simulated dashboards are explicitly labeled with `SimulatedBadge`.
- Centrally governed via `lib/capabilities/status.ts`.

---

## 2. Tech Stack & Architecture

- **Framework:** Next.js 15.1.7 (App Router with Server Components and Server Actions)
- **Language & Runtime:** TypeScript 5.7, Node.js 18+ (tested on Node v24)
- **Styling:** Tailwind CSS 3.4 with custom typography and brand tokens
- **Icons:** Lucide React
- **Database & ORM:** PostgreSQL managed via Drizzle ORM
  - **Dual-Mode Persistence:** Connects to any external PostgreSQL instance via `DATABASE_URL` (Docker, Supabase, Neon, AWS RDS), with automatic fallback to embedded `@electric-sql/pglite` on disk for zero-friction local development and CI runs.
- **Authentication & RBAC:** Session-based signed JWTs via `jose` with 6 granular user roles.
- **Validation:** Zod schemas for all lead forms, ingestion payloads, and CMS mutations.
- **Testing:** Vitest for unit tests, Playwright for end-to-end integration tests.

---

## 3. Getting Started

### Prerequisites
- Node.js 18.18+ or 20+ (Node 24 supported)
- npm or pnpm

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd newsystem-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   *(By default, `.env.local` runs with embedded PGlite storage in `./.data/pglite`, requiring zero external database installations).*

4. Seed the database with initial users, authors, categories, tags, and articles:
   ```bash
   npm run db:seed
   ```

5. Start the local development server:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to view the website.

---

## 4. Preconfigured Admin Accounts & RBAC

The seed script (`npm run db:seed`) automatically sets up 4 test accounts for role-based testing:

| Email | Role | Default Password | Key Permissions |
| :--- | :--- | :--- | :--- |
| `admin@newsystem.id` | **SUPERADMIN** | `Admin123!` | Full system access, settings, leads, redirects, audit trail |
| `editor@newsystem.id` | **EDITOR** | `Editor123!` | Create, edit any article, submit for review, media upload |
| `reviewer@newsystem.id` | **REVIEWER** | `Reviewer123!` | Review submissions, approve/reject changes, view audit logs |
| `marketing@newsystem.id` | **MARKETING_LEAD_MANAGER** | `Marketing123!` | View, qualify, and export leads, manage newsletter subscribers |

To access the CMS dashboard, navigate to:
**[http://localhost:3000/admin](http://localhost:3000/admin)**  
*(1-click login buttons are provided on the login page for rapid role switching).*

---

## 5. Website Information Architecture

### Public Marketing Platform
- **Homepage (`/`):** 12 enterprise SaaS sections covering the core operating system, problem statement, modular flows, AI Copilot, 7 manufacturing solutions, roadmap, and lead capture.
- **Platform Architecture (`/platform`):** Unified OS, multi-company/multi-plant data hierarchy, and security perimeter.
- **AI Copilot (`/copilot`):** Company Copilot vs Module Copilots with transaction evidence requirements.
- **Modules (`/modules` & `/modules/[slug]`):** 11 detailed module pages (ERP, MES, HRIS, CRM, Accounting, Quality, Maintenance, Automation, Workspace, Connect, BI).
- **Solutions (`/solutions` & `/solutions/[slug]`):** 7 manufacturing archetypes (General, F&B, Garment, Furniture & Assembly, Batch, Discrete, Hybrid).
- **Design Partner Program (`/design-partner`):** Structured qualification criteria and factory application form.
- **Blog (`/blog`, `/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`, `/blog/author/[slug]`):** Real-time search, category navigation, estimated reading time, heading Table of Contents, and JSON-LD schema.
- **Technical SEO:** Live RSS 2.0 (`/rss.xml`), dynamic XML sitemap (`/sitemap.xml`), and `robots.txt`.

### Editorial CMS Features (`/admin`)
- **Dashboard (`/admin`):** Live database statistics, recent lead activity, and pending review alerts.
- **Post Manager & Editor (`/admin/posts`):** Draft, Review, Schedule, and Publish workflow with revision rollback.
- **AI Editorial Assistant (`/admin/ai-assistant`):** Outline generation, Indonesian manufacturing tone optimization, and readability scoring (Gemini 2.0 Flash enabled).
- **Lead Manager (`/admin/leads`):** Real-time CRM lead viewer, status qualification (New, Contacted, Qualified, Closed), and CSV export.
- **Taxonomy (`/admin/categories` & `/admin/authors`):** Full control over category metadata and author bios.
- **Media Library (`/admin/media`):** Local and CDN image uploads with 1-click clipboard URL copying.
- **Newsletter (`/admin/newsletter`):** Subscriber management and CSV export.
- **SEO Redirects (`/admin/redirects`):** 301/302 URL redirect manager.
- **Settings & Maturity Matrix (`/admin/settings`):** Centralized capability status overrides.
- **Ingest Queue (`/admin/ingest`):** Webhook ingestion log and payload inspector.
- **Audit Trail (`/admin/audit-logs`):** Immutable log of all administrative actions.

---

## 6. Integration Endpoints

### 1. External Content Ingestion API
Endpoint for headless ingestion pipelines (n8n, Make, Zapier, Python scripts):
```bash
POST /api/v1/editorial/ingest
Authorization: Bearer newsystem_dev_ingest_key
Content-Type: application/json

{
  "sourceSystem": "n8n_manufacturing_feed",
  "externalId": "doc-8492",
  "title": "Optimasi Waktu Siklus Stamping dengan Penerapan Single-Minute Exchange of Die",
  "excerpt": "Panduan implementasi SMED untuk memangkas waktu setup mesin press dari 90 menit menjadi 8 menit.",
  "content": "Penerapan teknik SMED pada lini stamping membedakan operasi internal dan eksternal...",
  "categorySlug": "mes-shop-floor-control",
  "authorSlug": "budi-santoso"
}
```

### 2. Scheduled Publication Cron Runner
Endpoint for external cron schedulers (GitHub Actions, Vercel Cron, Cloudflare Workers):
```bash
POST /api/cron/publish
Authorization: Bearer newsystem_dev_cron_secret_key
```

---

## 7. Quality Assurance & Testing

```bash
# Run TypeScript compilation check
npm run typecheck

# Run Vitest unit tests (RBAC, Leads, Maturity, Ingest, Cron)
npm test

# Run Playwright E2E integration tests
npm run test:e2e
```

---

## 8. Deployment Options

### Option A: Vercel / Hosted Next.js
1. Set environment variables in Vercel project settings:
   - `DATABASE_URL`: Hosted PostgreSQL connection string (Supabase, Neon, AWS RDS).
   - `CMS_JWT_SECRET`: 32+ character random string.
   - `EDITORIAL_INGEST_API_KEY`: Secret key for webhook ingestion.
   - `CRON_SECRET`: Secret key for scheduled publication runner.
2. Run database migration and seed:
   ```bash
   npx tsx scripts/seed.ts
   ```
3. Deploy branch directly to Vercel.

### Option B: Docker Compose (Self-Hosted)
A ready-to-run `docker-compose.yml` is provided for running a dedicated PostgreSQL database container alongside the application:
```bash
docker compose up -d
npm run db:seed
npm run build
npm run start
```

---

## 9. License & Brand Protection

© 2026 NewSystem. All rights reserved.  
The NewSystem name, tagline ("One System. Every Process. Smarter Business."), official logo vector assets, and design system tokens are proprietary.
