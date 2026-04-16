import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  original_price: z.number().optional().nullable(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  stock: z.number().int().min(0),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
});

export async function GET() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/admin/products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch products";
    console.error("GET /api/admin/products:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Generate unique slug
    let slug = slugify(parsed.data.title);
    const { data: existing } = await supabase
      .from("products")
      .select("slug")
      .ilike("slug", `${slug}%`);

    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const { data, error } = await supabase
      .from("products")
      .insert({ ...parsed.data, slug })
      .select()
      .single();

    if (error) {
      console.error("POST /api/admin/products supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create product";
    console.error("POST /api/admin/products:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
