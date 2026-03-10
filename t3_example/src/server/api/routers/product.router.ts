import {z} from "zod"
import { productService } from "~/server/services/product.service"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { count } from "console"

export const productRouter = createTRPCRouter({
    getAll: publicProcedure.query(() => {
        return productService.getAll()
    }),

    getAllPagination: publicProcedure
        .input(
            z.object({
                page: z.number(),
                limit: z.number()
            })
        )
        .query(({input}) => {
            return productService.getAllPagination(input.page, input.limit)
        }),

    getBySlug: publicProcedure
        .input(
            z.object({
                slug: z.string()
            })
        )
        .query(({input}) => {
            return productService.getBySlug(input.slug)
        }),

    getById: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(({input}) => {
            return productService.getById(input.id)
        })
})