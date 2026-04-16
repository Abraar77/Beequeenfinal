import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "admin_token";
const ADMIN_LOGIN = "/admin";
const PROTECTED_PREFIX = "/admin/";
const ISSUER = "beequeenofkashmir";
const AUDIENCE = "admin-panel";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

async function isValidAdmin(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes (but not /admin itself — the login page)
  if (pathname.startsWith(PROTECTED_PREFIX)) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }

    const valid = await isValidAdmin(token);
    if (!valid) {
      const response = NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
      response.cookies.delete(ADMIN_COOKIE);
      return response;
    }
  }

  // If already logged-in admin visits /admin login page → redirect to dashboard
  if (pathname === ADMIN_LOGIN) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (token) {
      const valid = await isValidAdmin(token);
      if (valid) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
