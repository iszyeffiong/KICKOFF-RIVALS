import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { RivalsLogo } from "./RivalsLogo";
import {
  IconTrophy,
  IconChevronRight,
  IconStar,
  IconTarget,
} from "./Icons";

interface ReturningUserWelcomeProps {
  username: string;
  totalBets: number;
  wins: number;
  korBalance: number;
  loginStreak?: number;
  onProceed: () => void;
}

export function ReturningUserWelcome({
  username,
  totalBets,
  wins,
  korBalance,
  loginStreak = 0,
  onProceed,
}: ReturningUserWelcomeProps) {
  const [showStats, setShowStats] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowStats(true), 500);
    const timer2 = setTimeout(() => setAnimationComplete(true), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const winRate = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <RivalsLogo size="md" variant="full" className="text-white" />
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          {/* Welcome Icon */}
          <div className="flex justify-center mb-6 animate-bounce-subtle">
            <div className="p-6 rounded-full bg-primary/20 shadow-lg shadow-primary/20">
              <IconTrophy className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* Welcome Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in">
            Welcome Back!
          </h1>

          <p className="text-xl text-slate-300 mb-2 animate-fade-in">
            {username}
          </p>

          <p className="text-slate-400 mb-8 animate-fade-in">
            Great to see you again. Ready to win?
          </p>

          {/* Stats Section */}
          {showStats && (
            <div className="space-y-4 mb-8 animate-slide-up">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
                Your Performance
              </h2>

              {/* Main Stats Grid */}
              <div className="bg-slate-800/50 border border-primary/20 rounded-xl p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {/* Total Bets */}
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-3xl font-bold text-white">
                      {totalBets}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">Total Bets</p>
                  </div>

                  {/* Win Rate */}
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-3xl font-bold text-primary">{winRate}%</p>
                    <p className="text-xs text-slate-400 mt-2">Win Rate</p>
                  </div>

                  {/* KOR Balance */}
                  <div className="bg-yellow-500/10 rounded-lg p-4">
                    <p className="text-3xl font-bold text-yellow-400">
                      {Math.floor(korBalance)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">KOR Balance</p>
                  </div>
                </div>
              </div>

              {/* Wins Counter */}
              <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
                    <IconTarget className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-green-400">{wins}</span>{" "}
                    wins
                  </p>
                  <p className="text-xs text-slate-500">
                    {totalBets > 0
                      ? `${totalBets - wins} losses`
                      : "Start betting to build your record"}
                  </p>
                </div>
              </div>

              {/* Login Streak */}
              {loginStreak > 0 && (
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20">
                      <IconStar className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-slate-300">
                      <span className="font-bold text-orange-400">
                        {loginStreak}
                      </span>{" "}
                      day streak
                    </p>
                    <p className="text-xs text-slate-500">
                      Keep it up!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CTA Button */}
          {animationComplete && (
            <button
              onClick={onProceed}
              className={cn(
                "btn btn-primary w-full h-14 font-semibold text-lg",
                "hover:scale-[1.02] transition-all duration-300",
                "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
                "animate-fade-in"
              )}
            >
              Continue to Dashboard
              <IconChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}

          {/* Tips */}
          <div className="mt-8 text-slate-500 text-sm animate-fade-in">
            <p>New matches start every few seconds. Good luck!</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-slate-500 text-xs">
        Play responsibly. Virtual currency only.
      </footer>
    </div>
  );
}

export default ReturningUserWelcome;
