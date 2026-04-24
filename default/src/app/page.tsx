"use client";

import { api } from "~/trpc/react";
import { ProductCard } from "./_components/ProductCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-10">
        <section className="glass-card overflow-hidden p-8 mb-10">
          <div className="relative overflow-hidden rounded-4xl bg-slate-950/90 p-8 md:p-10">
            <div className="hero-glow"></div>
            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  New streetwear drop
                </span>
                <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
                  Modern streetwear. Premium fit.
                </h1>
                <p className="max-w-2xl text-slate-300 text-lg leading-8">
                  Discover the latest curated collection of shoes, activewear, and accessories with bold details, elevated materials, and effortless style.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#catalog" className="btn-accent">
                    Shop bestsellers
                  </a>
                  <a href="#catalog" className="btn-secondary">
                    Browse collection
                  </a>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="surface-panel overflow-hidden p-6">
                  <div className="rounded-[1.75rem] bg-slate-900/80 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                    <div className="mb-4 text-slate-400">Editor’s pick</div>
                    <div className="grid gap-3">
                      <div className="rounded-3xl border border-white/5 bg-slate-950/90 p-4">
                        <h3 className="text-xl font-semibold text-white">Air Max 90</h3>
                        <p className="mt-2 text-slate-400">Fresh, dynamic comfort for everyday wear.</p>
                      </div>
                      <div className="rounded-3xl border border-white/5 bg-slate-950/90 p-4">
                        <h3 className="text-xl font-semibold text-white">Court Legacy</h3>
                        <p className="mt-2 text-slate-400">Retro edge with modern performance.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Featured collection</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Shop the latest looks</h2>
              <p className="mt-2 text-slate-400 max-w-2xl">A premium selection of fresh essentials designed for performance and street-ready style.</p>
            </div>
          </div>
          <ProductCatalog />
        </section>
      </div>
    </main>
  );
}

function ProductCatalog() {
  const { data: products, isLoading, error } = api.product.getAll.useQuery({
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card animate-pulse p-5">
            <div className="aspect-square rounded-3xl bg-slate-800 mb-5"></div>
            <div className="h-4 rounded-full bg-slate-800 mb-3"></div>
            <div className="h-3 rounded-full bg-slate-800 mb-3"></div>
            <div className="h-4 rounded-full bg-slate-800 w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error("Error loading products:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg">Failed to load products. Please try again later.</p>
        <p className="text-red-300 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
