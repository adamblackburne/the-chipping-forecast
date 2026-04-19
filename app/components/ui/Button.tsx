import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:   "bg-ink text-paper border-ink hover:bg-ink-2",
  secondary: "bg-paper text-ink border-ink hover:bg-paper-2",
  accent:    "bg-accent text-paper border-accent hover:opacity-90",
  ghost:     "bg-transparent text-ink border-line-soft hover:bg-paper-2",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-base px-4 py-2.5 rounded-xl",
  lg: "text-lg px-5 py-3 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "md", full = false, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={[
          "inline-flex items-center justify-center gap-2 border font-sans font-medium",
          "transition-colors duration-150 cursor-pointer select-none",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          full ? "w-full" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
