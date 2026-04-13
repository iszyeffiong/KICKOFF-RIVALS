import { createFileRoute } from "@tanstack/react-router";
import { useGame } from "@/contexts/GameContext";
import { useProfile } from "@/hooks/useProfile";
import { LeagueTable } from "../../components/LeagueTable";

export const Route = createFileRoute("/dashboard/league")({
  component: LeagueTab,
});

function LeagueTab() {
  const { profile } = useProfile();
  const { leagueTables, selectedLeagueId, setSelectedLeagueId } =
    useGame();

  return (
    <main className="p-3 max-w-md mx-auto w-full">
      <LeagueTable
        entries={leagueTables[selectedLeagueId] || []}
        currentLeagueId={selectedLeagueId}
        onLeagueChange={setSelectedLeagueId}
        userStats={profile as any}
      />
    </main>
  );
}
