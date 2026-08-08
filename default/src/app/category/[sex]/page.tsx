"use client";

import Link from "next/link";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductGrid } from "./_components/ProductGrid";
import { CategoryCard } from "../../_components/CategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "~/lib/categories";
import { ReviewCard } from "../../_components/ReviewCard";
import { api } from "~/trpc/react";

interface SexCategoryPageProps {
  params: Promise<{
    sex: string;
  }>;
}

const VALID_SEXES = ["men", "women", "kids"];

export default function SexCategoryPage({ params }: SexCategoryPageProps) {
  const { sex } = use(params);
  const router = useRouter();
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

  useEffect(() => {
    if (!VALID_SEXES.includes(sex)) {
      router.replace(`/categories/${sex}`);
    }
  }, [sex, router]);

  if (!VALID_SEXES.includes(sex)) {
    return null;
  }

  const displaySex = sex.charAt(0).toUpperCase() + sex.slice(1);

  const nextReview = () => {
    setCurrentReviewIndex((prev: number) => (prev + 1) % Math.max(1, reviewsList.length - 3));
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev: number) => (prev - 1 + Math.max(1, reviewsList.length - 3)) % Math.max(1, reviewsList.length - 3));
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative h-[660px] flex items-center">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
                Explore Our {displaySex} Collection
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
              </p>
              <Link
                href={`/category/${sex}/all`}
                className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <img
                  src={`/images/${sex}-hero.png`}
                  alt={`${displaySex} Hero Image`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Featured Products for {displaySex}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium fashion items for {displaySex.toLowerCase()}
            </p>
          </div>
          <ProductGrid sex={sex} />
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
                basePath={`/category/${sex}`}
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