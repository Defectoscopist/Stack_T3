import { createTRPCRouter, protectedProcedure } from "../trpc";
import { OrderService } from "~/server/services/order.service";
import { AddressService } from "~/server/services/address.service";
import * as OrderSchemas from "~/server/schemas/order.schema";

import { db } from "~/server/db";

const orderService = new OrderService(db);
const addressService = new AddressService(db);

export const orderRouter = createTRPCRouter({
    createOrder: protectedProcedure
        .input(OrderSchemas.createOrderSchema)
        .mutation(async ({ input }) => {
            return orderService.createOrder(input);
        }),

    checkout: protectedProcedure
        .input(OrderSchemas.checkoutSchema)
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.session.user.id;
            // 1. Create address
            const address = await addressService.createAddress({
                firstName: input.firstName,
                lastName: input.lastName,
                street: input.street,
                city: input.city,
                state: input.state,
                postalCode: input.postalCode,
                country: input.country,
                phone: input.phone,
                userId,
            });
            // 2. Create order with the address
            return orderService.createOrder({
                userId,
                addressId: address.id,
                items: input.items,
            });
        }),

    getOrdersByUserId: protectedProcedure
        .input(OrderSchemas.getOrdersByUserIdSchema)
        .query(async ({ input }) => {
            return orderService.getOrdersByUserId(input);
        }),

    getOrderById: protectedProcedure
        .input(OrderSchemas.getOrderByIdSchema)
        .query(async ({ input }) => {
            return orderService.getOrderById(input);
        }),

    updateOrderStatus: protectedProcedure
        .input(OrderSchemas.updateOrderStatusSchema)
        .mutation(async ({ input }) => {
            return orderService.updateOrderStatus(input);
        }),

    cancelOrder: protectedProcedure
        .input(OrderSchemas.cancelOrderSchema)
        .mutation(async ({ input, ctx }) => {
            // Only allow cancelling if the order belongs to the user
            const order = await orderService.getOrderById({ id: input.orderId });
            if (!order || order?.userId !== ctx.session.user.id) {
                throw new Error("Order not found or not owned by you");
            }
            if (order.status !== "PENDING" && order.status !== "DELIVERING") {
                throw new Error("Cannot cancel order in current status");
            }
            return orderService.cancelOrder(input);
        }),
});
