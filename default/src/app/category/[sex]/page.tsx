import Link from "next/link";
import { categoryGroups } from "~/lib/categories";
import { ProductGrid } from "./_components/ProductGrid";

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
      {/* Breadcrumb */}
      <div className="max-w-screen-2xl mx-auto px-4 pt-10 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="capitalize">{displaySex}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center bg-gray-100 rounded-[2rem] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="w-full">
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
            <div className="relative h-[300px] lg:h-[350px] flex items-center justify-center">
              <img src={`/images/${sex}-hero.png`} alt={`${displaySex} Hero Image`} className="object-cover w-full h-full rounded-lg" />
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
            <h2 className="text-3xl font-bold text-black mb-4">Explore {displaySex} Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect style within our curated {displaySex.toLowerCase()} collections.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryGroup.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${sex}/${category.slug}`}
                className="group block rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-4 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">{category.name} Image</span>
                </div>
                <div className="px-5 pb-6">
                  <h3 className="text-xl font-semibold text-black mb-2">{category.name}</h3>
                  <p className="text-gray-600">Shop the latest {displaySex.toLowerCase()} {category.name.toLowerCase()} styles.</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Info Section */}
      <section className="py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="rounded-2xl bg-gray-50 p-8">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your order quickly with our express delivery options. Free shipping on orders over $100.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-8">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Easy Returns</h3>
              <p className="text-gray-600">Not satisfied? Return your items hassle-free within 30 days of delivery for a full refund.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-8">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Secure Payments</h3>
              <p className="text-gray-600">Shop with confidence using our secure payment gateways. Your data is always protected.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}