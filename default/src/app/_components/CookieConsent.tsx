"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "shop-cookie-consent-v1";

/**
 * Minimal cookie notice. The site only sets an essential authentication cookie,
 * so no consent is legally required — this banner just informs the user, per the
 * Cookie Policy (/cookies).
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // storage unavailable — ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <p className="text-sm text-gray-600 flex-1">
          This demo uses an essential cookie to keep you signed in. We don&apos;t use tracking
          cookies.{" "}
          <Link href="/cookies" className="text-gray-900 underline underline-offset-2">
            Learn more
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 bg-black text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
