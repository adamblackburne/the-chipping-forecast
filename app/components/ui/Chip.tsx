import { HTMLAttributes } from "react";

type ChipVariant = "default" | "accent" | "warn" | "solid";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
}

const variantClasses: Record<ChipVariant, string> = {
  default: "bg-paper border-ink/20 text-ink-2",
  accent:  "bg-accent-soft border-accent text-accent",
  warn:    "bg-warn-soft border-warn text-warn",
  solid:   "bg-ink border-ink text-paper",
};

export function Chip({ variant = "default", className = "", children, ...props }: ChipProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-full",
        "font-sans leading-none whitespace-nowrap",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
