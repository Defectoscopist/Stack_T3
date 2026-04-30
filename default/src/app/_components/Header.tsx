"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "./CartContext";
import { categoryGroups } from "~/lib/categories";


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { items } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
                className="relative"
                onMouseEnter={() => setActiveDropdown(gender)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-gray-700 hover:text-black font-medium capitalize">
                  {gender}
                </button>
                {activeDropdown === gender && (
                  <div
                    className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50"
                    onMouseEnter={() => setActiveDropdown(gender)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {cats.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${gender}/${cat.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/shop" className="text-gray-700 hover:text-black font-medium">
              Shop
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black font-medium">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <button className="lg:hidden text-gray-700 hover:text-black">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-700 hover:text-black">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

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
                  <div className="font-medium text-gray-900 capitalize mb-2">{gender}</div>
                  <div className="pl-4 space-y-2">
                    {cats.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${gender}/${cat.slug}`}
                        className="block text-gray-700 hover:text-black"
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