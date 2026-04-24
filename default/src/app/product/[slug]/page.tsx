"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useCart } from "../../_components/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;

  const { data: product, isLoading, error } = api.product.getBySlug.useQuery(
    { slug: productSlug },
    { enabled: !!productSlug }
  );

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const sizeOptions = useMemo(
    () => product ? Array.from(new Set(product.variants.map(v => v.size))) : [],
    [product]
  );

  const colorOptions = useMemo(
    () =>
      product
        ? Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))) as string[]
        : [],
    [product]
  );

  const currentVariant = product
    ? product.variants.find(v => v.id === selectedVariant) || product.variants[0]
    : null;

  const handleSelectSize = (size: string) => {
    const variant = product?.variants.find(v => v.size === size);
    setSelectedVariant(variant?.id ?? null);
  };

  const handleSelectColor = (color: string) => {
    const variant = product?.variants.find(v => v.color === color);
    setSelectedVariant(variant?.id ?? null);
  };

  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="container mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-10 rounded-full bg-slate-800 w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square rounded-4xl bg-slate-900"></div>
              <div className="space-y-4">
                <div className="h-10 rounded-full bg-slate-900"></div>
                <div className="h-4 rounded-full bg-slate-900"></div>
                <div className="h-4 rounded-full bg-slate-900 w-5/6"></div>
                <div className="h-12 rounded-3xl bg-slate-900"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    console.error("Query error:", error);
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="container mx-auto px-4 py-10">
          <div className="glass-card p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
            <p className="text-slate-400 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
            {error && <p className="text-red-400 mb-4 text-sm">{error.message}</p>}
            <Link href="/" className="btn-accent">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!currentVariant) return;

    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      name: product.name,
      price: currentVariant.price,
      quantity,
      size: currentVariant.size,
      color: currentVariant.color,
      imageUrl: product.imagesUrl[0] ?? "",
    });

    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-10">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card overflow-hidden">
            <div className="relative aspect-square overflow-hidden bg-slate-900">
              {product.imagesUrl.length > 0 ? (
                <Image
                  src={product.imagesUrl[0]!}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-900 text-slate-500">
                  <span>No Image</span>
                </div>
              )}
            </div>

            {product.imagesUrl.length > 1 && (
              <div className="grid grid-cols-4 gap-3 p-4">
                {product.imagesUrl.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-3xl bg-slate-900 transition hover:-translate-y-1">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-8 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white">{product.name}</h1>
              <p className="text-slate-300 max-w-2xl leading-8">{product.description}</p>
            </div>

            <div className="space-y-6">
              {product.variants.length > 0 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
                    <div className="flex flex-wrap gap-3">
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSelectSize(size)}
                          className={`variant-pill ${currentVariant?.size === size ? "variant-pill-active" : ""}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {colorOptions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Color</h3>
                      <div className="flex flex-wrap gap-3">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleSelectColor(color)}
                            className={`variant-pill ${currentVariant?.color === color ? "variant-pill-active" : ""}`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentVariant && (
                <div className="space-y-6 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Price</p>
                      <p className="mt-2 text-4xl font-bold text-white">${currentVariant.price.toFixed(2)}</p>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${currentVariant.stock > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
                      {currentVariant.stock > 0 ? `${currentVariant.stock} in stock` : "Out of stock"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/80 p-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="rounded-full bg-slate-900 px-4 py-3 text-xl text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-14 text-center text-lg font-semibold text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(currentVariant.stock, quantity + 1))}
                        className="rounded-full bg-slate-900 px-4 py-3 text-xl text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={quantity >= currentVariant.stock}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={currentVariant.stock === 0}
                      className={`btn-accent w-full ${currentVariant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {currentVariant.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
