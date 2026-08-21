#!/usr/bin/env node
/**
 * dev-all — запускает backend (Next.js, порт 3000) и mobile web preview
 * (Expo/Metro, порт 8081) одновременно одной командой:
 *
 *   npm run dev:all
 *
 * Ctrl+C останавливает оба процесса. Логи помечены префиксами [backend] и [mobile].
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mobileDir = join(root, "mobile");

const processes = [];

function run(label, cwd, command, args) {
  const child = spawn(command, args, {
    cwd,
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const prefix = `[${label}]`;
  const pipe = (stream, out) => {
    stream.on("data", (chunk) => {
      for (const line of chunk.toString().split(/\r?\n/)) {
        if (line.trim()) out(`${prefix} ${line}`);
      }
    });
  };
  pipe(child.stdout, (line) => console.log(line));
  pipe(child.stderr, (line) => console.error(line));

  child.on("exit", (code) => {
    console.log(`${prefix} exited with code ${code}`);
  });

  processes.push(child);
  return child;
}

function stopAll() {
  for (const child of processes) {
    if (child && !child.killed) {
      try {
        child.kill();
      } catch {
        /* ignore */
      }
    }
  }
}

console.log("🚀 Starting backend (3000) + mobile web (8081)...");
console.log("   Press Ctrl+C to stop both.\n");

run("backend", root, "npm", ["run", "dev"]);
run("mobile", mobileDir, "npm", ["run", "web"]);

process.on("SIGINT", () => {
  console.log("\n🛑 Stopping...");
  stopAll();
  setTimeout(() => process.exit(0), 500);
});
process.on("SIGTERM", () => stopAll());
