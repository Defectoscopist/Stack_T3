"use client";

import { api } from "~/trpc/react";
import { ProductCard } from "~/components/product-card";
import { CollectionCard } from "~/components/collection-card";
import { mapProductToCard } from "~/lib/mappers/product";


  const COLLECTIONS = [
  { afterIndex: 0,  title: "Core Collection",       image: "/collections/core.jfif" },
  { afterIndex: 4,  title: "Spatial Flow",           image: "/collections/spatial-flow.jfif" },
  { afterIndex: 8,  title: "Adaptive Atmosphere",    image: "/collections/adaptive-atmosphere.jfif" },
  { afterIndex: 12, title: "Visual Continuity",      image: "/collections/visual-continuity.jfif" },
  { afterIndex: 16, title: "Ambient Mood",           image: "/collections/ambient-mood.jfif" },
  { afterIndex: 20, title: "Quiet Operation",        image: "/collections/quiet-operation.jfif" },
];

export const ProductGrid = () => {
  const { data, isLoading } = api.product.getAll.useQuery({ limit: 20 });

  if (isLoading) { /* скелетон */ }
  if (!data) return null;

  const products = data.map(mapProductToCard);

  // Строим элементы сетки с коллекциями по позиции
  const items: React.ReactNode[] = [];

  products.forEach((product, index) => {
    // Перед этим индексом вставляем коллекцию если есть
    const collection = COLLECTIONS.find(c => c.afterIndex === index);
    if (collection) {
      items.push(
        <div key={`col-${index}`} className="col-span-2">
          <CollectionCard title={collection.title} image={collection.image} />
        </div>
      );
    }
    items.push(<ProductCard key={product.id} product={product} />);
  });

  // Коллекция после всех продуктов
  const lastCollection = COLLECTIONS.find(c => c.afterIndex === products.length);
  if (lastCollection) {
    items.push(
      <div key="col-last" className="col-span-2">
        <CollectionCard title={lastCollection.title} image={lastCollection.image} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {items}
    </div>
  );
};

