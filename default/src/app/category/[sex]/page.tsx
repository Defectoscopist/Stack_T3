"use client";

import Link from "next/link";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductGrid } from "./_components/ProductGrid";
import { CategoryCard } from "../../_components/CategoryCard";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { categories } from "~/lib/categories";

interface SexCategoryPageProps {
  params: Promise<{
    sex: string;
  }>;
}

const VALID_SEXES = ["men", "women", "kids"];

export default function SexCategoryPage({ params }: SexCategoryPageProps) {
  const { sex } = use(params);
  const router = useRouter();

  useEffect(() => {
    if (!VALID_SEXES.includes(sex)) {
      router.replace(`/categories/${sex}`);
    }
  }, [sex, router]);

  if (!VALID_SEXES.includes(sex)) {
    return null;
  }

  const displaySex = sex.charAt(0).toUpperCase() + sex.slice(1);

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      review: "Absolutely love the quality and style. Fast shipping and great customer service!",
    },
    {
      name: "Mike Chen",
      rating: 5,
      review: "Found exactly what I was looking for. The fit is perfect and the material is top-notch.",
    },
    {
      name: "Emma Davis",
      rating: 4,
      review: "Great selection and affordable prices. Will definitely shop here again.",
    },
    {
      name: "Alex Rodriguez",
      rating: 5,
      review: "The website is easy to navigate and the products are exactly as described.",
    },
    {
      name: "Jessica Brown",
      rating: 5,
      review: "Amazing collection! The customer service team was incredibly helpful with sizing questions.",
    },
    {
      name: "David Wilson",
      rating: 4,
      review: "Good quality products at reasonable prices. Shipping was a bit slow but overall satisfied.",
    },
    {
      name: "Lisa Anderson",
      rating: 5,
      review: "Love the variety and the unique pieces. Definitely my go-to fashion destination now!",
    },
    {
      name: "James Taylor",
      rating: 5,
      review: "Excellent quality and fast delivery. The packaging was also very professional.",
    },
  ];

  const nextReview = () => {
    setCurrentReviewIndex((prev: number) => (prev + 1) % (reviews.length - 3));
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev: number) => (prev - 1 + (reviews.length - 3)) % (reviews.length - 3));
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
                disabled={currentReviewIndex >= reviews.length - 4}
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
              {reviews.map((review, index) => (
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

function ReviewCard({ name, rating, review }: { name: string; rating: number; review: string }) {
  return (
    <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
          <span className="text-gray-600 text-sm">{name[0]}</span>
        </div>
        <div>
          <h4 className="font-semibold text-black">{name}</h4>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600">{review}</p>
    </div>
  );
}