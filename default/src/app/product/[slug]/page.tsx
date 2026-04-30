"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Ruler,
} from "lucide-react";
import { api } from "~/trpc/react";
import { useCart } from "../../_components/CartContext";
import { ProductCard } from "../../_components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;

  const { data: product, isLoading, error } = api.product.getBySlug.useQuery(
    { slug: productSlug },
    { enabled: !!productSlug }
  );

  const { data: relatedProducts } = api.product.getAll.useQuery(
    { limit: 4 },
    { enabled: !!product }
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  // Find variant that matches both selected color and size
  const currentVariant = useMemo(() => {
    if (!product) return null;
    
    // Try to find exact match for both color and size
    const variant = product.variants.find(
      v => v.color === selectedColor && String(v.size) === selectedSize
    );
    
    if (variant) return variant;
    
    // If no exact match, try to find variant with selected size (ignoring color)
    if (selectedSize) {
      const sizeVariant = product.variants.find(v => String(v.size) === selectedSize);
      if (sizeVariant) return sizeVariant;
    }
    
    // If no size match, try to find variant with selected color (ignoring size)
    if (selectedColor) {
      const colorVariant = product.variants.find(v => v.color === selectedColor);
      if (colorVariant) return colorVariant;
    }
    
    // Fallback to first variant
    return product.variants[0] ?? null;
  }, [product, selectedColor, selectedSize]);

  // Check if a specific size is available for the selected color
  const isSizeAvailable = (size: string): boolean => {
    if (!product) return false;
    
    // If a color is selected, check if this size exists for that color
    if (selectedColor) {
      const variant = product.variants.find(
        v => v.color === selectedColor && String(v.size) === size
      );
      return !!variant && variant.stock > 0;
    }
    
    // If no color selected, check if any variant with this size exists
    const variant = product.variants.find(v => String(v.size) === size);
    return !!variant && variant.stock > 0;
  };

  // Check if a specific color is available for the selected size
  const isColorAvailable = (color: string): boolean => {
    if (!product) return false;
    
    // If a size is selected, check if this color exists for that size
    if (selectedSize) {
      const variant = product.variants.find(
        v => v.color === color && String(v.size) === selectedSize
      );
      return !!variant && variant.stock > 0;
    }
    
    // If no size selected, check if any variant with this color exists
    const variant = product.variants.find(v => v.color === color);
    return !!variant && variant.stock > 0;
  };

  const handleSelectSize = (size: string) => {
    // If the size is not available for the current color selection, don't allow selection
    if (!isSizeAvailable(size)) return;
    
    // Toggle: if already selected, deselect it
    setSelectedSize(prev => prev === size ? null : size);
  };

  const handleSelectColor = (color: string) => {
    // If the color is not available for the current size selection, don't allow selection
    if (!isColorAvailable(color)) return;
    
    // Toggle: if already selected, deselect it
    if (selectedColor === color) {
      setSelectedColor(null);
      return;
    }
    
    setSelectedColor(color);
    
    // If a size was previously selected but is not available in the new color, reset size
    if (selectedSize) {
      const variantForCurrentSize = product?.variants.find(
        v => v.color === color && String(v.size) === selectedSize
      );
      if (!variantForCurrentSize || variantForCurrentSize.stock === 0) {
        // Find first available size for this color
        const firstAvailableSize = product?.variants.find(
          v => v.color === color && v.stock > 0
        );
        if (firstAvailableSize) {
          setSelectedSize(String(firstAvailableSize.size));
        } else {
          setSelectedSize(null);
        }
      }
    }
  };

  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-10">
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
      <div className="min-h-screen bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-10 shadow-lg border border-neutral-100">
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">Product Not Found</h1>
              <p className="text-neutral-600 mb-8">The product you're looking for doesn't exist or may have been removed.</p>
              {error && <p className="text-red-500 mb-6 text-sm">{error.message}</p>}
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-lg"
              >
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

  // Calculate price display
  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : (currentVariant?.price ?? product.variants[0]?.price);
  const originalPrice = product.isOnSale && product.originalPrice ? product.originalPrice : null;
  const discountPercent = product.discountPercent || 0;

  // Accordion toggle
  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span className="text-neutral-300">/</span>
          <Link href="/shop" className="hover:text-neutral-900 transition-colors capitalize">
            {product.productType}
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Product Images */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* Main Image */}
            <div className="relative bg-neutral-50 rounded-2xl overflow-hidden group">
              {product.imagesUrl.length > 0 && (
                <div className="relative aspect-square">
                  <Image
                    src={product.imagesUrl[selectedImage]!}
                    alt={`${product.name} - Image ${selectedImage + 1}`}
                    fill
                    className="object-contain mix-blend-multiply"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}

              {/* Sale Badge */}
              {product.isOnSale && discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                    -{discountPercent}% OFF
                  </span>
                </div>
              )}

              {/* Best Seller Badge */}
              {product.isBestSeller && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-white" />
                    Best Seller
                  </span>
                </div>
              )}

              {/* Image Navigation Arrows */}
              {product.imagesUrl.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md border border-neutral-200 hover:bg-white transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-neutral-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md border border-neutral-200 hover:bg-white transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-neutral-700" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {product.imagesUrl.length > 1 && (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                  {selectedImage + 1} / {product.imagesUrl.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.imagesUrl.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.imagesUrl.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-neutral-900 ring-2 ring-neutral-200"
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

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Price Section */}
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {product.variants.some((v) => v.stock === 0) && product.variants.some((v) => v.stock > 0) && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                    Limited Stock
                  </span>
                )}
                {product.variants.every((v) => v.stock > 10) && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                    In Stock
                  </span>
                )}
                {product.variants.every((v) => v.stock === 0) && (
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-4xl md:text-5xl font-bold text-neutral-900">
                  ${displayPrice?.toFixed(2)}
                </span>
                {originalPrice && originalPrice > (displayPrice || 0) && (
                  <>
                    <span className="text-2xl text-neutral-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 5 ? "fill-amber-400 text-amber-400" : "text-neutral-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-neutral-600 text-sm font-medium">
                5.0 <span className="text-neutral-400">(128 reviews)</span>
              </span>
              <span className="text-neutral-300">|</span>
              <span className="text-neutral-600 text-sm font-medium">
                256 sold
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Divider */}
            <div className="border-t border-neutral-200"></div>

            {/* Color Selection */}
            {colorOptions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
                    Color:{" "}
                    <span className="text-neutral-600 font-normal normal-case">
                      {selectedColor || "Select a color"}
                    </span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color, index) => {
                    const available = isColorAvailable(color);
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={index}
                        onClick={() => available && handleSelectColor(color)}
                        disabled={!available}
                        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all border-2 ${
                          isSelected
                            ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                            : available
                            ? "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50"
                            : "border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizeOptions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
                    Size:{" "}
                    <span className="text-neutral-600 font-normal normal-case">
                      {selectedSize || "Select a size"}
                    </span>
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((size, index) => {
                    const available = isSizeAvailable(String(size));
                    const isSelected = selectedSize === String(size);
                    return (
                      <button
                        key={index}
                        onClick={() => available && handleSelectSize(String(size))}
                        disabled={!available}
                        className={`px-6 py-3 min-w-[72px] rounded-xl font-medium transition-all border-2 ${
                          isSelected
                            ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                            : available
                            ? "border-neutral-200 text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50"
                            : "border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50"
                        }`}
                      >
                        {String(size)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trust Badges - Moved here to fill space */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-neutral-200">
              <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-neutral-50 rounded-xl">
                <Truck className="w-5 h-5 text-neutral-700" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">Free Shipping</p>
                  <p className="text-[10px] text-neutral-500">Over $50</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-neutral-50 rounded-xl">
                <Shield className="w-5 h-5 text-neutral-700" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">Secure</p>
                  <p className="text-[10px] text-neutral-500">100% Protected</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-neutral-50 rounded-xl">
                <RotateCcw className="w-5 h-5 text-neutral-700" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">Returns</p>
                  <p className="text-[10px] text-neutral-500">30-Day Policy</p>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {currentVariant && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-sm font-semibold text-neutral-900">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-all active:scale-95"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(
                            currentVariant.stock > 0 ? currentVariant.stock : quantity,
                            quantity + 1
                          )
                        )
                      }
                      className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-all active:scale-95"
                      disabled={currentVariant.stock > 0 && quantity >= currentVariant.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={currentVariant.stock === 0}
                    className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                      currentVariant.stock > 0
                        ? "bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {currentVariant.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                      isWishlisted
                        ? "border-red-500 bg-red-50 text-red-500"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </button>
                  <button className="w-14 h-14 rounded-xl border-2 border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Stock Info */}
                {currentVariant.stock > 0 && currentVariant.stock <= 5 && (
                  <p className="text-center text-sm text-amber-600 font-medium">
                    🔥 Only {currentVariant.stock} left in stock - order soon!
                  </p>
                )}
              </div>
            )}

            {/* Product Details Accordion */}
            <div className="border-t border-neutral-200 pt-4 space-y-2">
              {/* Shipping Accordion */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                >
                  <span className="font-semibold text-neutral-900">Shipping Information</span>
                  {activeAccordion === "shipping" ? (
                    <ChevronUp className="w-5 h-5 text-neutral-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-600" />
                  )}
                </button>
                {activeAccordion === "shipping" && (
                  <div className="p-4 bg-white space-y-3">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-neutral-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">Standard Shipping</p>
                        <p className="text-neutral-600 text-sm">5-7 business days - $5.99</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-neutral-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">Express Shipping</p>
                        <p className="text-neutral-600 text-sm">2-3 business days - $12.99</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">Free Shipping</p>
                        <p className="text-neutral-600 text-sm">On all orders over $50</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Returns Accordion */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("returns")}
                  className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                >
                  <span className="font-semibold text-neutral-900">Returns & Exchanges</span>
                  {activeAccordion === "returns" ? (
                    <ChevronUp className="w-5 h-5 text-neutral-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-600" />
                  )}
                </button>
                {activeAccordion === "returns" && (
                  <div className="p-4 bg-white space-y-3">
                    <div className="flex items-start gap-3">
                      <RotateCcw className="w-5 h-5 text-neutral-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">30-Day Return Policy</p>
                        <p className="text-neutral-600 text-sm">
                          Items must be unworn with original tags attached. Free returns on all orders.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-neutral-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">Quality Guarantee</p>
                        <p className="text-neutral-600 text-sm">
                          If you receive a defective item, we'll replace it free of charge.
                        </p>
                      </div>
                    </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Product Details Accordion */}
        <div className="mt-12 border-t border-neutral-200 pt-6 space-y-3">
          {/* Description Accordion */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("description")}
                  className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                >
                  <span className="font-semibold text-neutral-900">Product Details</span>
                  {activeAccordion === "description" ? (
                    <ChevronUp className="w-5 h-5 text-neutral-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-600" />
                  )}
                </button>
                {activeAccordion === "description" && (
                  <div className="p-4 bg-white">
                    <p className="text-neutral-600 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between py-2 border-b border-neutral-100">
                        <span className="text-neutral-500 text-sm">Category</span>
                        <span className="text-neutral-900 font-medium text-sm capitalize">
                          {product.productType}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-neutral-100">
                        <span className="text-neutral-500 text-sm">SKU</span>
                        <span className="text-neutral-900 font-medium text-sm font-mono">
                          {product.variants[0]?.id.substring(0, 12).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-neutral-500 text-sm">Tags</span>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          {product.tags.split(",").map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded-md"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-neutral-200 max-w-screen-2xl mx-auto px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                You May Also Like
              </h2>
              <Link
                href="/shop"
                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSizeGuide(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-auto p-6">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
            <h3 className="text-xl font-bold text-neutral-900 mb-6">Size Guide</h3>
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="text-left py-3 px-3 font-semibold text-neutral-900">Size</th>
                    <th className="text-left py-3 px-3 font-semibold text-neutral-900">Chest (in)</th>
                    <th className="text-left py-3 px-3 font-semibold text-neutral-900">Length (in)</th>
                    <th className="text-left py-3 px-3 font-semibold text-neutral-900">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600">
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-3 font-medium text-neutral-900">XS</td>
                    <td className="py-3 px-3">34-36</td>
                    <td className="py-3 px-3">26</td>
                    <td className="py-3 px-3">16</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-3 font-medium text-neutral-900">S</td>
                    <td className="py-3 px-3">36-38</td>
                    <td className="py-3 px-3">27</td>
                    <td className="py-3 px-3">17</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-3 font-medium text-neutral-900">M</td>
                    <td className="py-3 px-3">38-40</td>
                    <td className="py-3 px-3">28</td>
                    <td className="py-3 px-3">18</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-3 font-medium text-neutral-900">L</td>
                    <td className="py-3 px-3">40-42</td>
                    <td className="py-3 px-3">29</td>
                    <td className="py-3 px-3">19</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-3 font-medium text-neutral-900">XL</td>
                    <td className="py-3 px-3">42-44</td>
                    <td className="py-3 px-3">30</td>
                    <td className="py-3 px-3">20</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-neutral-900">XXL</td>
                    <td className="py-3 px-3">44-46</td>
                    <td className="py-3 px-3">31</td>
                    <td className="py-3 px-3">21</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
                <p className="text-sm text-neutral-600">
                  <strong className="text-neutral-900">How to measure:</strong> Measure your chest at the fullest part, length from the top of the shoulder to the hem, and shoulder width from edge to edge.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}