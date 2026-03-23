import { useState, useEffect } from "react";
import { cn, formatNumber, truncateAddress } from "../lib/utils";
import { IconTrophy, IconUser, IconZap, IconCoins, IconShare, IconTrendingUp, IconTrendingDown, IconTarget, IconAward } from "./Icons";

interface LeaderboardEntry {
  walletAddress: string;
  username: string;
  doodlBalance: number; // KOR
  totalBets: number;    // Games
  wins: number;         // Wins
  referralCount: number;
  coins: number;        // Points
}

export function Leaderboard() {
  const [entriesKor, setEntriesKor] = useState<LeaderboardEntry[]>([]);
  const [entriesReferral, setEntriesReferral] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"kor" | "referral">("kor");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.success) {
          setEntriesKor(data.leaderboardKor || []);
          setEntriesReferral(data.leaderboardReferrals || []);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 h-64 text-slate-400">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4" />
        <p>Loading Leaderboard...</p>
      </div>
    );
  }

  const currentEntries = activeTab === "kor" ? entriesKor : entriesReferral;

  return (
    <div className="space-y-4 pb-10 max-w-md mx-auto w-full">
      {/* Timer / Header Banner (Matches the bet history style roughly) */}
      <div className="bg-gradient-to-r from-brand-dark to-dark rounded-xl p-4 text-center shadow-card border-l-4 border-pitch relative overflow-hidden">
        <IconTrophy className="absolute -right-2 -bottom-2 w-20 h-20 text-white/5" />
        <h2 className="font-mono text-[10px] uppercase text-brand-light tracking-widest mb-1 shadow-sm">
          GLOBAL STANDINGS
        </h2>
        <div className="font-mono text-2xl font-bold text-black tracking-wider">
          LEADERBOARD
        </div>
      </div>

      {/* Prize Pool & Season Section */}
      <div className="flex justify-between items-center px-2 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-2 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center border border-yellow-400/20 shadow-inner">
            <IconCoins className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">
              Active Reward
            </div>
            <div className="text-lg font-black text-dark tracking-tighter flex items-center gap-1">
              $1,000,000
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 bg-slate-100 px-1.5 py-0.5 rounded">KOR</span>
            </div>
          </div>
        </div>

        <div className="text-right relative z-10">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">
            Status
          </div>
          <div className="inline-flex items-center gap-2 bg-brand text-white pl-3 pr-1 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 border border-brand-light/30">
            Season 1
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-gray-200 p-1 rounded-xl overflow-hidden shadow-inner mt-4 mb-2">
        <button
          onClick={() => setActiveTab("kor")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "kor"
              ? "bg-white text-brand shadow-sm"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Highest KOR
        </button>
        <button
          onClick={() => setActiveTab("referral")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "referral"
              ? "bg-white text-brand shadow-sm"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Most Referrals
        </button>
      </div>

      {currentEntries.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm">No players found on the leaderboard yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentEntries.map((entry, index) => {
            const isTop3 = index < 3;
            return (
              <div
                key={entry.walletAddress}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 group hover:border-brand/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Player Profile
                    </div>
                    <div className="font-bold text-dark text-sm flex items-center gap-1">
                      {entry.username}
                      {isTop3 && <IconAward className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {truncateAddress(entry.walletAddress)}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-[9px] font-bold uppercase px-2 py-1 rounded border shadow-sm",
                      index === 0 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        index === 1 ? "bg-slate-50 text-slate-700 border-slate-200" :
                          index === 2 ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-gray-50 text-gray-700 border-gray-200"
                    )}
                  >
                    Rank #{index + 1}
                  </div>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-gray-50">
                  <div>
                    <div className="font-mono text-xs font-bold text-dark">
                      {entry.wins}W / {entry.totalBets - entry.wins}L{" "}
                      <span className="text-gray-300 mx-1">@</span>{" "}
                      <span className="text-brand">{entry.totalBets} Games</span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 mt-1">
                      Referrals: {entry.referralCount} • Points: {formatNumber(entry.coins)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                      {activeTab === "kor" ? "KOR Tokens" : "Referrals"}
                    </div>
                    {activeTab === "kor" ? (
                      <div className="font-mono font-bold text-brand bg-brand/5 px-2 py-1 rounded border border-brand/10 shadow-sm inline-flex items-center gap-1">
                        <IconZap className="w-3 h-3" />
                        {formatNumber(entry.doodlBalance)}
                      </div>
                    ) : (
                      <div className="font-mono font-bold text-dark bg-gray-50 px-2 py-1 rounded border border-gray-200 shadow-sm inline-flex items-center gap-1">
                        <IconUser className="w-3 h-3" />
                        {formatNumber(entry.referralCount)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
