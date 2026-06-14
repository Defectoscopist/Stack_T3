import z from "zod";

// ===== Dashboard Stats =====
export const dashboardStatsOutputSchema = z.object({
  totalRevenue: z.number(),
  totalOrders: z.number(),
  totalProducts: z.number(),
  totalUsers: z.number(),
  ordersByStatus: z.record(z.string(), z.number()),
  revenueToday: z.number(),
  ordersToday: z.number(),
  recentOrders: z.array(z.object({
    id: z.string(),
    status: z.string(),
    total: z.number(),
    userName: z.string().nullable(),
    createdAt: z.date(),
  })),
  topProducts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    totalSold: z.number(),
    revenue: z.number(),
  })),
});

// ===== CRUD Product Schemas =====
export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  salePrice: z.number().nullable().optional(),
  originalPrice: z.number().nullable().optional(),
  discountPercent: z.number().int().nullable().optional(),
  tags: z.string().optional(),
  productType: z.string().optional(),
  sex: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    altText: z.string().optional(),
  })).optional(),
  variants: z.array(z.object({
    price: z.number().min(0),
    stock: z.number().int().min(0).default(0),
    color: z.string().nullable().optional(),
    size: z.string().optional(),
    images: z.array(z.object({
      url: z.string(),
      altText: z.string().optional(),
    })).optional(),
  })).optional(),
});

export const updateProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  salePrice: z.number().nullable().optional(),
  originalPrice: z.number().nullable().optional(),
  discountPercent: z.number().int().nullable().optional(),
  tags: z.string().optional(),
  productType: z.string().optional(),
  sex: z.string().optional(),
});

export const deleteProductSchema = z.object({
  id: z.string().min(1),
});

// ===== CRUD Category Schemas =====
export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
});

export const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export const deleteCategorySchema = z.object({
  id: z.string().min(1),
});

// ===== CRUD Brand Schemas =====
export const createBrandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
});

export const updateBrandSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export const deleteBrandSchema = z.object({
  id: z.string().min(1),
});

// ===== CRUD Variant Schemas =====
export const createVariantSchema = z.object({
  productId: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().int().min(0).default(0),
  color: z.string().nullable().optional(),
  size: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    altText: z.string().optional(),
  })).optional(),
});

export const updateVariantSchema = z.object({
  id: z.string().min(1),
  price: z.number().optional(),
  stock: z.number().int().optional(),
  color: z.string().nullable().optional(),
  size: z.string().optional(),
});

export const deleteVariantSchema = z.object({
  id: z.string().min(1),
});

// ===== Admin Order Schemas =====
export const adminUpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["PENDING", "DELIVERING", "COMPLETED", "CANCELLED", "RETURNING", "RETURNED"]),
});

export const adminGetOrdersSchema = z.object({
  status: z.string().optional(),
  limit: z.number().int().min(1).default(50),
  offset: z.number().int().min(0).default(0),
});

// ===== Admin User Schemas =====
export const adminGetUsersSchema = z.object({
  limit: z.number().int().min(1).default(50),
  offset: z.number().int().min(0).default(0),
});

export const adminUpdateUserRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["USER", "ADMIN"]),
});