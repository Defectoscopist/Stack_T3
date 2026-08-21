import { NextResponse } from "next/server";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { getMobileUserId, parseBearer } from "~/server/mobile/token";
import { OrderService } from "~/server/services/order.service";

const orderService = new OrderService(db);

function getErrorStatus(error: TRPCError) {
  switch (error.code) {
    case "NOT_FOUND":
      return 404;
    case "BAD_REQUEST":
      return 400;
    default:
      return 500;
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = parseBearer(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await getMobileUserId(token);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const order = await orderService.confirmOrder(id, userId);
    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof TRPCError) {
      return NextResponse.json(
        { error: error.message },
        { status: getErrorStatus(error) },
      );
    }
    return NextResponse.json({ error: "Payment confirmation failed" }, { status: 500 });
  }
}
