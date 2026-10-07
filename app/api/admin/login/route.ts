import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { setAdminCookie } from "@/app/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { passcode } = (await request.json()) as { passcode?: string };
  const configuredPasscode = env.ADMIN_PASSCODE?.trim();
  if (!configuredPasscode) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }
  if (passcode?.trim() !== configuredPasscode) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
