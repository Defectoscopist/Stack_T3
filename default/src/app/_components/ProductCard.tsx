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
    categoryId: string;
    brandId: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  // Get the lowest price from variants
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const hasStock = product.variants.some(v => v.stock > 0);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group overflow-hidden rounded-4xl border border-white/10 bg-slate-950/90 shadow-[0_30px_60px_-18px_rgba(0,0,0,0.6)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_35px_80px_-22px_rgba(52,211,153,0.24)]"
    >
      <div className="aspect-square relative overflow-hidden border-b border-white/10">
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
        {product.isFeatured && (
          <div className="absolute top-4 left-4 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 backdrop-blur-sm">
            Featured
          </div>
        )}
        {!hasStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-sm font-semibold text-white">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-semibold tracking-tight text-white line-clamp-2">{product.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-2xl font-bold text-emerald-300">${lowestPrice.toFixed(2)}</span>
          <span className="text-sm uppercase tracking-[0.14em] text-slate-500">
            {product.variants.length} option{product.variants.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}