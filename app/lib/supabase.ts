import { env } from "cloudflare:workers";

export type StoredResponse = {
  id: string;
  createdAt: string;
  school: string;
  division: string;
  communication: number;
  infoPack: number;
  gameFormat: number;
  scheduling: number;
  officiating: number;
  facilities: number;
  organisation: number;
  hosting: number;
  accommodation: number;
  meals: number;
  overall: number;
  schedulePace: string;
  strengths: string;
  priorityArea: string;
  highlight: string;
  improvement: string;
  returnIntent: string;
  comments: string;
};

type SupabaseRow = {
  id: string;
  created_at: string;
  school: string;
  division: string;
  communication: number;
  info_pack: number;
  game_format: number;
  scheduling: number;
  officiating: number;
  facilities: number;
  organisation: number;
  hosting: number;
  accommodation: number;
  meals: number;
  overall: number;
  schedule_pace: string;
  strengths: string[];
  priority_area: string;
  highlight: string;
  improvement: string;
  return_intent: string;
  comments: string;
};

function settings(kind: "public" | "admin") {
  const url = env.SUPABASE_URL?.replace(/\/$/, "");
  const key = kind === "admin"
    ? (env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY)
    : (env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY);
  if (!url || !key) throw new Error(`Supabase ${kind} settings are not configured`);
  return { url, key };
}

export async function insertResponse(row: Omit<SupabaseRow, "id" | "created_at">) {
  const { url, key } = settings("public");
  const response = await fetch(`${url}/rest/v1/joi_feedback`, {
    method: "POST",
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(`Supabase insert failed (${response.status}): ${await response.text()}`);
}

export async function listResponses(): Promise<StoredResponse[]> {
  const { url, key } = settings("admin");
  const response = await fetch(`${url}/rest/v1/joi_feedback?select=*&order=created_at.desc`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase query failed (${response.status}): ${await response.text()}`);
  const rows = await response.json() as SupabaseRow[];
  return rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    school: row.school,
    division: row.division,
    communication: row.communication,
    infoPack: row.info_pack,
    gameFormat: row.game_format,
    scheduling: row.scheduling,
    officiating: row.officiating,
    facilities: row.facilities,
    organisation: row.organisation,
    hosting: row.hosting,
    accommodation: row.accommodation,
    meals: row.meals,
    overall: row.overall,
    schedulePace: row.schedule_pace,
    strengths: JSON.stringify(row.strengths ?? []),
    priorityArea: row.priority_area,
    highlight: row.highlight ?? "",
    improvement: row.improvement ?? "",
    returnIntent: row.return_intent,
    comments: row.comments ?? "",
  }));
}
