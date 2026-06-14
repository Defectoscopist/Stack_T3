import { createTRPCRouter, protectedProcedure } from "../trpc";
import { AddressService } from "~/server/services/address.service";
import * as AddressSchemas from "~/server/schemas/address.schema";

import { db } from "~/server/db";

const addressService = new AddressService(db);

export const addressRouter = createTRPCRouter({
    createAddress: protectedProcedure
        .input(AddressSchemas.createAddressSchema)
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.session.user.id;
            return addressService.createAddress({ ...input, userId });
        }),

    getAddresses: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;
            return addressService.getAddressesByUserId(userId);
        }),
});