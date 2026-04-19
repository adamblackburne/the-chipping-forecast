"use client";

import { useState } from "react";
import { RankedPlayer, bracketLabel } from "@/lib/datagolf";
import { Chip } from "@/components/ui/Chip";
import { GolferRow } from "./GolferRow";

interface TierSectionProps {
  slot: 1 | 2 | 3 | 4;
  players: RankedPlayer[];
  selectedPlayer: RankedPlayer | null;
  onSelect: (player: RankedPlayer) => void;
  deadline: Date;
}

const INITIAL_SHOW = 10;

export function TierSection({ slot, players, selectedPlayer, onSelect, deadline }: TierSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const isPastDeadline = new Date() >= deadline;
  const visible = showAll ? players : players.slice(0, INITIAL_SHOW);
  const hasMore = players.length > INITIAL_SHOW && !showAll;

  return (
    <div>
      {/* Sticky section header */}
      <div
        className={[
          "sticky top-0 z-10 flex items-center justify-between",
          "px-4 py-2 border-b border-ink bg-paper",
          slot > 1 ? "border-t" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-ink inline-block shrink-0" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-2">
            {bracketLabel(slot)}
          </span>
        </div>
        {selectedPlayer ? (
          <Chip variant="accent">✓ picked</Chip>
        ) : (
          <span className="text-xs text-ink-3 font-sans">
            choose 1 of {players.length}
          </span>
        )}
      </div>

      {/* Player list */}
      <div>
        {visible.map((player) => (
          <GolferRow
            key={player.id}
            player={player}
            selected={selectedPlayer?.id === player.id}
            onSelect={onSelect}
            disabled={isPastDeadline}
          />
        ))}

        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="w-full py-3 text-center text-sm text-ink-2 font-sans border border-dashed border-ink-3 rounded-lg mx-3 my-2"
            style={{ width: "calc(100% - 24px)" }}
          >
            load {players.length - INITIAL_SHOW} more ↓
          </button>
        )}
      </div>
    </div>
  );
}
