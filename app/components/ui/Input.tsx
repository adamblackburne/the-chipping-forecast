import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, mono = false, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs uppercase tracking-wider text-ink-2 font-sans"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full border border-ink rounded-xl px-3 py-2.5 bg-paper text-ink",
            "font-sans text-base placeholder:text-ink-3",
            "focus:outline-none focus:ring-2 focus:ring-accent/40",
            "disabled:opacity-40",
            error ? "border-warn" : "",
            mono ? "font-mono tracking-widest text-center" : "",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <p className="text-xs text-warn">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-3">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
