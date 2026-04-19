"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

export function CountdownTimer({ targetDate, onExpire }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => targetDate.getTime() - Date.now());

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => {
      const next = targetDate.getTime() - Date.now();
      setRemaining(next);
      if (next <= 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate, onExpire, remaining]);

  return (
    <span className="font-mono text-4xl font-medium text-ink tabular-nums">
      {formatDuration(remaining)}
    </span>
  );
}
