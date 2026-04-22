export interface RankedPlayer {
  id: string;
  name: string;
  worldRanking: number | null; // null = in field but not in rankings table
}

/** Return players for the specified pick slot, based on field position.
 *
 * Slots 1–3 each contain the 10 best-ranked players in the field for that
 * position (slot 1 = best 10, slot 2 = 11th–20th, slot 3 = 21st–30th).
 * Slot 4 contains all remaining ranked players plus any unranked players
 * (sorted alphabetically) at the end.
 */
export function filterByBracket(
  players: RankedPlayer[],
  slot: 1 | 2 | 3 | 4
): RankedPlayer[] {
  const ranked = [...players]
    .filter((p) => p.worldRanking !== null)
    .sort((a, b) => a.worldRanking! - b.worldRanking!);
  const unranked = [...players]
    .filter((p) => p.worldRanking === null)
    .sort((a, b) => a.name.localeCompare(b.name));

  const SLOT_SIZE = 10;
  const start = (slot - 1) * SLOT_SIZE;

  if (slot < 4) {
    return ranked.slice(start, start + SLOT_SIZE);
  }
  return [...ranked.slice(start), ...unranked];
}

export function bracketLabel(slot: 1 | 2 | 3 | 4): string {
  switch (slot) {
    case 1: return "Top 10 (in field)";
    case 2: return "Ranks 11–20 (in field)";
    case 3: return "Ranks 21–30 (in field)";
    case 4: return "Ranks 31+ (in field)";
  }
}

// Unranked players (null/0) are only valid in slot 4.
// Slot membership is field-position-based, so ranked players are always valid for any slot.
export function validatePickSlot(worldRanking: number | null, slot: 1 | 2 | 3 | 4): boolean {
  if (worldRanking === null || worldRanking === 0) return slot === 4;
  return true;
}
