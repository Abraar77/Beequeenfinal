"use client";

import Link from "next/link";
import { ShoppingCart, Star, Package } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import ImageCarousel from "./ImageCarousel";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const discount = calculateDiscount(product.original_price ?? 0, product.price);
  const inStock = product.stock > 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(product, 1);
    openCart();
    toast.success(`${product.title} added to cart!`, {
      icon: "🛒",
    });
  }

  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <div className="product-card relative overflow-hidden">
        {/* Image */}
        <div className="relative">
          <ImageCarousel
            images={product.images}
            title={product.title}
            aspectRatio="square"
            className="rounded-t-xl rounded-b-none"
          />

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {product.featured && (
              <Badge variant="gold">Featured</Badge>
            )}
            {discount > 0 && (
              <Badge variant="pink">{discount}% OFF</Badge>
            )}
            {!inStock && (
              <Badge variant="red">Out of Stock</Badge>
            )}
          </div>

          {/* Quick buy overlay */}
          <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/20 transition-all duration-300 rounded-t-xl z-10 pointer-events-none" />
        </div>

        {/* Info */}
        <div className="p-4 space-y-3">
          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {product.category.replace(/-/g, " ")}
            </span>
            <div className="flex items-center gap-1">
              <Star size={10} className="text-brand-gold fill-brand-gold" />
              <span className="text-[10px] text-gray-500">4.9</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors duration-200">
            {product.title}
          </h3>

          {/* Price row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg" style={{
                background: "linear-gradient(135deg, #D4AF37, #F0D060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-gray-600 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            {inStock && product.stock < 10 && (
              <span className="text-[10px] text-orange-400 font-medium flex items-center gap-1">
                <Package size={9} />
                {product.stock} left
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              inStock
                ? "text-white hover:-translate-y-px hover:shadow-[0_0_20px_rgba(233,30,140,0.4)]"
                : "cursor-not-allowed text-gray-500/50"
            }`}
            style={inStock
              ? { background: "linear-gradient(135deg, #E91E8C 0%, #FF2D9B 100%)" }
              : { background: "rgba(255,255,255,0.05)" }
            }
          >
            <ShoppingCart size={14} />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </Link>
  );
}
