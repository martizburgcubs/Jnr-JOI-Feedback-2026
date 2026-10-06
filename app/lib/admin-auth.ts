import { cookies } from "next/headers";
import { env } from "cloudflare:workers";

const COOKIE_NAME = "joi_admin";

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signature() {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return bytesToHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("junior-joi-2026-admin")));
}

export async function isAdmin() {
  if (process.env.NODE_ENV !== "production") return true;
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  return Boolean(value) && value === (await signature());
}

export async function setAdminCookie() {
  (await cookies()).set(COOKIE_NAME, await signature(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 12 });
}

export async function clearAdminCookie() {
  (await cookies()).set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
}
