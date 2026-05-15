"use client";

export function ReturnsContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">30-Day Return Policy</h4>
        <p className="text-sm text-neutral-600">
          Items must be unworn with original tags attached. Free returns on all orders within 30 days of delivery.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">How to Return</h4>
        <p className="text-sm text-neutral-600">
          Print the prepaid return label included in your package. Pack the item securely with all tags, attach the label, and drop it off at any shipping carrier location.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Exchanges</h4>
        <p className="text-sm text-neutral-600">
          We offer free size exchanges. Place a new order and return the original item for a full refund — it's the fastest way to get the correct size.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Refund Timeline</h4>
        <p className="text-sm text-neutral-600">
          Refunds are processed within 5-7 business days after we receive your return. The refund will be issued to your original payment method.
        </p>
      </div>
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-800">
          <strong>Final Sale Items:</strong> Items marked as final sale cannot be returned or exchanged unless defective.
        </p>
      </div>
    </div>
  );
}