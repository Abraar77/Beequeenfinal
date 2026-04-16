import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Edit Product</h1>
        <p className="text-gray-600 text-sm mt-1 truncate">{data.title}</p>
      </div>
      <ProductForm product={data as Product} mode="edit" />
    </div>
  );
}
