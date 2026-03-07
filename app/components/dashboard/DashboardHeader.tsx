import { Link } from "@tanstack/react-router";
import { IconHome, IconTicket, IconUser, IconTable, IconCoins, IconZap, IconRefresh } from "../Icons";
import { useUserStore } from "../../stores/userStore";
import { useProfile } from "../../hooks/useProfile";
import { formatNumber } from "../../lib/utils";

const NAV_TABS = [
  {
    to: "/dashboard/home" as const,
    label: "Matches",
    icon: <IconHome className="w-5 h-5" />,
  },
  {
    to: "/dashboard/league" as const,
    label: "Table",
    icon: <IconTable className="w-5 h-5" />,
  },
  {
    to: "/dashboard/bets" as const,
    label: "My Bets",
    icon: <IconTicket className="w-5 h-5" />,
  },
  {
    to: "/dashboard/profile" as const,
    label: "Profile",
    icon: <IconUser className="w-5 h-5" />,
  },
] as const;

export function DashboardHeader() {
  const { walletState } = useUserStore();
  const { profile, isLoading, refresh, isFetching } = useProfile();

  return (
    <header className="bg-dark text-white sticky top-0 z-110 shadow-md">
      <div className="flex justify-between items-center p-3 h-16">
        <div className="font-sport font-black text-2xl italic tracking-tighter text-white">
          KICKOFF<span className="text-pitch">RIVALS</span>
        </div>

        {walletState.isConnected && (
          <div className="flex items-center gap-3">
            {/* Balances */}
            <div className="hidden sm:flex items-center gap-4 mr-2">
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <IconCoins className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs font-bold leading-none">
                  {isLoading ? "..." : formatNumber(profile?.coins || 0)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-pitch/10 px-2.5 py-1 rounded-lg border border-pitch/20">
                <IconZap className="w-3.5 h-3.5 text-pitch" />
                <span className="text-xs font-bold leading-none text-pitch">
                  {isLoading ? "..." : formatNumber(profile?.korBalance || 0)}
                </span>
              </div>
            </div>

            {/* Profile Brief & Refresh */}
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-1 pr-3 rounded-full border border-white/10 transition-colors"
                title="View Profile"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary overflow-hidden">
                  <IconUser className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold truncate max-w-[80px]">
                  {isLoading ? "Loading..." : profile?.username || "Guest"}
                </span>
              </Link>

              <button
                onClick={() => refresh()}
                disabled={isFetching}
                className={`p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${isFetching ? "opacity-50" : ""}`}
                title="Refresh Balance"
              >
                <IconRefresh className={`w-4 h-4 ${isFetching ? "animate-spin text-pitch" : "text-gray-400"}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      <nav className="border-t border-gray-700">
        <div className="flex justify-around items-center">
          {NAV_TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex flex-col items-center flex-1 py-2 transition-all text-gray-400 hover:text-white"
              activeProps={{
                className:
                  "flex flex-col items-center flex-1 py-2 transition-all text-pitch border-b-2 border-pitch",
              }}
            >
              {tab.icon}
              <span className="text-[9px] font-bold uppercase mt-1 opacity-70">
                {tab.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
