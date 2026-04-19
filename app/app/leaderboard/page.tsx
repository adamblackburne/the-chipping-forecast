import Link from "next/link";
import { MobileShell } from "@/components/layout/MobileShell";
import { TopBar } from "@/components/layout/TopBar";
import { fetchLeaderboard, fetchTournamentPair } from "@/lib/espn";

export const revalidate = 120;

function formatScore(score: number | null): string {
  if (score === null) return "–";
  if (score === 0) return "E";
  return score > 0 ? `+${score}` : `${score}`;
}

export default async function LeaderboardPage() {
  const { inPlay } = await fetchTournamentPair().catch(() => ({
    inPlay: null,
    next: null,
  }));

  if (!inPlay) {
    return (
      <MobileShell>
        <TopBar title="Leaderboard" back="/" />
        <main className="flex flex-col flex-1 items-center justify-center px-5 py-8 gap-4">
          <p className="font-display text-2xl font-bold text-ink">No live tournament</p>
          <p className="font-sans text-sm text-ink-2 text-center">
            Check back when a tournament is underway.
          </p>
          <Link href="/" className="text-sm text-accent font-medium mt-2">
            ← Back to home
          </Link>
        </main>
      </MobileShell>
    );
  }

  const { entries } = await fetchLeaderboard(inPlay.id).catch(() => ({
    entries: [],
    lastCutPosition: 0,
  }));

  return (
    <MobileShell>
      <TopBar title={inPlay.shortName} back="/" />

      <main className="flex flex-col flex-1 overflow-y-auto">
        {/* Event header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-line-soft bg-paper-2 shrink-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-3">
            Full field · {entries.length} golfers
          </p>
          <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-600 text-white shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            Live
          </span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[3.5rem_1fr_3.5rem_3rem] gap-x-2 px-4 py-2 border-b border-line-soft bg-paper shrink-0">
          <span className="font-mono text-[10px] text-ink-3">Pos</span>
          <span className="font-mono text-[10px] text-ink-3">Player</span>
          <span className="font-mono text-[10px] text-ink-3 text-right">Score</span>
          <span className="font-mono text-[10px] text-ink-3 text-right">Thru</span>
        </div>

        {/* Entries */}
        <div>
          {entries.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="font-sans text-sm text-ink-3">No leaderboard data available.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.playerId}
                className="grid grid-cols-[3.5rem_1fr_3.5rem_3rem] gap-x-2 px-4 py-3 border-b border-line-soft bg-paper"
              >
                <span
                  className={[
                    "font-mono text-sm font-bold",
                    entry.status === "cut" || entry.status === "wd" || entry.status === "dq"
                      ? "text-warn"
                      : "text-ink",
                  ].join(" ")}
                >
                  {entry.positionDisplay}
                </span>
                <span className="font-sans text-sm text-ink truncate">
                  {entry.shortName || entry.displayName}
                </span>
                <span
                  className={[
                    "font-mono text-sm text-right",
                    entry.score !== null && entry.score < 0
                      ? "text-warn font-medium"
                      : "text-ink",
                  ].join(" ")}
                >
                  {formatScore(entry.score)}
                </span>
                <span className="font-mono text-sm text-ink-3 text-right">{entry.thru ?? "–"}</span>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-6 text-center">
          <Link href="/" className="font-sans text-sm text-accent">
            ← Back to home
          </Link>
        </div>
      </main>
    </MobileShell>
  );
}
