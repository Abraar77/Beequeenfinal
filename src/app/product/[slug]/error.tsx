"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ProductPage] error:", error);
  }, [error]);

  return (
    <div className="min-h-screen pt-36 pb-8 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🍯</div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Couldn&apos;t load this product
        </h1>
        <p className="text-gray-500 mb-8">
          Something went wrong while fetching this product. Please try again or
          browse our shop.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #E91E8C 0%, #FF2D9B 100%)" }}
          >
            Try Again
          </button>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-300 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
