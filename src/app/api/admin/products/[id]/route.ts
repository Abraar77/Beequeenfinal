import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  original_price: z.number().optional().nullable(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("products")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
