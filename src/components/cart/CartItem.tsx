"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, getImageUrl } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const img = item.product.images?.[0];

  return (
    <div className="flex gap-3 py-4 border-b border-white/5 group">
      {/* Image */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-dark-700 shrink-0">
        {img ? (
          <Image
            src={getImageUrl(img)}
            alt={item.product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🏔️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-white text-sm font-semibold leading-tight line-clamp-2">
              {item.product.title}
            </p>
            <p className="text-gray-600 text-xs mt-0.5 capitalize">
              {item.product.category.replace(/-/g, " ")}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.product.id)}
            suppressHydrationWarning
            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
          >
            <X size={12} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Qty controls */}
          <div className="flex items-center gap-1 bg-dark-600 rounded-lg p-0.5 border border-white/5">
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              suppressHydrationWarning
              className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <Minus size={10} />
            </button>
            <span className="w-7 text-center text-white text-xs font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              suppressHydrationWarning
              className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
            >
              <Plus size={10} />
            </button>
          </div>

          {/* Price */}
          <span className="text-sm font-bold" style={{
            background: "linear-gradient(135deg, #D4AF37, #F0D060)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {formatPrice(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
