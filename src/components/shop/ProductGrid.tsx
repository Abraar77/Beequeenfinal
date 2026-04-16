import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({ products, emptyMessage }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
          <Package size={28} className="text-brand-gold/50" />
        </div>
        <h3 className="text-white font-semibold text-xl mb-2">No products found</h3>
        <p className="text-gray-600 text-sm max-w-xs">
          {emptyMessage || "Try adjusting your filters or search terms."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
