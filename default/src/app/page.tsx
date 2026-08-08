"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";
import { ProductCard } from "./_components/ProductCard";
import { CategoryCard } from "./_components/CategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "~/lib/categories";
import { ReviewCard } from "./_components/ReviewCard";

export default function Home() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const { data: reviews } = api.review.getRecentReviews.useQuery(undefined, {
    select: (data) =>
      data.map((review) => ({
        name: review.user.name,
        rating: review.rating,
        review: review.comment,
      })),
  });
  const reviewsList = reviews ?? [];

  const nextReview = () => {
    setCurrentReviewIndex((prev: number) => (prev + 1) % Math.max(1, reviewsList.length - 3));
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev: number) => (prev - 1 + Math.max(1, reviewsList.length - 3)) % Math.max(1, reviewsList.length - 3));
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[660px] flex items-center">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
                FIND CLOTHES THAT MATCHES YOUR STYLE
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
              </p>
              <Link href="/shop" className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                Shop Now
              </Link>
            </div>

            {/* Image */}
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <img src="/images/hero.png" alt="Hero Image" className="object-cover w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium fashion items
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">What are you looking for?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                title={category.title}
                description={category.description}
                slug={category.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-black">Customer Reviews</h2>
            <div className="flex space-x-2">
              <button
                onClick={prevReview}
                className="p-2 border border-gray-300 rounded-full hover:border-black transition-colors disabled:opacity-50"
                disabled={currentReviewIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextReview}
                className="p-2 border border-gray-300 rounded-full hover:border-black transition-colors disabled:opacity-50"
                disabled={currentReviewIndex >= reviewsList.length - 4}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              className="flex space-x-6 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentReviewIndex * (320 + 24)}px)` }}
            >
              {reviewsList.map((review, index) => (
                <ReviewCard
                  key={index}
                  name={review.name}
                  rating={review.rating}
                  review={review.review}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductGrid() {
  const { data: products, isLoading, error } = api.product.getAll.useQuery({
    limit: 8,
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