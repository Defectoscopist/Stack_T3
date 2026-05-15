"use client";

import Link from "next/link";

interface CategoryCardProps {
  title: string;
  description: string;
  slug: string;
  basePath?: string;
}

export function CategoryCard({ title, description, slug, basePath = "/categories" }: CategoryCardProps) {
  return (
    <Link
      href={`${basePath}/${slug}`}
      className="group block rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-4 bg-gray-200">
        <img
          src={`/images/categories/${slug}.png`}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            if (target.parentElement) {
              const placeholder = document.createElement("div");
              placeholder.className =
                "absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-medium";
              placeholder.textContent = title;
              target.parentElement.appendChild(placeholder);
            }
          }}
        />
      </div>
      <div className="px-5 pb-6">
        <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}