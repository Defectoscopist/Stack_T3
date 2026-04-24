import z from "zod";

enum OrderStatus {
    PENDING = "PENDING",
    DELIVERING = "DELIVERING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    RETURNING = "RETURNING",
    RETURNED = "RETURNED",
}

export const orderStatusSchema = z.nativeEnum(OrderStatus).describe("Status of the order, must be one of the predefined statuses");

export const orderItemInputSchema = z.object({
    productVariantId: z.string().min(1).describe("Product Variant ID must be a non-empty string"),
    quantity: z.number().int().min(1).describe("Quantity of the product variant in the order, must be at least 1"),
});

export const orderItemOutputSchema = z.object({
    id: z.string().min(1).describe("Order Item ID must be a non-empty string"),
    productVariantId: z.string().min(1).describe("Product Variant ID must be a non-empty string"),
    quantity: z.number().min(1).describe("Quantity of the product variant in the order, must be at least 1"),
    price: z.number().min(0).describe("Price of the product variant at the time of order, must be a non-negative number"),
});

export const orderOutputSchema = z.object({
    id: z.string().min(1).describe("Order ID must be a non-empty string"),
    status: orderStatusSchema,
    total: z.number().min(0).describe("Total price of the order, must be a non-negative number"),
    userId: z.string().min(1).describe("User ID must be a non-empty string"),
    addressId: z.string().min(1).describe("Address ID must be a non-empty string"),
    createdAt: z.date().describe("Date and time when the order was created"),
    updatedAt: z.date().describe("Date and time when the order was last updated"),
    orderItems: orderItemOutputSchema.array().describe("Array of order line items"),
});

export const createOrderSchema = z.object({
    userId: z.string().min(1).describe("User ID must be a non-empty string"),
    addressId: z.string().min(1).describe("Address ID must be a non-empty string"),
    items: orderItemInputSchema.array().min(1).describe("Array of items in the order, must contain at least one item"),
});

export const getOrderByIdSchema = z.object({
    id: z.string().min(1).describe("Order ID must be a non-empty string"),
});

export const getOrdersByUserIdSchema = z.object({
    userId: z.string().min(1).describe("User ID must be a non-empty string"),
    status: orderStatusSchema.optional().describe("Filter by order status, must be one of the predefined statuses"),
    limit: z.number().int().min(1).default(10).describe("Number of orders to return, must be at least 1, defaults to 10"),
    offset: z.number().int().min(0).default(0).describe("Number of orders to skip for pagination, defaults to 0"),
});

export const updateOrderStatusSchema = z.object({
    orderId: z.string().uuid().min(2).describe("Order ID must be a valid UUID and at least 2 characters long"),
    status: orderStatusSchema,
});

export const cancelOrderSchema = z.object({
    orderId: z.string().uuid().min(2).describe("Order ID must be a valid UUID and at least 2 characters long"),
});


