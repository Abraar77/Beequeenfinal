import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "100");

    const supabase = await createClient();
    let query = supabase.from("products").select("*");

    if (category) query = query.eq("category", category);
    if (featured === "true") query = query.eq("featured", true);
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

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/products:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
