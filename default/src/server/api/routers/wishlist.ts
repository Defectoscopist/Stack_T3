import { createTRPCRouter, protectedProcedure } from "../trpc";
import { WishlistService } from "~/server/services/wishlist.service";
import * as WishlistSchemas from "~/server/schemas/wishlist.schema";

import { db } from "~/server/db";

const wishlistService = new WishlistService(db);

export const wishlistRouter = createTRPCRouter({
  addToWishlist: protectedProcedure
    .input(WishlistSchemas.addToWishlistSchema)
    .mutation(async ({ input, ctx }) => {
      return wishlistService.addToWishlist(ctx.session.user.id, input);
    }),

  removeFromWishlist: protectedProcedure
    .input(WishlistSchemas.removeFromWishlistSchema)
    .mutation(async ({ input, ctx }) => {
      return wishlistService.removeFromWishlist(ctx.session.user.id, input);
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