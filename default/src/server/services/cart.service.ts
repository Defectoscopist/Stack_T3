import type z from "zod";
import type * as CartSchemas from "../schemas/cart.schema";

import { db } from "~/server/db";

export class CartService {
    constructor(private prisma: typeof db) {}

    async getCartByUserId(input: z.infer<typeof CartSchemas.getCartByUserIdSchema>) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId: input.userId },
            include: {
                products: {
                    include: {
                        productVariant: {
                            include: {
                                product: true,
                                variantImages: true,
                            },
                        },
                    },
                },
            },
        });

        cart ??= await this.prisma.cart.create({
            data: {
                userId: input.userId,
            },
            include: {
                products: {
                    include: {
                        productVariant: {
                            include: {
                                product: {
                                    include: { productImages: true }
                                },
                                variantImages: true
                            }
                        }
                    }
                }
            }
        });

        return cart;
    }

    async updateCartItem(input: z.infer<typeof CartSchemas.updateCartItemSchema>) {
        const cartItem = await this.prisma.cartProduct.findUnique({
            where: { id: input.cartItemId },
        });

        if (!cartItem) {
            throw new Error(`Cart item with ID ${input.cartItemId} not found`);
        }

        if (input.quantity === 0) {
            return this.prisma.cartProduct.delete({
                where: { id: input.cartItemId },
            });
        }

        const productVariant = await this.prisma.productVariant.findUnique({
            where: { id: cartItem.productVariantId },
        });

        if (!productVariant) {
            throw new Error(`Product variant for the cart item was not found`);
        }

        if (input.quantity > productVariant.stock) {
            throw new Error(`Insufficient stock. Available: ${productVariant.stock}, requested: ${input.quantity}`);
        }

        return this.prisma.cartProduct.update({
            where: { id: input.cartItemId },
            data: {
                quantity: input.quantity,
            },
            include: {
                productVariant: {
                    include: {
                        product: {
                            include: { productImages: true },
                        },
                        variantImages: true,
                    },
                },
            },
        });
    }

    async addToCart(input: z.infer<typeof CartSchemas.addToCartSchema>) {
        const cart = await this.getCartByUserId({ userId: input.userId });

        const productVariant = await this.prisma.productVariant.findUnique({
            where: { id: input.productVariantId },
        });

        if (!productVariant) {
            throw new Error(`Product variant with ID ${input.productVariantId} not found`);
        }

        if (productVariant.stock < input.quantity) {
            throw new Error(`Insufficient stock. Available: ${productVariant.stock}, requested: ${input.quantity}`);
        }

        const existingCartItem = await this.prisma.cartProduct.findFirst({
            where: {
                cartId: cart.id,
                productVariantId: input.productVariantId,
            },
        });

        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + input.quantity;
            if (newQuantity > productVariant.stock) {
                throw new Error(`Insufficient stock. Available: ${productVariant.stock}, requested: ${newQuantity}`);
            }

            return this.prisma.cartProduct.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: newQuantity,
                },
                include: {
                    productVariant: {
                        include: {
                            product: {
                                include: { productImages: true },
                            },
                            variantImages: true,
                        },
                    },
                },
            });
        }

        return this.prisma.cartProduct.create({
            data: {
                cartId: cart.id,
                productVariantId: input.productVariantId,
                quantity: input.quantity,
            },
            include: {
                productVariant: {
                    include: {
                        product: {
                            include: { productImages: true },
                        },
                        variantImages: true,
                    },
                },
            },
        });
    }

    async removeCartItem(input: z.infer<typeof CartSchemas.removeCartItemSchema>) {
        const cartItem = await this.prisma.cartProduct.findUnique({
            where: { id: input.cartItemId },
        });

        if (!cartItem) {
            throw new Error(`Cart item with ID ${input.cartItemId} not found`);
        }

        return this.prisma.cartProduct.delete({
            where: { id: input.cartItemId },
        });
    }

    async getCartTotal(userId: string): Promise<number> {
        const cart = await this.getCartByUserId({ userId });

        const cartItems = await this.prisma.cartProduct.findMany({
            where: { cartId: cart.id },
            include: {
                productVariant: true,
            },
        });

        return cartItems.reduce((total, item) => {
            return total + item.productVariant.price.toNumber() * item.quantity;
        }, 0);
    }
}
