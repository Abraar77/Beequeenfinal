import type { Product } from "@/types";
import ProductCard from "@/components/shop/ProductCard";

interface RecommendedProductsProps {
  products: Product[];
  title?: string;
}

export default function RecommendedProducts({ products, title = "You May Also Like" }: RecommendedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="section-label mb-3">Recommended</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
