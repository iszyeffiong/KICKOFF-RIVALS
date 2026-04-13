import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { LEAGUES } from "../../constants";
import { ResultsOverlay } from "../../components/dashboard/ResultsOverlay";
import { TimerBanner } from "../../components/dashboard/TimerBanner";
import { LeagueFilterBar } from "../../components/dashboard/ResultsOverlay";
import { MatchGrid } from "../../components/dashboard/MatchGrid";

export const Route = createFileRoute("/dashboard/home")({
  component: HomeTab,
});

function HomeTab() {
  const {
    gameState,
    timer,
    matches,
    getCurrentGameMinute,
    setBettingOn,
    setWatchingMatchId,
    handleAddToBetSlip,
    roundNumber,
  } = useGame();

  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState("all");

  return (
    <div className="p-3 max-w-[95vw] mx-auto w-full relative min-h-[50vh]">
      {/* Results Overlay — only shown when game is FINISHED */}
      {gameState === "FINISHED" && (
        <ResultsOverlay timer={timer} matches={matches} />
      )}

      {/* League column headers (desktop only) */}
      <div className="hidden md:grid grid-cols-3 gap-4 mb-4 font-bold text-white text-center">
        {LEAGUES.map((league) => (
          <div
            key={league.id}
            className="bg-dark/50 p-2 rounded-lg border border-pitch/30"
          >
            {league.name}
          </div>
        ))}
      </div>

      {/* Timer Banner */}
      <TimerBanner
        timer={timer}
        gameState={gameState}
        roundNumber={roundNumber}
        getCurrentGameMinute={getCurrentGameMinute}
      />

      {/* League filter pills */}
      <LeagueFilterBar
        selected={selectedLeagueFilter}
        onSelect={setSelectedLeagueFilter}
      />

      {/* Match cards */}
      <MatchGrid
        matches={matches}
        gameState={gameState}
        selectedLeagueFilter={selectedLeagueFilter}
        getCurrentGameMinute={getCurrentGameMinute}
        onBet={setBettingOn}
        onWatch={(match) => setWatchingMatchId(match.id)}
        onAddToBetSlip={handleAddToBetSlip}
      />
    </div>
  );
}
