import { Tile } from "@/components/ui/Tile";

export interface PickSummaryItem {
  slot: 1 | 2 | 3 | 4;
  playerName: string;
  worldRanking: number;
  finalPosition?: number | null;
}

interface PickSummaryProps {
  picks: PickSummaryItem[];
  onEdit?: () => void;
}

const slotLabel = (slot: 1 | 2 | 3 | 4) => {
  const labels: Record<number, string> = { 1: "Top 10", 2: "11–20", 3: "21–30", 4: "31+" };
  return labels[slot];
};

export function PickSummary({ picks, onEdit }: PickSummaryProps) {
  const ordered = [...picks].sort((a, b) => a.slot - b.slot);
  return (
    <Tile className="divide-y divide-line-soft p-0 overflow-hidden">
      {ordered.map((pick) => (
        <div key={pick.slot} className="flex items-center gap-3 px-3 py-2.5 bg-accent-soft">
          <span className="font-mono text-[10px] text-ink-2 w-10 shrink-0 uppercase tracking-wide">
            {slotLabel(pick.slot)}
          </span>
          <span className="font-mono text-xs text-ink-2 w-6 shrink-0">
            #{pick.worldRanking}
          </span>
          <span className="flex-1 font-sans text-sm text-ink">{pick.playerName}</span>
          {pick.finalPosition != null && (
            <span className="font-mono text-xs text-ink-2 shrink-0">
              {pick.finalPosition}
            </span>
          )}
        </div>
      ))}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="w-full py-2 text-xs text-accent font-medium font-sans text-center bg-paper hover:bg-paper-2 transition-colors"
        >
          Edit picks →
        </button>
      )}
    </Tile>
  );
}
