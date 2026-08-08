import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { AdminService } from "~/server/services/admin.service";
import * as AdminSchemas from "~/server/schemas/admin.schema";
import { db } from "~/server/db";

const adminService = new AdminService(db);

// Middleware to check if user is admin (for mutations)
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

// Read-only queries — accessible by any logged-in user
const viewProcedure = protectedProcedure;

export const adminRouter = createTRPCRouter({
  // ===== Dashboard =====
  getDashboardStats: viewProcedure.query(async () => {
    return adminService.getDashboardStats();
  }),

  // ===== Products =====
  getAllProducts: viewProcedure.query(async () => {
    return db.product.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        brand: true,
        category: true,
        productImages: true,
        variants: true,
        _count: { select: { variants: true } },
      },
    });
  }),

  getProductById: viewProcedure
    .input(AdminSchemas.deleteProductSchema)
    .query(async ({ input }) => {
      return adminService.getProductById(input.id);
    }),

  createProduct: adminProcedure
    .input(AdminSchemas.createProductSchema)
    .mutation(async ({ input }) => {
      return adminService.createProduct(input);
    }),

  updateProduct: adminProcedure
    .input(AdminSchemas.updateProductSchema)
    .mutation(async ({ input }) => {
      return adminService.updateProduct(input);
    }),

  deleteProduct: adminProcedure
    .input(AdminSchemas.deleteProductSchema)
    .mutation(async ({ input }) => {
      return adminService.deleteProduct(input);
    }),

  // ===== Categories =====
  getAllCategories: viewProcedure.query(async () => {
    return adminService.getAllCategories();
  }),

  createCategory: adminProcedure
    .input(AdminSchemas.createCategorySchema)
    .mutation(async ({ input }) => {
      return adminService.createCategory(input);
    }),

  updateCategory: adminProcedure
    .input(AdminSchemas.updateCategorySchema)
    .mutation(async ({ input }) => {
      return adminService.updateCategory(input);
    }),

  deleteCategory: adminProcedure
    .input(AdminSchemas.deleteCategorySchema)
    .mutation(async ({ input }) => {
      return adminService.deleteCategory(input);
    }),

  // ===== Brands =====
  getAllBrands: viewProcedure.query(async () => {
    return adminService.getAllBrands();
  }),

  createBrand: adminProcedure
    .input(AdminSchemas.createBrandSchema)
    .mutation(async ({ input }) => {
      return adminService.createBrand(input);
    }),

  updateBrand: adminProcedure
    .input(AdminSchemas.updateBrandSchema)
    .mutation(async ({ input }) => {
      return adminService.updateBrand(input);
    }),

  deleteBrand: adminProcedure
    .input(AdminSchemas.deleteBrandSchema)
    .mutation(async ({ input }) => {
      return adminService.deleteBrand(input);
    }),

  // ===== Variants =====
  createVariant: adminProcedure
    .input(AdminSchemas.createVariantSchema)
    .mutation(async ({ input }) => {
      return adminService.createVariant(input);
    }),

  updateVariant: adminProcedure
    .input(AdminSchemas.updateVariantSchema)
    .mutation(async ({ input }) => {
      return adminService.updateVariant(input);
    }),

  deleteVariant: adminProcedure
    .input(AdminSchemas.deleteVariantSchema)
    .mutation(async ({ input }) => {
      return adminService.deleteVariant(input);
    }),

  // ===== Orders =====
  getAllOrders: viewProcedure
    .input(AdminSchemas.adminGetOrdersSchema)
    .query(async ({ input }) => {
      return adminService.getAllOrders(input);
    }),

  updateOrderStatus: adminProcedure
    .input(AdminSchemas.adminUpdateOrderStatusSchema)
    .mutation(async ({ input }) => {
      return adminService.updateOrderStatus(input);
    }),

  // ===== Users =====
  getAllUsers: viewProcedure
    .input(AdminSchemas.adminGetUsersSchema)
    .query(async ({ input }) => {
      return adminService.getAllUsers(input);
    }),

  updateUserRole: adminProcedure
    .input(AdminSchemas.adminUpdateUserRoleSchema)
    .mutation(async ({ input }) => {
      return adminService.updateUserRole(input);
    }),
});
