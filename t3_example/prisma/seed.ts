import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
    // Category
    const smartHome = await prisma.category.create({
        data: {
            name: "Smart Home",
            slug: "smart-home"
        }
    })

    // Brand
    const brand = await prisma.brand.create({
        data: {
            name: "AURELIX",
            slug: "aurelix"
        }
    })

    // Product
    const product = await prisma.product.create({
        data: {
            name: "Aurelix Quantum Kettle",
            description: "Self-optimizing thermal device.",
            slug: "aurelix-quantum-kettle",
            categoryId: smartHome.id,
            brandId: brand.id,
            variant: {
                create: [
                    {
                        sku: "AQK-001",
                        price: 799.99,
                        stock: 15,
                        color: "Graphite"
                    }
                ] 
            }
        }
    })

    console.log("Seed complete")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())