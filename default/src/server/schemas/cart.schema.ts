import z from "zod";
import {productVariantOutputSchema} from "./product.schema";


export const getCartByUserIdSchema = z.object({
    userId: z.string().uuid().min(2).describe("User ID must be a valid UUID and at least 2 characters long"),
});

export const cartItemOutputSchema = z.object({
    id: z.string().uuid().describe("Cart Item ID must be a valid UUID"),
    productVariant: productVariantOutputSchema.describe("Product variant details for the cart item"),
    quantity: z.number().min(0).describe("Quantity of the product variant in the cart, must be a non-negative number"),
});

export const cartOutputSchema = z.object({
    id: z.string().uuid().describe("Cart ID must be a valid UUID"),
    userId: z.string().uuid().describe("User ID must be a valid UUID"),
    products: cartItemOutputSchema.array().describe("Array of products in the cart"),
    total: z.number().min(0).describe("Total price of the items in the cart, must be a non-negative number")
});

export const addToCartSchema = z.object({
    userId: z.string().uuid().min(2).describe("User ID must be a valid UUID and at least 2 characters long"),
    productVariantId: z.string().uuid().min(2).describe("Product Variant ID must be a valid UUID and at least 2 characters long"),
    quantity: z.number().min(1).describe("Quantity of the product variant to add to the cart, must be at least 1"),
});

export const updateCartItemSchema = z.object({
    cartItemId: z.string().uuid().min(2).describe("Cart Item ID must be a valid UUID and at least 2 characters long"),
    quantity: z.number().min(0).describe("Updated quantity of the product variant in the cart, must be a non-negative number"),
});

export const removeCartItemSchema = z.object({
    cartItemId: z.string().uuid().min(2).describe("Cart Item ID must be a valid UUID and at least 2 characters long"),
});

