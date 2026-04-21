import Link from "next/link";
import { MobileShell } from "@/components/layout/MobileShell";
import { fetchFullSchedule } from "@/lib/espn";
import type { EspnTournament } from "@/lib/espn";

export const revalidate = 3600;

export default async function SchedulePage() {
  const events = await fetchFullSchedule().catch(() => [] as EspnTournament[]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // First "pre" event that hasn't started yet, or the current live event
  const nextEvent =
    events.find((t) => t.status === "in") ??
    events.find((t) => t.status === "pre" && new Date(t.startDate) >= today) ??
    null;

  const grouped = groupByMonth(events);

  return (
    <MobileShell>
      <main className="flex flex-col flex-1 px-5 py-8 gap-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-2">
          <Link href="/" className="font-mono text-xs text-ink-2 underline underline-offset-2">
            ← Back
          </Link>
          <h1 className="font-display font-bold text-2xl text-ink leading-tight">
            2026 PGA Tour
          </h1>
        </div>

        {events.length === 0 && (
          <p className="font-sans text-sm text-ink-3 text-center py-12">
            Schedule unavailable — try again shortly.
          </p>
        )}

        {/* Month groups */}
        <div className="flex flex-col gap-8">
          {grouped.map(({ month, tournaments }) => (
            <section key={month}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-0.5 bg-ink inline-block" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-2">
                  {month}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {tournaments.map((t) => (
                  <TournamentRow
                    key={t.id}
                    tournament={t}
                    isNext={nextEvent?.id === t.id}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-auto text-xs text-ink-3 text-center font-sans pb-4">
          Schedule via ESPN · updated hourly
        </p>
      </main>
    </MobileShell>
  );
}

function TournamentRow({
  tournament: t,
  isNext,
}: {
  tournament: EspnTournament;
  isNext: boolean;
}) {
  const dateRange = formatDateRange(t.startDate, t.endDate);

  let badgeClass = "bg-paper text-ink-2 border-ink/20";
  let badgeLabel = "Scheduled";

  if (t.status === "in") {
    badgeClass = "bg-red-600 text-white border-red-600";
    badgeLabel = "Live";
  } else if (t.status === "post") {
    badgeClass = "bg-paper-2 text-ink-3 border-ink/10";
    badgeLabel = "Finished";
  } else if (t.fieldReady) {
    badgeClass = "bg-ink text-paper border-ink";
    badgeLabel = "Open";
  }

  return (
    <div
      id={isNext ? "next-event" : undefined}
      style={isNext ? { scrollMarginTop: "1rem" } : undefined}
      className={[
        "border rounded-xl p-4",
        isNext
          ? "border-accent bg-accent-soft"
          : "border-ink/10 bg-paper",
      ].join(" ")}
    >
      {isNext && (
        <p className="font-mono text-[9px] uppercase tracking-widest text-accent mb-2">
          Next up
        </p>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className={[
            "font-display font-bold text-base leading-tight",
            t.status === "post" ? "text-ink-2" : "text-ink",
          ].join(" ")}>
            {t.name}
          </p>
          {t.venue && (
            <p className="font-sans text-xs text-ink-3 truncate">{t.venue}</p>
          )}
          <p className="font-mono text-[11px] text-ink-3 mt-1">{dateRange}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {t.status === "in" && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" />
            </span>
          )}
          <span className={[
            "text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border",
            badgeClass,
          ].join(" ")}>
            {badgeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function groupByMonth(events: EspnTournament[]): { month: string; tournaments: EspnTournament[] }[] {
  const map = new Map<string, EspnTournament[]>();
  for (const t of events) {
    const key = new Date(t.startDate).toLocaleString("en-GB", { month: "long", year: "numeric" });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return Array.from(map.entries()).map(([month, tournaments]) => ({ month, tournaments }));
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  if (s.getMonth() === e.getMonth()) {
    return `${s.getDate()}–${e.toLocaleString("en-GB", opts)}`;
  }
  return `${s.toLocaleString("en-GB", opts)} – ${e.toLocaleString("en-GB", opts)}`;
}
