"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TournamentBanner } from "@/components/onboarding/TournamentBanner";
import type { EspnTournament } from "@/lib/espn";

export default function CreateGroupPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [tournament, setTournament] = useState<EspnTournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((data) => {
        // Only use the next upcoming (pre) tournament — never an in-play one.
        // If no upcoming tournament exists, we still allow group creation;
        // the tournament will be linked automatically once ESPN announces one.
        setTournament(data.next ?? null);
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
          groupName: groupName.trim() || "Sunday Sandbaggers",
          maxPlayers: maxPlayers ? parseInt(maxPlayers, 10) : null,
          tournamentEspnId:    tournament?.id ?? null,
          tournamentName:      tournament?.name ?? null,
          tournamentStartDate: tournament?.startDate ?? null,
          firstTeeTime:        tournament?.firstTeeTime ?? tournament?.startDate ?? null,
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

  const deadlineDisplay = tournament?.firstTeeTime
    ? formatDeadline(tournament.firstTeeTime)
    : "—";

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

        {/* Tournament info */}
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-2 font-sans mb-1.5">
            Tournament
          </p>
          {loading ? (
            <div className="h-20 rounded-xl bg-paper-2 animate-pulse" />
          ) : tournament ? (
            <TournamentBanner
              name={tournament.name}
              venue={tournament.venue}
              deadlineDisplay={deadlineDisplay}
              status={tournament.status}
            />
          ) : (
            <div className="rounded-xl border border-line-soft bg-paper-2 px-4 py-3 space-y-1">
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
            disabled={submitting || loading}
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
