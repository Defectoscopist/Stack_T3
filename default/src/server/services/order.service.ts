import type z from "zod";
import type * as OrderSchemas from "../schemas/order.schema";

import { db } from "~/server/db";
import type { Prisma } from "generated/prisma";

export class OrderService {
    constructor(private prisma: typeof db) {}

    /**
     * Automatically simulate order status progression.
     * Starts a background process: PENDING -> DELIVERING (after 30s) -> COMPLETED (after 2min)
     */
    private async simulateStatusProgression(orderId: string) {
        // After 30 seconds, change to DELIVERING
        setTimeout(() => {
            void this.prisma.order.update({
                where: { id: orderId },
                data: { status: "DELIVERING" },
            }).catch(() => {
                // Order might have been cancelled
            });
        }, 30_000);

        // After 2 minutes, change to COMPLETED
        setTimeout(() => {
            void (async () => {
                try {
                    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
                    if (order && order.status !== "CANCELLED" && order.status !== "RETURNING" && order.status !== "RETURNED") {
                        await this.prisma.order.update({
                            where: { id: orderId },
                            data: { status: "COMPLETED" },
                        });
                    }
                } catch {
                    // Order might have been cancelled
                }
            })();
        }, 120_000);
    }

    async createOrder(input: z.infer<typeof OrderSchemas.createOrderSchema>) {
        const { userId, addressId, items } = input;

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
            throw new Error(`Product variant(s) not found: ${missing.join(", ")}`);
        }

        const variantById = new Map(variants.map((variant) => [variant.id, variant]));

        const orderItems = mergedItems.map((item) => {
            const variant = variantById.get(item.productVariantId)!;
            if (item.quantity > variant.stock) {
                throw new Error(`Insufficient stock for variant ${variant.id}. Available: ${variant.stock}, requested: ${item.quantity}`);
            }

            return {
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                price: variant.price,
            };
        });

        const total = orderItems.reduce((sum, item) => {
            return sum + item.price.toNumber() * item.quantity;
        }, 0);

        return await this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    total,
                    orderItems: {
                        create: orderItems,
                    },
                },
                include: {
                    orderItems: true,
                },
            });

            await Promise.all(
                orderItems.map((item) =>
                    tx.productVariant.update({
                        where: { id: item.productVariantId },
                        data: {
                            stock: { decrement: item.quantity },
                        },
                    }),
                ),
            );

            // Start status progression simulation
            // Don't await — let it run in background
            void this.simulateStatusProgression(order.id).catch(() => undefined);

            return order;
        });
    }

    async getOrdersByUserId(input: z.infer<typeof OrderSchemas.getOrdersByUserIdSchema>) {
        const { userId, status, limit, offset } = input;
        const where: Prisma.OrderWhereInput = {
            userId,
            ...(status && { status }),
        };
        return this.prisma.order.findMany({
            where,
            include: {
                orderItems: {
                    include: {
                        productVariant: {
                            include: {
                                product: {
                                    include: {
                                        productImages: true,
                                    },
                                },
                            },
                        },
                    },
                },
                address: true,
            },
            take: limit,
            skip: offset,
        });
    }

    async getOrderById(input: z.infer<typeof OrderSchemas.getOrderByIdSchema>) {
        return this.prisma.order.findUnique({
            where: { id: input.id },
            include: {
                orderItems: {
                    include: {
                        productVariant: {
                            include: {
                                product: {
                                    include: {
                                        productImages: true,
                                    },
                                },
                            },
                        },
                    },
                },
                address: true,
            },
        });
    }

    async updateOrderStatus(input: z.infer<typeof OrderSchemas.updateOrderStatusSchema>) {
        const { orderId, status } = input;
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }

    async cancelOrder(input: z.infer<typeof OrderSchemas.cancelOrderSchema>) {
        const { orderId } = input;
        return this.prisma.$transaction(async (tx) => {
            // Get order items to restore stock
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { orderItems: true },
            });
            if (!order) throw new Error("Order not found");

            // Cancel the order
            const updated = await tx.order.update({
                where: { id: orderId },
                data: { status: "CANCELLED" },
            });

            // Restore stock for each item
            await Promise.all(
                order.orderItems.map((item) =>
                    tx.productVariant.update({
                        where: { id: item.productVariantId },
                        data: {
                            stock: { increment: item.quantity },
                        },
                    }),
                ),
            );

            return updated;
        });
    }
}

