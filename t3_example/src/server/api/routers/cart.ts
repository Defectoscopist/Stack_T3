import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    let cart = await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
                images: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await ctx.db.cart.create({
        data: { userId: ctx.session.user.id },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                  images: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const variant = await ctx.db.productVariant.findUnique({
        where: { id: input.variantId },
      });

      if (!variant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product variant not found",
        });
      }

      let cart = await ctx.db.cart.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!cart) {
        cart = await ctx.db.cart.create({
          data: { userId: ctx.session.user.id },
        });
      }

      const existingItem = await ctx.db.cartItem.findUnique({
        where: {
          cartId_variantId: {
            cartId: cart.id,
            variantId: input.variantId,
          },
        },
      });

      if (existingItem) {
        await ctx.db.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + input.quantity,
          },
        });
      } else {
        await ctx.db.cartItem.create({
          data: {
            cartId: cart.id,
            variantId: input.variantId,
            quantity: input.quantity,
            price: variant.price,
          },
        });
      }

      return ctx.db.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                  images: true,
                },
              },
            },
          },
        },
      });
    }),

  updateItem: protectedProcedure
    .input(
      z.object({
        cartItemId: z.string().min(1),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cartItem = await ctx.db.cartItem.findUnique({
        where: { id: input.cartItemId },
        include: { cart: true },
      });

      if (!cartItem || cartItem.cart.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found",
        });
      }

      await ctx.db.cartItem.update({
        where: { id: input.cartItemId },
        data: { quantity: input.quantity },
      });

      return ctx.db.cart.findUnique({
        where: { id: cartItem.cartId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                  images: true,
                },
              },
            },
          },
        },
      });
    }),

  removeItem: protectedProcedure
    .input(
      z.object({
        cartItemId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cartItem = await ctx.db.cartItem.findUnique({
        where: { id: input.cartItemId },
        include: { cart: true },
      });

      if (!cartItem || cartItem.cart.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found",
        });
      }

      await ctx.db.cartItem.delete({
        where: { id: input.cartItemId },
      });

      return ctx.db.cart.findUnique({
        where: { id: cartItem.cartId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                  images: true,
                },
              },
            },
          },
        },
      });
    }),

  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const cart = await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!cart) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cart not found",
      });
    }

    await ctx.db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return ctx.db.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: true,
      },
    });
  }),
});
