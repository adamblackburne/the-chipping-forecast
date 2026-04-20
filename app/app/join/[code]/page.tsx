import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Tile } from "@/components/ui/Tile";
import { supabase } from "@/lib/supabase";
import type { Competition, Participant } from "@/lib/supabase";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function JoinPreviewPage({ params }: Props) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  const { data: comp } = await supabase
    .from("competitions")
    .select("*")
    .eq("join_code", upperCode)
    .single<Competition>();

  if (!comp) notFound();

  const { data: participants } = await supabase
    .from("participants")
    .select("id, display_name, created_at")
    .eq("competition_id", comp.id)
    .order("created_at", { ascending: true })
    .limit(6)
    .returns<Pick<Participant, "id" | "display_name" | "created_at">[]>();

  const memberCount = participants?.length ?? 0;
  const deadline = new Date(comp.pick_deadline);
  const deadlineDisplay = deadline.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <MobileShell>
      <TopBar back="/join" title="" />

      <main className="flex flex-col flex-1 px-5 py-5 gap-5">
        <div>
          <Chip variant="warn" className="mb-3">Invited via link</Chip>
          <p className="font-display text-3xl font-bold text-ink leading-tight">
            {comp.tournament_name}
          </p>
        </div>

        <Tile>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-2 mb-1">
            Playing for
          </p>
          <p className="font-display font-bold text-xl text-ink">{comp.tournament_name}</p>
          <p className="font-sans text-xs text-ink-2 mt-1">
            {memberCount} player{memberCount !== 1 ? "s" : ""} · deadline {deadlineDisplay}
          </p>
        </Tile>

        {participants && participants.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-2 mb-2">
              Members
            </p>
            <div className="space-y-0">
              {participants.slice(0, 5).map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2.5 py-2.5 border-b border-line-soft last:border-b-0"
                >
                  <span
                    className="w-7 h-7 rounded-full border border-ink bg-paper-2 flex items-center justify-center text-xs font-sans font-semibold shrink-0"
                    aria-hidden
                  >
                    {p.display_name[0]?.toUpperCase()}
                  </span>
                  <span className="font-sans text-sm text-ink">{p.display_name}</span>
                  {i === 0 && (
                    <span className="font-sans text-xs text-ink-3 ml-auto">host</span>
                  )}
                </div>
              ))}
              {memberCount > 5 && (
                <p className="text-xs text-ink-3 text-center pt-2">
                  + {memberCount - 5} more
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <Link href={`/setup/${upperCode}`}>
            <Button variant="accent" full size="lg">
              Join this group →
            </Button>
          </Link>
        </div>
      </main>
    </MobileShell>
  );
}
