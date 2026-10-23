# Website redesign and SEO repair — 23 October 2026

Phase: **TESTED locally and Preview HTTP smoke VERIFIED; production release NOT_STARTED**.

## User-visible result

- New homepage inspired by the spatial hierarchy and product storytelling of Fulcrum and Katana, retaining official NewSystem identity, colors, SVG logos and Indonesian content.
- Interactive production/inventory/cost preview with explicit sample-data label, keyboard tab controls, mobile navigation, native FAQ, hover/entrance effects and progressive scroll animation with reduced-motion support.
- Public links to all 11 modules, industry solutions, blog, consultation and Design Partner program. Removed unsupported homepage ROI, customer testimonial and aggregate-rating/free-price structured-data claims.
- Existing blog/CMS retained. Added crawlable pagination, fixed database tag filtering, zero-result search and withdrawn-article behavior, article update timestamps, title duplication and newsletter submission/persistence defects.

## SEO behavior

The root layout previously emitted a hard-coded homepage canonical and inherited its canonical metadata on other pages. Public routes now provide exactly one route-specific canonical. Search results are noindex/follow; paginated indexes retain their page canonical. Robots permits the public site and assets while excluding admin/API paths. Sitemap uses actual article update/publication times and omits fabricated lastmod timestamps on static pages. RSS escapes XML/CDATA. Article content and BlogPosting/Breadcrumb data are served in initial HTML; unsafe raw HTML in the basic Markdown renderer is escaped.

Blog, article, taxonomy, sitemap and RSS responses are request-rendered so publication and withdrawal do not require redeploying static article pages. Successful empty database queries remain empty. A configured external DB remains authoritative and query failures propagate instead of resurfacing curated fallback content. Curated articles remain available for an unconfigured local/demo checkout, including a read-only filesystem. Removed the eager exported DB instance; module imports no longer create `.data` before application error handling can run.

Newsletter now sends JSON matching its API and displays success/error states. Subscriber and audit IDs now fit their VARCHAR(36) columns. Persistence was tested only with synthetic local data; no real subscription or email was sent.

## Verification evidence

- `pnpm install --frozen-lockfile`: successful, no dependency/lockfile changes.
- `pnpm lint`: PASS. Added missing ESLint configuration; fixed six existing JSX lint errors without changing their displayed content. Next 15 warns that its lint command will be removed in Next 16.
- `pnpm typecheck`: PASS.
- `pnpm test`: **28 passed, 7 test files**. Includes real in-memory PGlite/PostgreSQL tests for empty search, withdrawn fallback-named article, draft/future-date exclusion, tag filtering, updatedAt, newsletter persistence/deduplication/audit; mocked ENOENT/EROFS filesystem regressions verifies lazy DB imports and curated public blog availability.
- `pnpm build`: PASS, Next.js 15.5.27, all 40 static routes generated. No eager PGlite worker aborts in final build.
- `node scripts/check-seo.mjs` against `next start`: **54 sitemap URLs passed**, including 6 articles. Checks HTTP 200, one H1 in initial HTML, one self-canonical, no public noindex, descriptions, BlogPosting JSON-LD, unique sitemap, RSS, search noindex and pagination canonical. This is a raw HTTP crawl; it does not execute JavaScript.
- Browser review: 320, 390, 768, 1280px; document scroll width equals viewport width at each. Verified mobile menu → blog → article, inventory tab, arrow-key tab navigation, FAQ expansion. Production-mode homepage browser error log empty. Screenshots saved with the task deliverables.
- Existing Playwright assertions updated to current public copy. **Playwright runner was not executed**; browser checks used the supported in-app browser.

## Current production baseline and limits

Read-only checks on 23 October 2026 found homepage HTTP 200 with **two homepage canonicals**, `/blog` HTTP **500**, robots HTTP 200 and sitemap HTTP 200 containing 54 URLs. Vercel production is deployment `dpl_HvZe4aJgbS83AqNDba5WQjAfPoyY`, commit `75cea2c69d28354342ddcbb17d94f11e527ef5fc`, project `prj_l7yPpIPINDUdSuGx61YatL76JjPu`.

The connector returned **403 Forbidden** for runtime logs and protected Preview access. The official Vercel CLI, using the existing authenticated session and explicit project/team scope, successfully provided the fallback. Production `/blog` logs confirm `ENOENT: no such file or directory, mkdir '/var/task/.data/pglite'` during eager DB initialization. Removing the eager exported DB instance fixes the import-time crash and allows the existing public fallback handling to run. CMS writes and subscriber storage on Vercel still require a correctly provisioned persistent PostgreSQL database; an unconfigured read-only serverless filesystem can serve curated articles but cannot provide persistent CMS/subscriber writes. No production database/env was changed, seeded, or inspected for secret values.

`docs/implementation/REQUIREMENTS_MATRIX.md` and implementation ADRs required by repository guidance were absent. Existing reference documents and implementation status were inspected; this patch covers the public website/blog only, not verification of the full manufacturing product.

## Next gate

Draft PR: https://github.com/slaks37/antigravitynewsyst/pull/1. Git integration automatically created Preview `dpl_J5FhcRY5MiUNQ7S3WZ51vnYprevh`, **READY** for runtime commit `b998d7114b6f96f53d741198c34e49981de28934`. Authenticated CLI HTTP checks passed for `/`, `/blog`, one article, category, tag, `/sitemap.xml`, `/robots.txt` and `/rss.xml`; XML parsed, sitemap contains 54 URLs, and tested HTML pages have one H1 and self-canonical. Preview: https://antigravitynewsyst-4xiyhnij5-slaks37s-projects.vercel.app. This establishes hosted public blog rendering, not persistent CMS/subscriber writes.

Review and approve production release per AGENTS.md. Persistent CMS/subscriber writes still need a separately validated PostgreSQL configuration; no production environment/database changes are included. After an approved production release, repeat the HTTP crawl against `https://newsystem.space`, confirm `/blog` is healthy, and submit the sitemap / inspect URLs in the owner's Google Search Console. Crawlability checks do not establish Google indexing or rankings.

References: https://fulcrumpro.com/, https://katanamrp.com/, https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls, https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics.
