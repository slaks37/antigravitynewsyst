/** Read-only HTTP crawl: no browser/JS rendering, no writes to application data. */
import assert from "node:assert/strict";

const base = process.env.SEO_BASE_URL || "http://127.0.0.1:3000";
const canonicalOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";
const fetchPage = async (path) => {
  const response = await fetch(new URL(path, base), { headers: { "User-Agent": "NewSystem-SEO-Check/1.0" } });
  return { status: response.status, html: await response.text() };
};
const sitemap = await fetchPage("/sitemap.xml");
assert.equal(sitemap.status, 200);
const urls = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.ok(urls.length > 20);
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URLs");
const checked = [];
for (const url of urls) {
  const path = new URL(url).pathname;
  const { status, html } = await fetchPage(path);
  assert.equal(status, 200, `${path} must return 200`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path} needs one H1 in initial HTML`);
  const canonical = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)].map(m => m[1]);
  assert.equal(canonical.length, 1, `${path} needs exactly one canonical`);
  assert.equal(new URL(canonical[0]).pathname.replace(/\/$/, ""), path.replace(/\/$/, ""), `${path} canonical must point to itself`);
  assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), `${path} unexpectedly noindex`);
  assert.ok(/<meta[^>]*name="description"[^>]*content="[^"]+"/.test(html), `${path} missing description`);
  if (/^\/blog\/[^/]+$/.test(path)) {
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
    assert.ok(schemas.some(s => s["@type"] === "BlogPosting"), `${path} needs BlogPosting`);
  }
  checked.push(path);
}
const robots = await fetchPage("/robots.txt");
assert.equal(robots.status, 200);
assert.ok(robots.html.includes("Allow: /"));
assert.ok(robots.html.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
const rss = await fetchPage("/rss.xml");
assert.equal(rss.status, 200);
assert.ok(rss.html.includes("<rss"));
const search = await fetchPage("/blog?q=zz-no-matching-article-zz");
assert.equal(search.status, 200);
assert.ok(/name="robots"[^>]*content="noindex, follow"/.test(search.html));
assert.ok(search.html.includes("Tidak ada artikel"));
const paginated = await fetchPage("/blog?page=2");
assert.ok(paginated.html.includes('rel="canonical" href="https://newsystem.space/blog?page=2"'));
console.log(JSON.stringify({ result: "PASS", checkedPages: checked.length, blogArticles: checked.filter(p => /^\/blog\/[^/]+$/.test(p)).length, checks: ["HTTP 200", "single H1 in raw HTML", "one self canonical", "indexable robots", "descriptions", "BlogPosting JSON-LD", "sitemap unique", "RSS", "search noindex", "pagination canonical"], pages: checked }, null, 2));
