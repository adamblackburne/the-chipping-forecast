export type DerivedCompStatus =
  | "awaiting_tournament"
  | "scheduled"
  | "open"
  | "in_progress"
  | "final";

/**
 * Derives the effective competition status from ESPN tournament data.
 * The DB `status` column only gates awaiting_tournament; everything beyond
 * that is determined here from live ESPN state.
 */
export function deriveCompStatus(
  espnStatus: "pre" | "in" | "post",
  hasPlayers: boolean
): Exclude<DerivedCompStatus, "awaiting_tournament"> {
  if (espnStatus === "post") return "final";
  if (espnStatus === "in") return "in_progress";
  return hasPlayers ? "open" : "scheduled";
}
