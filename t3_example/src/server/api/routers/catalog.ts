import {createTRPCRouter} from "~/server/api/trpc";
import { publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {Prisma} from "~/../generated/prisma";

const takeDefault = 24;
const skipDefault = 0;

export const catalogRouter = createTRPCRouter({
    listCategories: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }),
    listProducts: publicProcedure
        .input(
                z.object({
                categorySlug: z.string().min(1).optional(),
                brandSlug: z.string().min(1).optional(),
                search: z.string().min(1).max(80).optional(),
                take: z.number().int().min(1).max(60).default(takeDefault),
                skip: z.number().int().min(0).default(skipDefault),
            }).optional()
        )
        .query(async ({ ctx, input }) => {

            const where: Prisma.ProductWhereInput = {
                isActive: true,
                deletedAt: null,
            };

            if (input?.categorySlug) {
                where.category = {
                    slug: input.categorySlug,
                };
            }
            if (input?.brandSlug) {
                where.brand = {
                    slug: input.brandSlug,
                };
            }
            if (input?.search) {
                where.OR = [
                    {name: {contains: input.search}},
                    {description: {contains: input.search}},
                ];
            }
            return ctx.db.product.findMany({
                where,
                orderBy: [
                    {isFeatured: "desc"},
                    {createdAt: "desc"},
                ],
                take: input?.take ?? takeDefault,
                skip: input?.skip ?? skipDefault,
                include: {
                    brand: true,
                    category: true,
                    images: {
                        orderBy: {
                            position: "asc",
                        },
                    },
                    variant: {
                        orderBy: {
                            price: "asc",
                        },
                    },
                },
            });
        }),
    getProductBySlug: publicProcedure
    .input(z.object({
        slug: z.string().min(1),
    }))
    .query(async ({ ctx, input }) => {
        return ctx.db.product.findFirst({
            where: {
                slug: input.slug,
                isActive: true,
                deletedAt: null,
            },
            include: {
                brand: true,
                category: true,
                images: {
                    orderBy: {
                        position: "asc",
                    },
                },
                variant: {
                    orderBy: {
                        price: "asc",
                    },
                },
            },
        });
    }),
});

