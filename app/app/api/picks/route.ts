import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, supabase } from "@/lib/supabase";
import { validatePickSlot } from "@/lib/datagolf";

async function resolveParticipant(token: string) {
  const { data } = await supabase
    .from("participants")
    .select("id, competition_id")
    .eq("session_token", token)
    .single();
  return data;
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-session-token");
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const participant = await resolveParticipant(token);
  if (!participant) return NextResponse.json({ error: "Session not found" }, { status: 401 });

  const { data: picks } = await supabase
    .from("picks")
    .select("*")
    .eq("participant_id", participant.id)
    .order("pick_slot", { ascending: true });

  return NextResponse.json({ picks: picks ?? [] });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-session-token");
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { joinCode, pickSlot, playerEspnId, playerName, worldRanking } = await req.json();

  if (!pickSlot || !playerEspnId || !playerName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (![1, 2, 3, 4].includes(pickSlot)) {
    return NextResponse.json({ error: "Invalid pick slot" }, { status: 400 });
  }

  // null worldRanking = unranked player, valid only for slot 4
  const rankingValue: number | null = worldRanking ?? null;
  if (!validatePickSlot(rankingValue, pickSlot as 1 | 2 | 3 | 4)) {
    return NextResponse.json(
      { error: `World ranking ${rankingValue ?? "unranked"} is not valid for slot ${pickSlot}` },
      { status: 400 }
    );
  }

  const participant = await resolveParticipant(token);
  if (!participant) return NextResponse.json({ error: "Session not found" }, { status: 401 });

  // Check deadline hasn't passed
  const { data: comp } = await supabase
    .from("competitions")
    .select("pick_deadline, join_code")
    .eq("id", participant.competition_id)
    .single();

  if (!comp || (joinCode && comp.join_code !== joinCode.toUpperCase())) {
    return NextResponse.json({ error: "Competition mismatch" }, { status: 400 });
  }
  if (comp.pick_deadline && new Date() >= new Date(comp.pick_deadline)) {
    return NextResponse.json({ error: "Pick deadline has passed" }, { status: 400 });
  }

  const db = createServiceClient();

  // Upsert pick (replace if slot already filled)
  const { data: pick, error } = await db
    .from("picks")
    .upsert(
      {
        participant_id:       participant.id,
        pick_slot:            pickSlot,
        player_espn_id:       playerEspnId,
        player_name:          playerName,
        world_ranking_at_pick: rankingValue ?? 0,
        final_position:       null,
      },
      { onConflict: "participant_id,pick_slot" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ pick });
}
