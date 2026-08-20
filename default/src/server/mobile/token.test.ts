import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHash } from "node:crypto";

// Mock db before importing the module under test.
const findUnique = vi.fn();
const deleteFn = vi.fn();
const upsert = vi.fn();

vi.mock("~/server/db", () => ({
  db: {
    mobileToken: {
      findUnique: (...args: unknown[]) => findUnique(...args),
      delete: (...args: unknown[]) => deleteFn(...args),
      upsert: (...args: unknown[]) => upsert(...args),
    },
  },
}));

import {
  createMobileToken,
  getMobileUserId,
  parseBearer,
} from "./token";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

describe("parseBearer", () => {
  it("returns null for missing / empty header", () => {
    expect(parseBearer(null)).toBeNull();
    expect(parseBearer("")).toBeNull();
    expect(parseBearer("   ")).toBeNull();
  });

  it("parses Bearer tokens case-insensitively", () => {
    expect(parseBearer("Bearer abc123")).toBe("abc123");
    expect(parseBearer("bearer xyz")).toBe("xyz");
    expect(parseBearer("BEARER  tok  ")).toBe("tok");
  });

  it("rejects non-Bearer schemes", () => {
    expect(parseBearer("Basic abc")).toBeNull();
    expect(parseBearer("Token abc")).toBeNull();
    expect(parseBearer("abc")).toBeNull();
  });
});

describe("createMobileToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    upsert.mockResolvedValue({});
  });

  it("stores only the SHA-256 hash and returns a raw token + expiry", async () => {
    const { token, expiresAt } = await createMobileToken("user-1");

    expect(token).toMatch(/^[a-f0-9]{64}$/);
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());

    expect(upsert).toHaveBeenCalledOnce();
    const arg = upsert.mock.calls[0]![0] as {
      where: { tokenHash: string };
      create: { tokenHash: string; userId: string; expiresAt: Date };
    };
    expect(arg.create.userId).toBe("user-1");
    expect(arg.create.tokenHash).toBe(sha256(token));
    expect(arg.where.tokenHash).toBe(sha256(token));
  });
});

describe("getMobileUserId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null for empty token", async () => {
    expect(await getMobileUserId("")).toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("returns null when token is unknown", async () => {
    findUnique.mockResolvedValue(null);
    expect(await getMobileUserId("deadbeef")).toBeNull();
  });

  it("returns userId for a valid non-expired token", async () => {
    findUnique.mockResolvedValue({
      id: "mt-1",
      userId: "user-42",
      expiresAt: new Date(Date.now() + 60_000),
    });
    expect(await getMobileUserId("raw-token")).toBe("user-42");
    expect(deleteFn).not.toHaveBeenCalled();
  });

  it("deletes and rejects an expired token", async () => {
    findUnique.mockResolvedValue({
      id: "mt-exp",
      userId: "user-x",
      expiresAt: new Date(Date.now() - 1_000),
    });
    deleteFn.mockResolvedValue({});
    expect(await getMobileUserId("old-token")).toBeNull();
    expect(deleteFn).toHaveBeenCalledWith({ where: { id: "mt-exp" } });
  });
});
