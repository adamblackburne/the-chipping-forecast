import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const { joinCode, displayName } = await req.json();

  if (!joinCode || !displayName?.trim()) {
    return NextResponse.json({ error: "Missing joinCode or displayName" }, { status: 400 });
  }

  const db = createServiceClient();

  // Find the competition
  const { data: comp, error: compErr } = await db
    .from("competitions")
    .select("id, max_players, status")
    .eq("join_code", joinCode.toUpperCase())
    .single();

  if (compErr || !comp) {
    return NextResponse.json({ error: "No group with that code" }, { status: 404 });
  }
  if (comp.status === "completed") {
    return NextResponse.json({ error: "This competition has ended" }, { status: 400 });
  }

  // Check max players
  if (comp.max_players) {
    const { count } = await db
      .from("participants")
      .select("id", { count: "exact", head: true })
      .eq("competition_id", comp.id);
    if ((count ?? 0) >= comp.max_players) {
      return NextResponse.json({ error: "This group is full" }, { status: 400 });
    }
  }

  // Handle duplicate display names — append #2, #3 etc.
  const baseName = displayName.trim().slice(0, 30);
  let finalName = baseName;
  const { data: existing } = await db
    .from("participants")
    .select("display_name")
    .eq("competition_id", comp.id)
    .ilike("display_name", `${baseName}%`);
  if (existing && existing.some((p: { display_name: string }) => p.display_name === baseName)) {
    finalName = `${baseName}#${existing.length + 1}`;
  }

  const sessionToken = randomUUID();

  const { data: participant, error: partErr } = await db
    .from("participants")
    .insert({
      competition_id: comp.id,
      display_name:   finalName,
      session_token:  sessionToken,
      total_score:    null,
    })
    .select()
    .single();

  if (partErr) {
    return NextResponse.json({ error: partErr.message }, { status: 500 });
  }

  return NextResponse.json({
    sessionToken: participant.session_token,
    displayName:  participant.display_name,
    participantId: participant.id,
  });
}
