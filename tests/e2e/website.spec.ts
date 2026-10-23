import { test, expect } from "@playwright/test";

test.describe("NewSystem Corporate Website E2E Journeys", () => {
  test("Homepage loads properly with brand tagline and verified maturity badges", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/NewSystem — Your Entire Business. Working as One./);

    // Headline check
    const heroHeading = page.locator("h1");
    await expect(heroHeading).toContainText("Seluruh perusahaan.");
    await expect(page.locator("body")).toContainText("One System. Every Process. Smarter Business.");

    // Truthful maturity disclaimer banner
    await expect(page.locator("body")).toContainText("SIMULASI");

    // Primary CTA button presence
    const discussBtn = page.getByRole("link", { name: /Diskusikan perusahaan Anda/i }).first();
    await expect(discussBtn).toBeVisible();
  });

  test("Platform architecture page renders multi-plant & security models", async ({ page }) => {
    await page.goto("/platform");
    await expect(page.locator("h1")).toContainText("Satu Arsitektur Terpadu. Tanpa Kompromi Fragmentasi.");
    await expect(page.locator("body")).toContainText("Multi-Company & Multi-Plant");
  });

  test("Modules and Solutions index pages load all industry categories", async ({ page }) => {
    await page.goto("/modules");
    await expect(page.locator("h1")).toContainText("Modul Terintegrasi untuk Seluruh Operasi Pabrik");
    await expect(page.locator("body")).toContainText("Enterprise Resource Planning");

    await page.goto("/solutions");
    await expect(page.locator("h1")).toContainText("Solusi Industri yang Menjawab Logika Nyata Pabrik");
    await expect(page.locator("body")).toContainText("Food & Beverage (F&B)");
  });

  test("Blog page lists published articles with category navigation", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("h1")).toContainText("Wawasan Teknis & Panduan Operasional Pabrik");

    // Check that at least one article card is rendered
    const articles = page.locator("article");
    await expect(articles.first()).toBeVisible();
  });

  test("Design Partner Program registration page renders form and requirements", async ({ page }) => {
    await page.goto("/design-partner");
    await expect(page.locator("h1")).toContainText("Bantu Bentuk Masa Depan Sistem Operasi Manufaktur");

    // Ensure lead form is interactive
    const nameInput = page.locator('input[placeholder*="Hendra Pratama"]').first();
    await expect(nameInput).toBeVisible();
  });

  test("Admin CMS login page renders role options", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("h1")).toContainText("Portal CMS & Editorial");

    // Check role test buttons
    await expect(page.getByText("Superadmin", { exact: true })).toBeVisible();
    await expect(page.getByText("Editor", { exact: true })).toBeVisible();
  });
});
