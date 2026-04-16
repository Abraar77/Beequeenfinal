"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import CartItem from "./CartItem";
import Button from "@/components/ui/Button";
import { usePathname } from "next/navigation";

export default function CartDrawer() {
  const pathname = usePathname();
  const { items, isOpen, closeCart, clearCart, totalPrice, totalItems } = useCartStore();
  const count = totalItems();
  const total = totalPrice();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (pathname?.startsWith("/admin")) return null;
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-50 flex flex-col transition-transform duration-400 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #111111 0%, #0D0D0D 100%)",
          borderLeft: "1px solid rgba(212,175,55,0.12)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingCart size={18} className="text-brand-gold" />
            <h2 className="font-display text-lg font-bold text-white">Your Cart</h2>
            {count > 0 && (
              <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-dark-900"
                style={{ background: "linear-gradient(135deg, #E91E8C, #FF2D9B)" }}>
                {count}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <button
                onClick={clearCart}
                suppressHydrationWarning
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Clear cart"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              onClick={closeCart}
              suppressHydrationWarning
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
                <ShoppingCart size={28} className="text-brand-gold/40" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Cart is empty</h3>
              <p className="text-gray-600 text-sm mb-6">Add some products to get started</p>
              <Button variant="pink" size="md" onClick={closeCart}>
                <span>Browse Products</span>
              </Button>
            </div>
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/5 space-y-4"
            style={{ background: "rgba(0,0,0,0.3)" }}>
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-medium">Total</span>
              <span className="font-display text-2xl font-bold text-shimmer">
                {formatPrice(total)}
              </span>
            </div>

            {/* CTA */}
            <Link href="/checkout" onClick={closeCart}>
              <Button variant="pink" size="lg" fullWidth className="gap-2 group">
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/shop" onClick={closeCart}>
              <Button variant="outline" size="md" fullWidth>
                Continue Shopping
              </Button>
            </Link>

            <p className="text-center text-xs text-gray-600">
              🔒 Secure checkout via WhatsApp
            </p>
          </div>
        )}
      </div>
    </>
  );
}
