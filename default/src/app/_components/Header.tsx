"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "./CartContext";
import { categoryGroups } from "~/lib/categories";
import { api } from "~/trpc/react";


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { items } = useCart();

  const { data: searchResults, isFetching } = api.product.getFiltered.useQuery(
    { search: searchQuery, limit: 6 },
    { enabled: searchQuery.length >= 2 }
  );

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white/70 backdrop-blur-sm sticky top-0 z-50 hover:bg-white transition-colors duration-300 ease-out border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold text-black">
              SHOP
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {Object.entries(categoryGroups).map(([gender, cats]) => (
              <div
                key={gender}
                className="relative group"
              >
                <Link
                  href={`/category/${gender}`}
                  className="flex items-center gap-1 text-gray-700 hover:text-black font-medium capitalize"
                >
                  {gender}
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                {/* Dropdown */}
                <div style={{ backgroundColor: "white" }} className="absolute top-full left-0 mt-1 w-48 border border-gray-200 rounded-xl shadow-lg py-2 transition-all duration-300 ease-out opacity-0 invisible -translate-y-1.5 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto">
                  {/* Invisible bridge to prevent gap closing */}
                  <div className="absolute -top-1 left-0 right-0 h-1" />
                  {cats.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${gender}/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:text-black transition-all duration-200 ease-out"
                    >
                      <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:transition-all after:duration-200 after:ease-out hover:after:w-full">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-1" />
                  <Link
                    href={`/category/${gender}`}
                    className="block px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:text-black transition-all duration-200 ease-out"
                  >
                    <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:transition-all after:duration-200 after:ease-out hover:after:w-full">
                      View All {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
            <Link href="/shop" className="text-gray-700 hover:text-black font-medium">
              Discover
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black font-medium">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div ref={searchRef} className="hidden lg:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              />
              {isFetching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
            </div>
            {/* Search results dropdown */}
            {searchFocused && searchQuery.length >= 2 && searchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => { setSearchFocused(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                      {product.imagesUrl[0] && (
                        <Image
                          src={product.imagesUrl[0]}
                          alt={product.name}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate">{product.productType}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 shrink-0">
                      ${Math.min(...product.variants.map((v) => v.price)).toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            {searchFocused && searchQuery.length >= 2 && !isFetching && searchResults?.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-6 px-4 text-center text-sm text-gray-400 z-50">
                No products found for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <div className="lg:hidden relative">
              <button
                className="text-gray-700 hover:text-black"
                onClick={() => setSearchFocused(!searchFocused)}
              >
                <Search className="w-5 h-5" />
              </button>
              {searchFocused && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  {searchQuery.length >= 2 && searchResults && searchResults.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={() => { setSearchFocused(false); setSearchQuery(""); }}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50"
                        >
                          <div className="w-8 h-8 rounded bg-gray-100 shrink-0 overflow-hidden">
                            {product.imagesUrl[0] && (
                              <Image src={product.imagesUrl[0]} alt={product.name} width={32} height={32} className="object-cover w-full h-full" />
                            )}
                          </div>
                          <span className="text-sm text-gray-900 truncate flex-1">{product.name}</span>
                          <span className="text-xs font-semibold text-gray-900">${Math.min(...product.variants.map(v => v.price)).toFixed(2)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="relative group">
              <Link href="/cart" className="relative text-gray-700 hover:text-black block">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              {/* Cart Dropdown */}
              <div style={{ backgroundColor: "white" }} className="absolute right-0 top-full mt-1 w-80 border border-gray-200 rounded-xl shadow-lg py-3 transition-all duration-300 ease-out opacity-0 invisible -translate-y-1.5 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto">
                <div className="absolute -top-1 right-6 w-3 h-3 rotate-45 border-l border-t border-gray-200 bg-white" />
                {items.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Your cart is empty
                  </div>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto px-2 space-y-1">
                      {items.slice(0, 4).map((item) => (
                        <Link
                          key={item.id}
                          href="/cart"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                            {item.imageUrl && (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.size && `${item.size}`}{item.size && item.color ? " / " : ""}{item.color && `${item.color}`} × {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </Link>
                      ))}
                    </div>
                    {items.length > 4 && (
                      <p className="px-4 py-2 text-xs text-center text-gray-500">
                        +{items.length - 4} more items
                      </p>
                    )}
                    <div className="border-t border-gray-100 mx-2 my-1" />
                    <div className="px-4 py-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">Total</span>
                      <span className="text-sm font-bold text-gray-900">
                        ${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="px-3 pb-1">
                      <Link
                        href="/cart"
                        className="block w-full text-center bg-black text-white rounded-full py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors"
                      >
                        View Cart & Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Profile */}
            <Link href="/profile" className="text-gray-700 hover:text-black">
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu */}
            <button
              className="md:hidden text-gray-700 hover:text-black"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-4">
              {Object.entries(categoryGroups).map(([gender, cats]) => (
                <div key={gender}>
                  <Link
                    href={`/category/${gender}`}
                    className="block text-gray-700 hover:text-black font-medium capitalize mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {gender}
                  </Link>
                  <div className="ml-4 space-y-2 pb-2">
                    {cats.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${gender}/${cat.slug}`}
                        className="block text-sm text-gray-600 hover:text-black"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <Link
                href="/shop"
                className="block text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}