"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "All Products", value: "", emoji: "✨" },
  { label: "Honey", value: "honey", emoji: "🍯" },
  { label: "Honey Soap", value: "honey-soap", emoji: "🧴" },
  { label: "Saffron", value: "saffron", emoji: "🌸" },
  { label: "Dry Fruits", value: "dry-fruits", emoji: "🥜" },
  { label: "Shilajit", value: "shilajit", emoji: "💎" },
  { label: "Kahwa & Tea", value: "kahwa-tea", emoji: "🫖" },
  { label: "Oils & Extracts", value: "oils-extracts", emoji: "🫙" },
];

interface CategoryStripProps {
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
}

export default function CategoryStrip({ activeCategory, onCategoryChange }: CategoryStripProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = activeCategory ?? searchParams.get("category") ?? "";

  const handleClick = (value: string) => {
    if (onCategoryChange) {
      onCategoryChange(value);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("category", value);
    else params.delete("category");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <>
      {/* Mobile: 2-column grid cards */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {CATEGORIES.map((cat) => {
          const active = current === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleClick(cat.value)}
              suppressHydrationWarning
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 text-left",
                active
                  ? "text-white shadow-pink"
                  : "text-gray-400 border border-white/5 hover:border-brand-gold/30 hover:text-brand-gold"
              )}
              style={
                active
                  ? { background: "linear-gradient(135deg, #E91E8C, #FF2D9B)", border: "1px solid transparent" }
                  : { background: "rgba(26,26,26,0.8)" }
              }
            >
              <span className="text-xl leading-none shrink-0">{cat.emoji}</span>
              <span className="leading-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: horizontal scrollable pills */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((cat) => {
          const active = current === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleClick(cat.value)}
              suppressHydrationWarning
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 shrink-0",
                active
                  ? "text-white shadow-pink"
                  : "bg-dark-700 text-gray-400 border border-white/5 hover:border-brand-gold/30 hover:text-brand-gold"
              )}
              style={
                active
                  ? { background: "linear-gradient(135deg, #E91E8C, #FF2D9B)" }
                  : {}
              }
            >
              <span className="text-base leading-none">{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
