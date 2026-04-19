import { NextResponse } from "next/server";
import { fetchCurrentTournament } from "@/lib/espn";

export const revalidate = 600;

export async function GET() {
  const tournament = await fetchCurrentTournament();
  if (!tournament) {
    return NextResponse.json({ tournament: null }, { status: 200 });
  }
  return NextResponse.json({ tournament });
}
