import {z} from "zod"
import { productService } from "~/server/services/product.service"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const productRouter = createTRPCRouter({
    getAll: publicProcedure.query(() => {
        return productService.getAllProducts()
    }),

    getBySlug: publicProcedure
        .input(
            z.object({
                slug: z.string()
            })
        )
        .query(({input}) => {
            return productService.getProductBySlug(input.slug)
        }),

    getById: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(({input}) => {
            return productService.getProductById(input.id)
        })
})