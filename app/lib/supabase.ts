import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — avoids crashing at build time when env vars aren't present
let _anon: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_anon) {
    _anon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _anon;
}

// Named export alias for convenience in server components
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string, unknown>)[prop as string];
  },
});

// Server-only client (uses service role — never expose to browser)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Database types ────────────────────────────────────────

export interface Competition {
  id: string;
  join_code: string;
  tournament_espn_id: string;
  tournament_name: string;
  tournament_start_date: string;
  pick_deadline: string;
  max_players: number | null;
  status: "open" | "live" | "completed";
  created_by_session: string;
  created_at: string;
}

export interface Participant {
  id: string;
  competition_id: string;
  display_name: string;
  session_token: string;
  total_score: number | null;
  created_at: string;
}

export interface Pick {
  id: string;
  participant_id: string;
  pick_slot: 1 | 2 | 3 | 4;
  player_espn_id: string;
  player_name: string;
  world_ranking_at_pick: number;
  final_position: number | null;
  created_at: string;
}

export interface TournamentCache {
  espn_tournament_id: string;
  raw_data: Record<string, unknown>;
  fetched_at: string;
}
