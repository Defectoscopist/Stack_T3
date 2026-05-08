"use client";

import { api } from "~/trpc/react";
import { ProductCard } from "~/app/_components/ProductCard";

interface ProductGridProps {
  sex: string;
}

export function ProductGrid({ sex }: ProductGridProps) {
  const { data: products, isLoading, error } = api.product.getAll.useQuery({
    limit: 8, // You can adjust this limit as needed
    sex: sex,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !products) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}