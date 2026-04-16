import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, verifyAdminPassword, verifyStoredPassword, ADMIN_COOKIE } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

// ─── Brute-force protection (in-memory) ────────────────────────────────────
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function checkLoginAttempt(ip: string): { allowed: boolean; retryAfterSecs?: number } {
  const now = Date.now();
  // Prune expired entries to prevent memory leak
  if (loginAttempts.size > 1000) {
    for (const [key, val] of loginAttempts) {
      if (now > val.resetAt) loginAttempts.delete(key);
    }
  }
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOCKOUT_MS });
    return { allowed: true };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSecs: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true };
}

function resetLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, retryAfterSecs } = checkLoginAttempt(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${Math.ceil((retryAfterSecs ?? 900) / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(retryAfterSecs ?? 900) } }
    );
  }

  try {
    const { password } = await request.json();

    // Check DB-stored password first (set via Change Password); fall back to env var
    let passwordValid = false;
    try {
      const supabase = createServiceClient();
      const { data } = await supabase
        .from("admin_settings")
        .select("value")
        .eq("key", "admin_password")
        .single();
      if (data?.value) {
        passwordValid = await verifyStoredPassword(password, data.value);
      }
    } catch {
      // Table may not exist yet — fall through to env var check
    }
    if (!passwordValid) {
      passwordValid = verifyAdminPassword(password);
    }
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Correct password — reset brute-force counter
    resetLoginAttempts(ip);

    const token = await signAdminToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
