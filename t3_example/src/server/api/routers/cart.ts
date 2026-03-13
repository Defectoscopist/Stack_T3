import { createTRPCRouter } from "~/server/api/trpc";
import {z} from "zod"
import { protectedProcedure } from "~/server/api/trpc";
import {Prisma} from "~/../generated/prisma";

export const cartRouter = createTRPCRouter({
    
    get: protectedProcedure.query(async ({ctx}) => {
        const user = ctx.session.user

        const cart =  (
            ctx.db.cart.findUnique({
                where: {userId: user.id}
            })
        )

        if (!cart) {
            return( await ctx.db.cart.create({
                data: {
                    userId: user.id,
                },
            }))
        }
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
        const user = ctx.session.user;

        // Find existing cart or create if none
        let cart = await ctx.db.cart.findUnique({
            where: { userId: user.id },
            include: { items: true },
        });
        if (!cart) {
            cart = await ctx.db.cart.create({
                data: {
                    userId: user.id,
                },
                include: { items: true },
            });
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(
            (item) => item.variantId === input.variantId
        );

        if (existingItem) {
            // Update the quantity of the existing item
            await ctx.db.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + input.quantity },
            });
        } else {
            // Add new item to the cart
            await ctx.db.cartItem.create({
                data: {
                    cartId: cart.id,
                    variantId: input.variantId,
                    quantity: input.quantity,
                },
            });
        }

        // Optionally, return the updated cart
        const updatedCart = await ctx.db.cart.findUnique({
            where: { userId: user.id },
            include: { items: true },
        });
        return updatedCart;
        })

})
