import type z from "zod";
import type * as OrderSchemas from "../schemas/order.schema";

import { db } from "~/server/db";
import type { Prisma } from "generated/prisma";

export class OrderService {
    constructor(private prisma: typeof db) {}

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
                orderItems: true,
            },
            take: limit,
            skip: offset,
        });
    }

    async getOrderById(input: z.infer<typeof OrderSchemas.getOrderByIdSchema>) {
        return this.prisma.order.findUnique({
            where: { id: input.id },
            include: {
                orderItems: true,
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
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
        });
    }
}

