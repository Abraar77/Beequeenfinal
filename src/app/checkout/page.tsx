import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — BeeQueen of Kashmir",
  description: "Complete your order securely.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="section-label mb-3">Almost There</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
            Complete Your <span className="text-shimmer">Order</span>
          </h1>
          <p className="text-gray-500 mt-3 text-base">
            Fill in your details below and confirm via WhatsApp.
          </p>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
