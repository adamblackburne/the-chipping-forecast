import { NextRequest, NextResponse } from "next/server";
import { fetchWorldRankings } from "@/lib/rankings";
import { fetchTournamentField } from "@/lib/espn";
import { supabase } from "@/lib/supabase";
import type { RankedPlayer } from "@/lib/datagolf";

export const revalidate = 600;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const { data: comp } = await supabase
    .from("competitions")
    .select("tournament_espn_id, tournament_tour")
    .eq("join_code", code.toUpperCase())
    .single();

  if (!comp || !comp.tournament_espn_id) return NextResponse.json({ players: [] });

  const tour = (comp.tournament_tour === "eur" ? "eur" : "pga") as "pga" | "eur";

  const [rankings, fieldPlayers] = await Promise.all([
    fetchWorldRankings(),
    fetchTournamentField(comp.tournament_espn_id, tour),
  ]);

  const rankingByName = new Map(rankings.map((r) => [r.name.toLowerCase(), r.worldRanking]));

  const players: RankedPlayer[] = fieldPlayers.map((p) => ({
    id: p.id,
    name: p.displayName,
    worldRanking: rankingByName.get(p.displayName.toLowerCase()) ?? null,
  }));

  // Ranked players first (ascending), unranked at the end
  players.sort((a, b) => {
    if (a.worldRanking === null && b.worldRanking === null) return 0;
    if (a.worldRanking === null) return 1;
    if (b.worldRanking === null) return -1;
    return a.worldRanking - b.worldRanking;
  });

  return NextResponse.json({ players });
}
