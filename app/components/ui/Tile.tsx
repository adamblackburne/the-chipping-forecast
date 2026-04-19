import { HTMLAttributes } from "react";

type TileVariant = "default" | "accent" | "warn";

interface TileProps extends HTMLAttributes<HTMLDivElement> {
  variant?: TileVariant;
}

const variantClasses: Record<TileVariant, string> = {
  default: "bg-paper border-ink/20",
  accent:  "bg-accent-soft border-accent",
  warn:    "bg-warn-soft border-warn",
};

export function Tile({ variant = "default", className = "", children, ...props }: TileProps) {
  return (
    <div
      className={[
        "border rounded-xl p-3",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
