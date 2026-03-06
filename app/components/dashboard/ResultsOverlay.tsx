import { useState } from "react";
import { LEAGUES } from "../../constants";
import { MatchCard } from "../MatchCard";
import type { Match } from "../../types";

interface ResultsOverlayProps {
  timer: number;
  matches: Match[];
}

export function ResultsOverlay({ timer, matches }: ResultsOverlayProps) {
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState("all");

  return (
    <div
      id="results-overlay"
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-start text-white overflow-y-auto w-full"
    >
      <div className="w-full max-w-6xl flex flex-col items-center pt-36 pb-8 px-4 relative">
        <CloseButton />

        <RoundEndedBanner timer={timer} />

        <LeagueFilterBar
          selected={selectedLeagueFilter}
          onSelect={setSelectedLeagueFilter}
          dark
        />

        <MatchResultsGrid
          matches={matches}
          selectedLeagueFilter={selectedLeagueFilter}
        />
      </div>
    </div>
  );
}

function CloseButton() {
  return (
    <button
      onClick={() => {
        const el = document.getElementById("results-overlay");
        if (el) el.style.display = "none";
      }}
      className="absolute top-8 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-all z-[120]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}

function RoundEndedBanner({ timer }: { timer: number }) {
  return (
    <>
      <div className="text-4xl md:text-6xl font-bold font-sport italic mb-2 animate-bounce text-center text-pitch drop-shadow-glow">
        ROUND ENDED
      </div>

      <div className="flex flex-col items-center gap-2 mb-8 bg-dark/50 p-4 rounded-xl border border-pitch/30 backdrop-blur-sm">
        <div className="text-sm text-gray-400 font-mono uppercase tracking-widest">
          Next Round Starts In
        </div>
        <div className="text-5xl font-mono font-bold text-white tabular-nums">
          {Math.floor(timer / 60).toString().padStart(2, "0")}:
          {(timer % 60).toString().padStart(2, "0")}
        </div>
      </div>

      <div className="text-xl text-brand-light font-mono tracking-widest mb-6 border-b border-brand-light/30 pb-2 w-full text-center max-w-md">
        FINAL SCORES
      </div>
    </>
  );
}

interface LeagueFilterBarProps {
  selected: string;
  onSelect: (id: string) => void;
  dark?: boolean;
}

export function LeagueFilterBar({
  selected,
  onSelect,
  dark = false,
}: LeagueFilterBarProps) {
  const activeClass = "bg-pitch text-white ring-2 ring-offset-2 ring-pitch";
  const inactiveClass = dark
    ? "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
    : "bg-white text-gray-500 hover:bg-gray-100 hover:text-dark";

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-4 scrollbar-hide px-2 w-full justify-center">
      <button
        onClick={() => onSelect("all")}
        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${
          selected === "all" ? activeClass : inactiveClass
        }`}
      >
        ALL LEAGUES
      </button>
      {LEAGUES.map((league) => (
        <button
          key={league.id}
          onClick={() => onSelect(league.id)}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${
            selected === league.id ? activeClass : inactiveClass
          }`}
        >
          {league.name.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function MatchResultsGrid({
  matches,
  selectedLeagueFilter,
}: {
  matches: Match[];
  selectedLeagueFilter: string;
}) {
  const scoreFor = (m: Match) => ({
    home:
      m.homeScore !== undefined && m.homeScore !== null
        ? m.homeScore
        : (m.result?.homeScore ?? 0),
    away:
      m.awayScore !== undefined && m.awayScore !== null
        ? m.awayScore
        : (m.result?.awayScore ?? 0),
  });

  if (selectedLeagueFilter === "all") {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {LEAGUES.map((league) => (
          <div
            key={league.id}
            className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10"
          >
            <h3 className="font-bold text-center text-brand-light mb-2 border-b border-brand-light/30 pb-1">
              {league.name}
            </h3>
            {matches
              .filter((m) => m.leagueId === league.id)
              .map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  minute={90}
                  displayScore={scoreFor(m)}
                  onBet={() => {}}
                  onWatch={() => {}}
                  onAddToBetSlip={() => {}}
                />
              ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {matches
        .filter((m) => m.leagueId === selectedLeagueFilter)
        .map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            minute={90}
            displayScore={scoreFor(m)}
            onBet={() => {}}
            onWatch={() => {}}
            onAddToBetSlip={() => {}}
          />
        ))}
    </div>
  );
}
