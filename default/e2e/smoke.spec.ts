import { test, expect } from "@playwright/test";

// Smoke-тесты: проверяют критичные пользовательские пути. Эти тесты не зависят
// от данных в БД — они опираются только на статичный layout/заголовки.

test.describe("Главная страница", () => {
  test("рендерит шапку (логотип) и подвал", async ({ page }) => {
    await page.goto("/");

    // Логотип в шапке — ссылка на главную
    await expect(page.getByRole("link", { name: "SHOP", exact: true }).first()).toBeVisible();

    // Подвал с копирайтом
    await expect(page.getByText(/All rights reserved\./i)).toBeVisible();
  });

  test("CTA «Shop Now» ведёт в магазин", async ({ page }) => {
    await page.goto("/");

    const cta = page.getByRole("link", { name: "Shop Now" });
    await expect(cta).toBeVisible();
    await cta.click();

    await expect(page).toHaveURL(/\/shop$/);
    await expect(
      page.getByRole("heading", { name: /Discover curated collections/i }),
    ).toBeVisible();
  });
});

test.describe("Категории в шапке", () => {
  test("переход по категории открывает страницу категории", async ({ page }) => {
    await page.goto("/");

    const navLink = page.getByRole("link", { name: "men" }).first();
    await expect(navLink).toBeVisible();
    await navLink.click();

    await expect(page).toHaveURL(/\/category\/men$/);
  });
});
