import Link from "next/link";
import { ReactNode } from "react";

interface TopBarProps {
  title?: string;
  back?: string;    // href for back navigation
  action?: ReactNode;
  className?: string;
}

export function TopBar({ title, back, action, className = "" }: TopBarProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-b border-line-soft bg-paper shrink-0 ${className}`}
    >
      {/* Left — back chevron */}
      <div className="w-10">
        {back && (
          <Link
            href={back}
            className="text-2xl text-ink leading-none"
            aria-label="Go back"
          >
            ‹
          </Link>
        )}
      </div>

      {/* Centre — title */}
      <span className="font-display font-bold text-lg text-ink">{title}</span>

      {/* Right — action */}
      <div className="w-10 flex justify-end text-sm text-accent font-medium">
        {action}
      </div>
    </div>
  );
}
