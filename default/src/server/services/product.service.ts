import type { z } from "zod";
import type * as ProductSchemas from "../schemas/product.schema";

import { db } from "~/server/db";
import type { Prisma, ProductType } from "generated/prisma";

export class ProductService {
  constructor(private prisma: typeof db) {}

  async getProductById(
    input: z.infer<typeof ProductSchemas.getProductsByIdSchema>,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: input.id },
      include: {
        brand: true,
        category: true,
        productImages: true,
        variants: {
          include: { variantImages: true },
        },
      },
    });

    if (!product) return null;

    // Transform the data to match the output schema - only return expected fields
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
      discountPercent: product.discountPercent,
      tags: product.tags,
      productType: product.productType,
      categoryId: product.categoryId,
      brandId: product.brandId,
      sex: product.sex,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
      },
      imagesUrl: product.productImages.map(img => img.url),
      variants: product.variants.map(variant => ({
        id: variant.id,
        price: Number(variant.price),
        stock: variant.stock,
        color: variant.color,
        size: variant.size,
        imagesUrl: variant.variantImages.map(img => img.url),
      })),
    };
  }

  async getProductBySlug(
    input: z.infer<typeof ProductSchemas.getProductsBySlugSchema>,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { slug: input.slug },
      include: {
        brand: true,
        category: true,
        productImages: true,
        variants: {
          include: { variantImages: true },
        },
      },
    });

    if (!product) return null;

    // Transform the data to match the output schema - only return expected fields
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
      discountPercent: product.discountPercent,
      tags: product.tags,
      productType: product.productType,
      categoryId: product.categoryId,
      brandId: product.brandId,
      sex: product.sex,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
      },
      imagesUrl: product.productImages.map(img => img.url),
      variants: product.variants.map(variant => ({
        id: variant.id,
        price: Number(variant.price),
        stock: variant.stock,
        color: variant.color,
        size: variant.size,
        imagesUrl: variant.variantImages.map(img => img.url),
      })),
    };
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
      ...(minPrice !== undefined || maxPrice !== undefined ? {
        variants: {
          some: {
            ...(minPrice !== undefined && { price: { gte: minPrice } }),
            ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
          },
        },
      } : {}),
      ...(search && {
        OR: [
          { name: { contains: search.toLowerCase() } },
          { description: { contains: search.toLowerCase() } },
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
      },
    });

    // Transform the data to match the output schema
    return products.map(product => ({
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
      discountPercent: product.discountPercent,
      tags: product.tags,
      productType: product.productType,
      categoryId: product.categoryId,
      brandId: product.brandId,
      sex: product.sex,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
      },
      imagesUrl: product.productImages?.map(img => img.url) || [],
      variants: product.variants?.map(variant => ({
        id: variant.id,
        price: Number(variant.price),
        stock: variant.stock,
        color: variant.color,
        size: variant.size,
        imagesUrl: (variant as any).variantImages?.map((img: any) => img.url) ?? [],
      })) ?? [],
    }));
  }

  async getAllProducts(
    input: z.infer<typeof ProductSchemas.getAllProductsSchema>,
  ) {
    const { limit, offset } = input;

    const products = await this.prisma.product.findMany({
      take: limit,
      skip: offset,
      include: {
        brand: true,
        category: true,
        productImages: true,
        variants: {
          include: { variantImages: true },
        },
      },
    });

    // Transform the data to match the output schema
    return products.map(product => ({
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
      discountPercent: product.discountPercent,
      tags: product.tags,
      productType: product.productType,
      categoryId: product.categoryId,
      brandId: product.brandId,
      sex: product.sex,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
      },
      imagesUrl: product.productImages.map(img => img.url),
      variants: product.variants.map(variant => ({
        id: variant.id,
        price: Number(variant.price),
        stock: variant.stock,
        color: variant.color,
        size: variant.size,
        imagesUrl: variant.variantImages.map(img => img.url),
      })),
    }));
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

    // Transform to match schema
    return {
      id: variant.id,
      price: Number(variant.price),
      stock: variant.stock,
      color: variant.color,
      size: variant.size,
      imagesUrl: variant.variantImages.map(img => img.url),
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
        product: { include: {brand: true, category: true }},
      },
    });

    // Transform to match schema
    return variants.map(variant => ({
      id: variant.id,
      price: Number(variant.price),
      stock: variant.stock,
      color: variant.color,
      size: variant.size,
      imagesUrl: variant.variantImages.map(img => img.url),
    }));
  }
}
