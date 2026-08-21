import { NextResponse } from "next/server";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { getMobileUserId, parseBearer } from "~/server/mobile/token";
import { OrderService } from "~/server/services/order.service";

const orderService = new OrderService(db);

export async function DELETE(
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
    const order = await orderService.cancelOrder(id, userId);
    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof TRPCError) {
      const status = error.code === "NOT_FOUND" ? 404 : error.code === "BAD_REQUEST" ? 400 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json({ error: "Order cancellation failed" }, { status: 500 });
  }
}
