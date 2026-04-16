import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RecommendedProducts from "@/components/product/RecommendedProducts";
import type { Metadata } from "next";
import type { Product } from "@/types";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("title, description, images")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} — BeeQueen of Kashmir`,
    description: product.description || "Premium authentic Kashmiri product.",
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

// Pre-build featured product pages at deploy time; others generate on first visit
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    // Use direct supabase-js (no cookies) — safe to call at build time
    const { createClient: createDirectClient } = await import("@supabase/supabase-js");
    const supabase = createDirectClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("products")
      .select("slug")
      .eq("featured", true)
      .limit(20);
    return (data || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  // Fetch recommendations
  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .order("featured", { ascending: false })
    .limit(8);

  let recommendations = (related || []) as Product[];

  // If fewer than 4, supplement with featured
  if (recommendations.length < 4) {
    const { data: featured } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .neq("id", product.id)
      .limit(4);

    const extraIds = new Set(recommendations.map((p) => p.id));
    const extras = ((featured || []) as Product[]).filter((p) => !extraIds.has(p.id));
    recommendations = [...recommendations, ...extras].slice(0, 4);
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-8">
      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-600 mb-8">
          <a href="/" className="hover:text-brand-gold transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-brand-gold transition-colors">Shop</a>
          <span>/</span>
          <a href={`/shop?category=${product.category ?? ""}`} className="hover:text-brand-gold transition-colors capitalize">
            {(product.category ?? "").replace(/-/g, " ")}
          </a>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery images={product.images ?? []} title={product.title} />
          <ProductInfo product={product as Product} />
        </div>
      </div>

      {/* Recommendations */}
      <RecommendedProducts products={recommendations} />
    </div>
  );
}
