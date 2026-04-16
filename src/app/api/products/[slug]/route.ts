import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
