import { Loader2 } from "lucide-react";

export function MaintenanceOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark/95 backdrop-blur-sm">
      <div className="max-w-md w-full px-6 text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative text-7xl mb-4">🚧</div>
        </div>

        <h1 className="text-4xl font-sport italic text-black tracking-widest uppercase">
          Under Maintenance
        </h1>

        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />

        <p className="text-light-secondary text-lg leading-relaxed font-sans">
          We're currently preparing the field for a major upgrade.
          The game will be back online shortly with improved features and performance.
        </p>


        <div className="pt-8 border-t border-white/10">
          <p className="text-xs text-black uppercase tracking-[0.2em]">
            Thanks for your patience, Rivals!
          </p>
        </div>
      </div>
    </div>
  );
}
