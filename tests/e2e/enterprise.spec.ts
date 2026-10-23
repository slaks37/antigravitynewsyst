import { test, expect } from "@playwright/test";

test("story syncs to scroll and ripple can be reset without real writes", async ({
  page,
}) => {
  const writes: string[] = [];
  page.on("request", (req) => {
    if (req.method() === "POST") writes.push(req.url());
  });
  await page.goto("/");
  await page.locator("#scene-ripple").scrollIntoViewIfNeeded();
  await expect(
    page.locator(".enterprise-canvas-column [data-canvas-phase]"),
  ).toHaveAttribute("data-canvas-phase", "ripple");
  const reset = page.getByRole("button", {
    name: "Reset simulasi keterlambatan",
  });
  await expect(reset).toHaveAttribute("aria-pressed", "true");
  await reset.click();
  const start = page.getByRole("button", {
    name: "Simulasikan kiriman terlambat",
  });
  await expect(start).toHaveAttribute("aria-pressed", "false");
  await start.click();
  await expect(page.locator(".ripple-source")).toContainText("tertunda 2 hari");
  await expect(page.locator(".ripple-impacts li")).toHaveCount(6);
  expect(writes).toEqual([]);
});

test("module tabs support keyboard and expose all families", async ({
  page,
}) => {
  await page.goto("/");
  const first = page.getByRole("tab", { name: /Run Your Business/ });
  await first.focus();
  await first.press("End");
  await expect(
    page.getByRole("tab", { name: /Understand Your Business/ }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Prototipe");
  await expect(
    page.getByRole("tabpanel").getByRole("link", { name: /Copilot/ }),
  ).toHaveAttribute("href", "/copilot");
  await page
    .getByRole("tab", { name: /Understand Your Business/ })
    .press("Home");
  await expect(first).toHaveAttribute("aria-selected", "true");
});

test("services has four proposed phases and preserves the lead form", async ({
  page,
}) => {
  await page.goto("/services");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".service-phases details")).toHaveCount(4);
  await expect(page.locator("body")).toContainText(
    "belum dinyatakan sebagai layanan komersial",
  );
  await expect(page.getByLabel("Nama Lengkap", { exact: false })).toBeVisible();
});

test("mobile and reduced motion keep content readable without sticky canvas", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Seluruh perusahaan");
  await expect(page.locator(".enterprise-canvas-column")).toBeHidden();
  await expect(page.locator(".mobile-scene-dashboard").first()).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: /Buka menu/i }).click();
  await expect(
    page
      .getByRole("navigation", { name: /Navigasi seluler/i })
      .getByRole("link", { name: "Services", exact: true }),
  ).toBeVisible();
});

test("no JavaScript retains narrative, all module links and services", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("#scene-ripple h2")).toContainText(
    "Satu perubahan",
  );
  await expect(
    page.locator("noscript").getByRole("link", { name: /Maintenance/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Jelajahi pendekatan layanan" }),
  ).toBeVisible();
  await context.close();
});
