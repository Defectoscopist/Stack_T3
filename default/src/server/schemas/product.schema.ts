import z from "zod";

enum Size {
    XXXXS = "XXXXS",
    XXXS = "XXXS",
    XXS = "XXS",
    XS = "XS",
    S = "S",
    M = "M",
    L = "L",
    XL = "XL",
    XXL = "XXL",
    XXXL = "XXXL",
    XXXXL = "XXXXL",
    ONE_SIZE = "ONE_SIZE"
}

//=================================     Products     =====================================

export const getProductsByIdSchema = z.object({
    id: z.string().min(1).describe("Product ID must be a non-empty string"),
});

export const getProductsBySlugSchema = z.object({
    slug: z.string().min(2).max(100).describe("Product slug must be a string between 2 and 100 characters long")
});

export const paginationSchema = z.object({
    limit: z.number().int().min(1).default(1000).describe("Limit must be a positive integer between 1 and 1000"),
    offset: z.number().int().min(0).default(0).describe("Offset must be a non-negative integer")
});

export const filteredProductSchema = z.object({
    isActive: z.boolean().default(true).describe("Filter by active status, defaults to true"),
    isFeatured: z.boolean().default(false).describe("Filter by featured status, defaults to false"),
    brandId: z.string().min(1).nullable().default(null).describe("Brand ID must be a non-empty string or null"),
    categoryId: z.string().min(1).nullable().default(null).describe("Category ID must be a non-empty string or null"),
});

export const getProductsSchema = z.object({
    ...paginationSchema.shape,
    ...filteredProductSchema.shape,
    search: z.string().optional().describe("Search query must be a string between 2 and 100 characters long"),
    images: z.boolean().default(true).describe("Include product images in the response, defaults to true"),
    variants: z.boolean().default(true).describe("Include product variants in the response, defaults to true"),
})

export const getAllProductsSchema = paginationSchema

export const productImageOutputSchema = z.array(z.string().url().describe("Array of image URLs for the product")).describe("Array of image URLs for the product")


//=================================     Product Variants    =====================================

export const getProductVariantByIdSchema = z.object({
    id: z.string().min(1).describe("Product Variant ID must be a non-empty string"),
});

export const getProductVariantsByProductSchema = z.object({

    // optional
    color: z.string().min(2).max(50).optional().describe("Filter by color, must be a string between 2 and 50 characters long"),
    size: z.nativeEnum(Size).optional().describe("Filter by size, must be one of the predefined sizes"),
    variantImages: z.boolean().default(true).describe("Include variant images in the response, defaults to true"),
    inStock: z.boolean().default(false).describe("Filter by stock availability, defaults to false"),

    productId: z.string().min(1).describe("Product ID must be a non-empty string"),
})

//=================================     Output Schemas    =====================================

export const productVariantOutputSchema = z.object({
    id: z.string().min(1),
    price: z.number().min(0).describe("Price must be a non-negative number"),
    stock: z.number().min(0).describe("Stock must be a non-negative number"),
    color: z.string().nullable(),
    size: z.nativeEnum(Size),
    imagesUrl: z.string().array().describe("Array of image URLs for the product variant"),
})

export const productOutputSchema = z.object({
    id: z.string().min(1),
    name: z.string(),
    description: z.string(),
    slug: z.string(),
    imagesUrl: productImageOutputSchema,
    variants: productVariantOutputSchema.array().describe("Array of product variants"),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
    categoryId: z.string().min(1),
    brandId: z.string().min(1)
})