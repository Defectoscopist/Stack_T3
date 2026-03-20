import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import path from "path";

const buildProductQuery = (input: any, extraWhere: any = {}) => {
  const { categoryId, brandId, minPrice, maxPrice, deleted, isActive, orderBy, orderDirection } = input;
  
  const where: any = {
    isActive,
    deletedAt: deleted,
    ...extraWhere
  };

  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;

  return {
    where: {
      ...where,
      variant: {
        some: {
          price: { gte: minPrice, lte: maxPrice }
        }
      }
    },
    include: {
      images: true,
      variant: {
        where: {
          price: { gte: minPrice, lte: maxPrice }
        }
      }
    },
    orderBy: { [orderBy]: orderDirection }
  };
};

export const productRouter = createTRPCRouter({
    getAll: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                description: "Get all products with pagination, filtering and sorting",
                path: "/products",
                tags: ["Products"],
            }
        })
        .
        input(
            z.object({
                categoryId: z.string().optional(),
                brandId: z.string().optional(),
                page: z.number().min(1).optional().default(1),
                limit: z.number().min(1).max(100).optional().default(20),
                minPrice: z.number().min(0).optional().default(0),
                maxPrice: z.number().min(0).optional().default(Number.MAX_VALUE),
                deleted: z.boolean().optional().nullable().default(null),
                isActive: z.boolean().optional().default(true),
                orderBy: z.enum(["createdAt", "name"]).optional().default("createdAt"),
                orderDirection: z.enum(["asc", "desc"]).optional().default("desc"),
            })
        )
        .query(async ({ input, ctx }) => {
            const { page, limit } = input;
            const query = buildProductQuery(input);
            
            return ctx.db.product.findMany({
                ...query,
                skip: (page - 1) * limit,
                take: limit
            });
        }),

    getbySlug: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                description: "Get product by slug",
                path: "/products/slug/{slug}",
                tags: ["Products"],
            }
        })
        .input(
            z.object({
                slug: z.string().min(3).max(255)
            })
        )
        .query(async ({ input, ctx }) => {
            const { slug } = input;
            const product = await ctx.db.product.findUnique({
                where: {
                    slug: slug,
                    isActive: true,
                    deletedAt: null
                },
                include: {
                    images: true,
                    variant: true
                }
            })

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "getbySlug: Product not found"
                });
            }
            return product;
        }),

    getFeatured: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                description: "Get featured products",
                path: "/products/featured",
                tags: ["Products"],
            }
        })
        .input(
            z.object({
                categoryId: z.string().optional(),
                brandId: z.string().optional(),
                limit: z.number().min(1).max(100).optional().default(20),
                minPrice: z.number().min(0).optional().default(0),
                maxPrice: z.number().min(0).optional().default(Number.MAX_VALUE),
                deleted: z.boolean().optional().nullable().default(null),
                isActive: z.boolean().optional().default(true),
                orderBy: z.enum(["createdAt", "name"]).optional().default("createdAt"),
                orderDirection: z.enum(["asc", "desc"]).optional().default("desc"),
            })
        )
        .query(async ({ input, ctx }) => {
            const { limit } = input;
            const query = buildProductQuery(input, { isFeatured: true });
            
            return ctx.db.product.findMany({
                ...query,
                take: limit
            });
        }),


    create: protectedProcedure
        .use(({ctx, next}) => {
            if (ctx.session.user.role !== "ADMIN") throw new TRPCError({ code: "FORBIDDEN" });
            return next();
        })
        .meta({
            openapi: {
                method: "POST",
                description: "Create a new product",
                path: "/products",
                tags: ["Products"],
            }
        })
        .input(
            z.object({
                name: z.string().min(3, "Name must be at least 3 characters long").max(255, "Name must be at most 255 characters long"),
                description: z.string().min(3, "Description must be at least 3 characters long").max(5000, "Description must be at most 5000 characters long"),
                slug: z.string().min(3, "Slug must be at least 3 characters long").max(255, "Slug must be at most 255 characters long"),
                categoryId: z.string().uuid("Category ID must be a valid UUID"),
                brandId: z.string().uuid("Brand ID must be a valid UUID"),
                images: z.array(z.string().url("Image URL must be a valid URL")).min(1, "At least one image is required").max(10, "Maximum 10 images allowed")
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { name, description, slug, categoryId, brandId, images } = input;
            const product = await ctx.db.product.create({
                data: {name, description, slug, categoryId, brandId}
            });

            if (!product) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "create: Failed to create product"
                });
            }

            await Promise.all(
                images.map((url,position) =>
                    ctx.db.productImage.create({
                        data: {
                            url,
                            productId: product.id,
                            position
                        }
                    })
                )
            );
            return product;
        }),

    getById: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                description: "Get product by ID",
                path: "/products/{id}",
                tags: ["Products"],
            }
        })
        .input(
            z.object({
                id: z.string().uuid()
            })
        )
        .use(({ctx, next}) => {
            if (ctx.session.user.role !== "ADMIN") throw new TRPCError({ code: "FORBIDDEN" });
            return next();
        })
        .query(async ({ input, ctx }) => {
            const { id } = input;
            const product = await ctx.db.product.findUnique({
                where: {
                    id: id,
                    isActive: true,
                    deletedAt: null
                },
                include: {
                    images: true,
                    variant: true
                }
            });

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "getById: Product not found"
                });
            }
            return product;
        }),
});