import { useState } from "react";
import { cn } from "../lib/utils";
import { RivalsLogo } from "./RivalsLogo";
import { LEAGUES, TEAMS } from "../constants";
import {
  IconChevronRight,
  IconChevronLeft,
  IconCheck,
  IconUsers,
} from "./Icons";

interface AllianceSetupProps {
  apiUrl: string;
  initialUsername?: string; // pre-filled from onboarding
  onComplete: (data: {
    username: string;
    leagueId: string;
    teamId: string;
  }) => void;
}

export function AllianceSetup({
  apiUrl,
  initialUsername,
  onComplete,
}: AllianceSetupProps) {
  // Centralized onboarding flow: username is collected in Onboarding, then team in AllianceSetup.
  const [step, setStep] = useState<"league" | "team">("league");
  const [username] = useState(initialUsername ?? "");
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [error] = useState<string | null>(null);

  const handleLeagueSelect = (leagueId: string) => {
    setSelectedLeague(leagueId);
    setSelectedTeam(null);
    setStep("team");
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  const handleComplete = () => {
    if (selectedLeague && selectedTeam) {
      onComplete({
        username: username.trim(),
        leagueId: selectedLeague,
        teamId: selectedTeam,
      });
    }
  };

  const handleBack = () => {
    if (step === "team") {
      setStep("league");
    }
  };

  const teams = selectedLeague ? TEAMS[selectedLeague] || [] : [];
  const selectedTeamData = teams.find((t) => t.id === selectedTeam);
  const selectedLeagueData = LEAGUES.find((l) => l.id === selectedLeague);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <RivalsLogo size="sm" variant="full" className="text-white" />
        {step === "team" && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <IconChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </header>

      {/* Progress */}
      <div className="relative z-10 px-6">
        <div className="max-w-md mx-auto flex items-center gap-2">
          {["league", "team"].map((s, index) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                step === s
                  ? "bg-primary"
                  : index < ["league", "team"].indexOf(step)
                    ? "bg-primary/50"
                    : "bg-slate-700",
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* League Step */}
        {step === "league" && (
          <div className="max-w-md w-full animate-fade-in">
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Choose Your League
            </h1>
            <p className="text-slate-400 text-center mb-8">
              Pick the league you want to support
            </p>

            <div className="space-y-3">
              {LEAGUES.map((league) => (
                <button
                  key={league.id}
                  onClick={() => handleLeagueSelect(league.id)}
                  className={cn(
                    "w-full p-4 rounded-xl border transition-all",
                    "flex items-center justify-between",
                    "hover:border-primary hover:bg-primary/5",
                    selectedLeague === league.id
                      ? "border-primary bg-primary/10"
                      : "border-slate-700 bg-slate-800/50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* league logo or fallback initial */}
                    {league.logo ? (
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img
                          src={league.logo}
                          alt={`${league.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white",
                          league.id === "l1"
                            ? "bg-purple-600"
                            : league.id === "l2"
                              ? "bg-yellow-600"
                              : "bg-green-600",
                        )}
                      >
                        {league.name.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-white">
                        {league.name}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {TEAMS[league.id]?.length || 0} teams
                      </div>
                    </div>
                  </div>
                  <IconChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Team Step */}
        {step === "team" && selectedLeague && (
          <div className="max-w-md w-full animate-fade-in">
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Choose Your Team
            </h1>
            <p className="text-slate-400 text-center mb-2">
              {selectedLeagueData?.name}
            </p>
            <p className="text-slate-500 text-sm text-center mb-6">
              You'll earn bonus rewards when your team wins!
            </p>

            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 mb-6">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team.id)}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    "flex flex-col items-center gap-2 relative",
                    "hover:border-primary",
                    selectedTeam === team.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                      : "border-slate-700 bg-slate-800/50",
                  )}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg overflow-hidden"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={`${team.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      team.name.charAt(0)
                    )}
                  </div>
                  <span className="text-white text-sm font-medium text-center">
                    {team.name}
                  </span>
                  {selectedTeam === team.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <IconCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {selectedTeam && (
              <button
                onClick={handleComplete}
                className="btn btn-primary w-full h-12 font-semibold"
              >
                Join {selectedTeamData?.name}
                <IconChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-slate-500 text-xs">
        {step === "league" ? "Step 1 of 2" : "Step 2 of 2"}
      </footer>
    </div>
  );
}

export default AllianceSetup;
