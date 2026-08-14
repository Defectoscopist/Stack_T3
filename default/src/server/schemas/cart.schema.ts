import z from "zod";
import {productVariantOutputSchema} from "./product.schema";


export const getCartByUserIdSchema = z.object({
    userId: z.string().min(1).describe("User ID must be a non-empty string"),
});

export const cartItemOutputSchema = z.object({
    id: z.string().min(1).describe("Cart Item ID must be a non-empty string"),
    productVariant: productVariantOutputSchema.describe("Product variant details for the cart item"),
    quantity: z.number().min(0).describe("Quantity of the product variant in the cart, must be a non-negative number"),
});

export const cartOutputSchema = z.object({
    id: z.string().min(1).describe("Cart ID must be a non-empty string"),
    userId: z.string().min(1).describe("User ID must be a non-empty string"),
    products: cartItemOutputSchema.array().describe("Array of products in the cart"),
    total: z.number().min(0).describe("Total price of the items in the cart, must be a non-negative number")
});

export const addToCartSchema = z.object({
    userId: z.string().min(1).describe("User ID must be a non-empty string"),
    productVariantId: z.string().min(1).describe("Product Variant ID must be a non-empty string"),
    quantity: z.number().int().min(1).describe("Quantity of the product variant to add to the cart, must be at least 1"),
});

export const updateCartItemSchema = z.object({
    cartItemId: z.string().min(1).describe("Cart Item ID must be a non-empty string"),
    quantity: z.number().int().min(0).describe("Updated quantity of the product variant in the cart, must be a non-negative number"),
});

export const removeCartItemSchema = z.object({
    cartItemId: z.string().min(1).describe("Cart Item ID must be a non-empty string"),
});

