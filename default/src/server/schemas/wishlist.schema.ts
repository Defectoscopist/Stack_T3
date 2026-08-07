import z from "zod";

// ===== Wishlist Schemas =====

export const addToWishlistSchema = z.object({
  productId: z.string().min(1).describe("Product ID must be a non-empty string"),
});

export const removeFromWishlistSchema = z.object({
  productId: z.string().min(1).describe("Product ID must be a non-empty string"),
});

export const getWishlistSchema = z.object({
  limit: z.number().int().min(1).max(100).default(50).describe("Limit must be between 1 and 100"),
  offset: z.number().int().min(0).default(0).describe("Offset must be a non-negative integer"),
});

export const wishlistItemOutputSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  createdAt: z.date(),
  product: z.object({
    id: z.string().min(1),
    name: z.string(),
    slug: z.string(),
    price: z.number().min(0),
    imageUrl: z.string(),
    isOnSale: z.boolean(),
    salePrice: z.number().nullable(),
  }),
});