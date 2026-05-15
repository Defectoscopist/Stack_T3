"use client";

export function SizingHelpContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Finding Your Fit</h4>
        <p className="text-sm text-neutral-600">
          Use our detailed Size Guide for exact measurements of each garment. We recommend measuring a similar item you already own and comparing it to our size chart.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Size Charts</h4>
        <p className="text-sm text-neutral-600">
          Every product page has a "Size Guide" button that shows the specific measurements for that item. Sizes may vary slightly between different styles and fabrics.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Fit Tips</h4>
        <p className="text-sm text-neutral-600">
          If you're between sizes, we suggest sizing up for a relaxed fit or sizing down for a more tailored look. Check the product description for specific fit notes.
        </p>
      </div>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-neutral-900 mb-2">Need More Help?</h4>
        <p className="text-sm text-neutral-600">
          Contact our customer service team with your measurements and the item you're interested in — we'll help you find the perfect fit!
        </p>
      </div>
    </div>
  );
}