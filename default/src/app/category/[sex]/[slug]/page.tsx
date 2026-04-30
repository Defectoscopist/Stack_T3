"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { ProductCard } from "~/app/_components/ProductCard";
import { categoryGroups } from "~/lib/categories";

type SexType = "MEN" | "WOMEN" | "KIDS" | "UNISEX";

export default function CategoryPage() {
  const params = useParams();
  const sex = (params.sex as string) || "men";
  const slug = params.slug as string;
  
  let title: string = slug.replace(/-/g, " ");
  title = title.charAt(0).toUpperCase() + title.slice(1);

  const categoryGroup = categoryGroups[sex as keyof typeof categoryGroups] || categoryGroups.men;
  const categoryItem = categoryGroup.find((item) => item.slug === slug);
  
  const category = categoryItem ?? {
    name: title,
    slug,
  };

  const sexEnum: SexType = sex === "women" ? "WOMEN" : sex === "kids" ? "KIDS" : "MEN";

  const { data: products, isLoading, error } = api.product.getAll.useQuery({
    limit: 100,
  });

  // Filter products by sex and category, including unisex items
  const filteredProducts = products?.filter((product) => {
    const matchesSex = product.sex === sexEnum || product.sex === "UNISEX";
    const matchesCategory = product.category.slug === slug;
    return matchesSex && matchesCategory;
  }) ?? [];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-screen-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${sex}`} className="hover:text-black capitalize">
            {sex}
          </Link>
          <span className="mx-2">/</span>
          <span className="capitalize">{category.name}</span>
        </nav>

        <div className="rounded-4xl bg-gray-100 p-10 mb-12">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Category</p>
              <h1 className="text-5xl font-bold text-black mb-4 capitalize">
                {sex} - {category.name}
              </h1>
              <p className="text-gray-600 max-w-2xl leading-8">
                Discover our latest {sex} {category.name.toLowerCase()} selection. Quality gear for every adventure.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
                >
                  Browse all collections
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-black"
                >
                  Back to home
                </Link>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Explore this collection</p>
              <div className="space-y-4">
                <p className="text-gray-700 leading-7">
                  Our latest {sex} {category.name.toLowerCase()} styles and top picks for the season. From bold statement pieces to everyday essentials.
                </p>
                <p className="text-gray-700 leading-7">
                  Shop exclusive selections, new arrivals, and timeless favorites crafted for your lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Curated picks</p>
            <h2 className="text-3xl font-bold text-black">
              Top {sex} {category.name}
            </h2>
          </div>
          <p className="text-sm text-gray-600 max-w-xl">
            Browse products selected for {sex} {category.name.toLowerCase()} with a mix of best sellers and new arrivals.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-3xl bg-gray-200 h-72"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-600">
            <p className="mb-4">No products found for {sex} {category.name}.</p>
            <Link href="/shop" className="text-black font-semibold hover:underline">
              Browse all products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
