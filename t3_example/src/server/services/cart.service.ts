//import { Quando } from "next/font/google";
import { db } from "../db"
//import { success } from "zod/v4";

export const cartService = {
    async getCart(userId: string) {
        return db.cart.findUnique({
            where: {userId},
            include: {
                items: {
                    include: {
                        variant: true
                    }
                }
            }
        })
    },

    async addItem(userId: string, variantId: string, quantity: number) {
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
            return db.cartItem.update ({
                where: {id: existingItem.id},
                data: {quantity: existingItem.quantity + quantity}
            })
        }

        return db.cartItem.create({
            data: {
                cartId: cart.id,
                variantId,
                quantity
            }
        })
    },

    async updateItem (userId: string, variantId: string, quantity: number) {
        
        const cart = await db.cart.findUnique ({
            where: {userId: userId}
        })
        if (!cart) throw new Error("Cart not found!");

        const item = await db.cartItem.findFirst({
            where: {
                cartId: cart.id,
                variantId
            }
        })
        if (!item) throw new Error("Item not found!");

        if (quantity <= 0) {
            return db.cartItem.delete({
                where: {id: item.id}
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
        if (!cart) throw new Error("Cart not found!");

        return db.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                variantId
            }
        })
    },

    async clearCart (userId:string) {
        const cart = await db.cart.findUnique({
            where: {userId}
        })
        if (!cart) throw new Error("Cart not found!");

        await db.cartItem.deleteMany({
            where: {
                cartId: cart.id
            }
        })

        return {success: true};
    }
}