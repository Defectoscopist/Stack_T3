import { db } from "../db";

export const productService = {
    async getAllProducts() {
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

    async getProductBySlug(slug: string) {
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

    async getProductById(productId: string) {
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