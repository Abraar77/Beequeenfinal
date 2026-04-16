import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import ProductCard from "@/components/shop/ProductCard";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-label mb-3">Hand-Picked for You</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Featured <span className="text-shimmer">Products</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-brand-gold hover:text-brand-gold-light text-sm font-semibold transition-colors group whitespace-nowrap"
          >
            View All Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
