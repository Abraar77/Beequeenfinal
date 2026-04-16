import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/admin/orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch orders";
    console.error("GET /api/admin/orders:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
