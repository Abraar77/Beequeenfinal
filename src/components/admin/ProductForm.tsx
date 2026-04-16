"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUploader from "./ImageUploader";
import toast from "react-hot-toast";
import type { Product } from "@/types";

const schema = z.object({
  title: z.string().min(2, "Title required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  original_price: z.coerce.number().optional(),
  category: z.string().min(1, "Category required"),
  subcategory: z.string().optional(),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof schema>;

const CATEGORIES = [
  { value: "honey", label: "Honey" },
  { value: "honey-soap", label: "Honey Soap" },
  { value: "saffron", label: "Saffron" },
  { value: "dry-fruits", label: "Dry Fruits" },
  { value: "spices", label: "Spices" },
  { value: "kahwa-tea", label: "Kahwa & Tea" },
  { value: "shilajit", label: "Shilajit" },
  { value: "oils-extracts", label: "Oils & Extracts" },
  { value: "other", label: "Other" },
];

interface ProductFormProps {
  product?: Partial<Product>;
  mode?: "create" | "edit";
}

export default function ProductForm({ product, mode = "create" }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      original_price: product?.original_price || undefined,
      category: product?.category || "",
      subcategory: product?.subcategory || "",
      stock: product?.stock ?? 0,
      featured: product?.featured || false,
      images: product?.images || [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const url =
        mode === "edit" ? `/api/admin/products/${product?.id}` : "/api/admin/products";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save product");
      }

      toast.success(mode === "edit" ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Images */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-dark-900"
            style={{ background: "linear-gradient(135deg, #D4AF37, #F0D060)" }}>1</span>
          Product Images
        </h3>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploader value={field.value} onChange={field.onChange} maxImages={6} />
          )}
        />
      </div>

      {/* Basic Info */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-dark-900"
            style={{ background: "linear-gradient(135deg, #D4AF37, #F0D060)" }}>2</span>
          Basic Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Product Title"
            placeholder="e.g. Premium Kashmiri Saffron — Grade A"
            error={errors.title?.message}
            {...register("title")}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              placeholder="Describe the product in detail — origin, quality, benefits..."
              rows={5}
              className="input-luxury w-full px-4 py-3 text-sm resize-none"
              suppressHydrationWarning
              {...register("description")}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-dark-900"
            style={{ background: "linear-gradient(135deg, #D4AF37, #F0D060)" }}>3</span>
          Pricing & Stock
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Selling Price (₹)"
            type="number"
            placeholder="599"
            error={errors.price?.message}
            {...register("price")}
          />
          <Input
            label="Original Price (₹)"
            type="number"
            placeholder="799 (optional)"
            error={errors.original_price?.message}
            {...register("original_price")}
          />
          <Input
            label="Stock (units)"
            type="number"
            placeholder="100"
            error={errors.stock?.message}
            {...register("stock")}
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-dark-900"
            style={{ background: "linear-gradient(135deg, #D4AF37, #F0D060)" }}>4</span>
          Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Category</label>
            <select
              className="input-luxury px-4 py-3 text-sm appearance-none cursor-pointer"
              suppressHydrationWarning
              {...register("category")}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} style={{ background: "#1A1A1A" }}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-400">{errors.category.message}</p>}
          </div>
          <Input
            label="Subcategory (optional)"
            placeholder="e.g. Pure, Organic, Grade A"
            {...register("subcategory")}
          />
        </div>
      </div>

      {/* Featured toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl"
        style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.1)" }}>
        <div>
          <p className="text-white font-medium text-sm">Mark as Featured</p>
          <p className="text-gray-600 text-xs mt-0.5">Featured products appear on the homepage</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" suppressHydrationWarning {...register("featured")} />
          <div className="w-11 h-6 bg-dark-500 peer-checked:bg-brand-pink peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors duration-200" />
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="pink" size="lg" loading={loading} className="flex-1 sm:flex-none">
          <span>{mode === "edit" ? "Update Product" : "Create Product"}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
