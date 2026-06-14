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
    id: z.string().min(1),
    productVariantId: z.string().min(1),
    quantity: z.number().min(1),
    price: z.number().min(0),
});

export const orderOutputSchema = z.object({
    id: z.string().min(1),
    status: orderStatusSchema,
    total: z.number().min(0),
    userId: z.string().min(1),
    addressId: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
    orderItems: orderItemOutputSchema.array(),
});

export const createOrderSchema = z.object({
    userId: z.string().min(1),
    addressId: z.string().min(1),
    items: orderItemInputSchema.array().min(1),
});

export const checkoutSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    street: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(5, "ZIP code must be at least 5 digits"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    items: orderItemInputSchema.array().min(1),
});

export const getOrderByIdSchema = z.object({
    id: z.string().min(1),
});

export const getOrdersByUserIdSchema = z.object({
    userId: z.string().min(1),
    status: orderStatusSchema.optional(),
    limit: z.number().int().min(1).default(10),
    offset: z.number().int().min(0).default(0),
});

export const updateOrderStatusSchema = z.object({
    orderId: z.string().min(1),
    status: orderStatusSchema,
});

export const cancelOrderSchema = z.object({
    orderId: z.string().min(1),
});