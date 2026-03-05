import {z} from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { cartService } from "~/server/services/cart.service"

export const cartRouter = createTRPCRouter ({
    getCart: protectedProcedure.query(({ctx}) => {
        return cartService.getCart(ctx.session.user.id)
    }),

    addItem: protectedProcedure
        .input(
            z.object({
                variantId: z.string(),
                quantity: z.number().min(1)
            })
        )
        .mutation(({ctx, input}) => {
            return cartService.addItem(ctx.session.user.id, input.variantId, input.quantity)
        }),

    removeItem: protectedProcedure
        .input(
            z.object({
                variantId: z.string()
            })
        )
        .mutation(({ctx, input}) => {
            return cartService.removeItem(ctx.session.user.id, input.variantId)
        }),

    updateItem: protectedProcedure
        .input(
            z.object({
                variantId: z.string(),
                quantity: z.number()
            })
        )
        .mutation(({ctx, input}) => {
            return cartService.updateItem(ctx.session.user.id, input.variantId, input.quantity)
        })

})