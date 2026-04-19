"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { JoinCodeInput } from "@/components/onboarding/JoinCodeInput";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFind() {
    if (code.length < 6) {
      setError("Please enter all 6 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/competition/${code.toUpperCase()}`);
      if (!res.ok) {
        setError("No group with that code. Check with your friend.");
        return;
      }
      router.push(`/join/${code.toUpperCase()}`);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell>
      <TopBar back="/" title="Join group" />

      <main className="flex flex-col flex-1 px-5 py-8 gap-6">
        <p className="font-sans text-sm text-ink-2 text-center">
          Got a code from a friend?
        </p>

        <JoinCodeInput
          value={code}
          onChange={(v) => { setCode(v); setError(null); }}
          error={error ?? undefined}
        />

        <div className="mt-auto">
          <Button
            variant="accent"
            full
            size="lg"
            onClick={handleFind}
            disabled={loading || code.length < 6}
          >
            {loading ? "Finding…" : "Find group →"}
          </Button>
        </div>
      </main>
    </MobileShell>
  );
}
