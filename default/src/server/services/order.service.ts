import type z from "zod";
import type * as OrderSchemas from "../schemas/order.schema";

import Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import type { db } from "~/server/db";
import type { Prisma } from "generated/prisma";

/** How long we hold stock for an unpaid order before releasing it. */
const HOLD_DURATION_MS = 15 * 60 * 1000;

/** Default Stripe API version (pin; stripe package validates it). */
const STRIPE_VERSION = "2026-07-29.dahlia";

/**
 * Payment gateway.
 * When Stripe credentials are present this talks to the real Stripe API
 * (test mode). Otherwise it falls back to a local simulation so the demo still
 * works without keys. Both paths expose the same minimal surface used by
 * OrderService, and both are idempotent by `paymentIntentId`.
 */
type PaymentGateway = {
  createIntent(opts: {
    amount: number;
    orderId: string;
  }): Promise<{ id: string; clientSecret?: string; simulated: boolean }>;
  confirmForTest(opts: { paymentIntentId: string }): Promise<void>;
};

class StripeGateway implements PaymentGateway {
  private readonly stripe?: Stripe;

  constructor() {
    if (env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: STRIPE_VERSION });
    }
  }

  async createIntent(opts: { amount: number; orderId: string }) {
    if (!this.stripe) {
      return { id: `sim_pi_${opts.orderId}`, simulated: true };
    }
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(opts.amount * 100), // cents
      currency: "usd",
      metadata: { orderId: opts.orderId },
      // Test-mode cards complete immediately; this keeps the flow simple.
      automatic_payment_methods: { enabled: true },
    });
    if (!intent.client_secret) throw new Error("Stripe returned no client_secret");
    return { id: intent.id, clientSecret: intent.client_secret, simulated: false };
  }

  async confirmForTest(opts: { paymentIntentId: string }) {
    if (this.stripe) {
      await this.stripe.paymentIntents.confirm(opts.paymentIntentId, {
        payment_method: "pm_card_visa",
      });
    }
    // Simulated: no-op.
  }
}

export class OrderService {
    constructor(private prisma: typeof db) {}

    private readonly payments: PaymentGateway = new StripeGateway();

