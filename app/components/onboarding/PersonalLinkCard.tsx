"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface PersonalLinkCardProps {
  url: string;
}

export function PersonalLinkCard({ url }: PersonalLinkCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: "The Chipping Forecast — your personal link",
        text: "This is your personal link to access your picks. Save it!",
        url,
      });
    } else {
      await handleCopy();
    }
  }

  return (
    <div className="border-2 border-warn rounded-xl p-4 bg-warn-soft space-y-3">
      <div>
        <p className="font-sans font-bold text-warn text-sm">⚠ Save your personal link</p>
        <p className="font-sans text-xs text-warn/80 mt-0.5">
          This link IS your login. No password, no account — just this URL.
          If you lose it, you lose access.
        </p>
      </div>

      <div className="bg-paper rounded-lg px-3 py-2 border border-warn/40 overflow-hidden">
        <p className="font-mono text-xs text-ink break-all leading-relaxed">{url}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="flex-1"
        >
          {copied ? "✓ Copied!" : "📋 Copy link"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          className="flex-1"
        >
          ↑ Share
        </Button>
      </div>
    </div>
  );
}
