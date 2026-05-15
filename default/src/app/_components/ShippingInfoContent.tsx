"use client";

export function ShippingInfoContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Standard Shipping</h4>
        <p className="text-sm text-neutral-600">
          5-7 business days — $5.99. Free on orders over $50.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Express Shipping</h4>
        <p className="text-sm text-neutral-600">
          2-3 business days — $12.99. Available for most locations.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">International Shipping</h4>
        <p className="text-sm text-neutral-600">
          7-14 business days — rates calculated at checkout. Customs fees may apply.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Order Tracking</h4>
        <p className="text-sm text-neutral-600">
          Once your order ships, you'll receive a tracking number via email. You can also track your order from your account dashboard.
        </p>
      </div>
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Delivery times may be affected by holidays, weather conditions, or other unforeseen circumstances.
        </p>
      </div>
    </div>
  );
}