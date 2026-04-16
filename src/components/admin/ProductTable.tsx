"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Star, Package, AlertCircle } from "lucide-react";
import { formatPrice, getImageUrl } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products: initial }: ProductTableProps) {
  const [products, setProducts] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success("Product deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package size={40} className="text-brand-gold/30 mb-4" />
        <p className="text-white font-semibold mb-2">No products yet</p>
        <p className="text-gray-600 text-sm mb-5">Add your first product to get started.</p>
        <Link href="/admin/products/new" className="btn-pink px-6 py-2.5 text-sm font-semibold">
          <span>Add Product</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium">Price</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium">Stock</th>
            <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-white/2 transition-colors group">
              {/* Product */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-dark-700 shrink-0">
                    {p.images?.[0] ? (
                      <Image
                        src={getImageUrl(p.images[0])}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🏔️</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate max-w-[200px]">{p.title}</p>
                    <p className="text-gray-600 text-xs truncate max-w-[200px]">/product/{p.slug}</p>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-4 py-3">
                <Badge variant="gray">{p.category}</Badge>
              </td>

              {/* Price */}
              <td className="px-4 py-3 text-right">
                <span className="text-brand-gold font-bold">{formatPrice(p.price)}</span>
                {p.original_price && p.original_price > p.price && (
                  <div className="text-xs text-gray-600 line-through">{formatPrice(p.original_price)}</div>
                )}
              </td>

              {/* Stock */}
              <td className="px-4 py-3 text-right">
                <span className={`font-medium ${p.stock === 0 ? "text-red-400" : p.stock < 10 ? "text-orange-400" : "text-gray-300"}`}>
                  {p.stock}
                </span>
                {p.stock === 0 && <AlertCircle size={12} className="text-red-400 inline ml-1" />}
              </td>

              {/* Status */}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {p.featured && (
                    <Star size={12} className="text-brand-gold fill-brand-gold" />
                  )}
                  <Badge variant={p.stock > 0 ? "green" : "red"}>
                    {p.stock > 0 ? "In Stock" : "OOS"}
                  </Badge>
                </div>
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-brand-gold hover:bg-brand-gold/10 transition-all"
                  >
                    <Edit size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    disabled={deleting === p.id}
                    suppressHydrationWarning
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
