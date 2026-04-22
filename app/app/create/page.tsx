"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { EspnTournament } from "@/lib/espn";

function weekTimingLabel(startDate: string, endDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const dayOfWeek = (now.getDay() + 6) % 7;
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

  const dayMonthOpts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const range = start.getMonth() === end.getMonth()
    ? `${start.getDate()}–${end.toLocaleString("en-GB", dayMonthOpts)}`
    : `${start.toLocaleString("en-GB", dayMonthOpts)} – ${end.toLocaleString("en-GB", dayMonthOpts)}`;
  return `${prefix}: ${range}`;
}

export default function CreateGroupPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [options, setOptions] = useState<EspnTournament[]>([]);
  const [selected, setSelected] = useState<EspnTournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((data) => {
        const candidates: EspnTournament[] = [
          data.next,
          data.eur?.next,
        ].filter(Boolean) as EspnTournament[];
        setOptions(candidates);
        // Default: prefer whichever is open for picks, then just the first
        setSelected(candidates.find((t) => t.fieldReady) ?? candidates[0] ?? null);
      })
      .catch(() => setError("Could not load tournament data"))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/competition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName: groupName.trim(),
          maxPlayers: maxPlayers ? parseInt(maxPlayers, 10) : null,
          tournamentEspnId:    selected?.id ?? null,
          tournamentName:      selected?.name ?? null,
          tournamentStartDate: selected?.startDate ?? null,
          tournamentTour:      selected?.tour ?? "pga",
          firstTeeTime:        selected?.firstTeeTime ?? selected?.startDate ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create group");
      router.push(`/setup/${data.joinCode}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MobileShell>
      <TopBar back="/" title="New group" />

      <main className="flex flex-col flex-1 px-5 py-5 gap-5 overflow-y-auto">
        <Input
          label="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Sunday Sandbaggers"
        />

        <Input
          label="Max players (optional)"
          type="number"
          inputMode="numeric"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
          placeholder="No limit"
          hint="Leave blank for unlimited"
          min="2"
          max="100"
        />

        {/* Tournament selection */}
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-2 font-sans mb-2">
            Tournament
          </p>

          {loading ? (
            <div className="flex flex-col gap-2">
              <div className="h-24 rounded-xl bg-paper-2 animate-pulse" />
              <div className="h-24 rounded-xl bg-paper-2 animate-pulse opacity-60" />
            </div>
          ) : options.length > 0 ? (
            <div className="flex flex-col gap-2">
              {options.map((t) => {
                const isSelected = selected?.id === t.id;
                const isOpen = t.fieldReady && t.status !== "in";
                const isLive = t.status === "in";

                return (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t)}
                    className={[
                      "w-full text-left rounded-xl border p-4 transition-colors",
                      isSelected && isOpen
                        ? "border-accent bg-accent-soft"
                        : isSelected
                        ? "border-ink/40 bg-paper"
                        : "border-ink/10 bg-paper",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-ink-3 mb-0.5">
                          {t.tour === "pga" ? "PGA Tour" : "DP World Tour"}
                        </p>
                        <p className="font-display font-bold text-base text-ink leading-tight">
                          {t.name}
                        </p>
                        {t.venue && (
                          <p className="font-sans text-xs text-ink-2 mt-0.5">{t.venue}</p>
                        )}
                        {t.startDate && t.endDate && (
                          <p className="font-mono text-[11px] text-ink-3 mt-0.5">
                            {weekTimingLabel(t.startDate, t.endDate)}
                          </p>
                        )}
                        {t.firstTeeTime && isOpen && (
                          <p className="font-sans text-xs text-ink-3 mt-1">
                            Deadline:{" "}
                            <span className="text-ink-2">{formatDeadline(t.firstTeeTime)}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {isLive ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border bg-red-600 text-white border-red-600">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                            </span>
                            Live
                          </span>
                        ) : (
                          <span className={[
                            "text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border",
                            isOpen
                              ? "bg-ink text-paper border-ink"
                              : "bg-paper text-ink-2 border-ink/20",
                          ].join(" ")}>
                            {isOpen ? "Open for picks" : "Scheduled"}
                          </span>
                        )}
                        {/* Selection indicator */}
                        <span className={[
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected ? "border-ink bg-ink" : "border-ink/25 bg-transparent",
                        ].join(" ")}>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-paper" />
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-ink/10 bg-paper-2 px-4 py-3 space-y-1">
              <p className="font-sans text-sm text-ink-2">No tournament announced yet</p>
              <p className="font-sans text-xs text-ink-3">
                You can still create your group and invite friends. Picks will open automatically once the next tournament is announced.
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-warn">{error}</p>}

        <div className="mt-auto pt-4">
          <Button
            variant="accent"
            full
            size="lg"
            onClick={handleCreate}
            disabled={submitting || loading || !groupName.trim()}
          >
            {submitting ? "Creating…" : "Create group →"}
          </Button>
        </div>
      </main>
    </MobileShell>
  );
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
