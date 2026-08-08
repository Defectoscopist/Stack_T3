"use client";

import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string | null;
  rating: number;
  review: string | null;
}

export function ReviewCard({ name, rating, review }: ReviewCardProps) {
  return (
    <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
          <span className="text-gray-600 text-sm">{name?.[0] ?? "U"}</span>
        </div>
        <div>
          <h4 className="font-semibold text-black">{name ?? "Anonymous"}</h4>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600">{review}</p>
    </div>
  );
}