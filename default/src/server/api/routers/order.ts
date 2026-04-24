import { createTRPCRouter, protectedProcedure } from "../trpc";
import { OrderService } from "~/server/services/order.service";
import * as OrderSchemas from "~/server/schemas/order.schema";

import { db } from "~/server/db";

const orderService = new OrderService(db);

export const orderRouter = createTRPCRouter({
    createOrder: protectedProcedure
        .input(OrderSchemas.createOrderSchema)
        .mutation(async ({ input }) => {
            return orderService.createOrder(input);
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
        .mutation(async ({ input }) => {
            return orderService.cancelOrder(input);
        }),
});