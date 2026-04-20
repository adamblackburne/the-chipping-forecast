import { Chip } from "@/components/ui/Chip";
import { Tile } from "@/components/ui/Tile";

interface TournamentBannerProps {
  name: string;
  venue?: string;
  deadlineDisplay: string;  // e.g. "Thu 7:00 AM ET"
  status: "pre" | "in" | "post";
}

const statusLabel: Record<string, string> = {
  pre:  "Upcoming",
  in:   "Live",
  post: "Finished",
};

export function TournamentBanner({ name, venue, deadlineDisplay, status }: TournamentBannerProps) {
  return (
    <Tile variant="accent">
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-display font-bold text-lg text-ink leading-tight">{name}</p>
        <Chip variant={status === "in" ? "solid" : "default"}>
          {statusLabel[status] ?? status}
        </Chip>
      </div>
      {venue && <p className="font-sans text-xs text-ink-2">{venue}</p>}
      <p className="font-sans text-xs text-ink-2 mt-1">
        Pick deadline: <span className="text-ink font-medium">{deadlineDisplay}</span>
        <span className="text-ink-3 ml-1">(1hr before tee-off · auto)</span>
      </p>
    </Tile>
  );
}
