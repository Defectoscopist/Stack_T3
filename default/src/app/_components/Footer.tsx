"use client";

import Link from "next/link";
import { SizeGuide } from "./SizeGuide";
import { InfoModal } from "./InfoModal";
import { ShippingInfoContent } from "./ShippingInfoContent";
import { ReturnsContent } from "./ReturnsContent";
import { ShippingQuestionsContent } from "./ShippingQuestionsContent";
import { ReturnPolicyContent } from "./ReturnPolicyContent";
import { PaymentOptionsContent } from "./PaymentOptionsContent";
import { SizingHelpContent } from "./SizingHelpContent";
import { useState } from "react";

export function Footer() {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  const [showShippingQuestions, setShowShippingQuestions] = useState(false);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showSizingHelp, setShowSizingHelp] = useState(false);

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 cursor-default">
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
              <li className="text-gray-600 hover:text-black cursor-pointer">
                  Careers
              </li>
              <li className="text-gray-600 hover:text-black cursor-pointer">
                  Press
              </li>
              <li className="text-gray-600 hover:text-black cursor-pointer">
                  Blog
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
                <button
                  onClick={() => setShowShippingInfo(true)}
                  className="text-gray-600 hover:text-black text-left cursor-pointer"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowReturns(true)}
                  className="text-gray-600 hover:text-black text-left cursor-pointer"
                >
                  Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-gray-600 hover:text-black text-left cursor-pointer"
                >
                  Size Guide
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ & Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 cursor-default">
              FAQ
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setShowShippingQuestions(true)}
                  className="text-gray-600 hover:text-black text-left cursor-pointer"
                >
                  Shipping Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowReturnPolicy(true)}
                  className="text-gray-600 hover:text-black text-left cursor-pointer"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPaymentOptions(true)}
                  className="text-gray-600 hover:text-black text-left cursor-pointer"
                >
                  Payment Options
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 cursor-default">
              Resources
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-black cursor-pointer">
                  Style Guide
              </li>
              <li className="text-gray-600 hover:text-black cursor-pointer">
                  Care Instructions
              </li>
              <li className="text-gray-600 hover:text-black cursor-pointer">
                  Sustainability
              </li>
              <li className="text-gray-600 hover:text-black cursor-pointer">
                  Privacy Policy
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              &copy; 2024 SHOP. All rights reserved.
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

      {/* Modals */}
      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />

      <InfoModal isOpen={showShippingInfo} onClose={() => setShowShippingInfo(false)} title="Shipping Info">
        <ShippingInfoContent />
      </InfoModal>

      <InfoModal isOpen={showReturns} onClose={() => setShowReturns(false)} title="Returns">
        <ReturnsContent />
      </InfoModal>

      <InfoModal isOpen={showShippingQuestions} onClose={() => setShowShippingQuestions(false)} title="Shipping Questions">
        <ShippingQuestionsContent />
      </InfoModal>

      <InfoModal isOpen={showReturnPolicy} onClose={() => setShowReturnPolicy(false)} title="Return Policy">
        <ReturnPolicyContent />
      </InfoModal>

      <InfoModal isOpen={showPaymentOptions} onClose={() => setShowPaymentOptions(false)} title="Payment Options">
        <PaymentOptionsContent />
      </InfoModal>

      <InfoModal isOpen={showSizingHelp} onClose={() => setShowSizingHelp(false)} title="Sizing Help">
        <SizingHelpContent />
      </InfoModal>
    </footer>
  );
}