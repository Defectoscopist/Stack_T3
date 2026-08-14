import type z from "zod";
import type * as ReviewSchemas from "../schemas/review.schema";

import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";
import type { db } from "~/server/db";

export class ReviewService {
  constructor(private prisma: typeof db) {}

  async createReview(
    userId: string,
    input: z.infer<typeof ReviewSchemas.createReviewSchema>,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: input.productId },
      select: { id: true },
    });
    if (!product) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product with ID ${input.productId} not found`,
      });
    }

    try {
      return await this.prisma.review.create({
        data: {
          userId,
          productId: input.productId,
          rating: input.rating,
          title: input.title ?? null,
          comment: input.comment ?? null,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already reviewed this product",
        });
      }
      throw error;
    }
  }

  async updateReview(
    userId: string,
    input: z.infer<typeof ReviewSchemas.updateReviewSchema>,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id: input.reviewId },
    });
    if (!review || review?.userId !== userId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Review not found or not owned by you",
      });
    }

    return this.prisma.review.update({
      where: { id: input.reviewId },
      data: {
        ...(input.rating !== undefined && { rating: input.rating }),
        ...(input.title !== undefined && { title: input.title ?? null }),
        ...(input.comment !== undefined && { comment: input.comment ?? null }),
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });
  }

  async deleteReview(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review || review?.userId !== userId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Review not found or not owned by you",
      });
    }

    return this.prisma.review.delete({ where: { id: reviewId } });
  }

  async getReviewsByProduct(
    input: z.infer<typeof ReviewSchemas.getReviewsByProductSchema>,
  ) {
    const { productId, limit, offset } = input;
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const aggregate = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    return {
      reviews,
      summary: {
        averageRating: Number(aggregate._avg.rating ?? 0),
        totalReviews: aggregate._count,
      },
    };
  }

  async getRecentReviews(limit = 8) {
    return this.prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}