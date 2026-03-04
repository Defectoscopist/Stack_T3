//import { dbClient } from "../generated/db";
//import { dbClient } from "@db/client";

import {db} from "../src/server/db"

//const db = new dbClient();

async function main() {
    console.log("🚀 SEED НАЧАЛСЯ");
    // Category -------------------------------------------------------------------
    const categorySmartHome = await db.category.create({
        data: {
            name: "Smart Home",
            slug: "smart-home"
        }
    })

    const categoryAudio = await db.category.create({
        data: {
            name: "Audio",
            slug: "audio"
        }
    })

    const categoryLighting = await db.category.create({
        data: {
            name: "Lighting",
            slug: "lighting"
        }
    })

    const categorySecurity = await db.category.create({
        data: {
            name: "Security",
            slug: "security"
        }
    })

    // Brand -------------------------------------------------------------------
    const brand = await db.brand.create({
        data: {
            name: "TRAXEN",
            slug: "traxen"
        }
    })

    // Product -------------------------------------------------------------------
    const product1 = await db.product.create({
        data: {
            name: "Aurelix Quantum Kettle",
            description: "Самооптимизирующийся чайник с интеллектуальным поддержанием температуры. Нагревает воду до нужной температуры за 3 минуты",
            slug: "aurelix-quantum-kettle",
            categoryId: categorySmartHome.id,
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

    const product2 = await db.product.create({
        data: {
            name: "Sonic Sphere",
            description: "Умная колонка с голосовым помощником и 360° звуком. Поддерживает Wi-Fi, Bluetooth 5.3 и AirPlay",
            slug: "sonic-sphere",
            categoryId: categoryAudio.id,
            brandId: brand.id,
            variant: {
                create: [
                    {
                        sku: "SOSP-001",
                        price: 1799.99,
                        stock: 5,
                        color: "Green"
                    },
                    {
                        sku: "SOSP-002",
                        price: 1799.99,
                        stock: 0,
                        color: "Yellow"
                    }
                ] 
            }
        }
    })

    const product3 = await db.product.create({
        data: {
            name: "Luma Canvas",
            description: "RGB-лампа с 16 миллионами цветов и поддержкой сценариев. Управление через приложение и голосом",
            slug: "luma-canvas",
            categoryId: categoryLighting.id,
            brandId: brand.id,
            variant: {
                create: [
                    {
                        sku: "LUCA-001",
                        price: 5799.99,
                        stock: 12,
                        color: "White"
                    },
                    {
                        sku: "LUCA-002",
                        price: 5799.99,
                        stock: 53,
                        color: "Blue"
                    },
                    {
                        sku: "LUCA-003",
                        price: 5799.99,
                        stock: 150,
                        color: "Red"
                    }
                ] 
            }
        }
    })

    const product4 = await db.product.create({
        data: {
            name: "Iris 4K",
            description: "Камера видеонаблюдения с 4K разрешением, ночным видением и детекцией движения. Двусторонняя аудиосвязь",
            slug: "iris-4k",
            categoryId: categorySecurity.id,
            brandId: brand.id,
            variant: {
                create: [
                    {
                        sku: "IR4K-001",
                        price: 9999.99,
                        stock: 73,
                        color: "White"
                    },
                    {
                        sku: "IR4K-002",
                        price: 9999.99,
                        stock: 56,
                        color: "Black"
                    },
                ] 
            }
        }
    })

    const product5 = await db.product.create({
        data: {
            name: "Volt Smart Plug",
            description: "Умная розетка с мониторингом энергопотребления",
            slug: "volt-smart-plug",
            categoryId: categorySmartHome.id,
            brandId: brand.id,
            variant: {
                create: [
                    {
                        sku: "VOSMPL-001",
                        price: 799.99,
                        stock: 550,
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
    .finally(() => db.$disconnect())