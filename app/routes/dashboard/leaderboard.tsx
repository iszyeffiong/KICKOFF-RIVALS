import { createFileRoute } from "@tanstack/react-router";
import { Leaderboard } from "../../components/Leaderboard";

export const Route = createFileRoute("/dashboard/leaderboard")({
  component: LeaderboardRoute,
});

function LeaderboardRoute() {
  return (
    <div className="p-3 max-w-[95vw] mx-auto w-full relative min-h-[50vh]">
      <Leaderboard />
    </div>
  );
}
