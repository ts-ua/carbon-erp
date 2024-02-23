import type { getNotes } from "./shared.service";

export type Note = NonNullable<
  Awaited<ReturnType<typeof getNotes>>["data"]
>[number];

export const standardFactorType = [
  "Hours/Piece",
  "Hours/100 Pieces",
  "Hours/1000 Pieces",
  "Minutes/Piece",
  "Minutes/100 Pieces",
  "Minutes/1000 Pieces",
  "Pieces/Hour",
  "Pieces/Minute",
  "Seconds/Piece",
  "Total Hours",
  "Total Minutes",
] as const;

export type StandardFactor = (typeof standardFactorType)[number];
