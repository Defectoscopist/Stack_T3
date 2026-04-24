import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";


const productInclude = {
  images: true,
  variant: {
    include: {
      images: true,
    },
  },
};


const buildProductQuery = (input: any, extraWhere: any = {}) => {
  const {
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    deleted,
    isActive,
    orderBy,
    orderDirection,
  } = input;

  const where: any = {
    isActive,
    deletedAt: deleted,
    ...extraWhere,
  };

  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.variant = {
      some: {
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
    };
  }

  return {
    where,
    include: productInclude,
    orderBy: {
      [orderBy]: orderDirection,
    },
  };
};

export const productRouter = createTRPCRouter({

  getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        brandId: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        deleted: z.boolean().nullable().default(null),
        isActive: z.boolean().default(true),
        orderBy: z.enum(["createdAt", "name"]).default("createdAt"),
        orderDirection: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit } = input;

      const query = buildProductQuery(input);

      const products = await ctx.db.product.findMany({
        ...query,
        skip: (page - 1) * limit,
        take: limit,
      });

      return products;
    }),

  getFeatured: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        brandId: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        deleted: z.boolean().nullable().default(null),
        isActive: z.boolean().default(true),
        orderBy: z.enum(["createdAt", "name"]).default("createdAt"),
        orderDirection: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit } = input;

      const query = buildProductQuery(input, {
        isFeatured: true,
      });

      return ctx.db.product.findMany({
        ...query,
        take: limit,
      });
    }),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(3).max(255),
      })
    )
    .query(async ({ input, ctx }) => {
      const product = await ctx.db.product.findFirst({
        where: {
          slug: input.slug,
          isActive: true,
          deletedAt: null,
        },
        include: productInclude,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return product;
    }),

  create: protectedProcedure
    .use(({ ctx, next }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return next();
    })
    .input(
      z.object({
        name: z.string().min(3).max(255),
        description: z.string().min(3).max(5000),
        slug: z.string().min(3).max(255),
        categoryId: z.string().uuid(),
        brandId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.db.product.create({
        data: input,
      });

      return product;
    }),
});