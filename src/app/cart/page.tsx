"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import CartItem from "@/components/cart/CartItem";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const total = totalPrice();
  const count = totalItems();
  const delivery = total >= 999 ? 0 : 99;

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="section-label mb-2">Review & Checkout</p>
            <h1 className="font-display text-4xl font-bold text-white">
              Your <span className="text-shimmer">Cart</span>
            </h1>
          </div>
          {count > 0 && (
            <button
              onClick={clearCart}
              suppressHydrationWarning
              className="text-sm text-gray-600 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <ShoppingCart size={36} className="text-brand-gold/40" />
            </div>
            <h2 className="text-white font-semibold text-2xl mb-3">Your cart is empty</h2>
            <p className="text-gray-600 text-base mb-8 max-w-sm">
              Discover our premium Kashmiri products and add your favourites.
            </p>
            <Link href="/shop">
              <Button variant="pink" size="lg">
                <span>Start Shopping</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="card-luxury p-6">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card-luxury p-6 space-y-4 sticky top-32">
                <h2 className="text-white font-semibold text-lg">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal ({count} items)</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span className={delivery === 0 ? "text-emerald-400 font-medium" : "text-white"}>
                      {delivery === 0 ? "FREE" : formatPrice(delivery)}
                    </span>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                    <span className="text-white font-bold text-base">Total</span>
                    <span className="font-display text-2xl font-bold text-shimmer">
                      {formatPrice(total + delivery)}
                    </span>
                  </div>
                </div>

                {total < 999 && (
                  <div className="p-3 rounded-xl text-xs text-gray-500"
                    style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.1)" }}>
                    Add {formatPrice(999 - total)} more for free delivery! 🚚
                  </div>
                )}

                <Link href="/checkout">
                  <Button variant="pink" size="lg" fullWidth className="gap-2 group">
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" size="md" fullWidth className="mt-2">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
