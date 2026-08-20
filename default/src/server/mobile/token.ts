import { createHash, randomBytes } from "node:crypto";
import { db } from "~/server/db";

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Issue a raw bearer token for a user, storing only its SHA-256 hash in DB.
 * Returns the raw token (shown once to the mobile client) + expiry.
 */
export async function createMobileToken(userId: string) {
  const raw = randomBytes(32).toString("hex");
  const tokenHash = sha256(raw);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await db.mobileToken.upsert({
    where: { tokenHash },
    update: {},
    create: { tokenHash, userId, expiresAt },
  });

  return { token: raw, expiresAt };
}

/** Resolve a raw bearer token to a user id, or null if invalid/expired. */
export async function getMobileUserId(rawToken: string): Promise<string | null> {
  if (!rawToken) return null;
  const tokenHash = sha256(rawToken);
  const row = await db.mobileToken.findUnique({ where: { tokenHash } });
  if (!row) return null;
  if (row.expiresAt < new Date()) {
    await db.mobileToken.delete({ where: { id: row.id } });
    return null;
  }
  return row.userId;
}

/** Parse `Authorization: Bearer <token>` header value -> raw token or null. */
export function parseBearer(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const m = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  return m ? m[1]! : null;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}