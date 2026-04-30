import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    slug: string;
    imagesUrl: string[];
    variants: Array<{
      id: string;
      price: number;
      stock: number;
      color: string | null;
      size: string;
      imagesUrl: string[];
    }>;
    isFeatured: boolean;
    isActive: boolean;
    isBestSeller: boolean;
    isOnSale: boolean;
    salePrice: number | null;
    originalPrice: number | null;
    discountPercent: number;
    tags: string;
    productType: string;
    categoryId: string;
    brandId: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  // Get the lowest price from variants
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const hasStock = product.variants.some(v => v.stock > 0);

  // Calculate display price (use sale price if on sale)
  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : lowestPrice;
  const originalPrice = product.isOnSale && product.originalPrice ? product.originalPrice : lowestPrice;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="aspect-square relative overflow-hidden">
        {product.imagesUrl.length > 0 ? (
          <Image
            src={product.imagesUrl[0]!}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isFeatured && (
            <div className="rounded-full bg-black text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Featured
            </div>
          )}
          {product.isBestSeller && (
            <div className="rounded-full bg-red-500 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Best Seller
            </div>
          )}
        </div>
        {product.isOnSale && (
          <div className="absolute top-4 right-4 rounded-full bg-green-500 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            {product.discountPercent}% OFF
          </div>
        )}
        {!hasStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-sm font-semibold text-white">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-black line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-black">${displayPrice.toFixed(2)}</span>
            {product.isOnSale && displayPrice < originalPrice && (
              <span className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>
          <span className="text-sm uppercase tracking-wide text-gray-500">
            {product.variants.length} option{product.variants.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}