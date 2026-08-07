import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { WishlistService } from "~/server/services/wishlist.service";
import * as WishlistSchemas from "~/server/schemas/wishlist.schema";

import { db } from "~/server/db";

const wishlistService = new WishlistService(db);

export const wishlistRouter = createTRPCRouter({
  addToWishlist: protectedProcedure
    .input(WishlistSchemas.addToWishlistSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await wishlistService.addToWishlist(ctx.session.user.id, input);
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (e as Error).message,
        });
      }
    }),

  removeFromWishlist: protectedProcedure
    .input(WishlistSchemas.removeFromWishlistSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await wishlistService.removeFromWishlist(ctx.session.user.id, input);
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (e as Error).message,
        });
      }
    }),

  getWishlist: protectedProcedure
    .input(WishlistSchemas.getWishlistSchema)
    .query(async ({ input, ctx }) => {
      return wishlistService.getWishlist(ctx.session.user.id, input);
    }),

  isInWishlist: protectedProcedure
    .input(WishlistSchemas.addToWishlistSchema)
    .query(async ({ input, ctx }) => {
      return wishlistService.isInWishlist(ctx.session.user.id, input.productId);
    }),
});