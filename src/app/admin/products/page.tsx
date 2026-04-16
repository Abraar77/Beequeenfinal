import Link from "next/link";
import { Plus } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import ProductTable from "@/components/admin/ProductTable";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const products = (data || []) as Product[];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-600 text-sm mt-1">{products.length} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-dark-900 transition-all hover:shadow-pink"
          style={{ background: "linear-gradient(135deg, #E91E8C, #FF2D9B)" }}
        >
          <Plus size={15} />
          <span>Add Product</span>
        </Link>
      </div>

      <ProductTable products={products} />
    </div>
  );
}
