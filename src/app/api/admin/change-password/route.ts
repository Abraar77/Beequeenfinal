import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyAdminToken,
  verifyAdminPassword,
  verifyStoredPassword,
  hashPasswordForStorage,
  validatePasswordStrength,
  ADMIN_COOKIE,
} from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // 1. Verify admin session
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  let body: { currentPassword?: string; newPassword?: string; confirmPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { currentPassword, newPassword, confirmPassword } = body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
  }

  // 3. Validate new password strength
  const strengthError = validatePasswordStrength(newPassword);
  if (strengthError) {
    return NextResponse.json({ error: strengthError }, { status: 400 });
  }

  // 4. Verify current password (DB first, then env var)
  const supabase = createServiceClient();
  let currentValid = false;
  try {
    const { data } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password")
      .single();
    if (data?.value) {
      currentValid = await verifyStoredPassword(currentPassword, data.value);
    }
  } catch {
    // Table may not exist yet
  }
  if (!currentValid) {
    currentValid = verifyAdminPassword(currentPassword);
  }
  if (!currentValid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  // 5. Hash and store new password
  const hashed = await hashPasswordForStorage(newPassword);

  const { error: upsertError } = await supabase.from("admin_settings").upsert(
    { key: "admin_password", value: hashed, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );

  if (upsertError) {
    console.error("[change-password] upsert error:", upsertError);
    return NextResponse.json(
      { error: "Failed to save new password. Make sure the admin_settings table exists in Supabase." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
