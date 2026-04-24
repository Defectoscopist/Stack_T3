import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * IMAGE PATH GENERATOR
 */
const img = (slug: string, color: string, i: number) =>
  `/images/products/${slug}/${color.toLowerCase()}-${i}.png`;

/**
 * WAREHOUSES
 */
const warehouses = [
  { name: "Moscow North",       city: "Moscow",           country: "RU" },
  { name: "SPb Central",        city: "Saint Petersburg", country: "RU" },
  { name: "Dubai Hub",          city: "Dubai",            country: "AE" },
  { name: "Tokyo East",         city: "Tokyo",            country: "JP" },
];

/**
 * CORE PRODUCTS
 */
const coreProducts = [
  {
    name: "Aether Lamp",
    slug: "aether-lamp",
    description:
      "Aether Lamp is a spatial light object designed to stabilize perception of space through adaptive ambient diffusion. It reduces visual noise and creates controlled calmness.",
    variants: [
      {
        color: "Obsidian",
        colorHex: "#1E1E1E",
        price: 120,
        images: [
          img("aether-lamp", "obsidian", 1),
          img("aether-lamp", "obsidian", 2),
        ],
      },
      {
        color: "Bronze",
        colorHex: "#8C6A4A",
        price: 130,
        images: [img("aether-lamp", "bronze", 1)],
      },
    ],
  },
  {
    name: "Nova Air System",
    slug: "nova-air-system",
    description:
      "Nova Air System regulates micro-air composition in enclosed environments, maintaining optimal oxygen density and reducing particulate noise.",
    variants: [
      {
        color: "Silver",
        colorHex: "#C0C4C7",
        price: 340,
        images: [img("nova-air-system", "silver", 1)],
      },
      {
        color: "Platinum",
        colorHex: "#E5E4E2",
        price: 350,
        images: [img("nova-air-system", "platinum", 1)],
      },
    ],
  },
  {
    name: "Orbit Coffee Interface",
    slug: "orbit-coffee-interface",
    description:
      "Orbit Coffee Interface introduces precision-controlled extraction cycles for beverage preparation with minimal cognitive load.",
    variants: [
      {
        color: "Black",
        colorHex: "#2B2B2B",
        price: 260,
        images: [img("orbit-coffee-interface", "black", 1)],
      },
      {
        color: "Ivory",
        colorHex: "#FFFFF0",
        price: 270,
        images: [img("orbit-coffee-interface", "ivory", 1)],
      },
    ],
  },
];

/**
 * ADDITIONAL PRODUCTS
 */
