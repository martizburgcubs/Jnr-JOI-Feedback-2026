import { NextResponse } from "next/server";
import { z } from "zod";
import { insertResponse } from "@/app/lib/supabase";
import { AREA_OPTIONS, DIVISION_OPTIONS } from "@/app/lib/survey";

export const dynamic = "force-dynamic";

const rating = z.number().int().min(1).max(5);
const ratingsSchema = z.object({
  communication: rating,
  infoPack: rating,
  gameFormat: rating,
  scheduling: rating,
  officiating: rating,
  facilities: rating,
  organisation: rating,
  hosting: rating,
  accommodation: rating,
  meals: rating,
  overall: rating,
});
const schema = z.object({
  school: z.string().trim().min(2).max(120),
  division: z.enum(DIVISION_OPTIONS),
  ratings: ratingsSchema,
  schedulePace: z.enum(["Too compressed", "Slightly compressed", "Well balanced", "Too spread out"]),
  strengths: z.array(z.enum(AREA_OPTIONS)).min(1).max(3),
  priorityArea: z.enum([...AREA_OPTIONS, "None — keep it as is"]),
  highlight: z.string().trim().min(1).max(500),
  improvement: z.string().trim().min(1).max(500),
  returnIntent: z.enum(["Definitely", "Probably", "Unsure", "Probably not", "Definitely not"]),
  comments: z.string().trim().min(1).max(800),
  website: z.string().max(0),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the highlighted questions and try again." }, { status: 400 });
    }
    const value = parsed.data;
    await insertResponse({
      school: value.school,
      division: value.division,
      communication: value.ratings.communication,
      info_pack: value.ratings.infoPack,
      game_format: value.ratings.gameFormat,
      scheduling: value.ratings.scheduling,
      officiating: value.ratings.officiating,
      facilities: value.ratings.facilities,
      organisation: value.ratings.organisation,
      hosting: value.ratings.hosting,
      accommodation: value.ratings.accommodation,
      meals: value.ratings.meals,
      overall: value.ratings.overall,
      schedule_pace: value.schedulePace,
      strengths: value.strengths,
      priority_area: value.priorityArea,
      highlight: value.highlight,
      improvement: value.improvement,
      return_intent: value.returnIntent,
      comments: value.comments,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Survey submission failed", error);
    return NextResponse.json({ error: "We could not save your response. Please try again." }, { status: 500 });
  }
}
