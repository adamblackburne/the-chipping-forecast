export interface PickResult {
  slot: 1 | 2 | 3 | 4;
  playerName: string;
  position: number | null;  // null = not yet played
  status: "active" | "cut" | "wd" | "dq" | "complete";
}

export interface ParticipantScore {
  participantId: string;
  displayName: string;
  picks: PickResult[];
  total: number | null;
  tiebreakPositions: number[];
}

/**
 * Compute the score for a single pick.
 * MC, WD, DQ all score (lastCutPosition + 1).
 */
export function pickScore(pick: PickResult, lastCutPosition: number): number | null {
  if (pick.position === null) return null;
  if (pick.status === "cut" || pick.status === "wd" || pick.status === "dq") {
    return lastCutPosition + 1;
  }
  return pick.position;
}

/**
 * Score a participant's 4 picks and return their total + sorted positions for tiebreak.
 */
export function scoreParticipant(
  picks: PickResult[],
  lastCutPosition: number
): { total: number | null; tiebreakPositions: number[] } {
  const scores = picks.map((p) => pickScore(p, lastCutPosition));
  if (scores.some((s) => s === null)) {
    return { total: null, tiebreakPositions: [] };
  }
  const nonNull = scores as number[];
  const total = nonNull.reduce((a, b) => a + b, 0);
  // Tiebreak: sort ascending (lowest = best) for slot-by-slot comparison
  const tiebreakPositions = [...nonNull].sort((a, b) => a - b);
  return { total, tiebreakPositions };
}

/**
 * Compare two participants for leaderboard ordering.
 * Returns negative if a ranks above b.
 */
export function compareParticipants(a: ParticipantScore, b: ParticipantScore): number {
  // Null totals (in-progress) go to the bottom
  if (a.total === null && b.total === null) return 0;
  if (a.total === null) return 1;
  if (b.total === null) return -1;
  if (a.total !== b.total) return a.total - b.total;

  // Tiebreak: compare sorted pick scores position-by-position
  for (let i = 0; i < 4; i++) {
    const aPos = a.tiebreakPositions[i] ?? Infinity;
    const bPos = b.tiebreakPositions[i] ?? Infinity;
    if (aPos !== bPos) return aPos - bPos;
  }
  // Alphabetical as final fallback
  return a.displayName.localeCompare(b.displayName);
}

export function rankParticipants(participants: ParticipantScore[]): ParticipantScore[] {
  return [...participants].sort(compareParticipants);
}
