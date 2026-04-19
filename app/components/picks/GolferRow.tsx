import { RankedPlayer } from "@/lib/datagolf";

interface GolferRowProps {
  player: RankedPlayer;
  selected: boolean;
  onSelect: (player: RankedPlayer) => void;
  disabled?: boolean;
}

export function GolferRow({ player, selected, onSelect, disabled = false }: GolferRowProps) {
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(player)}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "flex w-full items-center gap-3 px-3 py-2.5 text-left",
        "border-b border-line-soft last:border-b-0 transition-colors",
        selected ? "bg-accent-soft" : "bg-paper hover:bg-paper-2 active:bg-paper-2",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {/* Radio dot */}
      <span
        className={[
          "shrink-0 w-4 h-4 rounded-full border-2 transition-colors",
          selected ? "border-accent bg-accent" : "border-ink-3 bg-paper",
        ].join(" ")}
        aria-hidden
      />

      {/* Avatar */}
      <span
        className={[
          "shrink-0 w-8 h-8 rounded-full border border-ink",
          "flex items-center justify-center text-xs font-sans font-semibold",
          selected ? "bg-accent text-paper" : "bg-paper-2 text-ink",
        ].join(" ")}
        aria-hidden
      >
        {initials}
      </span>

      {/* Rank */}
      <span className="font-mono text-xs text-ink-2 w-7 shrink-0">
        #{player.worldRanking}
      </span>

      {/* Name */}
      <span className="flex-1 font-sans text-sm text-ink">{player.name}</span>

      {/* Odds */}
      {player.odds && (
        <span className="font-mono text-xs text-ink-3 shrink-0">{player.odds}</span>
      )}
    </button>
  );
}
