import { NextRequest, NextResponse } from "next/server";
import { supabase, createServiceClient } from "@/lib/supabase";
import { fetchTournamentPair } from "@/lib/espn";

interface Props {
  params: Promise<{ code: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { code } = await params;

  let { data: comp, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("join_code", code.toUpperCase())
    .single();

  if (error || !comp) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // When a group exists but no tournament was announced yet, check ESPN on every
  // page load (responses are cached for 10 min). As soon as a "pre" tournament
  // appears we link it to the group and flip status to "open".
  if (comp.status === "awaiting_tournament") {
    const { next } = await fetchTournamentPair();
    if (next) {
      const teeTime = next.firstTeeTime ?? next.startDate;
      const pickDeadline = new Date(
        new Date(teeTime).getTime() - 60 * 60 * 1000
      ).toISOString();
      const db = createServiceClient();
      const { data: updated } = await db
        .from("competitions")
        .update({
          tournament_espn_id:    next.id,
          tournament_name:       next.name,
          tournament_start_date: next.startDate,
          pick_deadline:         pickDeadline,
          status:                "open",
        })
        .eq("id", comp.id)
        .select()
        .single();
      if (updated) comp = updated;
    }
  }

  return NextResponse.json({ competition: comp });
}
