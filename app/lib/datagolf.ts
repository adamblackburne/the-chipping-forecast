const DATAGOLF_BASE = "https://feeds.datagolf.com";

export interface RankedPlayer {
  id: string;             // DataGolf player ID (string)
  espnId: string | null;  // cross-referenced ESPN ID when available
  name: string;
  worldRanking: number;
  odds: string | null;    // e.g. "+2500" from odds endpoint if available
  recentForm: string[];   // last 5 tournament finishes
}

interface DGRankingRow {
  dg_id?: number;
  player_name?: string;
  owgr_rank?: number;
  espn_id?: number | string | null;
  datagolf_rank?: number;
}

interface DGOddsRow {
  player_name?: string;
  dg_id?: number;
  make_cut?: number;
  win?: number;
  top_5?: number;
  top_10?: number;
  top_20?: number;
}

export async function fetchWorldRankings(): Promise<RankedPlayer[]> {
  const key = process.env.DATAGOLF_API_KEY;
  if (!key) {
    console.warn("DATAGOLF_API_KEY not set — rankings unavailable");
    return [];
  }

  const res = await fetch(
    `${DATAGOLF_BASE}/preds/get-dg-rankings?tour=pga&file_format=json&key=${key}`,
    { next: { revalidate: 86400 } } // Rankings update Mondays — cache 24h
  );
  if (!res.ok) return [];
  const data = await res.json() as { rankings?: DGRankingRow[] };
  const rows: DGRankingRow[] = data.rankings ?? [];

  return rows.map((r): RankedPlayer => ({
    id: String(r.dg_id ?? ""),
    espnId: r.espn_id ? String(r.espn_id) : null,
    name: r.player_name ?? "Unknown",
    worldRanking: r.owgr_rank ?? r.datagolf_rank ?? 999,
    odds: null,
    recentForm: [],
  }));
}

/** Return only players in the specified ranking bracket. */
export function filterByBracket(
  players: RankedPlayer[],
  slot: 1 | 2 | 3 | 4
): RankedPlayer[] {
  switch (slot) {
    case 1: return players.filter((p) => p.worldRanking >= 1 && p.worldRanking <= 10);
    case 2: return players.filter((p) => p.worldRanking >= 11 && p.worldRanking <= 20);
    case 3: return players.filter((p) => p.worldRanking >= 21 && p.worldRanking <= 30);
    case 4: return players.filter((p) => p.worldRanking >= 31);
  }
}

export function bracketLabel(slot: 1 | 2 | 3 | 4): string {
  switch (slot) {
    case 1: return "Top 10";
    case 2: return "Ranks 11–20";
    case 3: return "Ranks 21–30";
    case 4: return "Ranks 31+";
  }
}

export function validatePickSlot(worldRanking: number, slot: 1 | 2 | 3 | 4): boolean {
  switch (slot) {
    case 1: return worldRanking >= 1 && worldRanking <= 10;
    case 2: return worldRanking >= 11 && worldRanking <= 20;
    case 3: return worldRanking >= 21 && worldRanking <= 30;
    case 4: return worldRanking >= 31;
  }
}
