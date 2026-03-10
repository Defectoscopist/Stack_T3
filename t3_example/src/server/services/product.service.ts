import { db } from "../db";

export const productService = {
    async getAll() {
        return db.product.findMany({
            where: {
                isActive: true,
                deletedAt: null
            },
            include: {
                images: true,
                variant: true,
                brand: true
            }
        })
    },

    async getAllPagination(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [products, total] = await db.$transaction ([
            db.product.findMany({
                where: {
                    isActive: true,
                    deletedAt: null
                },
                include: {
                    images: true,
                    variant: true,
                    brand: true
                },
                skip,
                take: limit
            }),

            db.product.count ({
                where: {
                    isActive: true,
                    deletedAt: null
                }
            })
        ]);

        return {
            products,
            total,
            page,
            pages: Math.ceil(total/limit)
        }
    },

    async getBySlug(slug: string) {
        return db.product.findUnique({
            where: {slug},
            include: {
                images: true,
                variant: true,
                brand: true,
                category: true
            }
        })
    },

    async getById(productId: string) {
        return db.product.findUnique({
            where: {id: productId},
            include: {
                images: true,
                variant: true,
                brand: true,
                category: true
            }
        })
    },

    //product by slug
    //product by id
}