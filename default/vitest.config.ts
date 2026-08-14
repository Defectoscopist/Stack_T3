import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      // Mirrors the `~/*` path alias from tsconfig.json
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // Only run unit tests; Playwright specs live in /e2e and are run separately.
    include: ["src/**/*.test.{ts,tsx}"],
    globals: false,
    // Minimal env so modules that import `~/server/db` (which validates env
    // via `src/env.js`) can load without a real database connection.
    env: {
      DATABASE_URL: "mysql://root:password@localhost:3306/fdvdsdfvd_test",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "**/generated/**"],
    },
  },
});