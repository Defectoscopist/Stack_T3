import z from "zod";

// ===== Review Schemas =====

export const createReviewSchema = z.object({
  productId: z.string().min(1).describe("Product ID must be a non-empty string"),
  rating: z.number().int().min(1).max(5).describe("Rating must be an integer between 1 and 5"),
  title: z.string().max(100).optional().describe("Review title, max 100 characters"),
  comment: z.string().max(2000).optional().describe("Review comment, max 2000 characters"),
});

export const updateReviewSchema = z.object({
  reviewId: z.string().min(1).describe("Review ID must be a non-empty string"),
  rating: z.number().int().min(1).max(5).optional().describe("Rating must be an integer between 1 and 5"),
  title: z.string().max(100).optional().describe("Review title, max 100 characters"),
  comment: z.string().max(2000).optional().describe("Review comment, max 2000 characters"),
});

export const deleteReviewSchema = z.object({
  reviewId: z.string().min(1).describe("Review ID must be a non-empty string"),
});

export const getReviewsByProductSchema = z.object({
  productId: z.string().min(1).describe("Product ID must be a non-empty string"),
  limit: z.number().int().min(1).max(100).default(20).describe("Limit must be between 1 and 100"),
  offset: z.number().int().min(0).default(0).describe("Offset must be a non-negative integer"),
});

export const reviewOutputSchema = z.object({
  id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().nullable(),
  comment: z.string().nullable(),
  createdAt: z.date(),
  user: z.object({
    id: z.string().min(1),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
});

export const productReviewsSummarySchema = z.object({
  averageRating: z.number().min(0).max(5),
  totalReviews: z.number().int().min(0),
});