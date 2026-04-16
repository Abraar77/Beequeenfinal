import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

const BUCKET = "products";
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: NextRequest) {
  // 1. Verify admin session
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Check server env
  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables." },
      { status: 503 }
    );
  }

  // 3. Parse form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // 4. Validate type and size
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum is 5 MB." },
      { status: 400 }
    );
  }

  // 5. Ensure bucket exists (create if needed — idempotent)
  const { error: bucketError } = await supabaseAdmin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_SIZE_BYTES,
    allowedMimeTypes: ALLOWED_TYPES,
  });
  // Ignore "already exists" errors; anything else is a real problem
  if (bucketError && !bucketError.message.includes("already exists")) {
    console.error("[upload] bucket init error:", bucketError);
    return NextResponse.json(
      { error: `Storage bucket error: ${bucketError.message}` },
      { status: 500 }
    );
  }

  // 6. Upload file
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[upload] storage upload error:", uploadError);
    return NextResponse.json(
      { error: uploadError.message || "Upload failed" },
      { status: 500 }
    );
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);

  return NextResponse.json({ url: data.publicUrl }, { status: 200 });
}
