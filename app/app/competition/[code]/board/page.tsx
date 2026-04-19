import { MobileShell } from "@/components/layout/MobileShell";
import { TopBar } from "@/components/layout/TopBar";
import { TabBar } from "@/components/layout/TabBar";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function BoardPage({ params }: Props) {
  const { code } = await params;
  return (
    <MobileShell>
      <TopBar title="Leaderboard" />
      <main className="flex flex-col flex-1 items-center justify-center px-5 py-8 gap-4">
        <p className="font-display text-2xl font-bold text-ink">Coming soon</p>
        <p className="font-sans text-sm text-ink-2 text-center">
          The live leaderboard will appear here once the tournament is underway.
        </p>
      </main>
      <TabBar competitionCode={code.toUpperCase()} />
    </MobileShell>
  );
}
