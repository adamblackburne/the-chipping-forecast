import { NextResponse } from "next/server";
import { fetchTournamentPair, fetchEurTournamentPair } from "@/lib/espn";

export const revalidate = 600;

export async function GET() {
  const [pga, eur] = await Promise.all([fetchTournamentPair(), fetchEurTournamentPair()]);
  return NextResponse.json({
    inPlay: pga.inPlay,
    next: pga.next,
    past: pga.past,
    tournament: pga.next ?? pga.inPlay,
    eur: { inPlay: eur.inPlay, next: eur.next, past: eur.past },
  });
}
