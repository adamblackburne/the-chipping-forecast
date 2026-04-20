"use client";

import { useRef, ChangeEvent } from "react";

interface JoinCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const CODE_LENGTH = 6;

export function JoinCodeInput({ value, onChange, error, disabled }: JoinCodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, CODE_LENGTH);
    onChange(raw);
  }

  // Display with hyphen: ABC-123
  const display = value.length > 3
    ? `${value.slice(0, 3)}-${value.slice(3)}`
    : value;

  return (
    <div className="space-y-1">
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        value={display}
        onChange={handleChange}
        disabled={disabled}
        maxLength={7} // 6 chars + 1 hyphen
        placeholder="ABC-123"
        className={[
          "w-full border rounded-xl px-4 py-4 text-center",
          "font-mono text-3xl tracking-[0.25em] bg-paper text-ink",
          "focus:outline-none focus:ring-2 focus:ring-accent/40",
          "placeholder:text-ink-3 placeholder:text-xl placeholder:tracking-widest",
          error ? "border-warn" : "border-ink",
          disabled ? "opacity-40" : "",
        ].join(" ")}
        aria-label="6-character invite code"
      />
      {error && <p className="text-xs text-warn text-center">{error}</p>}
      {!error && (
        <p className="text-xs text-ink-3 text-center">6 characters, not case-sensitive</p>
      )}
    </div>
  );
}
