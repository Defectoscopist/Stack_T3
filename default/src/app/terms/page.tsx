import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SHOP (Demo)",
  description: "Terms of Service for the SHOP demo project.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed">
          <p>
            This is a <strong>demonstration project</strong>. It does not offer, sell or deliver
            any goods or services, and it does not collect or process real payments. Any product
            listings, prices, checkout and order flows are simulated for demonstration purposes.
          </p>
          <p>
            The website is provided <strong>&quot;as is&quot;</strong>, without warranties of any
            kind. It is intended for educational and portfolio use. Data you enter (accounts,
            addresses, orders) may be modified or removed at any time without notice.
          </p>
          <p>
            All product images are free images from Unsplash (see the{" "}
            <a href="/about" className="text-gray-900 underline underline-offset-2">
              About
            </a>{" "}
            page for details). All other code and content on this site are the project author&apos;s.
          </p>
        </div>
      </div>
    </div>
  );
}
