import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendOwnerWhatsApp } from "@/lib/notify";
import { z } from "zod";

// ─── Rate limiting (in-memory, resets on cold start) ───────────────────────
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;          // max orders per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const REQUEST_SIZE_LIMIT = 10_000;  // 10 KB max body

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  // Prune expired entries to prevent unbounded memory growth
  if (rateLimitStore.size > 5000) {
    for (const [key, val] of rateLimitStore) {
      if (now > val.resetAt) rateLimitStore.delete(key);
    }
  }
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ─── Validation schema ──────────────────────────────────────────────────────
const schema = z.object({
  customer_name: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email().max(200),
  location: z.string().min(5).max(500),
  items: z.array(z.object({
    product: z.object({
      id: z.string(),
      title: z.string().max(200),
      price: z.number().positive(),
      images: z.array(z.string()).optional(),
    }),
    quantity: z.number().int().positive().max(100),
  })).min(1).max(50),
  total_price: z.number().positive().max(1_000_000),
});

export async function POST(request: NextRequest) {
  try {
    // ── IP extraction ──────────────────────────────────────────────────────
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    // ── Request size guard ─────────────────────────────────────────────────
    const contentLength = parseInt(request.headers.get("content-length") ?? "0", 10);
    if (contentLength > REQUEST_SIZE_LIMIT) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    // ── Rate limit ─────────────────────────────────────────────────────────
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many orders from this IP. Please try again later." },
        { status: 429, headers: { "Retry-After": "3600" } }
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order data", details: parsed.error.errors }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: parsed.data.customer_name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        location: parsed.data.location,
        items: parsed.data.items,
        total_price: parsed.data.total_price,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/orders supabase error:", error);
      return NextResponse.json({ error: error.message || "Database error" }, { status: 500 });
    }

    // ── WhatsApp notification (fire-and-forget) ────────────────────────────
    const now = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const itemLines = parsed.data.items
      .map((item) => `• ${item.product.title} × ${item.quantity} = ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}`)
      .join("\n");

    const msg =
      `🛒 *New Order — BeeQueen of Kashmir*\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 *Name:* ${parsed.data.customer_name}\n` +
      `📞 *Phone:* ${parsed.data.phone}\n` +
      `📧 *Email:* ${parsed.data.email}\n` +
      `📍 *Address:* ${parsed.data.location}\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `🛍️ *Items:*\n${itemLines}\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total: ₹${parsed.data.total_price.toLocaleString("en-IN")}*\n\n` +
      `🕐 ${now}`;

    sendOwnerWhatsApp(msg).catch(() => {});

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create order";
    console.error("POST /api/orders:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
