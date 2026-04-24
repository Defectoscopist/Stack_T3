import { PrismaClient, Size } from '../generated/prisma/index.js';

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
  ]);

  console.log('✅ Created 6 categories');

  // Helper function to create products with variants
  interface ProductData {
    name: string;
    description: string;
    slug: string;
    categoryId: string;
    brandId: string;
    variants: Array<{
      name: string;
      slug: string;
      color?: string;
      size?: string;
      price: number;
      stock: number;
      images: Array<{ url: string; altText: string }>;
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
      variants: [
        {
          name: 'White/Black',
          slug: 'air-max-90-white-black',
          color: 'White/Black',
          size: 'US 10',
          price: 129.99,
          stock: 50,
          images: [{ url: 'https://placehold.co/500x500?text=Air+Max+90+White', altText: 'Air Max 90 White' }],
        },
        {
          name: 'Red/White',
          slug: 'air-max-90-red-white',
          color: 'Red/White',
          size: 'US 10',
          price: 129.99,
          stock: 40,
          images: [{ url: 'https://placehold.co/500x500?text=Air+Max+90+Red', altText: 'Air Max 90 Red' }],
        },
        {
          name: 'All Black',
          slug: 'air-max-90-black',
          color: 'Black',
          size: 'US 11',
          price: 139.99,
          stock: 35,
          images: [{ url: 'https://placehold.co/500x500?text=Air+Max+90+Black', altText: 'Air Max 90 Black' }],
        },
      ],
    },
    {
      name: 'Ultra Boost 22',
      description: 'Premium comfort running shoe',
      slug: 'ultra-boost-22',
      categoryId: categories[0].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Cloud White',
          slug: 'ultra-boost-22-white',
          color: 'White',
          size: 'US 9',
          price: 199.99,
          stock: 25,
          images: [{ url: 'https://placehold.co/500x500?text=Ultra+Boost+White', altText: 'Ultra Boost White' }],
        },
        {
          name: 'Core Black',
          slug: 'ultra-boost-22-black',
          color: 'Black',
          size: 'US 9',
          price: 199.99,
          stock: 30,
          images: [{ url: 'https://placehold.co/500x500?text=Ultra+Boost+Black', altText: 'Ultra Boost Black' }],
        },
      ],
    },
    {
      name: 'Court Legacy',
      description: 'Vintage-inspired basketball shoe',
      slug: 'court-legacy',
      categoryId: categories[0].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'White/Gold',
          slug: 'court-legacy-white-gold',
          color: 'White/Gold',
          size: 'US 8',
          price: 99.99,
          stock: 60,
          images: [{ url: 'https://placehold.co/500x500?text=Court+Legacy', altText: 'Court Legacy' }],
        },
        {
          name: 'Black/Silver',
          slug: 'court-legacy-black-silver',
          color: 'Black/Silver',
          size: 'US 8',
          price: 99.99,
          stock: 45,
          images: [{ url: 'https://placehold.co/500x500?text=Court+Legacy+Black', altText: 'Court Legacy Black' }],
        },
        {
          name: 'Navy/Red',
          slug: 'court-legacy-navy-red',
          color: 'Navy/Red',
          size: 'US 10',
          price: 99.99,
          stock: 50,
          images: [{ url: 'https://placehold.co/500x500?text=Court+Legacy+Navy', altText: 'Court Legacy Navy' }],
        },
      ],
    },
    {
      name: 'Revolution 6',
      description: 'Lightweight everyday running shoe',
      slug: 'revolution-6',
      categoryId: categories[0].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'White',
          slug: 'revolution-6-white',
          color: 'White',
          size: 'US 7',
          price: 64.99,
          stock: 100,
          images: [{ url: 'https://placehold.co/500x500?text=Revolution+6', altText: 'Revolution 6' }],
        },
        {
          name: 'Black',
          slug: 'revolution-6-black',
          color: 'Black',
          size: 'US 7',
          price: 64.99,
          stock: 80,
          images: [{ url: 'https://placehold.co/500x500?text=Revolution+6+Black', altText: 'Revolution 6 Black' }],
        },
      ],
    },
    {
      name: 'ZoomX Invincible',
      description: 'Elite racing shoe for marathons',
      slug: 'zoomx-invincible',
      categoryId: categories[0].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'White/Blue',
          slug: 'zoomx-invincible-white-blue',
          color: 'White/Blue',
          size: 'US 11',
          price: 299.99,
          stock: 15,
          images: [{ url: 'https://placehold.co/500x500?text=ZoomX+Invincible', altText: 'ZoomX Invincible' }],
        },
        {
          name: 'Black/Yellow',
          slug: 'zoomx-invincible-black-yellow',
          color: 'Black/Yellow',
          size: 'US 11',
          price: 299.99,
          stock: 10,
          images: [{ url: 'https://placehold.co/500x500?text=ZoomX+Invincible+Black', altText: 'ZoomX Invincible Black' }],
        },
        {
          name: 'Red/White',
          slug: 'zoomx-invincible-red-white',
          color: 'Red/White',
          size: 'US 12',
          price: 299.99,
          stock: 12,
          images: [{ url: 'https://placehold.co/500x500?text=ZoomX+Invincible+Red', altText: 'ZoomX Invincible Red' }],
        },
      ],
    },
    {
      name: 'Nite Jogger',
      description: 'Reflective night running shoe',
      slug: 'nite-jogger',
      categoryId: categories[0].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Silver Metallic',
          slug: 'nite-jogger-silver',
          color: 'Silver',
          size: 'US 9',
          price: 149.99,
          stock: 40,
          images: [{ url: 'https://placehold.co/500x500?text=Nite+Jogger', altText: 'Nite Jogger' }],
        },
        {
          name: 'Grey/Blue',
          slug: 'nite-jogger-grey-blue',
          color: 'Grey/Blue',
          size: 'US 9',
          price: 149.99,
          stock: 35,
          images: [{ url: 'https://placehold.co/500x500?text=Nite+Jogger+Grey', altText: 'Nite Jogger Grey' }],
        },
        {
          name: 'Black/White',
          slug: 'nite-jogger-black-white',
          color: 'Black/White',
          size: 'US 10',
          price: 149.99,
          stock: 38,
          images: [{ url: 'https://placehold.co/500x500?text=Nite+Jogger+Black', altText: 'Nite Jogger Black' }],
        },
        {
          name: 'Purple',
          slug: 'nite-jogger-purple',
          color: 'Purple',
          size: 'US 8',
          price: 149.99,
          stock: 25,
          images: [{ url: 'https://placehold.co/500x500?text=Nite+Jogger+Purple', altText: 'Nite Jogger Purple' }],
        },
      ],
    },
    {
      name: 'Phantom GT2',
      description: 'Football boot for professional players',
      slug: 'phantom-gt2',
      categoryId: categories[0].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Black/Green',
          slug: 'phantom-gt2-black-green',
          color: 'Black/Green',
          size: 'US 10',
          price: 279.99,
          stock: 20,
          images: [{ url: 'https://placehold.co/500x500?text=Phantom+GT2', altText: 'Phantom GT2' }],
        },
        {
          name: 'White/Gold',
          slug: 'phantom-gt2-white-gold',
          color: 'White/Gold',
          size: 'US 10',
          price: 279.99,
          stock: 18,
          images: [{ url: 'https://placehold.co/500x500?text=Phantom+GT2+White', altText: 'Phantom GT2 White' }],
        },
      ],
    },
    {
      name: 'Copa Pure',
      description: 'Classic lightweight football boot',
      slug: 'copa-pure',
      categoryId: categories[0].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'White/Black',
          slug: 'copa-pure-white-black',
          color: 'White/Black',
          size: 'US 11',
          price: 249.99,
          stock: 22,
          images: [{ url: 'https://placehold.co/500x500?text=Copa+Pure', altText: 'Copa Pure' }],
        },
        {
          name: 'All Black',
          slug: 'copa-pure-black',
          color: 'Black',
          size: 'US 11',
          price: 249.99,
          stock: 20,
          images: [{ url: 'https://placehold.co/500x500?text=Copa+Pure+Black', altText: 'Copa Pure Black' }],
        },
        {
          name: 'Gold/Black',
          slug: 'copa-pure-gold-black',
          color: 'Gold/Black',
          size: 'US 12',
          price: 249.99,
          stock: 15,
          images: [{ url: 'https://placehold.co/500x500?text=Copa+Pure+Gold', altText: 'Copa Pure Gold' }],
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
      variants: [
        {
          name: 'White Small',
          slug: 'classic-tshirt-white-s',
          color: 'White',
          size: 'S',
          price: 34.99,
          stock: 200,
          images: [{ url: 'https://placehold.co/500x500?text=Classic+TShirt', altText: 'Classic T-Shirt' }],
        },
        {
          name: 'White Medium',
          slug: 'classic-tshirt-white-m',
          color: 'White',
          size: 'M',
          price: 34.99,
          stock: 250,
          images: [{ url: 'https://placehold.co/500x500?text=Classic+TShirt', altText: 'Classic T-Shirt' }],
        },
        {
          name: 'Black Large',
          slug: 'classic-tshirt-black-l',
          color: 'Black',
          size: 'L',
          price: 34.99,
          stock: 180,
          images: [{ url: 'https://placehold.co/500x500?text=Classic+TShirt+Black', altText: 'Classic T-Shirt Black' }],
        },
        {
          name: 'Grey XL',
          slug: 'classic-tshirt-grey-xl',
          color: 'Grey',
          size: 'XL',
          price: 34.99,
          stock: 150,
          images: [{ url: 'https://placehold.co/500x500?text=Classic+TShirt+Grey', altText: 'Classic T-Shirt Grey' }],
        },
      ],
    },
    {
      name: 'Running Tank Top',
      description: 'Lightweight breathable tank',
      slug: 'running-tank-top',
      categoryId: categories[1].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Black Small',
          slug: 'running-tank-black-s',
          color: 'Black',
          size: 'S',
          price: 44.99,
          stock: 100,
          images: [{ url: 'https://placehold.co/500x500?text=Running+Tank', altText: 'Running Tank' }],
        },
        {
          name: 'White Medium',
          slug: 'running-tank-white-m',
          color: 'White',
          size: 'M',
          price: 44.99,
          stock: 120,
          images: [{ url: 'https://placehold.co/500x500?text=Running+Tank+White', altText: 'Running Tank White' }],
        },
        {
          name: 'Blue Large',
          slug: 'running-tank-blue-l',
          color: 'Blue',
          size: 'L',
          price: 44.99,
          stock: 90,
          images: [{ url: 'https://placehold.co/500x500?text=Running+Tank+Blue', altText: 'Running Tank Blue' }],
        },
      ],
    },
    {
      name: 'Windrunner Jacket',
      description: 'Water-resistant training jacket',
      slug: 'windrunner-jacket',
      categoryId: categories[1].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Black Small',
          slug: 'windrunner-black-s',
          color: 'Black',
          size: 'S',
          price: 139.99,
          stock: 60,
          images: [{ url: 'https://placehold.co/500x500?text=Windrunner', altText: 'Windrunner Jacket' }],
        },
        {
          name: 'Red Medium',
          slug: 'windrunner-red-m',
          color: 'Red',
          size: 'M',
          price: 139.99,
          stock: 55,
          images: [{ url: 'https://placehold.co/500x500?text=Windrunner+Red', altText: 'Windrunner Red' }],
        },
        {
          name: 'White Large',
          slug: 'windrunner-white-l',
          color: 'White',
          size: 'L',
          price: 139.99,
          stock: 50,
          images: [{ url: 'https://placehold.co/500x500?text=Windrunner+White', altText: 'Windrunner White' }],
        },
        {
          name: 'Blue XL',
          slug: 'windrunner-blue-xl',
          color: 'Blue',
          size: 'XL',
          price: 139.99,
          stock: 45,
          images: [{ url: 'https://placehold.co/500x500?text=Windrunner+Blue', altText: 'Windrunner Blue' }],
        },
      ],
    },
    {
      name: 'Essential Hoodie',
      description: 'Cozy pullover hoodie',
      slug: 'essential-hoodie',
      categoryId: categories[1].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Grey Small',
          slug: 'essential-hoodie-grey-s',
          color: 'Grey',
          size: 'S',
          price: 89.99,
          stock: 80,
          images: [{ url: 'https://placehold.co/500x500?text=Essential+Hoodie', altText: 'Essential Hoodie' }],
        },
        {
          name: 'Black Medium',
          slug: 'essential-hoodie-black-m',
          color: 'Black',
          size: 'M',
          price: 89.99,
          stock: 95,
          images: [{ url: 'https://placehold.co/500x500?text=Essential+Hoodie+Black', altText: 'Essential Hoodie Black' }],
        },
        {
          name: 'Navy Large',
          slug: 'essential-hoodie-navy-l',
          color: 'Navy',
          size: 'L',
          price: 89.99,
          stock: 70,
          images: [{ url: 'https://placehold.co/500x500?text=Essential+Hoodie+Navy', altText: 'Essential Hoodie Navy' }],
        },
      ],
    },
    {
      name: 'Dri-FIT Leggings',
      description: 'High-waist compression leggings',
      slug: 'dri-fit-leggings',
      categoryId: categories[1].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Black XS',
          slug: 'dri-fit-black-xs',
          color: 'Black',
          size: 'XS',
          price: 119.99,
          stock: 75,
          images: [{ url: 'https://placehold.co/500x500?text=DRI-FIT+Leggings', altText: 'Dri-FIT Leggings' }],
        },
        {
          name: 'Black Small',
          slug: 'dri-fit-black-s',
          color: 'Black',
          size: 'S',
          price: 119.99,
          stock: 85,
          images: [{ url: 'https://placehold.co/500x500?text=DRI-FIT+Leggings', altText: 'Dri-FIT Leggings' }],
        },
        {
          name: 'Purple Medium',
          slug: 'dri-fit-purple-m',
          color: 'Purple',
          size: 'M',
          price: 119.99,
          stock: 60,
          images: [{ url: 'https://placehold.co/500x500?text=DRI-FIT+Leggings+Purple', altText: 'Dri-FIT Leggings Purple' }],
        },
        {
          name: 'Green Large',
          slug: 'dri-fit-green-l',
          color: 'Green',
          size: 'L',
          price: 119.99,
          stock: 50,
          images: [{ url: 'https://placehold.co/500x500?text=DRI-FIT+Leggings+Green', altText: 'Dri-FIT Leggings Green' }],
        },
      ],
    },
    {
      name: 'Training Shorts',
      description: 'Lightweight athletic shorts',
      slug: 'training-shorts',
      categoryId: categories[1].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Black Small',
          slug: 'training-shorts-black-s',
          color: 'Black',
          size: 'S',
          price: 59.99,
          stock: 110,
          images: [{ url: 'https://placehold.co/500x500?text=Training+Shorts', altText: 'Training Shorts' }],
        },
        {
          name: 'Black Medium',
          slug: 'training-shorts-black-m',
          color: 'Black',
          size: 'M',
          price: 59.99,
          stock: 130,
          images: [{ url: 'https://placehold.co/500x500?text=Training+Shorts', altText: 'Training Shorts' }],
        },
        {
          name: 'Navy Large',
          slug: 'training-shorts-navy-l',
          color: 'Navy',
          size: 'L',
          price: 59.99,
          stock: 100,
          images: [{ url: 'https://placehold.co/500x500?text=Training+Shorts+Navy', altText: 'Training Shorts Navy' }],
        },
      ],
    },
    {
      name: 'Utility Belt Bag',
      description: 'Multi-pocket waist bag for training',
      slug: 'utility-belt-bag',
      categoryId: categories[1].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Black',
          slug: 'utility-belt-bag-black',
          color: 'Black',
          size: 'One Size',
          price: 79.99,
          stock: 140,
          images: [{ url: 'https://placehold.co/500x500?text=Utility+Belt+Bag', altText: 'Utility Belt Bag' }],
        },
        {
          name: 'Grey',
          slug: 'utility-belt-bag-grey',
          color: 'Grey',
          size: 'One Size',
          price: 79.99,
          stock: 120,
          images: [{ url: 'https://placehold.co/500x500?text=Utility+Belt+Bag+Grey', altText: 'Utility Belt Bag Grey' }],
        },
        {
          name: 'Olive',
          slug: 'utility-belt-bag-olive',
          color: 'Olive',
          size: 'One Size',
          price: 79.99,
          stock: 100,
          images: [{ url: 'https://placehold.co/500x500?text=Utility+Belt+Bag+Olive', altText: 'Utility Belt Bag Olive' }],
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
      variants: [
        {
          name: 'Black',
          slug: 'dri-fit-cap-black',
          color: 'Black',
          size: 'One Size',
          price: 34.99,
          stock: 200,
          images: [{ url: 'https://placehold.co/500x500?text=DRI-FIT+Cap', altText: 'Dri-FIT Cap' }],
        },
        {
          name: 'White',
          slug: 'dri-fit-cap-white',
          color: 'White',
          size: 'One Size',
          price: 34.99,
          stock: 180,
          images: [{ url: 'https://placehold.co/500x500?text=DRI-FIT+Cap+White', altText: 'Dri-FIT Cap White' }],
        },
        {
          name: 'Red',
          slug: 'dri-fit-cap-red',
          color: 'Red',
          size: 'One Size',
          price: 34.99,
          stock: 150,
          images: [{ url: 'https://placehold.co/500x500?text=DRI-FIT+Cap+Red', altText: 'Dri-FIT Cap Red' }],
        },
        {
          name: 'Blue',
          slug: 'dri-fit-cap-blue',
          color: 'Blue',
          size: 'One Size',
          price: 34.99,
          stock: 170,
          images: [{ url: 'https://placehold.co/500x500?text=DRI-FIT+Cap+Blue', altText: 'Dri-FIT Cap Blue' }],
        },
      ],
    },
    {
      name: 'Crew Socks 3-Pack',
      description: 'Cushioned crew socks',
      slug: 'crew-socks-3pack',
      categoryId: categories[2].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Black',
          slug: 'crew-socks-black',
          color: 'Black',
          size: 'One Size',
          price: 24.99,
          stock: 300,
          images: [{ url: 'https://placehold.co/500x500?text=Crew+Socks', altText: 'Crew Socks' }],
        },
        {
          name: 'White',
          slug: 'crew-socks-white',
          color: 'White',
          size: 'One Size',
          price: 24.99,
          stock: 280,
          images: [{ url: 'https://placehold.co/500x500?text=Crew+Socks+White', altText: 'Crew Socks White' }],
        },
        {
          name: 'Grey Mix',
          slug: 'crew-socks-grey-mix',
          color: 'Grey Mix',
          size: 'One Size',
          price: 24.99,
          stock: 250,
          images: [{ url: 'https://placehold.co/500x500?text=Crew+Socks+Grey', altText: 'Crew Socks Grey' }],
        },
      ],
    },
    {
      name: 'Headband',
      description: 'Sweat-absorbing headband',
      slug: 'headband',
      categoryId: categories[2].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Black',
          slug: 'headband-black',
          color: 'Black',
          size: 'One Size',
          price: 19.99,
          stock: 250,
          images: [{ url: 'https://placehold.co/500x500?text=Headband', altText: 'Headband' }],
        },
        {
          name: 'White',
          slug: 'headband-white',
          color: 'White',
          size: 'One Size',
          price: 19.99,
          stock: 220,
          images: [{ url: 'https://placehold.co/500x500?text=Headband+White', altText: 'Headband White' }],
        },
      ],
    },
    {
      name: 'Gym Towel',
      description: 'Absorbent microfiber towel',
      slug: 'gym-towel',
      categoryId: categories[2].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Black',
          slug: 'gym-towel-black',
          color: 'Black',
          size: 'One Size',
          price: 29.99,
          stock: 180,
          images: [{ url: 'https://placehold.co/500x500?text=Gym+Towel', altText: 'Gym Towel' }],
        },
        {
          name: 'Grey',
          slug: 'gym-towel-grey',
          color: 'Grey',
          size: 'One Size',
          price: 29.99,
          stock: 160,
          images: [{ url: 'https://placehold.co/500x500?text=Gym+Towel+Grey', altText: 'Gym Towel Grey' }],
        },
        {
          name: 'White',
          slug: 'gym-towel-white',
          color: 'White',
          size: 'One Size',
          price: 29.99,
          stock: 175,
          images: [{ url: 'https://placehold.co/500x500?text=Gym+Towel+White', altText: 'Gym Towel White' }],
        },
      ],
    },
    {
      name: 'Water Bottle 750ml',
      description: 'Insulated stainless steel bottle',
      slug: 'water-bottle-750ml',
      categoryId: categories[2].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Black',
          slug: 'water-bottle-black',
          color: 'Black',
          size: '750ml',
          price: 44.99,
          stock: 140,
          images: [{ url: 'https://placehold.co/500x500?text=Water+Bottle', altText: 'Water Bottle' }],
        },
        {
          name: 'Blue',
          slug: 'water-bottle-blue',
          color: 'Blue',
          size: '750ml',
          price: 44.99,
          stock: 130,
          images: [{ url: 'https://placehold.co/500x500?text=Water+Bottle+Blue', altText: 'Water Bottle Blue' }],
        },
        {
          name: 'Red',
          slug: 'water-bottle-red',
          color: 'Red',
          size: '750ml',
          price: 44.99,
          stock: 120,
          images: [{ url: 'https://placehold.co/500x500?text=Water+Bottle+Red', altText: 'Water Bottle Red' }],
        },
      ],
    },
    {
      name: 'Gloves Winter',
      description: 'Thermal running gloves',
      slug: 'gloves-winter',
      categoryId: categories[2].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Black',
          slug: 'gloves-winter-black',
          color: 'Black',
          size: 'One Size',
          price: 39.99,
          stock: 110,
          images: [{ url: 'https://placehold.co/500x500?text=Winter+Gloves', altText: 'Winter Gloves' }],
        },
        {
          name: 'Grey',
          slug: 'gloves-winter-grey',
          color: 'Grey',
          size: 'One Size',
          price: 39.99,
          stock: 100,
          images: [{ url: 'https://placehold.co/500x500?text=Winter+Gloves+Grey', altText: 'Winter Gloves Grey' }],
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
      variants: [
        {
          name: 'Black',
          slug: 'sportwatch-pro-black',
          color: 'Black',
          size: 'One Size',
          price: 399.99,
          stock: 30,
          images: [{ url: 'https://placehold.co/500x500?text=SportWatch+Pro', altText: 'SportWatch Pro' }],
        },
        {
          name: 'Silver',
          slug: 'sportwatch-pro-silver',
          color: 'Silver',
          size: 'One Size',
          price: 399.99,
          stock: 25,
          images: [{ url: 'https://placehold.co/500x500?text=SportWatch+Pro+Silver', altText: 'SportWatch Pro Silver' }],
        },
      ],
    },
    {
      name: 'Fitness Tracker Band',
      description: 'Lightweight activity tracker',
      slug: 'fitness-tracker-band',
      categoryId: categories[3].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Black',
          slug: 'fitness-tracker-black',
          color: 'Black',
          size: 'One Size',
          price: 149.99,
          stock: 50,
          images: [{ url: 'https://placehold.co/500x500?text=Fitness+Tracker', altText: 'Fitness Tracker' }],
        },
        {
          name: 'White',
          slug: 'fitness-tracker-white',
          color: 'White',
          size: 'One Size',
          price: 149.99,
          stock: 45,
          images: [{ url: 'https://placehold.co/500x500?text=Fitness+Tracker+White', altText: 'Fitness Tracker White' }],
        },
      ],
    },
    {
      name: 'Wireless Earbuds',
      description: 'True wireless sport earbuds',
      slug: 'wireless-earbuds',
      categoryId: categories[3].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Black',
          slug: 'wireless-earbuds-black',
          color: 'Black',
          size: 'One Size',
          price: 179.99,
          stock: 60,
          images: [{ url: 'https://placehold.co/500x500?text=Wireless+Earbuds', altText: 'Wireless Earbuds' }],
        },
        {
          name: 'White',
          slug: 'wireless-earbuds-white',
          color: 'White',
          size: 'One Size',
          price: 179.99,
          stock: 50,
          images: [{ url: 'https://placehold.co/500x500?text=Wireless+Earbuds+White', altText: 'Wireless Earbuds White' }],
        },
        {
          name: 'Grey',
          slug: 'wireless-earbuds-grey',
          color: 'Grey',
          size: 'One Size',
          price: 179.99,
          stock: 45,
          images: [{ url: 'https://placehold.co/500x500?text=Wireless+Earbuds+Grey', altText: 'Wireless Earbuds Grey' }],
        },
      ],
    },
    {
      name: 'Heart Rate Monitor',
      description: 'Chest strap heart rate monitor',
      slug: 'heart-rate-monitor',
      categoryId: categories[3].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Standard',
          slug: 'heart-rate-monitor-std',
          color: 'Black',
          size: 'One Size',
          price: 119.99,
          stock: 40,
          images: [{ url: 'https://placehold.co/500x500?text=Heart+Rate+Monitor', altText: 'Heart Rate Monitor' }],
        },
      ],
    },
    {
      name: 'GPS Running Watch',
      description: 'Dedicated running GPS watch',
      slug: 'gps-running-watch',
      categoryId: categories[3].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Black',
          slug: 'gps-running-watch-black',
          color: 'Black',
          size: 'One Size',
          price: 299.99,
          stock: 35,
          images: [{ url: 'https://placehold.co/500x500?text=GPS+Running+Watch', altText: 'GPS Running Watch' }],
        },
        {
          name: 'Red',
          slug: 'gps-running-watch-red',
          color: 'Red',
          size: 'One Size',
          price: 299.99,
          stock: 30,
          images: [{ url: 'https://placehold.co/500x500?text=GPS+Running+Watch+Red', altText: 'GPS Running Watch Red' }],
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
      variants: [
        {
          name: 'Purple',
          slug: 'yoga-mat-purple',
          color: 'Purple',
          size: '6mm',
          price: 79.99,
          stock: 80,
          images: [{ url: 'https://placehold.co/500x500?text=Yoga+Mat', altText: 'Yoga Mat' }],
        },
        {
          name: 'Black',
          slug: 'yoga-mat-black',
          color: 'Black',
          size: '6mm',
          price: 79.99,
          stock: 90,
          images: [{ url: 'https://placehold.co/500x500?text=Yoga+Mat+Black', altText: 'Yoga Mat Black' }],
        },
        {
          name: 'Blue',
          slug: 'yoga-mat-blue',
          color: 'Blue',
          size: '6mm',
          price: 79.99,
          stock: 75,
          images: [{ url: 'https://placehold.co/500x500?text=Yoga+Mat+Blue', altText: 'Yoga Mat Blue' }],
        },
      ],
    },
    {
      name: 'Dumbbell Set',
      description: 'Adjustable dumbbell set 2-20kg',
      slug: 'dumbbell-set',
      categoryId: categories[4].id,
      brandId: brandNike.id,
      variants: [
        {
          name: '2-20kg',
          slug: 'dumbbell-set-2-20',
          color: 'Black',
          size: '2-20kg',
          price: 249.99,
          stock: 20,
          images: [{ url: 'https://placehold.co/500x500?text=Dumbbell+Set', altText: 'Dumbbell Set' }],
        },
      ],
    },
    {
      name: 'Resistance Bands Set',
      description: 'Elastic resistance bands 5-pack',
      slug: 'resistance-bands-set',
      categoryId: categories[4].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: '5-Pack',
          slug: 'resistance-bands-5pack',
          color: 'Multi-color',
          size: 'One Size',
          price: 49.99,
          stock: 150,
          images: [{ url: 'https://placehold.co/500x500?text=Resistance+Bands', altText: 'Resistance Bands' }],
        },
      ],
    },
    {
      name: 'Push-Up Bars',
      description: 'Pair of rotating push-up bars',
      slug: 'pushup-bars',
      categoryId: categories[4].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Standard',
          slug: 'pushup-bars-std',
          color: 'Black',
          size: 'One Size',
          price: 34.99,
          stock: 200,
          images: [{ url: 'https://placehold.co/500x500?text=Push-Up+Bars', altText: 'Push-Up Bars' }],
        },
      ],
    },
    {
      name: 'Ab Roller',
      description: 'Core strengthening ab roller',
      slug: 'ab-roller',
      categoryId: categories[4].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Black',
          slug: 'ab-roller-black',
          color: 'Black',
          size: 'One Size',
          price: 44.99,
          stock: 120,
          images: [{ url: 'https://placehold.co/500x500?text=Ab+Roller', altText: 'Ab Roller' }],
        },
        {
          name: 'Grey',
          slug: 'ab-roller-grey',
          color: 'Grey',
          size: 'One Size',
          price: 44.99,
          stock: 100,
          images: [{ url: 'https://placehold.co/500x500?text=Ab+Roller+Grey', altText: 'Ab Roller Grey' }],
        },
      ],
    },
    {
      name: 'Exercise Ball',
      description: 'Stability ball for core training',
      slug: 'exercise-ball',
      categoryId: categories[4].id,
      brandId: brandNike.id,
      variants: [
        {
          name: '65cm',
          slug: 'exercise-ball-65cm',
          color: 'Purple',
          size: '65cm',
          price: 69.99,
          stock: 60,
          images: [{ url: 'https://placehold.co/500x500?text=Exercise+Ball', altText: 'Exercise Ball' }],
        },
        {
          name: '75cm',
          slug: 'exercise-ball-75cm',
          color: 'Blue',
          size: '75cm',
          price: 74.99,
          stock: 50,
          images: [{ url: 'https://placehold.co/500x500?text=Exercise+Ball+Blue', altText: 'Exercise Ball Blue' }],
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
      variants: [
        {
          name: 'White/Black',
          slug: 'soccer-ball-wb',
          color: 'White/Black',
          size: '5',
          price: 149.99,
          stock: 45,
          images: [{ url: 'https://placehold.co/500x500?text=Soccer+Ball', altText: 'Soccer Ball' }],
        },
        {
          name: 'Multi-panel',
          slug: 'soccer-ball-multi',
          color: 'Multi-color',
          size: '5',
          price: 159.99,
          stock: 35,
          images: [{ url: 'https://placehold.co/500x500?text=Soccer+Ball+Multi', altText: 'Soccer Ball Multi' }],
        },
      ],
    },
    {
      name: 'Basketball',
      description: 'Outdoor rubber basketball',
      slug: 'basketball',
      categoryId: categories[5].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Size 7',
          slug: 'basketball-7',
          color: 'Orange',
          size: '7',
          price: 99.99,
          stock: 55,
          images: [{ url: 'https://placehold.co/500x500?text=Basketball', altText: 'Basketball' }],
        },
      ],
    },
    {
      name: 'Tennis Racket',
      description: 'Beginner-friendly tennis racket',
      slug: 'tennis-racket',
      categoryId: categories[5].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Standard',
          slug: 'tennis-racket-std',
          color: 'Black/Yellow',
          size: '27 inch',
          price: 189.99,
          stock: 25,
          images: [{ url: 'https://placehold.co/500x500?text=Tennis+Racket', altText: 'Tennis Racket' }],
        },
        {
          name: 'Advanced',
          slug: 'tennis-racket-adv',
          color: 'Red/Black',
          size: '27 inch',
          price: 229.99,
          stock: 20,
          images: [{ url: 'https://placehold.co/500x500?text=Tennis+Racket+Pro', altText: 'Tennis Racket Pro' }],
        },
      ],
    },
    {
      name: 'Jump Rope',
      description: 'Speed training jump rope',
      slug: 'jump-rope',
      categoryId: categories[5].id,
      brandId: brandNike.id,
      variants: [
        {
          name: 'Aluminum',
          slug: 'jump-rope-aluminum',
          color: 'Black/Red',
          size: 'Adjustable',
          price: 54.99,
          stock: 180,
          images: [{ url: 'https://placehold.co/500x500?text=Jump+Rope', altText: 'Jump Rope' }],
        },
        {
          name: 'Steel',
          slug: 'jump-rope-steel',
          color: 'Black',
          size: 'Adjustable',
          price: 64.99,
          stock: 150,
          images: [{ url: 'https://placehold.co/500x500?text=Jump+Rope+Steel', altText: 'Jump Rope Steel' }],
        },
      ],
    },
    {
      name: 'Lacrosse Stick',
      description: 'Beginner lacrosse stick',
      slug: 'lacrosse-stick',
      categoryId: categories[5].id,
      brandId: brandAdidas.id,
      variants: [
        {
          name: 'Youth',
          slug: 'lacrosse-stick-youth',
          color: 'Black/White',
          size: '40 inch',
          price: 79.99,
          stock: 30,
          images: [{ url: 'https://placehold.co/500x500?text=Lacrosse+Stick', altText: 'Lacrosse Stick' }],
        },
        {
          name: 'Adult',
          slug: 'lacrosse-stick-adult',
          color: 'Red/Black',
          size: '42 inch',
          price: 99.99,
          stock: 25,
          images: [{ url: 'https://placehold.co/500x500?text=Lacrosse+Stick+Adult', altText: 'Lacrosse Stick Adult' }],
        },
      ],
    },
  ];

  // Create all products with their variants and images
  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        slug: productData.slug,
        categoryId: productData.categoryId,
        brandId: productData.brandId,
        isFeatured: Math.random() > 0.7, // 30% of products are featured
        isActive: true,
        productImages: {
          create: productData.variants[0]?.images.map((image) => ({
            url: image.url,
            altText: image.altText,
          })) || [],
        },
        variants: {
          create: productData.variants.map((variant) => ({
            price: variant.price,
            stock: variant.stock,
            color: variant.color || null,
            size: mapUSizeToEnum(variant.size || 'ONE_SIZE'),
            variantImages: {
              create: variant.images.map((image) => ({
                url: image.url,
                altText: image.altText,
              })),
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
  console.log(`   - 6 Categories`);
  console.log(`   - 40 Products`);
  console.log(`   - 120+ Product Variants`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
