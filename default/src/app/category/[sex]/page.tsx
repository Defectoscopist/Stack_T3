import Link from "next/link";
import { categoryGroups } from "~/lib/categories";

interface SexCategoryPageProps {
  params: {
    sex: string;
  };
}

export default function SexCategoryPage({ params }: SexCategoryPageProps) {
  const sex = params.sex;
  const categoryGroup = categoryGroups[sex as keyof typeof categoryGroups] ?? categoryGroups.men;
  const displaySex = sex.charAt(0).toUpperCase() + sex.slice(1);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-screen-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="capitalize">{displaySex}</span>
        </nav>

        <div className="rounded-[2rem] bg-gray-100 p-10 mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">{displaySex} Categories</h1>
          <p className="text-gray-600 max-w-2xl leading-8">
            Explore our {displaySex.toLowerCase()} collections by category. Find top picks, new arrivals, and essential styles built for your preferences.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryGroup.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${sex}/${category.slug}`}
              className="rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">Category</p>
              <h2 className="text-2xl font-semibold text-black mb-2">{category.name}</h2>
              <p className="text-gray-600">Shop the latest {displaySex.toLowerCase()} {category.name.toLowerCase()} styles.</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
