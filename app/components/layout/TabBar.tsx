"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabBarProps {
  competitionCode: string;
}

const tabs = [
  { id: "picks",  label: "My Picks", href: (code: string) => `/competition/${code}` },
  { id: "board",  label: "Board",    href: (code: string) => `/competition/${code}/board` },
  { id: "group",  label: "Group",    href: (code: string) => `/competition/${code}/group` },
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
        const isActive = pathname === href || (tab.id === "picks" && pathname.endsWith("/picks"));
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
  const base = `w-5 h-5 rounded ${active ? "bg-ink" : "border border-current"}`;
  if (id === "picks") return <div className={base} aria-hidden />;
  if (id === "board") return <div className={`${base} rounded-sm`} aria-hidden />;
  return <div className={`${base} rounded-full`} aria-hidden />;
}
