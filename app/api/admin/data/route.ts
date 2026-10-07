import { NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/admin-auth";
import { listResponses } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    const rows = await listResponses();
    return NextResponse.json({ responses: rows });
  } catch (caught) {
    console.error("Admin feedback query failed", caught);
    const detail = caught instanceof Error ? caught.message : "Unknown database error";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
