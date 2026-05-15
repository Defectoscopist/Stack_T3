"use client";

import { CreditCard, Shield, Smartphone, Banknote } from "lucide-react";

export function PaymentOptionsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
        <CreditCard className="w-5 h-5 text-neutral-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-neutral-900 mb-1">Credit & Debit Cards</h4>
          <p className="text-sm text-neutral-600">
            We accept Visa, Mastercard, American Express, and Discover. Your payment information is encrypted and secure.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
        <Smartphone className="w-5 h-5 text-neutral-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-neutral-900 mb-1">Digital Wallets</h4>
          <p className="text-sm text-neutral-600">
            Pay conveniently with Apple Pay, Google Pay, PayPal, and Shop Pay. No need to enter your card details manually.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
        <Banknote className="w-5 h-5 text-neutral-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-neutral-900 mb-1">Buy Now, Pay Later</h4>
          <p className="text-sm text-neutral-600">
            Split your purchase into 4 interest-free payments with Klarna or Afterpay. Available at checkout on orders up to $1,000.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
        <Shield className="w-5 h-5 text-neutral-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-neutral-900 mb-1">Secure Checkout</h4>
          <p className="text-sm text-neutral-600">
            All transactions are processed over a secure 256-bit SSL connection. We never store your full payment details on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}