import { supabase } from "@/lib/supabase";

interface StoredRanking {
  name: string;
  worldRanking: number;
}

export async function fetchWorldRankings(): Promise<StoredRanking[]> {
  const { data, error } = await supabase
    .from("player_rankings")
    .select("name, ranking")
    .order("ranking", { ascending: true });

  if (error || !data || data.length === 0) {
    console.warn("player_rankings table empty or unavailable:", error?.message);
    return [];
  }

  return data.map((r) => ({ name: r.name, worldRanking: r.ranking }));
}
