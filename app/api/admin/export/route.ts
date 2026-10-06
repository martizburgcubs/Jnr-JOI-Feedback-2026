import { isAdmin } from "@/app/lib/admin-auth";
import { listResponses } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorised", { status: 401 });
  const rows = await listResponses();
  const headers = rows.length ? Object.keys(rows[0]) : [
    "id", "createdAt", "school", "division", "communication", "infoPack", "gameFormat", "scheduling", "officiating", "facilities", "organisation", "hosting", "accommodation", "meals", "overall", "schedulePace", "strengths", "priorityArea", "highlight", "improvement", "returnIntent", "comments",
  ];
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) {
    lines.push(headers.map((key) => {
      const raw = row[key as keyof typeof row];
      return csvCell(key === "strengths" ? JSON.parse(String(raw)) : raw);
    }).join(","));
  }
  return new Response(`\ufeff${lines.join("\r\n")}`, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=junior-joi-2026-feedback.csv" },
  });
}
