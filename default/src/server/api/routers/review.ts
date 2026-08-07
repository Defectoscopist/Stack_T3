import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { ReviewService } from "~/server/services/review.service";
import * as ReviewSchemas from "~/server/schemas/review.schema";

import { db } from "~/server/db";

const reviewService = new ReviewService(db);

export const reviewRouter = createTRPCRouter({
  createReview: protectedProcedure
    .input(ReviewSchemas.createReviewSchema)
    .mutation(async ({ input, ctx }) => {
      return reviewService.createReview(ctx.session.user.id, input);
    }),

  updateReview: protectedProcedure
    .input(ReviewSchemas.updateReviewSchema)
    .mutation(async ({ input, ctx }) => {
      return reviewService.updateReview(ctx.session.user.id, input);
    }),

  deleteReview: protectedProcedure
    .input(ReviewSchemas.deleteReviewSchema)
    .mutation(async ({ input, ctx }) => {
      return reviewService.deleteReview(ctx.session.user.id, input.reviewId);
    }),

  getReviewsByProduct: publicProcedure
    .input(ReviewSchemas.getReviewsByProductSchema)
    .query(async ({ input }) => {
      return reviewService.getReviewsByProduct(input);
    }),
});