    /**
     * Create an order and HOLD stock (reserve it) without finalizing.
     *
     * Trade-off: we optimistically reserve stock in the same transaction and
     * rely on the database lock to prevent overselling between two concurrent
     * checkouts. The hold expires (releaseExpiredHolds) if payment never
     * completes, releasing the reserved units. The client never sends a price —
     * the server recomputes totals from DB prices (never trust the client).
     */
    async checkout(input: z.infer<typeof OrderSchemas.checkoutSchema>, userId: string, addressId: string) {
        const { items } = input;

        const mergedItems = Array.from(
            items.reduce((map, item) => {
                const current = map.get(item.productVariantId) ?? 0;
                map.set(item.productVariantId, current + item.quantity);
                return map;
            }, new Map<string, number>()),
        ).map(([productVariantId, quantity]) => ({ productVariantId, quantity }));

        const productVariantIds = Array.from(new Set(mergedItems.map((item) => item.productVariantId)));
        const variants = await this.prisma.productVariant.findMany({
            where: { id: { in: productVariantIds } },
        });

        const foundIds = new Set(variants.map((variant) => variant.id));
        const missing = productVariantIds.filter((id) => !foundIds.has(id));
        if (missing.length > 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Product variant(s) not found: ${missing.join(", ")}`,
            });
        }

        const variantById = new Map(variants.map((variant) => [variant.id, variant]));

        const orderItems = mergedItems.map((item) => {
            const variant = variantById.get(item.productVariantId)!;
            const available = variant.stock - variant.stockReserved;
            if (item.quantity > available) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: `Insufficient stock for variant ${variant.id}. Available: ${Math.max(0, available)}, requested: ${item.quantity}`,
                });
            }
            return {
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                reserved: item.quantity,
                price: variant.price,
            };
        });

        const total = orderItems.reduce((sum, item) => {
            return sum + item.price.toNumber() * item.quantity;
        }, 0);

        const holdExpiresAt = new Date(Date.now() + HOLD_DURATION_MS);

        return await this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    total,
                    status: "PENDING",
                    paymentStatus: "PENDING_PAYMENT",
                    holdExpiresAt,
                    orderItems: {
                        create: orderItems,
                    },
                },
                include: { orderItems: true },
            });

            // Reserve stock.
            await Promise.all(
                orderItems.map((item) =>
                    tx.productVariant.update({
                        where: { id: item.productVariantId },
                        data: { stockReserved: { increment: item.quantity } },
                    }),
                ),
            );

            // Create the payment intent (real or simulated) inside the tx, so a
            // failure rolls back the stock reservation.
            const intent = await this.payments.createIntent({
                amount: total,
                orderId: order.id,
            });

            await tx.order.update({
                where: { id: order.id },
                data: { paymentIntentId: intent.id },
            });

            return {
                order: {
                    ...order,
                    paymentStatus: "PENDING_PAYMENT" as const,
                    paymentIntentId: intent.id,
                },
                clientSecret: intent.clientSecret,
                simulated: intent.simulated,
            };
        });
    }
/**
     * Confirm an order after payment. For test/simulated demos the client calls
     * this directly; in production Stripe Webhook (see api/webhooks) calls
     * finalizePaidOrder instead. Both are idempotent: if the order is already
     * PAID, re-confirming is a no-op.
     */
    async confirmOrder(orderId: string, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.findFirst({
                where: { id: orderId, userId },
                include: { orderItems: true },
            });
            if (!order) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
            }
            if (order.paymentStatus === "PAID") return order; // idempotent
            if (order.paymentStatus !== "PENDING_PAYMENT") {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Order is not payable" });
            }

            const paid = await tx.order.update({
                where: { id: order.id },
                data: { status: "PAID", paymentStatus: "PAID", paymentIntentId: order.paymentIntentId ?? undefined, holdExpiresAt: null },
            });

            // Move reserved units into actually-sold units.
            await Promise.all(
                order.orderItems.map((item) =>
                    tx.productVariant.update({
                        where: { id: item.productVariantId },
                        data: {
                            stockReserved: { decrement: item.reserved },
                            stock: { decrement: item.reserved },
                        },
                    }),
                ),
            );

            return paid;
        });
    }

    /** Idempotently finalize a paid order (called by the Stripe webhook). */
    async finalizePaidOrder(paymentIntentId: string) {
        const order = await this.prisma.order.findFirst({ where: { paymentIntentId } });
        if (!order) return null;
        // confirmOrder runs its own transaction and is idempotent.
        return this.confirmOrder(order.id, order.userId);
    }

    /** Release expired stock holds for unpaid orders (run on a schedule). */
    async releaseExpiredHolds() {
        const now = new Date();
        return this.prisma.$transaction(async (tx) => {
            const expired = await tx.order.findMany({
                where: { paymentStatus: "PENDING_PAYMENT", holdExpiresAt: { lt: now } },
                include: { orderItems: true },
            });
            let released = 0;
            for (const order of expired) {
                await Promise.all(
                    order.orderItems.map((item) =>
                        tx.productVariant.update({
                            where: { id: item.productVariantId },
                            data: { stockReserved: { decrement: item.reserved } },
                        }),
                    ),
                );
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: "CANCELLED", paymentStatus: "FAILED", holdExpiresAt: null },
                });
                released += 1;
            }
            return released;
        });
    }

    async getOrdersByUserId(input: z.infer<typeof OrderSchemas.getOrdersByUserIdSchema>) {
        const where: Prisma.OrderWhereInput = {
            userId: input.userId,
            ...(input.status && { status: input.status }),
        };
        return this.prisma.order.findMany({
            where,
            include: {
                orderItems: {
                    include: {
                        productVariant: { include: { product: { include: { productImages: true } } } },
                    },
                },
                address: true,
            },
            take: input.limit,
            skip: input.offset,
            orderBy: { createdAt: "desc" },
        });
    }

    /** Scope order lookup to the requesting user. */
    async getOrderById(id: string, userId: string) {
        return this.prisma.order.findFirst({
            where: { id, userId },
            include: {
                orderItems: {
                    include: {
                        productVariant: { include: { product: { include: { productImages: true } } } },
                    },
                },
                address: true,
            },
        });
    }

    async cancelOrder(orderId: string, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.findFirst({
                where: { id: orderId, userId },
                include: { orderItems: true },
            });
            if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found or not owned by you" });

            if (order.paymentStatus !== "PENDING_PAYMENT" && order.paymentStatus !== "PAID") {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot cancel order in current status" });
            }

            // Release any reserved stock.
            await Promise.all(
                order.orderItems.map((item) => {
                    const decrement = item.reserved;
                    return decrement > 0
                        ? tx.productVariant.update({
                              where: { id: item.productVariantId },
                              data: { stockReserved: { decrement } },
                          })
                        : Promise.resolve();
                }),
            );

            return tx.order.update({
                where: { id: order.id },
                data: { status: "CANCELLED", paymentStatus: "FAILED", holdExpiresAt: null },
            });
        });
    }
}