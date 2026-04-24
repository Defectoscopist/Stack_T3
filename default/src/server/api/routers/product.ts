import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import * as ProductSchemas from "~/server/schemas/product.schema";
import { ProductService } from "~/server/services/product.service";

const productService = new ProductService(db);

export const productRouter = createTRPCRouter({

  getById: publicProcedure
    .input(ProductSchemas.getProductsByIdSchema)
    .query(async ({ input }) => {
      const product = await productService.getProductById(input);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with ID ${input.id} not found`,
        });
      }
      //return product;
      return ProductSchemas.productOutputSchema.parse(product);
    }),

  getBySlug: publicProcedure
    .input(ProductSchemas.getProductsBySlugSchema)
    .query(async ({ input }) => {
      const product = await productService.getProductBySlug(input);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with slug ${input.slug} not found`,
        });
      }
      return ProductSchemas.productOutputSchema.parse(product);
    }),

  getFiltered: publicProcedure
    .input(ProductSchemas.getProductsSchema)
    .query(async ({ input }) => {
      const products = await productService.getProducts(input);
      return products.map(p => ProductSchemas.productOutputSchema.parse(p));
    }),

  getAll: publicProcedure
    .input(ProductSchemas.getAllProductsSchema)
    .query(async ({ input }) => {
      const products = await productService.getAllProducts(input);
      return products.map(p => ProductSchemas.productOutputSchema.parse(p));
    }),

  getVariantById: publicProcedure
    .input(ProductSchemas.getProductVariantByIdSchema)
    .query(async ({ input }) => {
      const variant = await productService.getProductVariantById(input);
      if (!variant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product variant with ID ${input.id} not found`,
        });
      }
      return ProductSchemas.productVariantOutputSchema.parse(variant);
    }),

  getVariantsByProduct: publicProcedure
    .input(ProductSchemas.getProductVariantsByProductSchema)
    .query(async ({ input }) => {
      const variants = await productService.getProductVariantsByProduct(input);
      if (!variants || variants.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No product variants found for product ID ${input.productId}`,
        });
      }
      return variants.map(v => ProductSchemas.productVariantOutputSchema.parse(v));
    }),
});
