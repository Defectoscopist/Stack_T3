import { createTRPCRouter } from "~/server/api/trpc";
import {z} from "zod"
import { protectedProcedure } from "~/server/api/trpc";
import {Prisma} from "~/../generated/prisma";
import { Quando } from "next/font/google";

export const cartRouter = createTRPCRouter({
    
    get: protectedProcedure.query(async ({ctx}) => {
        const user = ctx.session.user

        const cart =  (
            ctx.db.cart.findUnique({
                where: {userId: user.id}
            })
        )

        if (!cart) {
            
        }

        //if ()

        // if (!cart) {
        //     ctx.db.cart.create({
        //         where: {
        //             userId: user.id
        //         }
        //     })
        // }
        return cart;
    }),

    addItem: protectedProcedure
        .input(
            z.object({
                variantId: z.string().min(1),
                quantity: z.number().int().min(1).default(1),
            })
        )
        .mutation(async ({input, ctx}) =>{
            return (
                ctx.db.cartItem
            )
        })

})
