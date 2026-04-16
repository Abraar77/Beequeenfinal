import { SignJWT, jwtVerify } from "jose";

const ISSUER = "beequeenofkashmir";
const AUDIENCE = "admin-panel";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
};

export async function signAdminToken(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
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

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

export const ADMIN_COOKIE = "admin_token";
