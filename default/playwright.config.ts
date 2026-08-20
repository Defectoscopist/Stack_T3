import { defineConfig } from "@playwright/test";

/**
 * Playwright E2E configuration.
 *
 * Uses the classic config API (compatible across Playwright versions).
 * The app is served locally with `npm run dev` (webServer auto-manages it).
 * Tests live in `/e2e` and are DB-agnostic smoke tests by default.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
