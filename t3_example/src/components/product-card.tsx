"use client";

import { type MouseEvent, useState } from "react";
import { Plus } from "lucide-react";
import type { ProductCardUI } from "~/types/product";
import { api } from "~/trpc/react";
import { signIn, useSession } from "next-auth/react";

export const ProductCard = ({ product }: { product: ProductCardUI }) => {
  const { data: session } = useSession();
  const utils = api.useContext();
  const [activeVariant, setActiveVariant] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const addItemMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      void utils.cart.getCart.invalidate();
    },
  });

  const variant = product.variants[activeVariant];

  const image =
    variant?.images?.[0] ||
    product.variants[0]?.images?.[0] ||
    "/placeholder.jpg";

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!variant) return;

    if (!session) {
      void signIn();
      return;
    }

    setIsAdding(true);
    try {
      await addItemMutation.mutateAsync({
        variantId: variant.id,
        quantity: 1,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group cursor-pointer h-100 mt-4">
      {/* IMAGE */}
      <div className="bg-surface relative overflow-hidden rounded-2xl">
        <img
          src={image}
          className="scale-70 h-90 w-full object-cover transition-all duration-800 group-hover:scale-80"
        />

        {/* PLUS */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="text-text-primary hover:bg-primary absolute top-3 right-3 flex h-8 w-8 items-center justify-center
          rounded-full bg-[rgba(20,18,16,0.6)] backdrop-blur-md transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          <Plus size={16} />
        </button>

        {/* COLORS */}
        {product.variants.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
            {product.variants.map((v, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveVariant(i)}
                className="h-3 w-3 cursor-pointer rounded-full border transition-transform duration-200 hover:scale-110"
                style={{ background: v.colorHex ?? "#999" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* TEXT */}
      <div className="mt-3 text-center">
        <h3 className="text-text-primary">{product.name}</h3>
        <h3 className="text-text-secondary mt-1 text-sm">${product.minPrice}</h3>
      </div>
    </div>
  );
};
