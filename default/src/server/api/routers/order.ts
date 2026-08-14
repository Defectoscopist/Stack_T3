import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { OrderService } from "~/server/services/order.service";
import { AddressService } from "~/server/services/address.service";
import * as OrderSchemas from "~/server/schemas/order.schema";

import { db } from "~/server/db";

const orderService = new OrderService(db);
const addressService = new AddressService(db);

export const orderRouter = createTRPCRouter({
    createOrder: protectedProcedure
        .input(OrderSchemas.createOrderSchema)
        .mutation(async ({ input, ctx }) => {
            return orderService.createOrder({ ...input, userId: ctx.session.user.id });
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
        .query(async ({ input, ctx }) => {
            // Ignore the client-provided userId and always scope to the session
            // user so users can only see their own orders.
            return orderService.getOrdersByUserId({
                ...input,
                userId: ctx.session.user.id,
            });
        }),

    getOrderById: protectedProcedure
        .input(OrderSchemas.getOrderByIdSchema)
        .query(async ({ input, ctx }) => {
            const order = await orderService.getOrderById(
                input,
                ctx.session.user.id,
            );
            if (!order) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Order not found or not owned by you",
                });
            }
            return order;
        }),

    cancelOrder: protectedProcedure
        .input(OrderSchemas.cancelOrderSchema)
        .mutation(async ({ input, ctx }) => {
            return orderService.cancelOrder(input, ctx.session.user.id);
        }),
});
