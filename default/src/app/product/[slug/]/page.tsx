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
  const [selectedImage, setSelectedImage] = useState(0);

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
    ? product.variants.find(v => v.id === selectedVariant) ?? product.variants[0]
    : null;

  const handleSelectSize = (size: string) => {
    const variant = product?.variants.find(v => String(v.size) === size);
    setSelectedVariant(variant?.id ?? null);
  };

  const handleSelectColor = (color: string) => {
    const variant = product?.variants.find(v => v.color === color);
    setSelectedVariant(variant?.id ?? null);
  };

  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-neutral-200 rounded-full w-24"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square rounded-2xl bg-neutral-200"></div>
              <div className="space-y-6">
                <div className="h-8 bg-neutral-200 rounded-lg w-3/4"></div>
                <div className="h-20 bg-neutral-200 rounded-lg"></div>
                <div className="h-12 bg-neutral-200 rounded-lg"></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-12 bg-neutral-200 rounded-lg"></div>
                  <div className="h-12 bg-neutral-200 rounded-lg"></div>
                  <div className="h-12 bg-neutral-200 rounded-lg"></div>
                </div>
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
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-neutral-100">
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">Product Not Found</h1>
              <p className="text-neutral-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
              {error && <p className="text-red-500 mb-6 text-sm">{error.message}</p>}
              <Link href="/" className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors">
                Back to Products
              </Link>
            </div>
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
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.imagesUrl.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === product.imagesUrl.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-600">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 overflow-hidden">
              {product.imagesUrl.length > 0 && (
                <div className="relative aspect-square">
                  <Image
                    src={product.imagesUrl[selectedImage]!}
                    alt={`${product.name} - Image ${selectedImage + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}
              {product.imagesUrl.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm border border-neutral-200 hover:bg-white transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-neutral-600" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm border border-neutral-200 hover:bg-white transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-neutral-600" />
                  </button>
                </>
              )}
            </div>

            {product.imagesUrl.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.imagesUrl.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-neutral-900 ring-2 ring-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              {product.variants.some(v => v.stock === 0) && (
                <span className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                  Limited Stock
                </span>
              )}
              {product.variants.every(v => v.stock > 10) && (
                <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  In Stock
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
                {product.name}
              </h1>
              <p className="text-lg text-neutral-600 leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-bold text-neutral-900">
                  ${currentVariant?.price.toFixed(2) ?? product.variants[0]?.price.toFixed(2)}
                </span>
                {currentVariant && currentVariant.stock > 0 && (
                  <span className="text-lg text-neutral-500 font-medium">
                    {currentVariant.stock} available
                  </span>
                )}
              </div>
              {currentVariant?.stock === 0 && (
                <span className="text-red-600 font-medium text-sm">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-neutral-600 text-sm">
                5.0 (128 reviews)
              </span>
            </div>

            <div className="border-t border-neutral-200"></div>

            {sizeOptions.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-900 uppercase tracking-wide">
                  Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSize(String(size))}
                      className={`px-6 py-3 min-w-[64px] rounded-xl font-medium transition-all ${
                        currentVariant?.size === String(size)
                          ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/10"
                          : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                      }`}
                    >
                      {String(size)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colorOptions.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-900 uppercase tracking-wide">
                  Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectColor(color)}
                      className={`px-6 py-3 min-w-[64px] rounded-xl font-medium transition-all ${
                        currentVariant?.color === color
                          ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/10"
                          : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentVariant && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200">
                  <span className="text-sm font-semibold text-neutral-900">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-all"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-lg text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(currentVariant.stock > 0 ? currentVariant.stock : quantity, quantity + 1))}
                      className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-all"
                      disabled={currentVariant.stock > 0 && quantity >= currentVariant.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={currentVariant.stock === 0}
                    className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                      currentVariant.stock > 0
                        ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/20"
                        : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {currentVariant.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button className="w-14 h-14 rounded-xl border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="w-14 h-14 rounded-xl border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-neutral-200 pt-6 space-y-4">
              <div className="flex justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Category</span>
                <span className="text-neutral-900 font-medium capitalize">
                  {product.productType}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600">SKU</span>
                <span className="text-neutral-900 font-medium">
                  {product.variants[0]?.id.substring(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-neutral-600">Tags</span>
                <div className="flex gap-2">
                  {product.tags.split(",").map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
