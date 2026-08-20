import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import { OrderService } from "~/server/services/order.service";

const orderService = new OrderService(db);

/**
 * Stripe webhook endpoint.
 *
 * In production, register this URL ({APP_URL}/api/webhooks/stripe) in the
 * Stripe Dashboard and set STRIPE_WEBHOOK_SECRET. When Stripe keys are absent
 * (local demos), checkout runs in "simulated" mode and this endpoint is a no-op
 * (the client calls confirmCheckout directly instead).
 */
export async function POST(req: Request) {
  // Simulated/local mode: nothing to process via Stripe.
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, simulated: true });
  }

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    if (intent.id) {
      // Idempotent: no-ops if the order is already PAID.
      await orderService.finalizePaidOrder(intent.id).catch((err) => {
        console.error("finalizePaidOrder failed", err);
      });
    }
  }

  return NextResponse.json({ received: true });
}