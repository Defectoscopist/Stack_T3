import z from "zod";

export const createAddressSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    street: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(5, "ZIP code must be at least 5 digits"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const addressOutputSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phone: z.string(),
    userId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});