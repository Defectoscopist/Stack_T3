import { NextResponse } from "next/server";
import { TRPCError } from "@trpc/server";
import type { z } from "zod";
import { db } from "~/server/db";
import { getMobileUserId, parseBearer } from "~/server/mobile/token";
import { AddressService } from "~/server/services/address.service";
import { OrderService } from "~/server/services/order.service";
import * as OrderSchemas from "~/server/schemas/order.schema";

const orderService = new OrderService(db);
const addressService = new AddressService(db);

function getErrorStatus(error: TRPCError) {
  switch (error.code) {
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "BAD_REQUEST":
      return 400;
    default:
      return 500;
  }
}

async function getAuthenticatedUserId(req: Request) {
  const token = parseBearer(req.headers.get("authorization"));
  if (!token) return null;
  return getMobileUserId(token);
}

export async function GET(req: Request) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 10);
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const requestedStatus = url.searchParams.get("status") ?? undefined;
  const status = requestedStatus
    ? OrderSchemas.orderStatusSchema.safeParse(requestedStatus)
    : null;

  if (status && !status.success) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  }

  const input = {
    userId,
    limit: Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 10,
    offset: Number.isInteger(offset) && offset >= 0 ? offset : 0,
    ...(status?.success ? { status: status.data } : {}),
  } satisfies z.infer<typeof OrderSchemas.getOrdersByUserIdSchema>;

  const orders = await orderService.getOrdersByUserId(input);
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = OrderSchemas.checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid checkout data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const address = await addressService.createAddress({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      street: parsed.data.street,
      city: parsed.data.city,
      state: parsed.data.state,
      postalCode: parsed.data.postalCode,
      country: parsed.data.country,
      phone: parsed.data.phone,
      userId,
    });
    const checkout = await orderService.checkout(parsed.data, userId, address.id);
    return NextResponse.json(checkout, { status: 201 });
  } catch (error) {
    if (error instanceof TRPCError) {
      return NextResponse.json(
        { error: error.message },
        { status: getErrorStatus(error) },
      );
    }
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