const additionalProducts = [
  {
    name: "Echo Speaker",
    slug: "echo-speaker",
    description:
      "Echo Speaker creates immersive soundscapes that adapt to environmental acoustics, minimizing auditory clutter while enhancing spatial awareness in living spaces.",
    variants: [
      {
        color: "Midnight-Blue",
        colorHex: "#191970",
        price: 100,
        images: [img("echo-speaker", "midnight-blue", 1), img("echo-speaker", "midnight-blue", 2)],
      },
      {
        color: "Antique-Gold",
        colorHex: "#D4AF37",
        price: 120,
        images: [img("echo-speaker", "antique-gold", 1), img("echo-speaker", "antique-gold", 2)],
      },
    ],
  },
  {
    name: "Pulse Heater",
    slug: "pulse-heater",
    description:
      "Pulse Heater modulates thermal gradients with precision, maintaining optimal comfort zones while reducing energy dissipation in adaptive home environments.",
    variants: [
      {
        color: "Charcoal",
        colorHex: "#36454F",
        price: 110,
        images: [img("pulse-heater", "charcoal", 1), img("pulse-heater", "charcoal", 2)],
      },
      {
        color: "Copper",
        colorHex: "#B87333",
        price: 130,
        images: [img("pulse-heater", "copper", 1)],
      },
    ],
  },
  {
    name: "Flux Kettle",
    slug: "flux-kettle",
    description:
      "Flux Kettle optimizes liquid heating cycles through intelligent temperature mapping, ensuring consistent results with minimal thermal loss and sensory feedback.",
    variants: [
      {
        color: "Slate",
        colorHex: "#708090",
        price: 120,
        images: [img("flux-kettle", "slate", 1), img("flux-kettle", "slate", 2)],
      },
      {
        color: "Brass",
        colorHex: "#B5A642",
        price: 140,
        images: [img("flux-kettle", "brass", 1)],
      },
    ],
  },
  {
    name: "Zen Diffuser",
    slug: "zen-diffuser",
    description:
      "Zen Diffuser disperses aromatic compounds in controlled patterns, fostering atmospheric balance and reducing olfactory distractions in serene living areas.",
    variants: [
      {
        color: "Onyx",
        colorHex: "#353935",
        price: 130,
        images: [img("zen-diffuser", "onyx", 1), img("zen-diffuser", "onyx", 2)],
      },
      {
        color: "Rose Gold",
        colorHex: "#E0BFB8",
        price: 150,
        images: [img("zen-diffuser", "rose-gold", 1)],
      },
    ],
  },
  {
    name: "Core Vacuum",
    slug: "core-vacuum",
    description:
      "Core Vacuum employs adaptive suction algorithms to maintain surface cleanliness, operating silently while preserving material integrity in modern interiors.",
    variants: [
      {
        color: "Graphite",
        colorHex: "#3A3A3A",
        price: 140,
        images: [img("core-vacuum", "graphite", 1), img("core-vacuum", "graphite", 2)],
      },
      {
        color: "Bronze",
        colorHex: "#8C6A4A",
        price: 160,
        images: [img("core-vacuum", "bronze", 1)],
      },
    ],
  },
  {
    name: "Halo Mirror",
    slug: "halo-mirror",
    description:
      "Halo Mirror integrates reflective surfaces with ambient lighting controls, enhancing visual continuity and reducing glare in transitional spaces.",
    variants: [
      {
        color: "Ebony",
        colorHex: "#555D50",
        price: 150,
        images: [img("halo-mirror", "ebony", 1), img("halo-mirror", "ebony", 2)],
      },
      {
        color: "Gold",
        colorHex: "#FFD700",
        price: 170,
        images: [img("halo-mirror", "gold", 1)],
      },
    ],
  },
  {
    name: "Prism Fridge",
    slug: "prism-fridge",
    description:
      "Prism Fridge regulates internal climates through spectral analysis, preserving nutritional integrity while minimizing energy signatures in compact forms.",
    variants: [
      {
        color: "Steel",
        colorHex: "#43464B",
        price: 160,
        images: [img("prism-fridge", "steel", 1), img("prism-fridge", "steel", 2)],
      },
      {
        color: "Pearl",
        colorHex: "#F5F5F0",
        price: 180,
        images: [img("prism-fridge", "pearl", 1)],
      },
    ],
  },
  {
    name: "Ion Fan",
    slug: "ion-fan",
    description:
      "Ion Fan circulates air with electrostatic precision, creating laminar flows that enhance respiratory comfort without introducing mechanical noise.",
    variants: [
      {
        color: "Jet",
        colorHex: "#343434",
        price: 170,
        images: [img("ion-fan", "jet", 1), img("ion-fan", "jet", 2)],
      },
      {
        color: "Burgundy",
        colorHex: "#800020",
        price: 190,
        images: [img("ion-fan", "burgundy", 1)],
      },
    ],
  },
  {
    name: "Lumen Desk",
    slug: "lumen-desk",
    description:
      "Lumen Desk provides task-specific illumination through adaptive LED arrays, optimizing visual ergonomics and reducing eye strain in productive environments.",
    variants: [
      {
        color: "Coal",
        colorHex: "#2F2F2F",
        price: 180,
        images: [img("lumen-desk", "coal", 1), img("lumen-desk", "coal", 2)],
      },
      {
        color: "Electrum",
        colorHex: "#E6B800",
        price: 200,
        images: [img("lumen-desk", "electrum", 1)],
      },
    ],
  },
  {
    name: "Wave Cooker",
    slug: "wave-cooker",
    description:
      "Wave Cooker utilizes electromagnetic resonance for efficient thermal transfer, achieving culinary precision with controlled energy distribution and minimal heat leakage.",
    variants: [
      {
        color: "Ash",
        colorHex: "#B2BEB5",
        price: 190,
        images: [img("wave-cooker", "ash", 1), img("wave-cooker", "ash", 2)],
      },
      {
        color: "Pewter",
        colorHex: "#8C7853",
        price: 210,
        images: [img("wave-cooker", "pewter", 1)],
      },
    ],
  },
  {
    name: "Drift Sofa",
    slug: "drift-sofa",
    description:
      "Drift Sofa contours to postural dynamics through responsive materials, promoting musculoskeletal alignment and sensory relaxation in resting zones.",
    variants: [
      {
        color: "Shadow",
        colorHex: "#8A795D",
        price: 200,
        images: [img("drift-sofa", "shadow", 1), img("drift-sofa", "shadow", 2)],
      },
      {
        color: "Taupe",
        colorHex: "#483C32",
        price: 220,
        images: [img("drift-sofa", "taupe", 1)],
      },
    ],
  },
  {
    name: "Aero Dryer",
    slug: "aero-dryer",
    description:
      "Aero Dryer accelerates moisture removal through directed airflow patterns, maintaining material quality while operating at subsonic frequencies for quiet performance.",
    variants: [
      {
        color: "Graphite",
        colorHex: "#3A3A3A",
        price: 210,
        images: [img("aero-dryer", "graphite", 1), img("aero-dryer", "graphite", 2)],
      },
      {
        color: "Bronze",
        colorHex: "#8C6A4A",
        price: 230,
        images: [img("aero-dryer", "bronze", 1)],
      },
    ],
  },
  {
    name: "Nexus Hub",
    slug: "nexus-hub",
    description:
      "Nexus Hub centralizes device orchestration through wireless protocols, streamlining connectivity and reducing electromagnetic interference in smart ecosystems.",
    variants: [
      {
        color: "Gunmetal",
        colorHex: "#2C3539",
        price: 220,
        images: [img("nexus-hub", "gunmetal", 1), img("nexus-hub", "gunmetal", 2)],
      },
      {
        color: "Brass",
        colorHex: "#DAA520",
        price: 240,
        images: [img("nexus-hub", "brass", 1)],
      },
    ],
  },
  {
    name: "Void Storage",
    slug: "void-storage",
    description:
      "Void Storage optimizes spatial utilization with modular compartments, enabling efficient organization while maintaining aesthetic continuity in storage solutions.",
    variants: [
      {
        color: "Obsidian",
        colorHex: "#0F0F0F",
        price: 230,
        images: [img("void-storage", "obsidian", 1), img("void-storage", "obsidian", 2)],
      },
      {
        color: "Copper",
        colorHex: "#C87533",
        price: 250,
        images: [img("void-storage", "copper", 1)],
      },
    ],
  },
  {
    name: "Arc Table",
    slug: "arc-table",
    description:
      "Arc Table features curved structural elements for ergonomic interaction, supporting dynamic workflows with stable surfaces and integrated cable management.",
    variants: [
      {
        color: "Graphite",
        colorHex: "#3A3A3A",
        price: 240,
        images: [img("arc-table", "graphite", 1), img("arc-table", "graphite", 2)],
      },
      {
        color: "Bronze",
        colorHex: "#8C6A4A",
        price: 260,
        images: [img("arc-table", "bronze", 1)],
      },
    ],
  },
  {
    name: "Neon Panel",
    slug: "neon-panel",
    description:
      "Neon Panel illuminates environments with programmable light sequences, creating ambient moods that adapt to circadian rhythms and user preferences.",
    variants: [
      {
        color: "Noir",
        colorHex: "#1C1C1C",
        price: 250,
        images: [img("neon-panel", "noir", 1), img("neon-panel", "noir", 2)],
      },
      {
        color: "Champagne",
        colorHex: "#F7E7CE",
        price: 270,
        images: [img("neon-panel", "champagne", 1)],
      },
    ],
  },
  {
    name: "Glow Shelf",
    slug: "glow-shelf",
    description:
      "Glow Shelf combines display functionality with subtle backlighting, organizing objects while providing visual hierarchy in illuminated storage systems.",
    variants: [
      {
        color: "Carbon",
        colorHex: "#2F4F4F",
        price: 260,
        images: [img("glow-shelf", "carbon", 1), img("glow-shelf", "carbon", 2)],
      },
    ],
  },
];

