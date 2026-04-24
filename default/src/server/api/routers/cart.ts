import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CartService } from "~/server/services/cart.service";
import * as CartSchemas from "~/server/schemas/cart.schema";

import { db } from "~/server/db";

const cartService = new CartService(db);

export const cartRouter = createTRPCRouter({
    getCartByUserId: protectedProcedure
        .input(CartSchemas.getCartByUserIdSchema)
        .query(async ({ input }) => {
            return cartService.getCartByUserId(input);
        }),

    updateCartItem: protectedProcedure
        .input(CartSchemas.updateCartItemSchema)
        .mutation(async ({ input }) => {
            return cartService.updateCartItem(input);
        }),
    
    addToCart: protectedProcedure
        .input(CartSchemas.addToCartSchema)
        .mutation(async ({ input }) => {
            return cartService.addToCart(input);
        }),
    
    removeCartItem: protectedProcedure
        .input(CartSchemas.removeCartItemSchema)
        .mutation(async ({ input }) => {
            return cartService.removeCartItem(input);
        }),

    getCartTotal: protectedProcedure
        .input(CartSchemas.getCartByUserIdSchema)
        .query(async ({ input }) => {
            return cartService.getCartTotal(input.userId);
        }),
});