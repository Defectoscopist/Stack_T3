import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { createMobileToken } from "~/server/mobile/token";

const bodySchema = z.object({
  // Demo/auth simplification: the mobile client asks for a token for a userId.
  // In production this endpoint is reached AFTER OAuth/device login and the
  // user is derived from the verified session, never trusted from the body.
  userId: z.string().min(1),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 },
    );
  }

  const user = await db.user.findUnique({ where: { id: parsed.data.userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { token, expiresAt } = await createMobileToken(user.id);
  return NextResponse.json({ token, expiresAt });
}