import { test, expect } from "@playwright/test";

test.describe("NewSystem Corporate Website E2E Journeys", () => {
  test("Homepage loads properly with brand tagline and verified maturity badges", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/NewSystem — One System\. Every Process\. Smarter Business\./);

    // Headline check
    const heroHeading = page.locator("h1");
    await expect(heroHeading).toContainText("One System. Every Process. Smarter Business.");

    // Truthful maturity disclaimer banner
    await expect(page.locator("body")).toContainText("Catatan Transparansi Kesiapan Sistem");

    // Primary CTA button presence
    const discussBtn = page.getByRole("link", { name: /Diskusikan Pabrik Anda/i }).first();
    await expect(discussBtn).toBeVisible();
  });

  test("Platform architecture page renders multi-plant & security models", async ({ page }) => {
    await page.goto("/platform");
    await expect(page.locator("h1")).toContainText("Arsitektur Platform & Fondasi Teknis");
    await expect(page.locator("body")).toContainText("Multi-Company & Multi-Plant Hierarchy");
  });

  test("Modules and Solutions index pages load all industry categories", async ({ page }) => {
    await page.goto("/modules");
    await expect(page.locator("h1")).toContainText("Modul Operasional & Manajemen Pabrik");
    await expect(page.locator("body")).toContainText("Enterprise Resource Planning (ERP)");

    await page.goto("/solutions");
    await expect(page.locator("h1")).toContainText("Solusi Spesifik Industri Manufaktur");
    await expect(page.locator("body")).toContainText("Food & Beverage Manufacturing");
  });

  test("Blog page lists published articles with category navigation", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("h1")).toContainText("Wawasan & Analisis Manufaktur");

    // Check that at least one article card is rendered
    const articles = page.locator("article");
    await expect(articles.first()).toBeVisible();
  });

  test("Design Partner Program registration page renders form and requirements", async ({ page }) => {
    await page.goto("/design-partner");
    await expect(page.locator("h1")).toContainText("Program Mitra Desain Pabrik");

    // Ensure lead form is interactive
    const nameInput = page.locator('input[placeholder*="Budi Santoso"]').first();
    await expect(nameInput).toBeVisible();
  });

  test("Admin CMS login page renders 1-click test credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("h1")).toContainText("Masuk ke CMS NewSystem");

    // Check role test buttons
    await expect(page.getByRole("button", { name: /Superadmin/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Editor/i })).toBeVisible();
  });
});
