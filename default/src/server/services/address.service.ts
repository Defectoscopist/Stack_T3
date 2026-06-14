import type z from "zod";
import type * as AddressSchemas from "../schemas/address.schema";

import { db } from "~/server/db";

export class AddressService {
    constructor(private prisma: typeof db) {}

    async createAddress(input: z.infer<typeof AddressSchemas.createAddressSchema> & { userId: string }) {
        const { firstName, lastName, street, city, state, postalCode, country, phone, userId } = input;

        return this.prisma.address.create({
            data: {
                firstName,
                lastName,
                street,
                city,
                state,
                postalCode,
                country,
                phone,
                userId,
            },
        });
    }

    async getAddressesByUserId(userId: string) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
}