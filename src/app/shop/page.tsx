import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/shop/ProductGrid";
import CategoryStrip from "@/components/home/CategoryStrip";
import FilterBar from "@/components/shop/FilterBar";
import Spinner from "@/components/ui/Spinner";
import type { Metadata } from "next";
import type { Product } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop — Premium Kashmiri Products",
  description: "Browse our full collection of authentic Kashmiri saffron, dry fruits, spices, honey and more.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

async function ProductsSection({ category, sort, search }: {
  category?: string;
  sort?: string;
  search?: string;
}) {
  const supabase = await createClient();
  let query = supabase.from("products").select("*");

  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);

  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "featured":
      query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;
  const items = (products || []) as Product[];

  return (
    <>
      <FilterBar total={items.length} />
      <div className="mt-6">
        <ProductGrid
          products={items}
          emptyMessage={search ? `No products found for "${search}"` : "No products in this category yet. Check back soon!"}
        />
      </div>
    </>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, sort, search } = await searchParams;

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="section-label mb-3">Our Collection</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
            {search
              ? `Results for "${search}"`
              : category
              ? <><span className="text-shimmer capitalize">{category.replace(/-/g, " ")}</span></>
              : <>All <span className="text-shimmer">Products</span></>
            }
          </h1>
        </div>

        {/* Category filter */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <CategoryStrip activeCategory={category} />
          </Suspense>
        </div>

        {/* Products */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <Spinner size="lg" className="text-brand-gold" />
            </div>
          }
        >
          <ProductsSection category={category} sort={sort} search={search} />
        </Suspense>
      </div>
    </div>
  );
}
