"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabBarProps {
  competitionCode: string;
}

const tabs = [
  { id: "picks",  label: "My Picks",    href: (code: string) => `/competition/${code}` },
  { id: "board",  label: "Leaderboard", href: (code: string) => `/competition/${code}/board` },
  { id: "group",  label: "Group",       href: (code: string) => `/competition/${code}/group` },
];

export function TabBar({ competitionCode }: TabBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className="flex border-t border-ink bg-paper-2 shrink-0 pb-safe"
      aria-label="Main navigation"
    >
      {tabs.map((tab) => {
        const href = tab.href(competitionCode);
        const isActive =
          tab.id === "picks"
            ? pathname === href || pathname.endsWith("/picks")
            : tab.id === "board"
            ? pathname.startsWith(href)
            : pathname === href;

        return (
          <Link
            key={tab.id}
            href={href}
            className={[
              "flex flex-1 flex-col items-center gap-0.5 py-2",
              "text-xs font-sans transition-colors",
              isActive ? "text-ink" : "text-ink-3",
            ].join(" ")}
          >
            <TabIcon id={tab.id} active={isActive} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function TabIcon({ id, active }: { id: string; active: boolean }) {
  if (id === "picks") return <StarIcon active={active} />;
  if (id === "board") return <BarChartIcon active={active} />;
  return <GroupIcon active={active} />;
}

function StarIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BarChartIcon({ active }: { active: boolean }) {
  const f = active ? "currentColor" : "none";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <rect x="3"  y="13" width="4" height="8"  rx="0.5" fill={f} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <rect x="10" y="8"  width="4" height="13" rx="0.5" fill={f} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <rect x="17" y="3"  width="4" height="18" rx="0.5" fill={f} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

function GroupIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden fill="currentColor">
        {/* Secondary person (behind) */}
        <circle cx="17.5" cy="7" r="2.5" />
        <path d="M12 21a5.5 5.5 0 0 1 11 0z" />
        {/* Primary person (front) */}
        <circle cx="9" cy="7" r="3.5" />
        <path d="M1.5 21a7.5 7.5 0 0 1 15 0z" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* Secondary person (behind) */}
      <circle cx="17.5" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 21a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Primary person (front) */}
      <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M1.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
