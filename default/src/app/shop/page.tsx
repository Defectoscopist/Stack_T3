"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { ProductCard } from "~/app/_components/ProductCard";
import { categories } from "~/lib/categories";

export default function ShopPage() {
  const { data: products, isLoading, error } = api.product.getAll.useQuery({ limit: 12 });

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-screen-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-black text-white p-10 mb-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-gray-400 mb-4">Shop the edit</p>
              <h1 className="text-5xl font-bold leading-tight">Discover curated collections, fresh drops, and premium essentials.</h1>
              <p className="mt-6 max-w-2xl text-lg text-gray-200 leading-8">Explore our latest shop page with trend-forward product combinations, seasonal favorites, and beautiful style stories for every wardrobe.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/category/men/shoes"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
                >
                  Shop Shoes
                </Link>
                <Link
                  href="/category/men/apparel"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Shop Apparel
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[1.5rem] bg-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-3">Seasonal Edit</h2>
                <p className="text-gray-300 leading-7">Fresh arrivals, bold essentials, and smart layering pieces for every season.</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-3">Curated Collections</h2>
                <p className="text-gray-300 leading-7">Handpicked looks and premium combinations to refresh your wardrobe instantly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Categories</p>
              <h2 className="text-3xl font-bold text-black">Explore by category</h2>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">{category.title}</p>
                <h3 className="text-xl font-semibold text-black mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Featured products</p>
              <h2 className="text-3xl font-bold text-black">New arrivals & best sellers</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-3xl bg-gray-200 h-72"></div>
              ))}
            </div>
          ) : error || !products ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-600">
              Unable to load products right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
