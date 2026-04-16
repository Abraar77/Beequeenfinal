"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Star, Shield, Truck, Package } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const discount = calculateDiscount(product.original_price ?? 0, product.price);
  const inStock = product.stock > 0;

  const inc = () => setQuantity((q) => Math.min(q + 1, Math.min(product.stock, 10)));
  const dec = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem(product, quantity);
    openCart();
    toast.success(`${quantity} × ${product.title} added!`, { icon: "🛒" });
  };

  return (
    <div className="space-y-6">
      {/* Badges row */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="gold">{product.category.replace(/-/g, " ")}</Badge>
        {product.featured && <Badge variant="pink">Featured</Badge>}
        {!inStock && <Badge variant="red">Out of Stock</Badge>}
        {inStock && product.stock < 10 && (
          <Badge variant="gray">Only {product.stock} left</Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
        {product.title}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={14} className="text-brand-gold fill-brand-gold" />
          ))}
        </div>
        <span className="text-gray-500 text-sm">(4.8/5 · 100+ reviews)</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-4xl font-bold text-shimmer">
          {formatPrice(product.price)}
        </span>
        {product.original_price && product.original_price > product.price && (
          <>
            <span className="text-xl text-gray-600 line-through">
              {formatPrice(product.original_price)}
            </span>
            <Badge variant="pink">{discount}% OFF</Badge>
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-gray-400 leading-relaxed text-base">{product.description}</p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Quantity */}
      {inStock && (
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm font-medium">Quantity</span>
          <div className="flex items-center gap-3 bg-dark-700 rounded-xl p-1 border border-white/5">
            <button
              onClick={dec}
              disabled={quantity <= 1}
              suppressHydrationWarning
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-white font-semibold text-sm">{quantity}</span>
            <button
              onClick={inc}
              disabled={quantity >= Math.min(product.stock, 10)}
              suppressHydrationWarning
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-gray-600 text-sm">{product.stock} available</span>
        </div>
      )}

      {/* Add to cart */}
      <Button
        variant={inStock ? "pink" : "ghost"}
        size="xl"
        fullWidth
        onClick={handleAddToCart}
        disabled={!inStock}
        className="gap-3 text-base"
      >
        <ShoppingCart size={18} />
        <span>{inStock ? `Add to Cart — ${formatPrice(product.price * quantity)}` : "Out of Stock"}</span>
      </Button>

      {/* Trust row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Shield, text: "100% Authentic" },
          { icon: Truck, text: "Fast Delivery" },
          { icon: Package, text: "Secure Pack" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
            style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.1)" }}>
            <Icon size={16} className="text-brand-gold" />
            <span className="text-[10px] text-gray-500 font-medium">{text}</span>
          </div>
        ))}
      </div>

      {/* Product details */}
      <div className="space-y-3 pt-2">
        <h3 className="text-white font-semibold text-sm">Product Details</h3>
        <div className="space-y-2">
          {([
            { label: "Category", value: product.category.replace(/-/g, " ") },
            ...(product.subcategory ? [{ label: "Type", value: product.subcategory }] : []),
            { label: "Stock", value: inStock ? `${product.stock} units available` : "Out of stock" },
          ] as { label: string; value: string }[]).map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                <span className="text-gray-600">{row.label}</span>
                <span className="text-gray-300 font-medium capitalize">{row.value}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
