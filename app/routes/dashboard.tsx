import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, lazy, Suspense } from "react";
import { useGame } from "../contexts/GameContext";
import { LEAGUES, CONVERSION_RATE } from "../constants";

// Components
import { MatchCard } from "../components/MatchCard";
import { LeagueTable } from "../components/LeagueTable";
import { ProfileScreen } from "../components/ProfileScreen";
import { WalletModal } from "../components/WalletModal";
import { SwapConfirm } from "../components/SwapConfirm";
import { BetModal } from "../components/BetModal";
import { BetSlip } from "../components/BetSlip";
import { SimulationScreen } from "../components/SimulationScreen";
import { AdminAuth } from "../components/AdminAuth";
import { IconHome, IconTicket, IconUser, IconTable } from "../components/Icons";

const AdminPortal = lazy(() =>
  import("../components/AdminPortal").then((mod) => ({
    default: mod.AdminPortal,
  })),
);

export const Route = createFileRoute("/dashboard")({
  component: DashboardRoute,
});

function DashboardRoute() {
  const navigate = useNavigate();
  const {
    // Game state
    gameState,
    isInitializing,
    timer,
    matches,
    activeBets,
    leagueTables,
    userStats,
    balance,
    betSlipSelections,
    bettingOn,
    setBettingOn,
    watchingMatchId,
    setWatchingMatchId,
    selectedLeagueId,
    setSelectedLeagueId,
    showWallet,
    setShowWallet,
    showSwapConfirm,
    setShowSwapConfirm,
    showAdmin,
    setShowAdmin,
    showAdminAuth,
    setShowAdminAuth,
    adminSessionToken,
    coupons,
    setCoupons,
    setUserStats,
    setBalance,

    // Handlers
    handleBetPlacement,
    handleAddToBetSlip,
    handleRemoveFromBetSlip,
    handleClearBetSlip,
    handlePlaceBetSlip,
    handleQuestAction,
    handleQuestClaim,
    handleRedeem,
    handleReferral,
    handleLogout,
    handleClaimAllianceRewards,
    handleAdminSyncRequest,
    handleAdminAuthSuccess,
    fetchMatches,
    handleAdminLogout,
    addTransaction,
    getCurrentGameMinute,

    // Dashboard mount tracking
    setDashboardMounted,
  } = useGame();

  const [activeTab, setActiveTab] = useState<
    "home" | "league" | "bets" | "profile"
  >("home");
  const [betTab, setBetTab] = useState<"ongoing" | "ended">("ongoing");
  const [themeTransition, setThemeTransition] = useState(false);
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState("all");

  // Tell the context that the dashboard is mounted (starts game loop)
  useEffect(() => {
    setDashboardMounted(true);

    return () => setDashboardMounted(false);
  }, [setDashboardMounted]);

  const API_URL = "";

  // Route Guard: Redirect if no user logged in
  useEffect(() => {
    if (isInitializing) return;
    if (!userStats.username) {
      navigate({ to: "/" });
    }
  }, [userStats.username, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light text-dark font-sport italic text-2xl animate-pulse">
        LOADING...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans text-dark bg-light flex flex-col ${themeTransition ? "blur-sm" : ""} transition-all`}
    >
      {/* Header */}
      <header className="bg-dark text-white sticky top-0 z-[110] shadow-md">
        <div className="flex justify-between items-center p-3 h-16">
          <div className="font-sport font-black text-2xl italic tracking-tighter text-white">
            KICKOFF<span className="text-pitch">RIVALS</span>
          </div>
        </div>
        {/* Navigation */}
        <nav className="border-t border-gray-700">
          <div className="flex justify-around items-center">
            {[
              {
                id: "home",
                label: "Matches",
                icon: <IconHome className="w-5 h-5" />,
              },
              {
                id: "league",
                label: "Table",
                icon: <IconTable className="w-5 h-5" />,
              },
              {
                id: "bets",
                label: "My Bets",
                icon: <IconTicket className="w-5 h-5" />,
              },
              {
                id: "profile",
                label: "Profile",
                icon: <IconUser className="w-5 h-5" />,
              },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex flex-col items-center flex-1 py-2 transition-all ${
                  activeTab === t.id
                    ? "text-pitch border-b-2 border-pitch"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t.icon}
                <span
                  className={`text-[9px] font-bold uppercase mt-1 ${
                    activeTab === t.id ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Matches Tab */}
      {activeTab === "home" && (
        <div className="p-3 max-w-[95vw] mx-auto w-full relative min-h-[50vh]">
          {/* RESULTS OVERLAY */}
          {gameState === "FINISHED" && (
            <div
              id="results-overlay"
              className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-start text-white overflow-y-auto w-full"
            >
              <div className="w-full max-w-6xl flex flex-col items-center pt-36 pb-8 px-4 relative">
                <button
                  onClick={() => {
                    // HACK: Hide the overlay manually by removing the z-index class or hiding it
                    // A better way is state, but since the parent controls this based on GameState,
                    // we'll just use a local state to possibly override it
                    document.getElementById("results-overlay")!.style.display =
                      "none";
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
                <div className="text-4xl md:text-6xl font-bold font-sport italic mb-2 animate-bounce text-center text-pitch drop-shadow-glow">
                  ROUND ENDED
                </div>

                <div className="flex flex-col items-center gap-2 mb-8 bg-dark/50 p-4 rounded-xl border border-pitch/30 backdrop-blur-sm">
                  <div className="text-sm text-gray-400 font-mono uppercase tracking-widest">
                    Next Round Starts In
                  </div>
                  <div className="text-5xl font-mono font-bold text-white tabular-nums">
                    {Math.floor(timer / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(timer % 60).toString().padStart(2, "0")}
                  </div>
                </div>

                <div className="text-xl text-brand-light font-mono tracking-widest mb-6 border-b border-brand-light/30 pb-2 w-full text-center max-w-md">
                  FINAL SCORES
                </div>

                {/* Overlay Filter Buttons */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-4 scrollbar-hide px-2 w-full justify-center">
                  <button
                    onClick={() => setSelectedLeagueFilter("all")}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${
                      selectedLeagueFilter === "all"
                        ? "bg-pitch text-white ring-2 ring-offset-2 ring-pitch"
                        : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    ALL LEAGUES
                  </button>
                  {LEAGUES.map((league) => (
                    <button
                      key={league.id}
                      onClick={() => setSelectedLeagueFilter(league.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${
                        selectedLeagueFilter === league.id
                          ? `bg-pitch text-white ring-2 ring-offset-2 ring-pitch`
                          : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      {league.name.toUpperCase()}
                    </button>
                  ))}
                </div>

                {selectedLeagueFilter === "all" ? (
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
                              displayScore={{
                                home:
                                  m.homeScore !== undefined &&
                                  m.homeScore !== null
                                    ? m.homeScore
                                    : (m.result?.homeScore ?? 0),
                                away:
                                  m.awayScore !== undefined &&
                                  m.awayScore !== null
                                    ? m.awayScore
                                    : (m.result?.awayScore ?? 0),
                              }}
                              onBet={() => {}}
                              onWatch={() => {}}
                              onAddToBetSlip={() => {}}
                            />
                          ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {matches
                      .filter((m) => m.leagueId === selectedLeagueFilter)
                      .map((m) => (
                        <MatchCard
                          key={m.id}
                          match={m}
                          minute={90}
                          displayScore={{
                            home:
                              m.homeScore !== undefined && m.homeScore !== null
                                ? m.homeScore
                                : (m.result?.homeScore ?? 0),
                            away:
                              m.awayScore !== undefined && m.awayScore !== null
                                ? m.awayScore
                                : (m.result?.awayScore ?? 0),
                          }}
                          onBet={() => {}}
                          onWatch={() => {}}
                          onAddToBetSlip={() => {}}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* League Headers (Visual Only) */}
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
          <div className="bg-gradient-to-r from-brand-dark to-dark rounded-xl p-6 text-center mb-6 shadow-card border-l-4 border-pitch relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 text-8xl font-sport font-black italic -rotate-12 translate-x-4 -translate-y-4 pointer-events-none">
              LIVE
            </div>

            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="text-left">
                <div className="font-mono text-[10px] uppercase text-brand-light tracking-widest">
                  ROUND
                </div>
                <div className="text-2xl font-bold text-white">
                  #{useGame().roundNumber}
                </div>
              </div>
              <div className="text-right">
                <h2 className="font-mono text-[10px] uppercase text-brand-light tracking-widest mb-1">
                  {gameState} PHASE
                </h2>
              </div>
            </div>

            <div className="bg-white/90 rounded-lg py-2 shadow-inner">
              {gameState === "LIVE" ? (
                <div className="font-mono text-7xl font-bold text-red-600 tracking-wider tabular-nums drop-shadow-sm animate-pulse">
                  {getCurrentGameMinute()}'
                </div>
              ) : (
                <div className="font-mono text-7xl font-bold text-black tracking-wider tabular-nums drop-shadow-sm">
                  {Math.floor(timer / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(timer % 60).toString().padStart(2, "0")}
                </div>
              )}
            </div>
          </div>

          {/* League Filter Buttons */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-4 scrollbar-hide px-2">
            <button
              onClick={() => setSelectedLeagueFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${
                selectedLeagueFilter === "all"
                  ? "bg-pitch text-white ring-2 ring-offset-2 ring-pitch"
                  : "bg-white text-gray-500 hover:bg-gray-100 hover:text-dark"
              }`}
            >
              ALL LEAGUES
            </button>
            {LEAGUES.map((league) => (
              <button
                key={league.id}
                onClick={() => setSelectedLeagueFilter(league.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${
                  selectedLeagueFilter === league.id
                    ? `bg-pitch text-white ring-2 ring-offset-2 ring-pitch`
                    : "bg-white text-gray-500 hover:bg-gray-100 hover:text-dark"
                }`}
                style={
                  selectedLeagueFilter === league.id
                    ? {
                        backgroundColor: league.color
                          .split(" ")[0]
                          .replace("bg-", ""),
                      }
                    : {}
                }
              >
                {league.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Match Cards - filtered */}
          {selectedLeagueFilter === "all" ? (
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${
                gameState !== "BETTING" ? "opacity-90 grayscale-0" : ""
              }`}
            >
              {LEAGUES.map((league) => (
                <div key={league.id} className="space-y-4">
                  <h3 className="md:hidden font-bold text-brand-dark mb-2 sticky top-[130px] z-[105] bg-light/95 backdrop-blur-sm p-2 rounded border-b-2 border-brand">
                    {league.name}
                  </h3>
                  {matches
                    .filter((m) => m.leagueId === league.id)
                    .map((m) => {
                      const currentMinute = getCurrentGameMinute();
                      let displayScore = undefined;

                      if (gameState === "LIVE" || gameState === "FINISHED") {
                        // Prefer server scores if available
                        if (m.homeScore !== undefined && m.homeScore !== null) {
                          displayScore = {
                            home: m.homeScore,
                            away: m.awayScore!,
                          };
                        }
                        // Fallback to events if score is missing but we have events
                        else if (m.events) {
                          const homeGoals = m.events.filter(
                            (e: any) =>
                              e.type === "goal" &&
                              e.teamId === m.homeTeam.id &&
                              e.minute <= currentMinute,
                          ).length;
                          const awayGoals = m.events.filter(
                            (e: any) =>
                              e.type === "goal" &&
                              e.teamId === m.awayTeam.id &&
                              e.minute <= currentMinute,
                          ).length;
                          displayScore = { home: homeGoals, away: awayGoals };
                        }

                        // For FINISHED state, fallback to result object
                        if (
                          gameState === "FINISHED" &&
                          !displayScore &&
                          m.result
                        ) {
                          displayScore = {
                            home: m.result.homeScore,
                            away: m.result.awayScore,
                          };
                        }
                      }

                      return (
                        <MatchCard
                          key={m.id}
                          match={m}
                          minute={currentMinute}
                          displayScore={displayScore}
                          onBet={setBettingOn}
                          onWatch={(match) => setWatchingMatchId(match.id)}
                          onAddToBetSlip={handleAddToBetSlip}
                        />
                      );
                    })}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${gameState !== "BETTING" ? "opacity-90 grayscale-0" : ""}`}
            >
              {matches
                .filter((m) => m.leagueId === selectedLeagueFilter)
                .map((m) => {
                  const currentMinute = getCurrentGameMinute();
                  let displayScore = undefined;

                  if (gameState === "LIVE" || gameState === "FINISHED") {
                    if (m.homeScore !== undefined && m.homeScore !== null) {
                      displayScore = { home: m.homeScore, away: m.awayScore! };
                    } else if (m.events) {
                      const homeGoals = m.events.filter(
                        (e: any) =>
                          e.type === "goal" &&
                          e.teamId === m.homeTeam.id &&
                          e.minute <= currentMinute,
                      ).length;
                      const awayGoals = m.events.filter(
                        (e: any) =>
                          e.type === "goal" &&
                          e.teamId === m.awayTeam.id &&
                          e.minute <= currentMinute,
                      ).length;
                      displayScore = { home: homeGoals, away: awayGoals };
                    }
                    if (gameState === "FINISHED" && !displayScore && m.result) {
                      displayScore = {
                        home: m.result.homeScore,
                        away: m.result.awayScore,
                      };
                    }
                  }

                  return (
                    <MatchCard
                      key={m.id}
                      match={m}
                      minute={currentMinute}
                      displayScore={displayScore}
                      onBet={setBettingOn}
                      onWatch={(match) => setWatchingMatchId(match.id)}
                      onAddToBetSlip={handleAddToBetSlip}
                    />
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* League Table Tab */}
      {activeTab === "league" && (
        <main className="p-3 max-w-md mx-auto w-full">
          <LeagueTable
            entries={leagueTables[selectedLeagueId] || []}
            currentLeagueId={selectedLeagueId}
            onLeagueChange={setSelectedLeagueId}
            userStats={userStats}
          />
        </main>
      )}

      {/* My Bets Tab */}
      {activeTab === "bets" && (
        <main className="p-3 max-w-md mx-auto w-full space-y-4">
          <div className="flex bg-gray-200 p-1 rounded-xl overflow-hidden shadow-inner">
            <button
              onClick={() => setBetTab("ongoing")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                betTab === "ongoing"
                  ? "bg-white text-brand shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setBetTab("ended")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                betTab === "ended"
                  ? "bg-white text-brand shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              History
            </button>
          </div>
          <div className="space-y-3">
            {(() => {
              const filtered = activeBets.filter((b) =>
                betTab === "ongoing"
                  ? b.status === "pending"
                  : b.status !== "pending",
              );

              // Group accumulator bets by accumulatorId, keep singles as-is
              const singles = filtered.filter(
                (b) => b.betType !== "accumulator",
              );
              const accMap = new Map<string, typeof filtered>();
              filtered
                .filter((b) => b.betType === "accumulator" && b.accumulatorId)
                .forEach((b) => {
                  const key = b.accumulatorId!;
                  if (!accMap.has(key)) accMap.set(key, []);
                  accMap.get(key)!.push(b);
                });

              const statusStyle = (status: string) =>
                status === "won"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : status === "lost"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200";

              return (
                <>
                  {/* SINGLE BETS — each is its own slip */}
                  {singles.map((b, i) => (
                    <div
                      key={`single-${b.id}-${i}`}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-brand/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                            Single Bet
                          </div>
                          <div className="font-mono text-xs font-bold text-dark">
                            {b.homeTeamName && b.awayTeamName
                              ? `${b.homeTeamName} vs ${b.awayTeamName}`
                              : `Match #${b.matchId.slice(-4)}`}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Pick:{" "}
                            <span className="font-semibold text-brand">
                              {b.selection.toUpperCase()}
                            </span>{" "}
                            <span className="text-gray-400">
                              @ {Number(b.odds).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${statusStyle(b.status)}`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-2 mt-1">
                        <span>
                          Stake:{" "}
                          <span className="font-semibold text-dark">
                            {b.stake} KOR
                          </span>
                        </span>
                        <span>
                          {b.status === "won" ? (
                            <span className="text-green-600 font-bold">
                              +{b.potentialReturn.toFixed(0)} KOR
                            </span>
                          ) : b.status === "lost" ? (
                            <span className="text-red-500 font-medium">
                              Cashout: 0 KOR
                            </span>
                          ) : (
                            <span className="text-brand font-semibold">
                              Win: {b.potentialReturn.toFixed(0)} KOR
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* ACCUMULATOR BETS — grouped into one slip per accumulatorId */}
                  {Array.from(accMap.entries()).map(([accId, legs]) => {
                    const firstLeg = legs[0];
                    const accStatus = legs.every((l) => l.status === "won")
                      ? "won"
                      : legs.some((l) => l.status === "lost")
                        ? "lost"
                        : "pending";
                    const totalOdds = legs.reduce((p, l) => p * l.odds, 1);
                    const stake = firstLeg.stake;
                    const potentialReturn = stake * totalOdds;

                    return (
                      <div
                        key={`acc-${accId}`}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-brand/30 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                              Accumulator · {legs.length} selections
                            </div>
                            <div className="text-[11px] text-gray-500">
                              Combined Odds:{" "}
                              <span className="font-bold text-brand">
                                {totalOdds.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${statusStyle(accStatus)}`}
                          >
                            {accStatus}
                          </span>
                        </div>

                        {/* Each leg */}
                        <div className="space-y-1.5 mb-3">
                          {legs.map((leg, li) => (
                            <div
                              key={`leg-${leg.id}-${li}`}
                              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5"
                            >
                              <div className="text-[11px] text-gray-600">
                                {leg.homeTeamName && leg.awayTeamName
                                  ? `${leg.homeTeamName} vs ${leg.awayTeamName}`
                                  : `Match #${leg.matchId.slice(-4)}`}
                                {" · "}
                                <span className="font-semibold text-dark">
                                  {leg.selection.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-brand font-bold">
                                  @{Number(leg.odds).toFixed(2)}
                                </span>
                                <span
                                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${statusStyle(leg.status)}`}
                                >
                                  {leg.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-2">
                          <span>
                            Stake:{" "}
                            <span className="font-semibold text-dark">
                              {stake} KOR
                            </span>
                          </span>
                          <span>
                            {accStatus === "won" ? (
                              <span className="text-green-600 font-bold">
                                +{potentialReturn.toFixed(0)} KOR
                              </span>
                            ) : accStatus === "lost" ? (
                              <span className="text-red-500 font-medium">
                                Cashout: 0 KOR (Lost)
                              </span>
                            ) : (
                              <span className="text-brand font-semibold">
                                Win: {potentialReturn.toFixed(0)} KOR
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <div className="text-4xl mb-3">🎫</div>
                      <div className="font-semibold">
                        No {betTab === "ongoing" ? "active" : "past"} bets
                      </div>
                      <div className="text-xs mt-1">
                        {betTab === "ongoing"
                          ? "Place a bet from the Matches tab"
                          : "Your bet history will appear here"}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </main>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <main className="p-3 max-w-md mx-auto w-full">
          <ProfileScreen
            stats={userStats}
            onLogout={() => {
              handleLogout();
              navigate({ to: "/" });
            }}
            onRedeem={handleRedeem}
            onQuestClaim={handleQuestClaim}
            onQuestAction={handleQuestAction}
            onReferral={handleReferral}
            onSystemSync={handleAdminSyncRequest}
            onOpenWallet={() => setShowWallet(true)}
            onClaimAllianceRewards={handleClaimAllianceRewards}
          />
        </main>
      )}

      {/* Modals */}
      {showWallet && (
        <WalletModal
          onClose={() => setShowWallet(false)}
          onSwapRequest={() => {
            setShowWallet(false);
            setShowSwapConfirm(true);
          }}
          currentBalance={balance}
          userStats={userStats}
          onWalkReward={() => {}}
        />
      )}

      {showSwapConfirm && (
        <SwapConfirm
          coins={userStats.coins}
          onConfirm={async () => {
            const amount =
              Math.floor(userStats.coins / CONVERSION_RATE) * CONVERSION_RATE;
            try {
              const res = await fetch(`${API_URL}/api/user/convert-coins`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  walletAddress: userStats.walletAddress,
                  amount,
                }),
              });
              const data = await res.json();
              if (data.success) {
                setUserStats((s) => ({
                  ...s,
                  coins: data.coins,
                  korBalance: data.korBalance,
                }));
                setBalance(data.korBalance);
                addTransaction("convert", amount, "coins", "Swapped for KOR");
              } else {
                alert("Swap failed: " + data.error);
              }
            } catch (e) {
              console.error(e);
            }
            setShowSwapConfirm(false);
          }}
          onCancel={() => setShowSwapConfirm(false)}
        />
      )}

      {watchingMatchId && matches.find((m) => m.id === watchingMatchId) && (
        <SimulationScreen
          match={matches.find((m) => m.id === watchingMatchId)!}
          result={matches.find((m) => m.id === watchingMatchId)!.result!}
          currentMinute={getCurrentGameMinute()}
          onFinish={() => setWatchingMatchId(null)}
        />
      )}

      {bettingOn && (
        <BetModal
          match={bettingOn}
          balance={balance}
          onClose={() => setBettingOn(null)}
          onPlaceBet={handleBetPlacement}
        />
      )}

      {showAdminAuth && (
        <AdminAuth
          onAuthSuccess={handleAdminAuthSuccess}
          onCancel={() => setShowAdminAuth(false)}
        />
      )}

      {showAdmin && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[600] flex items-center justify-center">
              Loading admin...
            </div>
          }
        >
          <AdminPortal
            coupons={coupons}
            setCoupons={setCoupons}
            quests={userStats.quests}
            setQuests={(q) => setUserStats((p) => ({ ...p, quests: q }))}
            onClose={() => setShowAdmin(false)}
            sessionToken={adminSessionToken || ""}
            matches={matches}
            onRefreshMatches={fetchMatches}
          />
        </Suspense>
      )}

      {/* Bet Slip - Always visible at bottom */}
      <BetSlip
        selections={betSlipSelections}
        balance={userStats.korBalance}
        onRemoveSelection={handleRemoveFromBetSlip}
        onClearAll={handleClearBetSlip}
        onPlaceBet={handlePlaceBetSlip}
      />
    </div>
  );
}
