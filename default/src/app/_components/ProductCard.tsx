"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

// Map seed colors to actual CSS colors for the swatch circles
const colorMap: Record<string, string> = {
  "White/Black": "#e5e7eb",
  "Red/White": "#ef4444",
  "Black": "#1f2937",
  "White": "#f9fafb",
  "White/Blue": "#3b82f6",
  "Black/Green": "#22c55e",
  "White/Gold": "#fbbf24",
  "Black/Silver": "#6b7280",
  "Navy/Red": "#1e40af",
  "Silver": "#d1d5db",
  "Grey/Blue": "#64748b",
  "Purple": "#a855f7",
  "Gold/Black": "#f59e0b",
  "Grey": "#9ca3af",
  "Blue": "#3b82f6",
  "Red": "#ef4444",
  "Navy": "#1e3a5f",
  "Green": "#22c55e",
  "Pink": "#ec4899",
  "Grey Mix": "#a3a3a3",
  "Olive": "#808000",
  "Khaki": "#c3b091",
  "Beige": "#f5f5dc",
  "Brown": "#8b4513",
  "Dark Blue": "#1e3a8a",
  "Yellow": "#eab308",
  "Orange": "#f97316",
  "Multi-color": "#6366f1",
  "Black/Red": "#991b1b",
  "Red/Black": "#b91c1c",
  "Multi": "#8b5cf6",
};

function getSwatchColor(color: string | null): string {
  if (!color) return "#ccc";
  const normalized = color.trim();
  if (colorMap[normalized]) return colorMap[normalized];
  // Try lowercase match
  const lower = normalized.toLowerCase();
  if (colorMap[lower]) return colorMap[lower];
  // Return the color as-is if it's a valid hex or named color
  return lower;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // Get unique colors from variants
  const colorOptions = product.variants
    .filter((v) => v.color && v.imagesUrl.length > 0)
    .filter((v, i, arr) => arr.findIndex((x) => x.color === v.color) === i);

  // Determine which image to show
  let currentImage: string;
  if (hoveredColor) {
    const variant = product.variants.find(
      (v) => v.color === hoveredColor && v.imagesUrl.length > 0
    );
    currentImage = variant?.imagesUrl[0] ?? product.imagesUrl[0] ?? "";
  } else {
    currentImage = product.imagesUrl[0] ?? "";
  }

  const lowestPrice = Math.min(...product.variants.map((v) => v.price));
  const hasStock = product.variants.some((v) => v.stock > 0);

  const displayPrice =
    product.isOnSale && product.salePrice ? product.salePrice : lowestPrice;
  const originalPrice =
    product.isOnSale && product.originalPrice
      ? product.originalPrice
      : lowestPrice;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseLeave={() => setHoveredColor(null)}
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100 shrink-0">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
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
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-black line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-1">
          {product.description}
        </p>
        <div className="mt-auto pt-3 space-y-2">
          {colorOptions.length > 0 && (
            <div className="flex items-center gap-1.5">
              {colorOptions.map((v) => (
                <button
                  key={v.color}
                  type="button"
                  onMouseEnter={() => setHoveredColor(v.color)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    hoveredColor === v.color
                      ? "border-black scale-110 shadow-sm"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: getSwatchColor(v.color) }}
                  title={v.color ?? ""}
                />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-black">
                ${displayPrice.toFixed(2)}
              </span>
              {product.isOnSale && displayPrice < originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {colorOptions.length === 0 && (
              <span className="text-sm uppercase tracking-wide text-gray-500">
                {product.variants.length} option
                {product.variants.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}