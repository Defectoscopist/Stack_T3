import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — SHOP (Demo)",
  description: "Cookie policy for the SHOP demo project.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-lg font-semibold text-gray-900 pt-2">What are cookies?</h2>
          <p>
            Cookies are small text files that a website stores in your browser. They are used, for
            example, to remember your login state or site preferences.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 pt-2">What we use</h2>
          <p>
            This demo uses a single, <strong>essential</strong> cookie for authentication:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2 border-b border-gray-200">Cookie</th>
                  <th className="px-3 py-2 border-b border-gray-200">Purpose</th>
                  <th className="px-3 py-2 border-b border-gray-200">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border-b border-gray-100 font-mono text-xs">
                    next-auth.session-token
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100">
                    Keeps you signed in (session). HttpOnly, sent only to our site.
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100">Essential / functional</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Because this cookie is strictly necessary for signing in, it does <strong>not</strong>{" "}
            require prior consent, but we still inform you about it. We use{" "}
            <strong>no tracking, analytics, advertising or third-party cookies</strong>.
          </p>
          <p>
            The shopping cart is stored in your browser&apos;s <code className="text-xs">localStorage</code>,
            which is <strong>not a cookie</strong> and is not sent to the server on every request.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 pt-2">How to control cookies</h2>
          <p>
            You can view, block or delete cookies in your browser settings. Blocking the session
            cookie will prevent you from signing in, but the rest of the site will still work.
          </p>
        </div>
      </div>
    </div>
  );
}
