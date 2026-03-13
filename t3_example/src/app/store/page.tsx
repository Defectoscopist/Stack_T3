
import {api} from "~/trpc/server";
import { ProductCard } from "../_components/product-card";

export default async function StorePage() {
    const categories = await api.catalog.listCategories();
    const products = await api.catalog.listProducts();
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-5xl px-4 py-8">
            <header className="mb-6">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Your Brand
                </h1>
                <p className="mt-2 text-sm text-white/60">
                    Your brand philosophy
                </p>
            </header>
            <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {products.map((p) => {
                const variant = p.variant[0];
                const price = variant ? variant.price.toString() : "-";

                return (
                    <ProductCard
                        key={p.id}
                        name={p.name}
                        description={p.description}
                        price={price}
                        slug={p.slug}
                    >
                    </ProductCard>
                )
              })}
            </section>
            </div>
        </main>
    );
}