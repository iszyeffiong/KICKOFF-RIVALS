import type { GameState } from "../../types";

interface TimerBannerProps {
  timer: number;
  gameState: GameState;
  roundNumber: number;
  getCurrentGameMinute: () => number;
}

export function TimerBanner({
  timer,
  gameState,
  roundNumber,
  getCurrentGameMinute,
}: TimerBannerProps) {
  return (
    <div className="bg-gradient-to-r from-brand-dark to-dark rounded-xl p-6 text-center mb-6 shadow-card border-l-4 border-pitch relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10 text-8xl font-sport font-black italic -rotate-12 translate-x-4 -translate-y-4 pointer-events-none">
        LIVE
      </div>

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="text-left">
          <div className="font-mono text-[10px] uppercase text-brand-light tracking-widest">
            ROUND
          </div>
          <div className="text-2xl font-bold text-white">#{roundNumber}</div>
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
            {Math.floor(timer / 60).toString().padStart(2, "0")}:
            {(timer % 60).toString().padStart(2, "0")}
          </div>
        )}
      </div>
    </div>
  );
}
