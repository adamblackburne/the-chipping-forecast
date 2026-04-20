interface PickProgressProps {
  count: number;
  total?: number;
}

export function PickProgress({ count, total = 4 }: PickProgressProps) {
  return (
    <span className="font-mono text-sm text-ink-2">
      {count}/{total}
    </span>
  );
}
