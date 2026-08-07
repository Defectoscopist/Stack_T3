"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { useCart } from "../_components/CartContext";

export default function WishlistPage() {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const { addItem } = useCart();

  const { data, isLoading } = api.wishlist.getWishlist.useQuery(
    { limit: 50, offset: 0 },
    { enabled: !!session?.user }
  );

  const removeMutation = api.wishlist.removeFromWishlist.useMutation({
    onSuccess: () => {
      void utils.wishlist.getWishlist.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-10 shadow-lg border border-neutral-100">
              <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">Sign in required</h1>
              <p className="text-neutral-600 mb-8">
                Please sign in to view your wishlist.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-lg"
              >
                Go to Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-2">Saved for later</p>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
              Wishlist
            </h1>
          </div>
          <span className="text-sm text-gray-500">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</p>
            <p className="text-gray-600 mb-8">
              Save products you love and find them here later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
              const price = item.product.price;
              const lowestVariantPrice = item.product.price;
              const displayPrice = item.product.isOnSale && item.product.salePrice
                ? item.product.salePrice
                : lowestVariantPrice;

              return (
                <div
                  key={item.id}
                  className="group rounded-3xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="block relative aspect-square bg-gray-50 overflow-hidden"
                  >
                    {item.product.imageUrl && (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeMutation.mutate({ productId: item.productId });
                      }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow border border-gray-200 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="font-semibold text-neutral-900 text-sm mb-1 line-clamp-2 hover:underline">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-neutral-900">
                        ${displayPrice.toFixed(2)}
                        {item.product.isOnSale && item.product.salePrice && (
                          <span className="ml-2 text-sm font-normal text-neutral-400 line-through">
                            ${price.toFixed(2)}
                          </span>
                        )}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Add first variant of the product to cart (fallback)
                          // Real checkout uses product page selection
                          if (item.product.price) {
                            addItem({
                              productId: item.productId,
                              variantId: "",
                              name: item.product.name,
                              price: displayPrice,
                              quantity: 1,
                              size: "",
                              color: "",
                              imageUrl: item.product.imageUrl,
                            });
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black rounded-full px-4 py-2 hover:bg-gray-800 transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}