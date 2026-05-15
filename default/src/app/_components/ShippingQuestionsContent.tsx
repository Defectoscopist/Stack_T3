"use client";

export function ShippingQuestionsContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Do you ship internationally?</h4>
        <p className="text-sm text-neutral-600">
          Yes! We ship to over 60 countries worldwide. International shipping rates and delivery times vary by destination and are calculated at checkout.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">How long does shipping take?</h4>
        <p className="text-sm text-neutral-600">
          Standard shipping takes 5-7 business days within the US. Express shipping takes 2-3 business days. International orders typically arrive within 7-14 business days.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Can I change my shipping address?</h4>
        <p className="text-sm text-neutral-600">
          You can update your shipping address within 1 hour of placing your order. Contact our support team immediately with your order number and new address.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">What if my package is lost?</h4>
        <p className="text-sm text-neutral-600">
          If your package hasn't arrived within the estimated delivery window, contact our support team. We'll track it down and send a replacement if needed.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Do you offer free shipping?</h4>
        <p className="text-sm text-neutral-600">
          Yes, we offer free standard shipping on all orders over $50 within the United States. No promo code needed — the discount is applied automatically at checkout.
        </p>
      </div>
    </div>
  );
}