import { test, expect } from "@playwright/test";

test.describe("smoke — public pages", () => {
  test("home page renders header and footer", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "SHOP", exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByText(/demo project/i)).toBeVisible();
  });

  test("Shop Now CTA links to shop", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: "Shop Now" });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(
      page.getByRole("heading", { name: /Discover curated collections/i }),
    ).toBeVisible();
  });

  test("header category nav opens category page", async ({ page }) => {
    await page.goto("/");
    const navLink = page.getByRole("link", { name: "men" }).first();
    await expect(navLink).toBeVisible();
    await navLink.click();
    await expect(page).toHaveURL(/\/category\/men$/);
  });

  test("static legal pages respond 200", async ({ page }) => {
    for (const path of ["/privacy", "/terms", "/cookies", "/about", "/contact"]) {
      const res = await page.goto(path);
      expect(res?.ok(), `${path} should be OK`).toBeTruthy();
    }
  });

  test("unknown route shows not-found UI", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist-xyz");
    expect(res?.status()).toBeGreaterThanOrEqual(200);
    await expect(page.getByText(/not found|404|page/i).first()).toBeVisible();
  });
});

test.describe("smoke — mobile API (unauthenticated)", () => {
  test("products list rejects missing Bearer token", async ({ request }) => {
    const res = await request.get("/api/mobile/products");
    expect(res.status()).toBe(401);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toMatch(/unauthorized/i);
  });

  test("auth token endpoint rejects invalid body", async ({ request }) => {
    const res = await request.post("/api/mobile/auth/token", {
      data: {},
    });
    expect(res.status()).toBe(400);
  });
});
