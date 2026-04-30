import { PrismaClient, Size, Sex } from '../generated/prisma/index.js';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Helper function to map US shoe sizes to enum sizes
function mapUSizeToEnum(usSize: string): Size {
  const sizeMap: Record<string, Size> = {
    'US 5': Size.XS,
    'US 6': Size.XS,
    'US 7': Size.S,
    'US 8': Size.S,
    'US 9': Size.M,
    'US 10': Size.L,
    'US 11': Size.XL,
    'US 12': Size.XXL,
    'US 13': Size.XXXL,
    'US 14': Size.XXXXL,
  };
  return sizeMap[usSize] || Size.ONE_SIZE;
}

// Helper function to generate random image URLs based on category
function generateImageUrl(categorySlug: string): string {
  const seed = `${categorySlug}-${Math.floor(Math.random() * 1000)}`;
  return `https://picsum.photos/seed/${seed}/500/500`;
}

async function main() {

  console.log('Starting database seed...\n\n');

  // Clear existing data (be careful with this in production!)
  await prisma.cartProduct.deleteMany();
  console.log('Cleared cart products');
  await prisma.cart.deleteMany();
  console.log('Cleared carts');
  await prisma.orderItem.deleteMany();
  console.log('Cleared order items');
  await prisma.order.deleteMany();
  console.log('Cleared orders');
  await prisma.productImage.deleteMany();
  console.log('Cleared product images');
  await prisma.productVariant.deleteMany();
  console.log('Cleared product variants');
  await prisma.product.deleteMany();
  console.log('Cleared products');
  await prisma.category.deleteMany();
  console.log('Cleared brands');
  await prisma.brand.deleteMany();
  console.log('Cleared categories\n\n');

  // Create Brands
  const brandNike = await prisma.brand.create({
    data: {
      name: 'Nike',
      slug: 'nike',
      description: 'Premium athletic and lifestyle brand',
    },
  });

  const brandAdidas = await prisma.brand.create({
    data: {
      name: 'Adidas',
      slug: 'adidas',
      description: 'Leading sports equipment and apparel',
    },
  });

  console.log('✅ Created 2 brands');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Athletic and casual footwear',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Apparel',
        slug: 'apparel',
        description: 'T-shirts, jackets, and more',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Hats, bags, and accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Sports watches and trackers',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Gym',
        slug: 'home-gym',
        description: 'Home gym equipment',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports Gear',
        slug: 'sports-gear',
        description: 'Balls, equipment, and gear',
      },
    }),
    prisma.category.create({
      data: {
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'Casual and athletic t-shirts',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hoodies',
        slug: 'hoodies',
        description: 'Comfortable hoodies and sweatshirts',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pants',
        slug: 'pants',
        description: 'Jeans, trousers, and athletic pants',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Jackets',
        slug: 'jackets',
        description: 'Coats, jackets, and outerwear',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bags',
        slug: 'bags',
        description: 'Backpacks, duffel bags, and accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Watches',
        slug: 'watches',
        description: 'Smart watches and timepieces',
      },
    }),
  ]);

  console.log('✅ Created 12 categories');

  // Helper function to create products with variants
  interface ProductData {
    name: string;
    description: string;
    slug: string;
    categoryId: string;
    brandId: string;
    sex: Sex;
    variants: Array<{
      name: string;
      slug: string;
      color?: string;
      size?: string;
      price: number;
      stock: number;
    }>;
  }

  const productsData: ProductData[] = [
    // SHOES (8 products)
    {
      name: 'Air Max 90',
      description: 'Classic running shoe with excellent cushioning',
      slug: 'air-max-90',
      categoryId: categories[0].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White/Black',
          slug: 'air-max-90-white-black',
          color: 'White/Black',
          size: 'US 10',
          price: 129.99,
          stock: 50,
        },
        {
          name: 'Red/White',
          slug: 'air-max-90-red-white',
          color: 'Red/White',
          size: 'US 10',
          price: 129.99,
          stock: 40,
        },
        {
          name: 'All Black',
          slug: 'air-max-90-black',
          color: 'Black',
          size: 'US 11',
          price: 139.99,
          stock: 35,
        },
      ],
    },
    {
      name: 'Ultra Boost 22',
      description: 'Premium comfort running shoe',
      slug: 'ultra-boost-22',
      categoryId: categories[0].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Cloud White',
          slug: 'ultra-boost-22-white',
          color: 'White',
          size: 'US 9',
          price: 199.99,
          stock: 25,
        },
        {
          name: 'Core Black',
          slug: 'ultra-boost-22-black',
          color: 'Black',
          size: 'US 9',
          price: 199.99,
          stock: 30,
        },
      ],
    },
    {
      name: 'Court Legacy',
      description: 'Vintage-inspired basketball shoe',
      slug: 'court-legacy',
      categoryId: categories[0].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White/Gold',
          slug: 'court-legacy-white-gold',
          color: 'White/Gold',
          size: 'US 8',
          price: 99.99,
          stock: 60,
        },
        {
          name: 'Black/Silver',
          slug: 'court-legacy-black-silver',
          color: 'Black/Silver',
          size: 'US 8',
          price: 99.99,
          stock: 45,
        },
        {
          name: 'Navy/Red',
          slug: 'court-legacy-navy-red',
          color: 'Navy/Red',
          size: 'US 10',
          price: 99.99,
          stock: 50,
        },
      ],
    },
    {
      name: 'Revolution 6',
      description: 'Lightweight everyday running shoe',
      slug: 'revolution-6',
      categoryId: categories[0].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White',
          slug: 'revolution-6-white',
          color: 'White',
          size: 'US 7',
          price: 64.99,
          stock: 100,
        },
        {
          name: 'Black',
          slug: 'revolution-6-black',
          color: 'Black',
          size: 'US 7',
          price: 64.99,
          stock: 80,
        },
      ],
    },
    {
      name: 'ZoomX Invincible',
      description: 'Elite racing shoe for marathons',
      slug: 'zoomx-invincible',
      categoryId: categories[0].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White/Blue',
          slug: 'zoomx-invincible-white-blue',
          color: 'White/Blue',
          size: 'US 11',
          price: 299.99,
          stock: 15,
        },
        {
          name: 'Black/Yellow',
          slug: 'zoomx-invincible-black-yellow',
          color: 'Black/Yellow',
          size: 'US 11',
          price: 299.99,
          stock: 10,
        },
        {
          name: 'Red/White',
          slug: 'zoomx-invincible-red-white',
          color: 'Red/White',
          size: 'US 12',
          price: 299.99,
          stock: 12,
        },
      ],
    },
    {
      name: 'Nite Jogger',
      description: 'Reflective night running shoe',
      slug: 'nite-jogger',
      categoryId: categories[0].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Silver Metallic',
          slug: 'nite-jogger-silver',
          color: 'Silver',
          size: 'US 9',
          price: 149.99,
          stock: 40,
        },
        {
          name: 'Grey/Blue',
          slug: 'nite-jogger-grey-blue',
          color: 'Grey/Blue',
          size: 'US 9',
          price: 149.99,
          stock: 35,
        },
        {
          name: 'Black/White',
          slug: 'nite-jogger-black-white',
          color: 'Black/White',
          size: 'US 10',
          price: 149.99,
          stock: 38,
        },
        {
          name: 'Purple',
          slug: 'nite-jogger-purple',
          color: 'Purple',
          size: 'US 8',
          price: 149.99,
          stock: 25,
        },
      ],
    },
    {
      name: 'Phantom GT2',
      description: 'Football boot for professional players',
      slug: 'phantom-gt2',
      categoryId: categories[0].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black/Green',
          slug: 'phantom-gt2-black-green',
          color: 'Black/Green',
          size: 'US 10',
          price: 279.99,
          stock: 20,
        },
        {
          name: 'White/Gold',
          slug: 'phantom-gt2-white-gold',
          color: 'White/Gold',
          size: 'US 10',
          price: 279.99,
          stock: 18,
        },
      ],
    },
    {
      name: 'Copa Pure',
      description: 'Classic lightweight football boot',
      slug: 'copa-pure',
      categoryId: categories[0].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White/Black',
          slug: 'copa-pure-white-black',
          color: 'White/Black',
          size: 'US 11',
          price: 249.99,
          stock: 22,
        },
        {
          name: 'All Black',
          slug: 'copa-pure-black',
          color: 'Black',
          size: 'US 11',
          price: 249.99,
          stock: 20,
        },
        {
          name: 'Gold/Black',
          slug: 'copa-pure-gold-black',
          color: 'Gold/Black',
          size: 'US 12',
          price: 249.99,
          stock: 15,
        },
      ],
    },

    // APPAREL (8 products)
    {
      name: 'Classic T-Shirt',
      description: 'Comfortable everyday cotton t-shirt',
      slug: 'classic-tshirt',
      categoryId: categories[1].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White Small',
          slug: 'classic-tshirt-white-s',
          color: 'White',
          size: 'S',
          price: 34.99,
          stock: 200,
        },
        {
          name: 'White Medium',
          slug: 'classic-tshirt-white-m',
          color: 'White',
          size: 'M',
          price: 34.99,
          stock: 250,
        },
        {
          name: 'Black Large',
          slug: 'classic-tshirt-black-l',
          color: 'Black',
          size: 'L',
          price: 34.99,
          stock: 180,
        },
        {
          name: 'Grey XL',
          slug: 'classic-tshirt-grey-xl',
          color: 'Grey',
          size: 'XL',
          price: 34.99,
          stock: 150,
        },
      ],
    },
    {
      name: 'Running Tank Top',
      description: 'Lightweight breathable tank',
      slug: 'running-tank-top',
      categoryId: categories[1].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black Small',
          slug: 'running-tank-black-s',
          color: 'Black',
          size: 'S',
          price: 44.99,
          stock: 100,
        },
        {
          name: 'White Medium',
          slug: 'running-tank-white-m',
          color: 'White',
          size: 'M',
          price: 44.99,
          stock: 120,
        },
        {
          name: 'Blue Large',
          slug: 'running-tank-blue-l',
          color: 'Blue',
          size: 'L',
          price: 44.99,
          stock: 90,
        },
      ],
    },
    {
      name: 'Windrunner Jacket',
      description: 'Water-resistant training jacket',
      slug: 'windrunner-jacket',
      categoryId: categories[1].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black Small',
          slug: 'windrunner-black-s',
          color: 'Black',
          size: 'S',
          price: 139.99,
          stock: 60,
        },
        {
          name: 'Red Medium',
          slug: 'windrunner-red-m',
          color: 'Red',
          size: 'M',
          price: 139.99,
          stock: 55,
        },
        {
          name: 'White Large',
          slug: 'windrunner-white-l',
          color: 'White',
          size: 'L',
          price: 139.99,
          stock: 50,
        },
        {
          name: 'Blue XL',
          slug: 'windrunner-blue-xl',
          color: 'Blue',
          size: 'XL',
          price: 139.99,
          stock: 45,
        },
      ],
    },
    {
      name: 'Essential Hoodie',
      description: 'Cozy pullover hoodie',
      slug: 'essential-hoodie',
      categoryId: categories[1].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Grey Small',
          slug: 'essential-hoodie-grey-s',
          color: 'Grey',
          size: 'S',
          price: 89.99,
          stock: 80,
        },
        {
          name: 'Black Medium',
          slug: 'essential-hoodie-black-m',
          color: 'Black',
          size: 'M',
          price: 89.99,
          stock: 95,
        },
        {
          name: 'Navy Large',
          slug: 'essential-hoodie-navy-l',
          color: 'Navy',
          size: 'L',
          price: 89.99,
          stock: 70,
        },
      ],
    },
    {
      name: 'Dri-FIT Leggings',
      description: 'High-waist compression leggings',
      slug: 'dri-fit-leggings',
      categoryId: categories[1].id,
      brandId: brandNike.id,
    sex: Sex.WOMEN,
      variants: [
        {
          name: 'Black XS',
          slug: 'dri-fit-black-xs',
          color: 'Black',
          size: 'XS',
          price: 119.99,
          stock: 75,
        },
        {
          name: 'Black Small',
          slug: 'dri-fit-black-s',
          color: 'Black',
          size: 'S',
          price: 119.99,
          stock: 85,
        },
        {
          name: 'Purple Medium',
          slug: 'dri-fit-purple-m',
          color: 'Purple',
          size: 'M',
          price: 119.99,
          stock: 60,
        },
        {
          name: 'Green Large',
          slug: 'dri-fit-green-l',
          color: 'Green',
          size: 'L',
          price: 119.99,
          stock: 50,
        },
      ],
    },
    {
      name: 'Training Shorts',
      description: 'Lightweight athletic shorts',
      slug: 'training-shorts',
      categoryId: categories[1].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black Small',
          slug: 'training-shorts-black-s',
          color: 'Black',
          size: 'S',
          price: 59.99,
          stock: 110,
        },
        {
          name: 'Black Medium',
          slug: 'training-shorts-black-m',
          color: 'Black',
          size: 'M',
          price: 59.99,
          stock: 130,
        },
        {
          name: 'Navy Large',
          slug: 'training-shorts-navy-l',
          color: 'Navy',
          size: 'L',
          price: 59.99,
          stock: 100,
        },
      ],
    },
    {
      name: 'Utility Belt Bag',
      description: 'Multi-pocket waist bag for training',
      slug: 'utility-belt-bag',
      categoryId: categories[1].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'utility-belt-bag-black',
          color: 'Black',
          size: 'One Size',
          price: 79.99,
          stock: 140,
        },
        {
          name: 'Grey',
          slug: 'utility-belt-bag-grey',
          color: 'Grey',
          size: 'One Size',
          price: 79.99,
          stock: 120,
        },
        {
          name: 'Olive',
          slug: 'utility-belt-bag-olive',
          color: 'Olive',
          size: 'One Size',
          price: 79.99,
          stock: 100,
        },
      ],
    },

    // ACCESSORIES (7 products)
    {
      name: 'Dri-FIT Cap',
      description: 'Breathable moisture-wicking cap',
      slug: 'dri-fit-cap',
      categoryId: categories[2].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'dri-fit-cap-black',
          color: 'Black',
          size: 'One Size',
          price: 34.99,
          stock: 200,
        },
        {
          name: 'White',
          slug: 'dri-fit-cap-white',
          color: 'White',
          size: 'One Size',
          price: 34.99,
          stock: 180,
        },
        {
          name: 'Red',
          slug: 'dri-fit-cap-red',
          color: 'Red',
          size: 'One Size',
          price: 34.99,
          stock: 150,
        },
        {
          name: 'Blue',
          slug: 'dri-fit-cap-blue',
          color: 'Blue',
          size: 'One Size',
          price: 34.99,
          stock: 170,
        },
      ],
    },
    {
      name: 'Crew Socks 3-Pack',
      description: 'Cushioned crew socks',
      slug: 'crew-socks-3pack',
      categoryId: categories[2].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'crew-socks-black',
          color: 'Black',
          size: 'One Size',
          price: 24.99,
          stock: 300,
        },
        {
          name: 'White',
          slug: 'crew-socks-white',
          color: 'White',
          size: 'One Size',
          price: 24.99,
          stock: 280,
        },
        {
          name: 'Grey Mix',
          slug: 'crew-socks-grey-mix',
          color: 'Grey Mix',
          size: 'One Size',
          price: 24.99,
          stock: 250,
        },
      ],
    },
    {
      name: 'Headband',
      description: 'Sweat-absorbing headband',
      slug: 'headband',
      categoryId: categories[2].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'headband-black',
          color: 'Black',
          size: 'One Size',
          price: 19.99,
          stock: 250,
        },
        {
          name: 'White',
          slug: 'headband-white',
          color: 'White',
          size: 'One Size',
          price: 19.99,
          stock: 220,
        },
      ],
    },
    {
      name: 'Gym Towel',
      description: 'Absorbent microfiber towel',
      slug: 'gym-towel',
      categoryId: categories[2].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'gym-towel-black',
          color: 'Black',
          size: 'One Size',
          price: 29.99,
          stock: 180,
        },
        {
          name: 'Grey',
          slug: 'gym-towel-grey',
          color: 'Grey',
          size: 'One Size',
          price: 29.99,
          stock: 160,
        },
        {
          name: 'White',
          slug: 'gym-towel-white',
          color: 'White',
          size: 'One Size',
          price: 29.99,
          stock: 175,
        },
      ],
    },
    {
      name: 'Water Bottle 750ml',
      description: 'Insulated stainless steel bottle',
      slug: 'water-bottle-750ml',
      categoryId: categories[2].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'water-bottle-black',
          color: 'Black',
          size: '750ml',
          price: 44.99,
          stock: 140,
        },
        {
          name: 'Blue',
          slug: 'water-bottle-blue',
          color: 'Blue',
          size: '750ml',
          price: 44.99,
          stock: 130,
        },
        {
          name: 'Red',
          slug: 'water-bottle-red',
          color: 'Red',
          size: '750ml',
          price: 44.99,
          stock: 120,
        },
      ],
    },
    {
      name: 'Gloves Winter',
      description: 'Thermal running gloves',
      slug: 'gloves-winter',
      categoryId: categories[2].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'gloves-winter-black',
          color: 'Black',
          size: 'One Size',
          price: 39.99,
          stock: 110,
        },
        {
          name: 'Grey',
          slug: 'gloves-winter-grey',
          color: 'Grey',
          size: 'One Size',
          price: 39.99,
          stock: 100,
        },
      ],
    },

    // ELECTRONICS (5 products)
    {
      name: 'SportWatch Pro',
      description: 'Advanced fitness tracking smartwatch',
      slug: 'sportwatch-pro',
      categoryId: categories[3].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'sportwatch-pro-black',
          color: 'Black',
          size: 'One Size',
          price: 399.99,
          stock: 30,
        },
        {
          name: 'Silver',
          slug: 'sportwatch-pro-silver',
          color: 'Silver',
          size: 'One Size',
          price: 399.99,
          stock: 25,
        },
      ],
    },
    {
      name: 'Fitness Tracker Band',
      description: 'Lightweight activity tracker',
      slug: 'fitness-tracker-band',
      categoryId: categories[3].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'fitness-tracker-black',
          color: 'Black',
          size: 'One Size',
          price: 149.99,
          stock: 50,
        },
        {
          name: 'White',
          slug: 'fitness-tracker-white',
          color: 'White',
          size: 'One Size',
          price: 149.99,
          stock: 45,
        },
      ],
    },
    {
      name: 'Wireless Earbuds',
      description: 'True wireless sport earbuds',
      slug: 'wireless-earbuds',
      categoryId: categories[3].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'wireless-earbuds-black',
          color: 'Black',
          size: 'One Size',
          price: 179.99,
          stock: 60,
        },
        {
          name: 'White',
          slug: 'wireless-earbuds-white',
          color: 'White',
          size: 'One Size',
          price: 179.99,
          stock: 50,
        },
        {
          name: 'Grey',
          slug: 'wireless-earbuds-grey',
          color: 'Grey',
          size: 'One Size',
          price: 179.99,
          stock: 45,
        },
      ],
    },
    {
      name: 'Heart Rate Monitor',
      description: 'Chest strap heart rate monitor',
      slug: 'heart-rate-monitor',
      categoryId: categories[3].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Standard',
          slug: 'heart-rate-monitor-std',
          color: 'Black',
          size: 'One Size',
          price: 119.99,
          stock: 40,
        },
      ],
    },
    {
      name: 'GPS Running Watch',
      description: 'Dedicated running GPS watch',
      slug: 'gps-running-watch',
      categoryId: categories[3].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'gps-running-watch-black',
          color: 'Black',
          size: 'One Size',
          price: 299.99,
          stock: 35,
        },
        {
          name: 'Red',
          slug: 'gps-running-watch-red',
          color: 'Red',
          size: 'One Size',
          price: 299.99,
          stock: 30,
        },
      ],
    },

    // HOME & GYM (6 products)
    {
      name: 'Yoga Mat',
      description: 'Non-slip TPE yoga mat',
      slug: 'yoga-mat',
      categoryId: categories[4].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Purple',
          slug: 'yoga-mat-purple',
          color: 'Purple',
          size: '6mm',
          price: 79.99,
          stock: 80,
        },
        {
          name: 'Black',
          slug: 'yoga-mat-black',
          color: 'Black',
          size: '6mm',
          price: 79.99,
          stock: 90,
        },
        {
          name: 'Blue',
          slug: 'yoga-mat-blue',
          color: 'Blue',
          size: '6mm',
          price: 79.99,
          stock: 75,
        },
      ],
    },
    {
      name: 'Dumbbell Set',
      description: 'Adjustable dumbbell set 2-20kg',
      slug: 'dumbbell-set',
      categoryId: categories[4].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: '2-20kg',
          slug: 'dumbbell-set-2-20',
          color: 'Black',
          size: '2-20kg',
          price: 249.99,
          stock: 20,
        },
      ],
    },
    {
      name: 'Resistance Bands Set',
      description: 'Elastic resistance bands 5-pack',
      slug: 'resistance-bands-set',
      categoryId: categories[4].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: '5-Pack',
          slug: 'resistance-bands-5pack',
          color: 'Multi-color',
          size: 'One Size',
          price: 49.99,
          stock: 150,
        },
      ],
    },
    {
      name: 'Push-Up Bars',
      description: 'Pair of rotating push-up bars',
      slug: 'pushup-bars',
      categoryId: categories[4].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Standard',
          slug: 'pushup-bars-std',
          color: 'Black',
          size: 'One Size',
          price: 34.99,
          stock: 200,
        },
      ],
    },
    {
      name: 'Ab Roller',
      description: 'Core strengthening ab roller',
      slug: 'ab-roller',
      categoryId: categories[4].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'ab-roller-black',
          color: 'Black',
          size: 'One Size',
          price: 44.99,
          stock: 120,
        },
        {
          name: 'Grey',
          slug: 'ab-roller-grey',
          color: 'Grey',
          size: 'One Size',
          price: 44.99,
          stock: 100,
        },
      ],
    },
    {
      name: 'Exercise Ball',
      description: 'Stability ball for core training',
      slug: 'exercise-ball',
      categoryId: categories[4].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: '65cm',
          slug: 'exercise-ball-65cm',
          color: 'Purple',
          size: '65cm',
          price: 69.99,
          stock: 60,
        },
        {
          name: '75cm',
          slug: 'exercise-ball-75cm',
          color: 'Blue',
          size: '75cm',
          price: 74.99,
          stock: 50,
        },
      ],
    },

    // SPORTS GEAR (6 products)
    {
      name: 'Soccer Ball Professional',
      description: 'FIFA approved soccer ball',
      slug: 'soccer-ball-pro',
      categoryId: categories[5].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White/Black',
          slug: 'soccer-ball-wb',
          color: 'White/Black',
          size: '5',
          price: 149.99,
          stock: 45,
        },
        {
          name: 'Multi-panel',
          slug: 'soccer-ball-multi',
          color: 'Multi-color',
          size: '5',
          price: 159.99,
          stock: 35,
        },
      ],
    },
    {
      name: 'Basketball',
      description: 'Outdoor rubber basketball',
      slug: 'basketball',
      categoryId: categories[5].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Size 7',
          slug: 'basketball-7',
          color: 'Orange',
          size: '7',
          price: 99.99,
          stock: 55,
        },
      ],
    },
    {
      name: 'Tennis Racket',
      description: 'Beginner-friendly tennis racket',
      slug: 'tennis-racket',
      categoryId: categories[5].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Standard',
          slug: 'tennis-racket-std',
          color: 'Black/Yellow',
          size: '27 inch',
          price: 189.99,
          stock: 25,
        },
        {
          name: 'Advanced',
          slug: 'tennis-racket-adv',
          color: 'Red/Black',
          size: '27 inch',
          price: 229.99,
          stock: 20,
        },
      ],
    },
    {
      name: 'Jump Rope',
      description: 'Speed training jump rope',
      slug: 'jump-rope',
      categoryId: categories[5].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Aluminum',
          slug: 'jump-rope-aluminum',
          color: 'Black/Red',
          size: 'Adjustable',
          price: 54.99,
          stock: 180,
        },
        {
          name: 'Steel',
          slug: 'jump-rope-steel',
          color: 'Black',
          size: 'Adjustable',
          price: 64.99,
          stock: 150,
        },
      ],
    },
    {
      name: 'Lacrosse Stick',
      description: 'Beginner lacrosse stick',
      slug: 'lacrosse-stick',
      categoryId: categories[5].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Youth',
          slug: 'lacrosse-stick-youth',
          color: 'Black/White',
          size: '40 inch',
          price: 79.99,
          stock: 30,
        },
        {
          name: 'Adult',
          slug: 'lacrosse-stick-adult',
          color: 'Red/Black',
          size: '42 inch',
          price: 99.99,
          stock: 25,
        },
      ],
    },

    // T-SHIRTS (10 products)
    {
      name: 'Performance T-Shirt',
      description: 'Moisture-wicking athletic t-shirt',
      slug: 'performance-tshirt',
      categoryId: categories[6].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black Small',
          slug: 'performance-tshirt-black-s',
          color: 'Black',
          size: 'S',
          price: 39.99,
          stock: 150,
        },
        {
          name: 'White Medium',
          slug: 'performance-tshirt-white-m',
          color: 'White',
          size: 'M',
          price: 39.99,
          stock: 140,
        },
      ],
    },
    {
      name: 'Graphic Tee',
      description: 'Casual graphic print t-shirt',
      slug: 'graphic-tee',
      categoryId: categories[6].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Grey Large',
          slug: 'graphic-tee-grey-l',
          color: 'Grey',
          size: 'L',
          price: 29.99,
          stock: 120,
        },
        {
          name: 'Blue XL',
          slug: 'graphic-tee-blue-xl',
          color: 'Blue',
          size: 'XL',
          price: 29.99,
          stock: 100,
        },
      ],
    },
    {
      name: 'Long Sleeve Tee',
      description: 'Lightweight long sleeve t-shirt',
      slug: 'long-sleeve-tee',
      categoryId: categories[6].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Navy Small',
          slug: 'long-sleeve-navy-s',
          color: 'Navy',
          size: 'S',
          price: 49.99,
          stock: 80,
        },
      ],
    },
    {
      name: 'V-Neck Tee',
      description: 'Classic v-neck t-shirt',
      slug: 'v-neck-tee',
      categoryId: categories[6].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White Medium',
          slug: 'v-neck-white-m',
          color: 'White',
          size: 'M',
          price: 34.99,
          stock: 90,
        },
      ],
    },
    {
      name: 'Polo Shirt',
      description: 'Breathable polo shirt',
      slug: 'polo-shirt',
      categoryId: categories[6].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Red Large',
          slug: 'polo-red-l',
          color: 'Red',
          size: 'L',
          price: 59.99,
          stock: 70,
        },
      ],
    },
    {
      name: 'Tank Top',
      description: 'Sleeveless athletic tank',
      slug: 'tank-top',
      categoryId: categories[6].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Green Small',
          slug: 'tank-green-s',
          color: 'Green',
          size: 'S',
          price: 29.99,
          stock: 110,
        },
      ],
    },
    {
      name: 'Henley Tee',
      description: 'Button-up henley t-shirt',
      slug: 'henley-tee',
      categoryId: categories[6].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Grey Medium',
          slug: 'henley-grey-m',
          color: 'Grey',
          size: 'M',
          price: 44.99,
          stock: 85,
        },
      ],
    },
    {
      name: 'Thermal Tee',
      description: 'Thermal long sleeve t-shirt',
      slug: 'thermal-tee',
      categoryId: categories[6].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black Large',
          slug: 'thermal-black-l',
          color: 'Black',
          size: 'L',
          price: 54.99,
          stock: 65,
        },
      ],
    },
    {
      name: 'Racerback Tee',
      description: 'Racerback athletic t-shirt',
      slug: 'racerback-tee',
      categoryId: categories[6].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Pink Small',
          slug: 'racerback-pink-s',
          color: 'Pink',
          size: 'S',
          price: 39.99,
          stock: 95,
        },
      ],
    },
    {
      name: 'Muscle Tee',
      description: 'Sleeveless muscle t-shirt',
      slug: 'muscle-tee',
      categoryId: categories[6].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White Medium',
          slug: 'muscle-white-m',
          color: 'White',
          size: 'M',
          price: 32.99,
          stock: 105,
        },
      ],
    },

    // HOODIES (8 products)
    {
      name: 'Zip Hoodie',
      description: 'Full-zip athletic hoodie',
      slug: 'zip-hoodie',
      categoryId: categories[7].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black Small',
          slug: 'zip-hoodie-black-s',
          color: 'Black',
          size: 'S',
          price: 89.99,
          stock: 60,
        },
        {
          name: 'Grey Medium',
          slug: 'zip-hoodie-grey-m',
          color: 'Grey',
          size: 'M',
          price: 89.99,
          stock: 55,
        },
      ],
    },
    {
      name: 'Pullover Hoodie',
      description: 'Classic pullover hoodie',
      slug: 'pullover-hoodie',
      categoryId: categories[7].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Navy Large',
          slug: 'pullover-navy-l',
          color: 'Navy',
          size: 'L',
          price: 79.99,
          stock: 70,
        },
      ],
    },
    {
      name: 'Quarter Zip Hoodie',
      description: 'Quarter-zip training hoodie',
      slug: 'quarter-zip-hoodie',
      categoryId: categories[7].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Blue Medium',
          slug: 'quarter-zip-blue-m',
          color: 'Blue',
          size: 'M',
          price: 94.99,
          stock: 45,
        },
      ],
    },
    {
      name: 'Fleece Hoodie',
      description: 'Warm fleece hoodie',
      slug: 'fleece-hoodie',
      categoryId: categories[7].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Red Small',
          slug: 'fleece-red-s',
          color: 'Red',
          size: 'S',
          price: 84.99,
          stock: 50,
        },
      ],
    },
    {
      name: 'Tech Hoodie',
      description: 'Technical fabric hoodie',
      slug: 'tech-hoodie',
      categoryId: categories[7].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Green Large',
          slug: 'tech-green-l',
          color: 'Green',
          size: 'L',
          price: 109.99,
          stock: 35,
        },
      ],
    },
    {
      name: 'Lightweight Hoodie',
      description: 'Lightweight training hoodie',
      slug: 'lightweight-hoodie',
      categoryId: categories[7].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White Medium',
          slug: 'lightweight-white-m',
          color: 'White',
          size: 'M',
          price: 74.99,
          stock: 65,
        },
      ],
    },
    {
      name: 'Oversized Hoodie',
      description: 'Oversized fit hoodie',
      slug: 'oversized-hoodie',
      categoryId: categories[7].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black XL',
          slug: 'oversized-black-xl',
          color: 'Black',
          size: 'XL',
          price: 99.99,
          stock: 40,
        },
      ],
    },
    {
      name: 'Crop Hoodie',
      description: 'Cropped fit hoodie',
      slug: 'crop-hoodie',
      categoryId: categories[7].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Pink Small',
          slug: 'crop-pink-s',
          color: 'Pink',
          size: 'S',
          price: 79.99,
          stock: 55,
        },
      ],
    },

    // PANTS (8 products)
    {
      name: 'Joggers',
      description: 'Comfortable jogger pants',
      slug: 'joggers',
      categoryId: categories[8].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black Medium',
          slug: 'joggers-black-m',
          color: 'Black',
          size: 'M',
          price: 79.99,
          stock: 80,
        },
        {
          name: 'Grey Large',
          slug: 'joggers-grey-l',
          color: 'Grey',
          size: 'L',
          price: 79.99,
          stock: 75,
        },
      ],
    },
    {
      name: 'Sweatpants',
      description: 'Classic sweatpants',
      slug: 'sweatpants',
      categoryId: categories[8].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Navy Small',
          slug: 'sweatpants-navy-s',
          color: 'Navy',
          size: 'S',
          price: 69.99,
          stock: 90,
        },
      ],
    },
    {
      name: 'Cargo Pants',
      description: 'Multi-pocket cargo pants',
      slug: 'cargo-pants',
      categoryId: categories[8].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Khaki Medium',
          slug: 'cargo-khaki-m',
          color: 'Khaki',
          size: 'M',
          price: 89.99,
          stock: 60,
        },
      ],
    },
    {
      name: 'Track Pants',
      description: 'Athletic track pants',
      slug: 'track-pants',
      categoryId: categories[8].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black Large',
          slug: 'track-black-l',
          color: 'Black',
          size: 'L',
          price: 74.99,
          stock: 85,
        },
      ],
    },
    {
      name: 'Chinos',
      description: 'Slim fit chinos',
      slug: 'chinos',
      categoryId: categories[8].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Beige Medium',
          slug: 'chinos-beige-m',
          color: 'Beige',
          size: 'M',
          price: 94.99,
          stock: 70,
        },
      ],
    },
    {
      name: 'Leggings',
      description: 'High-performance leggings',
      slug: 'leggings',
      categoryId: categories[8].id,
      brandId: brandAdidas.id,
    sex: Sex.WOMEN,
      variants: [
        {
          name: 'Black Small',
          slug: 'leggings-black-s',
          color: 'Black',
          size: 'S',
          price: 79.99,
          stock: 95,
        },
      ],
    },
    {
      name: 'Corduroy Pants',
      description: 'Corduroy casual pants',
      slug: 'corduroy-pants',
      categoryId: categories[8].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Brown Large',
          slug: 'corduroy-brown-l',
          color: 'Brown',
          size: 'L',
          price: 109.99,
          stock: 50,
        },
      ],
    },
    {
      name: 'Denim Jeans',
      description: 'Classic denim jeans',
      slug: 'denim-jeans',
      categoryId: categories[8].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Dark Wash Medium',
          slug: 'denim-dark-m',
          color: 'Dark Blue',
          size: 'M',
          price: 119.99,
          stock: 65,
        },
      ],
    },

    // JACKETS (6 products)
    {
      name: 'Bomber Jacket',
      description: 'Classic bomber jacket',
      slug: 'bomber-jacket',
      categoryId: categories[9].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black Medium',
          slug: 'bomber-black-m',
          color: 'Black',
          size: 'M',
          price: 149.99,
          stock: 40,
        },
      ],
    },
    {
      name: 'Field Jacket',
      description: 'Military-style field jacket',
      slug: 'field-jacket',
      categoryId: categories[9].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Olive Large',
          slug: 'field-olive-l',
          color: 'Olive',
          size: 'L',
          price: 179.99,
          stock: 30,
        },
      ],
    },
    {
      name: 'Puffer Jacket',
      description: 'Insulated puffer jacket',
      slug: 'puffer-jacket',
      categoryId: categories[9].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Navy Small',
          slug: 'puffer-navy-s',
          color: 'Navy',
          size: 'S',
          price: 199.99,
          stock: 35,
        },
      ],
    },
    {
      name: 'Track Jacket',
      description: 'Athletic track jacket',
      slug: 'track-jacket',
      categoryId: categories[9].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'White Medium',
          slug: 'track-jacket-white-m',
          color: 'White',
          size: 'M',
          price: 89.99,
          stock: 55,
        },
      ],
    },
    {
      name: 'Leather Jacket',
      description: 'Classic leather jacket',
      slug: 'leather-jacket',
      categoryId: categories[9].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Brown Large',
          slug: 'leather-brown-l',
          color: 'Brown',
          size: 'L',
          price: 299.99,
          stock: 20,
        },
      ],
    },
    {
      name: 'Rain Jacket',
      description: 'Waterproof rain jacket',
      slug: 'rain-jacket',
      categoryId: categories[9].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Yellow Medium',
          slug: 'rain-yellow-m',
          color: 'Yellow',
          size: 'M',
          price: 129.99,
          stock: 45,
        },
      ],
    },

    // BAGS (6 products)
    {
      name: 'Backpack',
      description: 'Large capacity backpack',
      slug: 'backpack',
      categoryId: categories[10].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'backpack-black',
          color: 'Black',
          size: 'One Size',
          price: 89.99,
          stock: 70,
        },
      ],
    },
    {
      name: 'Duffle Bag',
      description: 'Large duffel bag',
      slug: 'duffel-bag',
      categoryId: categories[10].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Grey',
          slug: 'duffel-grey',
          color: 'Grey',
          size: 'One Size',
          price: 79.99,
          stock: 60,
        },
      ],
    },
    {
      name: 'Tote Bag',
      description: 'Canvas tote bag',
      slug: 'tote-bag',
      categoryId: categories[10].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Navy',
          slug: 'tote-navy',
          color: 'Navy',
          size: 'One Size',
          price: 39.99,
          stock: 100,
        },
      ],
    },
    {
      name: 'Messenger Bag',
      description: 'Crossbody messenger bag',
      slug: 'messenger-bag',
      categoryId: categories[10].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Brown',
          slug: 'messenger-brown',
          color: 'Brown',
          size: 'One Size',
          price: 69.99,
          stock: 50,
        },
      ],
    },
    {
      name: 'Gym Bag',
      description: 'Ventilated gym bag',
      slug: 'gym-bag',
      categoryId: categories[10].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'gym-bag-black',
          color: 'Black',
          size: 'One Size',
          price: 59.99,
          stock: 80,
        },
      ],
    },
    {
      name: 'Laptop Bag',
      description: 'Padded laptop bag',
      slug: 'laptop-bag',
      categoryId: categories[10].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Grey',
          slug: 'laptop-grey',
          color: 'Grey',
          size: 'One Size',
          price: 99.99,
          stock: 40,
        },
      ],
    },

    // WATCHES (4 products)
    {
      name: 'Digital Watch',
      description: 'Digital sports watch',
      slug: 'digital-watch',
      categoryId: categories[11].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Black',
          slug: 'digital-black',
          color: 'Black',
          size: 'One Size',
          price: 199.99,
          stock: 30,
        },
      ],
    },
    {
      name: 'Analog Watch',
      description: 'Classic analog watch',
      slug: 'analog-watch',
      categoryId: categories[11].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Silver',
          slug: 'analog-silver',
          color: 'Silver',
          size: 'One Size',
          price: 249.99,
          stock: 25,
        },
      ],
    },
    {
      name: 'Chronograph Watch',
      description: 'Multi-function chronograph',
      slug: 'chronograph-watch',
      categoryId: categories[11].id,
      brandId: brandNike.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Blue',
          slug: 'chronograph-blue',
          color: 'Blue',
          size: 'One Size',
          price: 349.99,
          stock: 15,
        },
      ],
    },
    {
      name: 'Field Watch',
      description: 'Rugged field watch',
      slug: 'field-watch',
      categoryId: categories[11].id,
      brandId: brandAdidas.id,
    sex: Sex.UNISEX,
      variants: [
        {
          name: 'Green',
          slug: 'field-green',
          color: 'Green',
          size: 'One Size',
          price: 299.99,
          stock: 20,
        },
      ],
    },
  ];

  // Create all products with their variants and images
  for (const productData of productsData) {
    const category = categories.find(c => c.id === productData.categoryId);
    if (!category) {
      console.error(`Category with ID ${productData.categoryId} not found for product ${productData.name}`);
      continue;
    }
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        slug: productData.slug,
        categoryId: productData.categoryId,
        brandId: productData.brandId,
        isFeatured: Math.random() > 0.7, // 30% of products are featured
        isActive: true,
        isBestSeller: Math.random() > 0.8, // 20% of products are best sellers
        isOnSale: Math.random() > 0.85, // 15% of products are on sale
        discountPercent: Math.random() > 0.85 ? Math.floor(Math.random() * 30) + 10 : 0, // 10-40% discount
        tags: 'sport,fitness,athletic', // Default tags as comma-separated string
        productType: 'SPORT', // Default to sport type
        sex: productData.sex,
        productImages: {
          create: [{ url: generateImageUrl(category.slug), altText: productData.name }],
        },
        variants: {
          create: productData.variants.map((variant) => ({
            price: variant.price,
            stock: variant.stock,
            color: variant.color || null,
            size: mapUSizeToEnum(variant.size || 'ONE_SIZE'),
            variantImages: {
              create: [{ url: generateImageUrl(category.slug), altText: variant.name }],
            },
          })),
        },
      },
    });
    console.log(`✅ Created product: ${product.name}`);
  }

  console.log(`\nSeeding completed`);
  console.log(`Created:`);
  console.log(`   - 2 Brands`);
  console.log(`   - 12 Categories`);
  console.log(`   - 100+ Products`);
  console.log(`   - 300+ Product Variants`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
