"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";
import { ProductCard } from "./_components/ProductCard";
import { ChevronLeft, ChevronRight, Image, Star } from "lucide-react";
import { categories } from "~/lib/categories";

export default function Home() {
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

function CategoryCard({ title, description, slug }: { title: string; description: string; slug: string }) {
  return (
    <Link href={`/category/men/${slug}`} className="group block rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-4 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">{title} Image</span>
      </div>
      <div className="px-5 pb-6">
        <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
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
