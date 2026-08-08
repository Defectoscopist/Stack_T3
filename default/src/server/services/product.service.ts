import type { z } from "zod";
import type * as ProductSchemas from "../schemas/product.schema";

import { db } from "~/server/db";
import type { Prisma, ProductType, Sex } from "generated/prisma";

type ProductWithRelations = {
  id: string;
  name: string;
  description: string;
  slug: string;
  isFeatured: boolean;
  isActive: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  salePrice: Prisma.Decimal | null;
  originalPrice: Prisma.Decimal | null;
  discountPercent: number | null;
  tags: string | null;
  productType: string;
  categoryId: string;
  brandId: string;
  sex: string;
  category: { id: string; name: string; slug: string; description: string };
  productImages: { url: string }[];
  variants: {
    id: string;
    price: Prisma.Decimal;
    stock: number;
    color: string | null;
    size: string;
    variantImages?: { url: string }[] | null;
  }[];
  _count?: { reviews: number };
  reviews?: { rating: number }[];
};

export class ProductService {
  constructor(private prisma: typeof db) {}

  /** Shared include for popular product queries */
  private productInclude = {
    brand: true,
    category: true,
    productImages: true,
    variants: {
      include: { variantImages: true },
    },
    _count: { select: { reviews: true } },
  } as const;

  /** Map of productId -> total quantity sold (from order items) */
  private productSoldByProductId = new Map<string, number>();

  /** Preload sold quantities for a set of product ids */
  private async loadSoldQuantities(productIds: string[]) {
    if (productIds.length === 0) return;
    const orderItems = await this.prisma.orderItem.groupBy({
      by: ["productVariantId"],
      _sum: { quantity: true },
      where: {
        productVariant: { productId: { in: productIds } },
        order: { status: { notIn: ["CANCELLED", "RETURNED"] } },
      },
    });
    const variantProductIds = new Map<string, string>();
    if (orderItems.length > 0) {
      const variantIds = orderItems.map((o) => o.productVariantId);
      const variants = await this.prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        select: { id: true, productId: true },
      });
      for (const v of variants) variantProductIds.set(v.id, v.productId);
    }
    this.productSoldByProductId.clear();
    for (const item of orderItems) {
      const productId = variantProductIds.get(item.productVariantId);
      if (!productId) continue;
      const current = this.productSoldByProductId.get(productId) ?? 0;
      this.productSoldByProductId.set(
        productId,
        current + (item._sum.quantity ?? 0),
      );
    }
  }

  /** Transform a Prisma product to the output schema shape */
  private mapProduct(product: ProductWithRelations) {
    const totalSold = this.productSoldByProductId.get(product.id) ?? 0;
    const reviews = product.reviews ?? [];
    const averageRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      slug: product.slug,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      isBestSeller: product.isBestSeller,
      isOnSale: product.isOnSale,
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      discountPercent: product.discountPercent ?? 0,
      tags: product.tags ?? "",
      productType: product.productType,
      categoryId: product.categoryId,
      brandId: product.brandId,
      sex: product.sex,
      totalSold,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: product._count?.reviews ?? reviews.length,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
      },
      imagesUrl: product.productImages.map((img) => img.url),
      variants: product.variants.map((variant) => ({
        id: variant.id,
        price: Number(variant.price),
        stock: variant.stock,
        color: variant.color,
        size: variant.size,
        imagesUrl: variant.variantImages?.map((img) => img.url) ?? [],
      })),
    };
  }

  async getProductById(
    input: z.infer<typeof ProductSchemas.getProductsByIdSchema>,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: input.id },
      include: {
        ...this.productInclude,
        reviews: { select: { rating: true } },
      },
    });

    if (!product) return null;
    await this.loadSoldQuantities([product.id]);

    return this.mapProduct(product);
  }

  async getProductBySlug(
    input: z.infer<typeof ProductSchemas.getProductsBySlugSchema>,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { slug: input.slug },
      include: {
        ...this.productInclude,
        reviews: { select: { rating: true } },
      },
    });

    if (!product) return null;
    await this.loadSoldQuantities([product.id]);

    return this.mapProduct(product);
  }

  async getProducts(input: z.infer<typeof ProductSchemas.getProductsSchema>) {
    const {
      limit,
      offset,
      isActive,
      isFeatured,
      isBestSeller,
      isOnSale,
      brandId,
      categoryId,
      productType,
      minPrice,
      maxPrice,
      search,
      images,
      variants,
    } = input;

    const where: Prisma.ProductWhereInput = {
      isActive,
      ...(isFeatured !== undefined && { isFeatured }),
      ...(isBestSeller !== undefined && { isBestSeller }),
      ...(isOnSale !== undefined && { isOnSale }),
      ...(brandId && { brandId }),
      ...(categoryId && { categoryId }),
      ...(productType && { productType: productType as ProductType }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            variants: {
              some: {
                ...(minPrice !== undefined && { price: { gte: minPrice } }),
                ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
              },
            },
          }
        : {}),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { category: { name: { contains: search } } },
          { variants: { some: { color: { contains: search } } } },
        ],
      }),
    };

    const products = await this.prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        productImages: images,
        variants: variants
          ? {
              include: { variantImages: true },
            }
          : false,
        brand: true,
        category: true,
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    });

    await this.loadSoldQuantities(products.map((p) => p.id));

    return products.map((product) => this.mapProduct(product));
  }

  async getAllProducts(
    input: z.infer<typeof ProductSchemas.getAllProductsSchema>,
  ) {
    const { limit, offset, sex } = input;

    const where: Prisma.ProductWhereInput = {};
    if (sex) {
      where.sex = sex.toUpperCase() as Sex;
    }

    const products = await this.prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        brand: true,
        category: true,
        productImages: true,
        variants: {
          include: { variantImages: true },
        },
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    });

    await this.loadSoldQuantities(products.map((p) => p.id));

    return products.map((product) => this.mapProduct(product));
  }

  async getProductVariantById(
    input: z.infer<typeof ProductSchemas.getProductVariantByIdSchema>,
  ) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: input.id },
      include: {
        variantImages: true,
        product: { include: { brand: true, category: true } },
      },
    });

    if (!variant) return null;

    return {
      id: variant.id,
      price: Number(variant.price),
      stock: variant.stock,
      color: variant.color,
      size: variant.size,
      imagesUrl: variant.variantImages.map((img) => img.url),
    };
  }

  async getProductVariantsByProduct(
    input: z.infer<typeof ProductSchemas.getProductVariantsByProductSchema>,
  ) {
    const { color, size, variantImages, inStock, productId } = input;

    const where: Prisma.ProductVariantWhereInput = {
      productId,
      ...(color && { color }),
      ...(size && { size }),
      ...(inStock && { stock: { gt: 0 } }),
      ...(variantImages !== undefined && {
        variantImages: variantImages ? { some: {} } : { none: {} },
      }),
    };

    const variants = await this.prisma.productVariant.findMany({
      where,
      include: {
        variantImages: true,
        product: { include: { brand: true, category: true } },
      },
    });

    return variants.map((variant) => ({
      id: variant.id,
      price: Number(variant.price),
      stock: variant.stock,
      color: variant.color,
      size: variant.size,
      imagesUrl: variant.variantImages.map((img) => img.url),
    }));
  }
}