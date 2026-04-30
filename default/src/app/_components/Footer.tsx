import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-black mb-4">SHOP</div>
            <p className="text-gray-600 mb-4 max-w-md">
              Discover the latest curated collection of fashion items designed to bring out your individuality and cater to your sense of style.
            </p>
            <div className="flex space-x-4">
              {/* Social links can be added here */}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-black">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-black">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-black">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-black">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Help
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-black">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-black">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-600 hover:text-black">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ & Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              FAQ
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq/shipping" className="text-gray-600 hover:text-black">
                  Shipping Questions
                </Link>
              </li>
              <li>
                <Link href="/faq/returns" className="text-gray-600 hover:text-black">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/faq/sizing" className="text-gray-600 hover:text-black">
                  Sizing Help
                </Link>
              </li>
              <li>
                <Link href="/faq/payment" className="text-gray-600 hover:text-black">
                  Payment Options
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/style-guide" className="text-gray-600 hover:text-black">
                  Style Guide
                </Link>
              </li>
              <li>
                <Link href="/care-instructions" className="text-gray-600 hover:text-black">
                  Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-gray-600 hover:text-black">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-black">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 SHOP. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-600 hover:text-black text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-black text-sm">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-black text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}