"use client";

import { useState } from "react";
import { RankedPlayer, bracketLabel } from "@/lib/datagolf";
import { GolferRow } from "./GolferRow";

interface TierSectionProps {
  slot: 1 | 2 | 3 | 4;
  players: RankedPlayer[];
  selectedPlayer: RankedPlayer | null;
  onSelect: (player: RankedPlayer) => void;
  deadline: Date;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const INITIAL_SHOW = 10;

export function TierSection({
  slot,
  players,
  selectedPlayer,
  onSelect,
  deadline,
  isExpanded,
  onToggleExpand,
}: TierSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const isPastDeadline = new Date() >= deadline;
  const showAllForSlot = slot === 4;
  const visible = (showAll || showAllForSlot) ? players : players.slice(0, INITIAL_SHOW);
  const hasMore = players.length > INITIAL_SHOW && !showAll && !showAllForSlot;

  return (
    <div>
      {/* Section divider — always visible, tappable to toggle */}
      <button
        type="button"
        onClick={onToggleExpand}
        className={[
          "w-full sticky top-0 z-10 flex items-center justify-between",
          "px-4 py-2 border-b border-ink bg-paper text-left",
          slot > 1 ? "border-t" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-ink inline-block shrink-0" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-2">
            {bracketLabel(slot)}
          </span>
          {!isExpanded && selectedPlayer && (
            <span className="font-sans text-xs text-ink ml-1">
              — {selectedPlayer.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedPlayer ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              ✓ picked
            </span>
          ) : (
            <span className="text-xs text-ink-3 font-sans">
              {isExpanded ? `choose 1 of ${players.length}` : "tap to choose"}
            </span>
          )}
          <span
            className="text-ink-3 text-xs transition-transform duration-200"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-hidden
          >
            ▾
          </span>
        </div>
      </button>

      {/* Player list — only rendered when expanded */}
      {isExpanded && (
        <div>
          {players.length > 0 && (
            <div className="flex items-center gap-3 px-3 py-1 border-b border-line-soft">
              <span className="shrink-0 w-4" aria-hidden />
              <span className="shrink-0 w-8" aria-hidden />
              <span className="font-mono text-[9px] uppercase tracking-widest text-ink-3 w-7 shrink-0">
                OWGR
              </span>
            </div>
          )}
          {players.length === 0 && (
            <p className="px-4 py-3 text-sm text-ink-3 font-sans">
              No players in this tier for this event.
            </p>
          )}
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
      )}
    </div>
  );
}
