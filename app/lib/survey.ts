export const RATING_FIELDS = [
  ["communication", "Pre-tournament communication"],
  ["infoPack", "Information pack & fixture clarity"],
  ["gameFormat", "Game format"],
  ["scheduling", "Scheduling & recovery time"],
  ["facilities", "Courts & facilities"],
  ["organisation", "Tournament organisation"],
  ["hosting", "Hosting & hospitality"],
  ["accommodation", "Accommodation"],
  ["meals", "Meals"],
  ["overall", "Overall experience"],
] as const;

export type RatingField = (typeof RATING_FIELDS)[number][0];

export const AREA_OPTIONS = [
  "Communication",
  "Fixtures & scheduling",
  "Game format",
  "Courts & facilities",
  "Accommodation",
  "Meals",
  "Hosting & hospitality",
  "Tournament atmosphere",
] as const;

export const DIVISION_OPTIONS = ["U13", "U14", "U15", "Both U14 & U15"] as const;

export const ratingLabels: Record<number, string> = {
  1: "Very poor", 2: "Poor", 3: "Good", 4: "Very good", 5: "Excellent",
};