/**
 * CATEGORY MAPPING
 */
const categoryMap = {
  "lighting":    { name: "Lighting",             slug: "lighting" },
  "climate":     { name: "Climate Control",       slug: "climate-control" },
  "kitchen":     { name: "Kitchen & Beverage",    slug: "kitchen-beverage" },
  "storage":     { name: "Storage & Furniture",   slug: "storage-furniture" },
  "audio":       { name: "Audio & Entertainment", slug: "audio-entertainment" },
  "appliances":  { name: "Appliances",            slug: "appliances" },
  "smart-home":  { name: "Smart Home",            slug: "smart-home" },
};

const productCategories: Record<string, keyof typeof categoryMap> = {
  "aether-lamp":            "lighting",
  "nova-air-system":        "climate",
  "orbit-coffee-interface": "kitchen",
  "echo-speaker":           "audio",
  "pulse-heater":           "climate",
  "flux-kettle":            "kitchen",
  "zen-diffuser":           "climate",
  "core-vacuum":            "appliances",
  "halo-mirror":            "lighting",
  "prism-fridge":           "appliances",
  "ion-fan":                "climate",
  "lumen-desk":             "lighting",
  "wave-cooker":            "kitchen",
  "drift-sofa":             "storage",
  "aero-dryer":             "appliances",
  "nexus-hub":              "smart-home",
  "void-storage":           "storage",
  "arc-table":              "storage",
  "neon-panel":             "lighting",
  "glow-shelf":             "storage",
};

