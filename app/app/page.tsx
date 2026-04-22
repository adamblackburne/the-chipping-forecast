import Link from "next/link";
import { MobileShell } from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { fetchTournamentPair, fetchEurTournamentPair } from "@/lib/espn";

export const revalidate = 600;

export default async function LandingPage() {
  const [pga, eur] = await Promise.all([
    fetchTournamentPair().catch(() => ({ inPlay: null, next: null, past: null })),
    fetchEurTournamentPair().catch(() => ({ inPlay: null, next: null, past: null })),
  ]);

  const pgaCurrent = pga.inPlay ?? pga.next;
  const pgaPast = pga.past;
  const eurCurrent = eur.inPlay ?? eur.next;
  const eurPast = eur.past;

  const pgaDeadline = pgaCurrent?.firstTeeTime && pgaCurrent.status === "pre"
    ? formatDeadline(pgaCurrent.firstTeeTime)
    : null;

  return (
    <MobileShell>
      <main className="flex flex-col flex-1 px-5 py-8 gap-6">
        {/* Wordmark */}
        <div className="pt-6">
          <h1 className="font-display font-bold text-5xl leading-[0.95] text-ink">
            The<br />Chipping<br />Forecast
          </h1>
          <p className="font-sans text-sm text-ink-2 mt-3">
            Pick 4 golfers. Lowest combined finish wins.
          </p>
        </div>

        {/* PGA Tour */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-ink inline-block" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-2">
              PGA Tour
            </span>
          </div>

          {pgaCurrent && (
            pgaCurrent.status === "in" ? (
              <Link href="/leaderboard" className="block">
                <div className="border border-ink/10 bg-paper rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-display font-bold text-xl text-ink leading-tight">
                      {pgaCurrent.name}
                    </p>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 bg-red-600 text-white border-red-600">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                      </span>
                      Live
                    </span>
                  </div>
                  {pgaCurrent.venue && (
                    <p className="font-sans text-xs text-ink-2">{pgaCurrent.venue}</p>
                  )}
                  <p className="font-mono text-[11px] text-ink-3 mt-0.5">
                    {weekTimingLabel(pgaCurrent.startDate, pgaCurrent.endDate)}
                  </p>
                  <p className="font-sans text-xs text-ink underline mt-2 text-right">
                    View Live Leaderboard
                  </p>
                </div>
              </Link>
            ) : (
              <div className={[
                "border rounded-xl p-4",
                pgaCurrent.fieldReady ? "border-accent bg-accent-soft" : "border-ink/10 bg-paper",
              ].join(" ")}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-display font-bold text-xl text-ink leading-tight">
                    {pgaCurrent.name}
                  </p>
                  <span className={[
                    "text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0",
                    pgaCurrent.fieldReady
                      ? "bg-ink text-paper border-ink"
                      : "bg-paper text-ink-2 border-ink/20",
                  ].join(" ")}>
                    {pgaCurrent.fieldReady ? "Open for picks" : "Scheduled"}
                  </span>
                </div>
                {pgaCurrent.venue && (
                  <p className="font-sans text-xs text-ink-2">{pgaCurrent.venue}</p>
                )}
                <p className="font-mono text-[11px] text-ink-3 mt-0.5">
                  {weekTimingLabel(pgaCurrent.startDate, pgaCurrent.endDate)}
                </p>
                {pgaDeadline && (
                  <p className="font-sans text-xs text-ink-2 mt-1">
                    Pick deadline:{" "}
                    <span className="text-ink font-medium">{pgaDeadline}</span>
                  </p>
                )}
              </div>
            )
          )}

          {pgaPast && pgaPast.id !== pgaCurrent?.id && (
            <Link href="/leaderboard" className="block">
              <div className="border border-ink/10 bg-paper rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-display font-bold text-xl text-ink leading-tight">
                    {pgaPast.name}
                  </p>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 bg-paper text-ink-2 border-ink/20">
                    Finished
                  </span>
                </div>
                {pgaPast.venue && (
                  <p className="font-sans text-xs text-ink-2">{pgaPast.venue}</p>
                )}
                <p className="font-mono text-[11px] text-ink-3 mt-0.5">
                  {weekTimingLabel(pgaPast.startDate, pgaPast.endDate)}
                </p>
                <p className="font-sans text-xs text-ink underline mt-2 text-right">
                  View Results
                </p>
              </div>
            </Link>
          )}
        </section>

        {/* DP World Tour */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-ink inline-block" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-2">
              DP World Tour
            </span>
          </div>

          {eurCurrent && (
            eurCurrent.status === "in" ? (
              <div className="border border-ink/10 bg-paper rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-display font-bold text-xl text-ink leading-tight">
                    {eurCurrent.name}
                  </p>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 bg-red-600 text-white border-red-600">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                    </span>
                    Live
                  </span>
                </div>
                {eurCurrent.venue && (
                  <p className="font-sans text-xs text-ink-2">{eurCurrent.venue}</p>
                )}
                <p className="font-mono text-[11px] text-ink-3 mt-0.5">
                  {weekTimingLabel(eurCurrent.startDate, eurCurrent.endDate)}
                </p>
              </div>
            ) : (
              <div className={[
                "border rounded-xl p-4",
                eurCurrent.fieldReady ? "border-accent bg-accent-soft" : "border-ink/10 bg-paper",
              ].join(" ")}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-display font-bold text-xl text-ink leading-tight">
                    {eurCurrent.name}
                  </p>
                  <span className={[
                    "text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0",
                    eurCurrent.fieldReady
                      ? "bg-ink text-paper border-ink"
                      : "bg-paper text-ink-2 border-ink/20",
                  ].join(" ")}>
                    {eurCurrent.fieldReady ? "Open for picks" : "Scheduled"}
                  </span>
                </div>
                {eurCurrent.venue && (
                  <p className="font-sans text-xs text-ink-2">{eurCurrent.venue}</p>
                )}
                <p className="font-mono text-[11px] text-ink-3 mt-0.5">
                  {weekTimingLabel(eurCurrent.startDate, eurCurrent.endDate)}
                </p>
              </div>
            )
          )}

          {eurPast && eurPast.id !== eurCurrent?.id && (
            <div className="border border-ink/10 bg-paper rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-display font-bold text-xl text-ink leading-tight">
                  {eurPast.name}
                </p>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 bg-paper text-ink-2 border-ink/20">
                  Finished
                </span>
              </div>
              {eurPast.venue && (
                <p className="font-sans text-xs text-ink-2">{eurPast.venue}</p>
              )}
              <p className="font-mono text-[11px] text-ink-3 mt-0.5">
                {weekTimingLabel(eurPast.startDate, eurPast.endDate)}
              </p>
            </div>
          )}

          {!eurCurrent && !eurPast && (
            <p className="font-sans text-sm text-ink-3 text-center py-4">
              No events found.
            </p>
          )}
        </section>

        <Divider />

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <Link href="/create" className="block">
            <Button variant="primary" full size="lg">
              + Start a group
            </Button>
          </Link>
          <Link href="/join" className="block">
            <Button variant="secondary" full size="lg">
              Join with code
            </Button>
          </Link>
        </div>

        {/* Schedule link */}
        <div className="flex justify-center">
          <Link
            href="/schedule#next-event"
            className="font-mono text-xs text-ink-2 underline underline-offset-2 hover:text-ink transition-colors"
          >
            View full 2026 PGA schedule →
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-auto text-xs text-ink-3 text-center font-sans pb-4">
          no accounts · no apps · just a link
        </p>
      </main>
    </MobileShell>
  );
}

function weekTimingLabel(startDate: string, endDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const dayOfWeek = (now.getDay() + 6) % 7; // Mon=0 … Sun=6
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - dayOfWeek);
  thisMonday.setHours(0, 0, 0, 0);
  const nextMonday = new Date(thisMonday);
  nextMonday.setDate(thisMonday.getDate() + 7);
  const weekAfter = new Date(nextMonday);
  weekAfter.setDate(nextMonday.getDate() + 7);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);

  let prefix: string;
  if (start >= thisMonday && start < nextMonday) prefix = "This Week";
  else if (start >= nextMonday && start < weekAfter) prefix = "Next Week";
  else if (start >= lastMonday && start < thisMonday) prefix = "Last Week";
  else prefix = start < now ? "Past" : "Coming Up";

  return `${prefix}: ${formatShortDateRange(start, end)}`;
}

function formatShortDateRange(start: Date, end: Date): string {
  const dayMonthOpts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${end.toLocaleString("en-GB", dayMonthOpts)}`;
  }
  return `${start.toLocaleString("en-GB", dayMonthOpts)} – ${end.toLocaleString("en-GB", dayMonthOpts)}`;
}

function formatDeadline(teeTime: string): string {
  const deadline = new Date(new Date(teeTime).getTime() - 60 * 60 * 1000);
  return deadline.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
