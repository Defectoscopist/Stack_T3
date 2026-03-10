//import { Quando } from "next/font/google";
import { TRPCError } from "@trpc/server"
import { db } from "../db"
//import { success } from "zod/v4";

export const cartService = {
    async getCart(userId: string) {
        return db.cart.findUnique({
            where: {userId},
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        })
    },

    async addItem(userId: string, variantId: string, quantity: number) {

        const variant = await db.productVariant.findUnique({
            where: {id: variantId},
            select: {
                id: true,
                price: true,
                stock: true
            }
        })

        if (!variant) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Variant not found"
            })
        }

        if (variant.stock < quantity) {
            throw new TRPCError ({
                code: "BAD_REQUEST",
                message: "Not enough stock"
            })
        }

        let cart = await db.cart.findUnique({
            where: {userId},
            include: {items: true}
        });

        if (!cart) {
            cart = await db.cart.create({
                data: {userId},
                include: {items: true}
            })
        }

        const existingItem = cart.items.find((i) => i.variantId === variantId)

        if (existingItem) {

            const newQuantity = existingItem.quantity + quantity

            if (newQuantity > variant.stock) {
                throw new TRPCError ({
                    code: "BAD_REQUEST",
                    message: "Not enough stock"
                })
            }

            return db.cartItem.update ({
                where: {id: existingItem.id},
                data: {quantity: newQuantity}
            })
        }

        return db.cartItem.create({
            data: {
                cartId: cart.id,
                variantId,
                quantity,
                price: variant.price
            }
        });
    },

    async updateItem (userId: string, variantId: string, quantity: number) {
        
        const cart = await db.cart.findUnique ({
            where: {userId}
        })
        
        if (!cart) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Cart not found"
            })
        }

        const item = await db.cartItem.findFirst({
            where: {
                cartId: cart.id,
                variantId
            }
        })
        
        if (!item) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Item not found"
            })
        }

        if (quantity <= 0) {
            return db.cartItem.delete({
                where: {id: item.id}
            })
        }

        const variant = await db.productVariant.findUnique({
            where: {
                id: variantId
            },
            select: {
                stock: true
            }
        })

        if (!variant) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Variant not found"
            })
        }

        if (quantity > variant.stock) {
                throw new TRPCError ({
                    code: "BAD_REQUEST",
                    message: "Not enough stock"
                })
            }

        return db.cartItem.update({
            where: {id: item.id},
            data: {quantity}
        })

    },

    async removeItem (userId: string, variantId: string) {
        const cart = await db.cart.findUnique({
            where: {userId}
        })
        
        if (!cart) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Cart not found"
            })
        }

        return db.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                variantId
            }
        })
    },

    async clearCart (userId: string) {
        const cart = await db.cart.findUnique({
            where: {userId}
        })
        if (!cart) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Cart not found"
            })
        }

        await db.cartItem.deleteMany({
            where: {
                cartId: cart.id
            }
        })

        return {success: true};
    },
}

