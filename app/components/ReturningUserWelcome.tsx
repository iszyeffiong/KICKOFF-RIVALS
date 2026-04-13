import { cn } from "../lib/utils";
import { RivalsLogo } from "./RivalsLogo";
import {
  IconTrophy,
  IconCoins,
  IconChevronRight,
  IconActivity,
  IconTrendingUp,
  IconCrown,
  IconStar,
  IconZap,
} from "./Icons";

interface ReturningUserWelcomeProps {
  username: string;
  totalBets: number;
  wins: number;
  korBalance: number;
  coins: number;
  onProceed: () => void;
}

export function ReturningUserWelcome({
  username,
  totalBets,
  wins,
  korBalance,
  coins,
  onProceed,
}: ReturningUserWelcomeProps) {
  const winRate = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:radial-gradient(white,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center animate-fade-in">
        <RivalsLogo size="md" variant="full" className="text-white" />
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5">
          <IconZap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white tracking-wider uppercase">Pro Player</span>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full">
          {/* Welcome Avatar/Icon */}
          <div className="flex justify-center mb-8 relative animate-bounce-subtle">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-primary/50 shadow-2xl shadow-primary/20">
                <IconCrown className="w-20 h-20 text-primary" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-900 p-2 rounded-full shadow-lg">
                <IconStar className="w-6 h-6 fill-current" />
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              Welcome Back,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                {username}
              </span>
            </h1>
            <p className="text-slate-400 text-lg">
              The arena has missed your presence. Your stats were waiting.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-primary/30 transition-colors group animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <IconTrophy className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-sm font-medium">Wins</span>
              </div>
              <div className="text-3xl font-bold text-white leading-none">{wins}</div>
              <div className="mt-2 text-xs text-slate-500 uppercase tracking-wider font-bold">Total Victories</div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-blue-400/30 transition-colors group animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-400/10 text-blue-400 group-hover:bg-blue-400 group-hover:text-white transition-colors">
                  <IconActivity className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-sm font-medium">Win Rate</span>
              </div>
              <div className="text-3xl font-bold text-white leading-none">{winRate}%</div>
              <div className="mt-2 text-xs text-slate-500 uppercase tracking-wider font-bold">Performance</div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-yellow-400/30 transition-colors group animate-slide-up" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-500 group-hover:bg-yellow-400 group-hover:text-white transition-colors">
                  <IconCoins className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-sm font-medium">Coins</span>
              </div>
              <div className="text-3xl font-bold text-white leading-none">{coins.toLocaleString()}</div>
              <div className="mt-2 text-xs text-slate-500 uppercase tracking-wider font-bold">Game Currency</div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-primary/30 transition-colors group animate-slide-up" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <IconStar className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-sm font-medium">Tokens</span>
              </div>
              <div className="text-3xl font-bold text-white leading-none">{korBalance.toLocaleString()}</div>
              <div className="mt-2 text-xs text-slate-500 uppercase tracking-wider font-bold">KOR Balance</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onProceed}
            className={cn(
              "btn btn-primary w-full h-16 rounded-2xl font-bold text-xl group animate-fade-in",
              "shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]",
              "transition-all duration-300 transform hover:-translate-y-1 active:scale-95",
              "flex items-center justify-center gap-2"
            )}
            style={{ animationDelay: '800ms' }}
          >
            Enter Dashboard
            <IconChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-6 text-center text-slate-500 text-sm animate-fade-in" style={{ animationDelay: '1000ms' }}>
            Syncing results from the arena...
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-8 flex justify-center gap-6 animate-fade-in" style={{ animationDelay: '1200ms' }}>
        <div className="h-1 w-12 rounded-full bg-slate-700" />
        <div className="h-1 w-12 rounded-full bg-primary" />
        <div className="h-1 w-12 rounded-full bg-slate-700" />
      </footer>
    </div>
  );
}

export default ReturningUserWelcome;
