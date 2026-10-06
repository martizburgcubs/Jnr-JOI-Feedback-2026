import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { setAdminCookie } from "@/app/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { passcode } = (await request.json()) as { passcode?: string };
  if (!env.ADMIN_PASSCODE || passcode !== env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
