import type z from "zod";
import type * as WishlistSchemas from "../schemas/wishlist.schema";

import { TRPCError } from "@trpc/server";
import type { db } from "~/server/db";
import type { Prisma } from "generated/prisma";

type WishlistItemWithProduct = {
  id: string;
  productId: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    isOnSale: boolean;
    salePrice: Prisma.Decimal | null;
    productImages: { url: string }[];
    variants: { price: Prisma.Decimal }[];
  };
};

export class WishlistService {
  constructor(private prisma: typeof db) {}

  private mapItem(item: WishlistItemWithProduct) {
    const lowestPrice =
      item.product.variants.length > 0
        ? Number(item.product.variants[0]!.price)
        : 0;
    const salePrice = item.product.salePrice
      ? Number(item.product.salePrice)
      : null;

    return {
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: lowestPrice,
        imageUrl: item.product.productImages[0]?.url ?? "",
        isOnSale: item.product.isOnSale,
        salePrice,
      },
    };
  }

  async addToWishlist(
    userId: string,
    input: z.infer<typeof WishlistSchemas.addToWishlistSchema>,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: input.productId },
    });
    if (!product) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product with ID ${input.productId} not found`,
      });
    }

    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId: input.productId },
      },
    });
    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Product is already in your wishlist",
      });
    }

    const item = await this.prisma.wishlistItem.create({
      data: {
        userId,
        productId: input.productId,
      },
      include: { product: this.productInclude },
    });

    return this.mapItem(item);
  }

  async removeFromWishlist(
    userId: string,
    input: z.infer<typeof WishlistSchemas.removeFromWishlistSchema>,
  ) {
    await this.prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId: input.productId,
        },
      },
    });
    return { success: true };
  }

  async getWishlist(
    userId: string,
    input: z.infer<typeof WishlistSchemas.getWishlistSchema>,
  ) {
    const { limit, offset } = input;
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: this.productInclude },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.wishlistItem.count({ where: { userId } });

    return { items: items.map((item) => this.mapItem(item)), total };
  }

  async isInWishlist(userId: string, productId: string) {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
    return !!item;
  }

  private productInclude = {
    include: {
      productImages: { take: 1, orderBy: { createdAt: "asc" } },
      variants: { orderBy: { price: "asc" }, take: 1 },
    },
  } as const;
}
