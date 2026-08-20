import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SHOP (Demo)",
  description: "Privacy policy for the SHOP demo project.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-lg font-semibold text-gray-900 pt-2">What we collect</h2>
          <p>
            You can browse the site without an account. If you choose to sign in, we receive from
            the authentication provider you use (GitHub, Google, VK or Yandex) the information you
            agreed to share there — typically your <strong>name, email address and profile
            picture</strong>. You may also voluntarily enter <strong>address and order</strong>{" "}
            information (e.g. when placing a simulated order).
          </p>

          <h2 className="text-lg font-semibold text-gray-900 pt-2">How we use it</h2>
          <p>
            This data is used solely to operate the demo: to identify you, save your profile,
            wishlist, reviews and simulate orders. It is stored in the project&apos;s database for
            the lifetime of the demo. We do <strong>not</strong> sell or share your data with third
            parties — the only external party involved is the authentication provider you chose, and
            only for the purpose of signing you in (with your consent given on their side).
          </p>

          <h2 className="text-lg font-semibold text-gray-900 pt-2">Your rights</h2>
          <p>
            Since this is a demonstration project, you can stop using it at any time. To request
            access to or deletion of your data, contact us via the{" "}
            <a href="/contact" className="text-gray-900 underline underline-offset-2">
              Contact
            </a>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}
