"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured" },
];

export default function FilterBar({ total }: { total?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "newest";

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 border-b border-white/5">
      <p className="text-gray-500 text-sm">
        {total !== undefined ? (
          <>
            Showing <span className="text-white font-medium">{total}</span> products
          </>
        ) : (
          "Browse all products"
        )}
      </p>

      <div className="flex items-center gap-2">
        <SlidersHorizontal size={14} className="text-gray-600" />
        <div className="flex items-center gap-1 bg-dark-700 rounded-xl p-1 border border-white/5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              suppressHydrationWarning
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap",
                sort === opt.value
                  ? "text-dark-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              )}
              style={
                sort === opt.value
                  ? { background: "linear-gradient(135deg, #E91E8C, #FF2D9B)" }
                  : {}
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
