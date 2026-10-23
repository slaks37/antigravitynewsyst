import { test, expect } from "@playwright/test";

// Local lab smoke only: no network/CPU throttling, no field Core Web Vitals claim.
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`initial render metrics and runtime errors at ${viewport.width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      const metrics = { lcpMs: 0, cls: 0 };
      Object.defineProperty(window, "__labMetrics", { value: metrics });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) metrics.lcpMs = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) metrics.cls += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("h1").waitFor();
    const metrics = await page.evaluate(() => ({
      ...(window as Window & { __labMetrics?: { lcpMs: number; cls: number } })
        .__labMetrics,
      scriptTransferBytes: performance
        .getEntriesByType("resource")
        .filter(
          (e) => (e as PerformanceResourceTiming).initiatorType === "script",
        )
        .reduce(
          (sum, e) => sum + (e as PerformanceResourceTiming).transferSize,
          0,
        ),
      navigationMs: (
        performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming
      ).domContentLoadedEventEnd,
    }));
    await testInfo.attach("local-lab-metrics.json", {
      body: JSON.stringify(
        {
          viewport,
          environment: "localhost production build; unthrottled; single sample",
          metrics,
          errors,
        },
        null,
        2,
      ),
      contentType: "application/json",
    });
    console.log(`LAB ${viewport.width}px ${JSON.stringify(metrics)}`);
    expect(errors).toEqual([]);
    expect(metrics.cls).toBeLessThanOrEqual(0.1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("desktop reduced motion has no GSAP transform dependency", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#scene-execution").scrollIntoViewIfNeeded();
  await expect(page.locator("#scene-execution h2")).toBeVisible();
  expect(
    await page
      .locator(".enterprise-canvas-column .enterprise-map")
      .getAttribute("style"),
  ).toBeNull();
  await expect(
    page.locator(".enterprise-canvas-column [data-canvas-phase]"),
  ).toHaveAttribute("data-canvas-phase", "execution");
});
