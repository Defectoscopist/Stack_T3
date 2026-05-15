"use client";

import { RotateCcw, Shield, AlertTriangle } from "lucide-react";

export function ReturnPolicyContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
        <RotateCcw className="w-5 h-5 text-neutral-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-neutral-900 mb-1">30-Day Return Window</h4>
          <p className="text-sm text-neutral-600">
            You have 30 calendar days from the date of delivery to initiate a return. Items must be unworn, unwashed, and with all original tags attached.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
        <Shield className="w-5 h-5 text-neutral-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-neutral-900 mb-1">Free Returns</h4>
          <p className="text-sm text-neutral-600">
            We provide a prepaid return label with every order. Return shipping is free for all customers within the United States.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
        <RotateCcw className="w-5 h-5 text-neutral-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-neutral-900 mb-1">Quality Guarantee</h4>
          <p className="text-sm text-neutral-600">
            If you receive a defective or incorrect item, we'll replace it free of charge. Contact our support team within 7 days of delivery.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-red-800 mb-1">Exceptions</h4>
          <p className="text-sm text-red-700">
            Final sale items, underwear, swimwear, and accessories (hats, belts, jewelry) are not eligible for return unless defective. Gift cards are non-refundable.
          </p>
        </div>
      </div>
    </div>
  );
}