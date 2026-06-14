import type { z } from "zod";
import type * as AdminSchemas from "../schemas/admin.schema";
import { db } from "~/server/db";

export class AdminService {
  constructor(private prisma: typeof db) {}

  async getDashboardStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalOrders,
      totalProducts,
      totalUsers,
      allOrders,
      ordersToday,
      revenueTodayAgg,
      topProductsRaw,
      categories,
      brands,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.user.count(),
      this.prisma.order.findMany({
        include: {
          orderItems: { include: { productVariant: { include: { product: true } } } },
          user: { select: { name: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: todayStart } },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } },
      }),
      this.prisma.orderItem.groupBy({
        by: ["productVariantId"],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      this.prisma.category.findMany({ orderBy: { name: "asc" } }),
      this.prisma.brand.findMany({ orderBy: { name: "asc" } }),
    ]);

    // Total revenue (excluding cancelled)
    const totalRevenueAgg = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ["CANCELLED", "RETURNED"] } },
    });

    // Top products
    const variantIds = topProductsRaw.map((t) => t.productVariantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    const topProducts = topProductsRaw.map((t) => {
      const variant = variantMap.get(t.productVariantId);
      return {
        id: variant?.productId ?? "",
        name: variant?.product.name ?? "Unknown",
        totalSold: t._sum.quantity ?? 0,
        revenue: Number(t._sum.price ?? 0) * (t._sum.quantity ?? 0),
      };
    });

    // Recent orders with user names
    const recentOrders = allOrders.slice(0, 5).map((o) => ({
      id: o.id,
      status: o.status,
      total: Number(o.total),
      userName: o.user.name,
      createdAt: o.createdAt,
    }));

    // Total orders count by status for all orders (not just recent)
    const allOrdersCountByStatus = await this.prisma.order.groupBy({
      by: ["status"],
      _count: true,
    });
    const fullOrdersByStatus: Record<string, number> = {};
    for (const s of allOrdersCountByStatus) {
      fullOrdersByStatus[s.status] = s._count;
    }

    return {
      totalRevenue: Number(totalRevenueAgg._sum.total ?? 0),
      totalOrders,
      totalProducts,
      totalUsers,
      ordersByStatus: fullOrdersByStatus,
      revenueToday: Number(revenueTodayAgg._sum.total ?? 0),
      ordersToday,
      recentOrders,
      topProducts,
      categories,
      brands,
    };
  }

  // ===== Product CRUD =====
  async createProduct(input: z.infer<typeof AdminSchemas.createProductSchema>) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: input.name,
          description: input.description,
          slug: input.slug,
          brandId: input.brandId,
          categoryId: input.categoryId,
          isFeatured: input.isFeatured,
          isActive: input.isActive,
          isBestSeller: input.isBestSeller,
          isOnSale: input.isOnSale,
          salePrice: input.salePrice ?? undefined,
          originalPrice: input.originalPrice ?? undefined,
          discountPercent: input.discountPercent ?? 0,
          tags: input.tags ?? "",
          productType: (input.productType as any) ?? "GENERAL",
          sex: (input.sex as any) ?? "UNISEX",
          productImages: input.images
            ? { create: input.images.map((img) => ({ url: img.url, altText: img.altText })) }
            : undefined,
          variants: input.variants
            ? {
                create: input.variants.map((v) => ({
                  price: v.price,
                  stock: v.stock,
                  color: v.color ?? null,
                  size: (v.size as any) ?? "ONE_SIZE",
                  variantImages: v.images
                    ? { create: v.images.map((img) => ({ url: img.url, altText: img.altText })) }
                    : undefined,
                })),
              }
            : undefined,
        },
        include: {
          brand: true,
          category: true,
          productImages: true,
          variants: { include: { variantImages: true } },
        },
      });
      return product;
    });
  }

  async updateProduct(input: z.infer<typeof AdminSchemas.updateProductSchema>) {
    const { id, ...data } = input;
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.brandId !== undefined) updateData.brandId = data.brandId;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.isBestSeller !== undefined) updateData.isBestSeller = data.isBestSeller;
    if (data.isOnSale !== undefined) updateData.isOnSale = data.isOnSale;
    if (data.salePrice !== undefined) updateData.salePrice = data.salePrice;
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
    if (data.discountPercent !== undefined) updateData.discountPercent = data.discountPercent;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.productType !== undefined) updateData.productType = data.productType;
    if (data.sex !== undefined) updateData.sex = data.sex;

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        brand: true,
        category: true,
        productImages: true,
        variants: { include: { variantImages: true } },
      },
    });
  }

  async deleteProduct(input: z.infer<typeof AdminSchemas.deleteProductSchema>) {
    return this.prisma.product.delete({ where: { id: input.id } });
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        productImages: true,
        variants: { include: { variantImages: true } },
      },
    });
  }

  // ===== Category CRUD =====
  async createCategory(input: z.infer<typeof AdminSchemas.createCategorySchema>) {
    return this.prisma.category.create({ data: input });
  }

  async updateCategory(input: z.infer<typeof AdminSchemas.updateCategorySchema>) {
    const { id, ...data } = input;
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.slug !== undefined) updateData.slug = data.slug;
    return this.prisma.category.update({ where: { id }, data: updateData });
  }

  async deleteCategory(input: z.infer<typeof AdminSchemas.deleteCategorySchema>) {
    return this.prisma.category.delete({ where: { id: input.id } });
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
  }

  // ===== Brand CRUD =====
  async createBrand(input: z.infer<typeof AdminSchemas.createBrandSchema>) {
    return this.prisma.brand.create({ data: input });
  }

  async updateBrand(input: z.infer<typeof AdminSchemas.updateBrandSchema>) {
    const { id, ...data } = input;
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.slug !== undefined) updateData.slug = data.slug;
    return this.prisma.brand.update({ where: { id }, data: updateData });
  }

  async deleteBrand(input: z.infer<typeof AdminSchemas.deleteBrandSchema>) {
    return this.prisma.brand.delete({ where: { id: input.id } });
  }

  async getAllBrands() {
    return this.prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
  }

  // ===== Variant CRUD =====
  async createVariant(input: z.infer<typeof AdminSchemas.createVariantSchema>) {
    return this.prisma.productVariant.create({
      data: {
        productId: input.productId,
        price: input.price,
        stock: input.stock,
        color: input.color ?? null,
        size: (input.size as any) ?? "ONE_SIZE",
        variantImages: input.images
          ? { create: input.images.map((img) => ({ url: img.url, altText: img.altText })) }
          : undefined,
      },
      include: { variantImages: true },
    });
  }

  async updateVariant(input: z.infer<typeof AdminSchemas.updateVariantSchema>) {
    const { id, ...data } = input;
    const updateData: Record<string, any> = {};
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.size !== undefined) updateData.size = data.size;
    return this.prisma.productVariant.update({
      where: { id },
      data: updateData,
      include: { variantImages: true },
    });
  }

  async deleteVariant(input: z.infer<typeof AdminSchemas.deleteVariantSchema>) {
    return this.prisma.productVariant.delete({ where: { id: input.id } });
  }

  // ===== Order Management =====
  async getAllOrders(input: z.infer<typeof AdminSchemas.adminGetOrdersSchema>) {
    const where: Record<string, any> = {};
    if (input.status) {
      where.status = input.status;
    }
    return this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            productVariant: {
              include: {
                product: { include: { productImages: true } },
              },
            },
          },
        },
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: input.limit,
      skip: input.offset,
    });
  }

  async updateOrderStatus(input: z.infer<typeof AdminSchemas.adminUpdateOrderStatusSchema>) {
    return this.prisma.order.update({
      where: { id: input.orderId },
      data: { status: input.status as any },
    });
  }

  // ===== User Management =====
  async getAllUsers(input: z.infer<typeof AdminSchemas.adminGetUsersSchema>) {
    return this.prisma.user.findMany({
      take: input.limit,
      skip: input.offset,
      include: {
        _count: { select: { orders: true } },
      },
    });
  }

  async updateUserRole(input: z.infer<typeof AdminSchemas.adminUpdateUserRoleSchema>) {
    return this.prisma.user.update({
      where: { id: input.userId },
      data: { role: input.role as any },
    });
  }
}