const featuredProducts = ["aether-lamp", "nova-air-system", "orbit-coffee-interface", "lumen-desk"];

/**
 * MAIN
 */
async function main() {
  console.log("🌱 SEED START");

  // CLEAN — порядок важен: сначала зависимые таблицы
  await prisma.variantStock.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("🧹 DB cleaned");

  // BRAND
  const brand = await prisma.brand.upsert({
    where: { slug: "aurelix" },
    update: {},
    create: { name: "AURELIX", slug: "aurelix" },
  });

  console.log(" Brand OK");

  // WAREHOUSES
  const createdWarehouses = [];
  for (const w of warehouses) {
    const wh = await prisma.warehouse.upsert({
      where: { name: w.name },
      update: {},
      create: w,
    });
    createdWarehouses.push(wh);
  }

  console.log("🏭 Warehouses OK");

  // CATEGORIES
  const categories: Record<string, string> = {};
  for (const [key, cat] of Object.entries(categoryMap)) {
    const created = await prisma.category.create({ data: cat });
    categories[key] = created.id;
  }

  console.log("📂 Categories created");

  const all = [...coreProducts, ...additionalProducts];

  console.log(`🚀 Creating ${all.length} products...`);

  for (const p of all) {
    try {
      console.log(`➡️  Product: ${p.slug}`);

      const catKey = productCategories[p.slug]!;
      const isFeatured = featuredProducts.includes(p.slug);

      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          brandId: brand.id,
          categoryId: categories[catKey]!,
          isFeatured,
          isActive: true,
          publishedAt: new Date("2026-04-01"),
        },
      });

      for (const v of p.variants) {
        const basePrice = v.price;
        const oldPrice = isFeatured ? basePrice + 30 : basePrice + 20;

        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: `${p.slug}-${v.color}`,
            price: basePrice,
            oldprice: oldPrice,
            color: v.color,
            colorHex: v.colorHex,
          },
        });

        // Остатки на каждом складе
        for (const wh of createdWarehouses) {
          await prisma.variantStock.create({
            data: {
              variantId: variant.id,
              warehouseId: wh.id,
              quantity: Math.floor(Math.random() * 20) + 5, // 5–25 штук
              reserved: 0,
            },
          });
        }

        // Изображения варианта
        for (let i = 0; i < v.images.length; i++) {
          await prisma.productImage.create({
            data: {
              url: v.images[i]!,
              alt: `${p.name} in ${v.color} - View ${i + 1}`,
              productId: product.id,
              variantId: variant.id,
              position: i,
            },
          });
        }
      }

      console.log(`   ✅ OK: ${p.slug}`);
    } catch (err) {
      console.error(`❌ FAILED: ${p.slug}`);
      console.error(err);
    }
  }

  console.log("🎉 SEED DONE");
}

main()
  .catch((e) => {
    console.error("💥 GLOBAL ERROR:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });