"use client";

const SESSION_KEY = "tcf_session";

export interface Session {
  sessionToken: string;
  displayName: string;
  competitionCode: string;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/** Re-hydrate session from a ?t= URL param, then strip it from the URL. */
export function hydrateFromToken(token: string, competitionCode: string): void {
  if (typeof window === "undefined") return;
  const existing = getSession();
  if (existing?.sessionToken === token) return;
  // We don't have the display name here — server will resolve it on first API call.
  // Store the token; display name will be filled in after the /api/session/[token] lookup.
  saveSession({ sessionToken: token, displayName: "", competitionCode });
}

export function buildPersonalUrl(competitionCode: string, sessionToken: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${base}/competition/${competitionCode}?t=${sessionToken}`;
}
