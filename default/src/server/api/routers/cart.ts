import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { CartService } from "~/server/services/cart.service";
import * as CartSchemas from "~/server/schemas/cart.schema";

import { db } from "~/server/db";

const cartService = new CartService(db);

export const cartRouter = createTRPCRouter({
    getCartByUserId: protectedProcedure
        .input(CartSchemas.getCartByUserIdSchema)
        .query(async ({ ctx }) => {
            // Always scope to the session user's cart
            return cartService.getCartByUserId({ userId: ctx.session.user.id });
        }),

    updateCartItem: protectedProcedure
        .input(CartSchemas.updateCartItemSchema)
        .mutation(async ({ input, ctx }) => {
            await assertOwnsCartItem(ctx.session.user.id, input.cartItemId);
            return cartService.updateCartItem(input);
        }),

    addToCart: protectedProcedure
        .input(CartSchemas.addToCartSchema)
        .mutation(async ({ input, ctx }) => {
            return cartService.addToCart({
                ...input,
                userId: ctx.session.user.id,
            });
        }),

    removeCartItem: protectedProcedure
        .input(CartSchemas.removeCartItemSchema)
        .mutation(async ({ input, ctx }) => {
            await assertOwnsCartItem(ctx.session.user.id, input.cartItemId);
            return cartService.removeCartItem(input);
        }),

    getCartTotal: protectedProcedure
        .query(async ({ ctx }) => {
            return cartService.getCartTotal(ctx.session.user.id);
        }),
});

/** Ensure a cart item belongs to the given user, else throw FORBIDDEN. */
async function assertOwnsCartItem(userId: string, cartItemId: string) {
    const item = await cartService.findCartItemOwnership(cartItemId);
    if (item?.cart.userId !== userId) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cart item not found or not owned by you",
        });
    }
}
