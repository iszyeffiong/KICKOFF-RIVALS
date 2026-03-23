import { useState } from "react";
import { cn } from "../lib/utils";
import { UserStats, Transaction } from "../types";
import { CONVERSION_RATE, CONVERSION_YIELD } from "../constants";
import {
  IconX,
  IconWallet,
  IconCoins,
  IconZap,
  IconArrowUp,
  IconArrowDown,
  IconChevronRight,
} from "./Icons";
import { formatNumber, formatDate, truncateAddress } from "../lib/utils";
interface WalletModalProps {
  onClose: () => void;
  onSwapRequest: () => void;
  onKorToCoinsRequest: (amount: number) => void;
  currentBalance: number;
  userStats: UserStats;
  onWalkReward: () => void;
}

export function WalletModal({
  onClose,
  onSwapRequest,
  onKorToCoinsRequest,
  currentBalance,
  userStats,
  onWalkReward,
}: WalletModalProps) {
  const [activeTab, setActiveTab] = useState<"balance" | "history">("balance");
  const [isSwapping, setIsSwapping] = useState(false);

  const canConvertCoins = userStats.coins >= CONVERSION_RATE;
  const convertibleKOR =
    Math.floor(userStats.coins / CONVERSION_RATE) * CONVERSION_YIELD;

  const minKorForCoins = 100;
  const canConvertKor = userStats.korBalance >= minKorForCoins;
  const convertibleCoins = userStats.korBalance * (CONVERSION_RATE / CONVERSION_YIELD);

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Centering wrapper — scrolls with overlay */}
      <div className="relative flex min-h-full items-center justify-center p-4 py-16">

      {/* Modal — natural height, no clipping */}
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <IconWallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Wallet</h2>
              <p className="text-xs text-muted-foreground font-mono">
                {truncateAddress(userStats.walletAddress)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <IconX className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 mx-4 mt-4 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab("balance")}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all",
              activeTab === "balance"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Balance
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all",
              activeTab === "history"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            History
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "balance" && (
            <div className="space-y-4">
              {/* KOR Balance */}
              <div className="card p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IconZap className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      KOR Tokens
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Betting Currency
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {formatNumber(userStats.korBalance)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Betting Currency
                </p>
              </div>

              {/* Coins Balance */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IconCoins className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-foreground">Coins</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Rewards Currency
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {formatNumber(userStats.coins)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {canConvertCoins
                    ? `Convert to ${convertibleKOR} KOR`
                    : `${CONVERSION_RATE - userStats.coins} more to convert`}
                </p>
              </div>

              {/* Coin to KOR Conversion */}
              <div className="card p-4 border-dashed bg-muted/20 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-3 relative z-20">
                  <h3 className="font-medium text-foreground">Coins to KOR Transfer</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {CONVERSION_RATE} Coins = {CONVERSION_YIELD} KOR
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex-1 bg-muted rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-foreground">
                      {formatNumber(Math.floor(userStats.coins / CONVERSION_RATE) * CONVERSION_RATE)}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Coins</p>
                  </div>

                  <IconChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />

                  <div className="flex-1 bg-primary/10 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-primary">
                      {formatNumber(convertibleKOR)}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">KOR</p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (isSwapping || !canConvertCoins) return;
                    setIsSwapping(true);
                    try {
                      await onSwapRequest();
                    } finally {
                      setIsSwapping(true); // Wait, false!
                      setIsSwapping(false);
                    }
                  }}
                  disabled={!canConvertCoins || isSwapping}
                  className={cn(
                    "btn w-full h-11",
                    canConvertCoins && !isSwapping ? "btn-primary shadow-lg shadow-primary/20" : "btn-secondary opacity-50",
                  )}
                >
                  <IconArrowDown className="w-4 h-4 mr-2" />
                  {isSwapping ? "Applying..." : (canConvertCoins ? "Transfer to KOR" : "Not Enough Coins")}
                </button>
              </div>

              {/* KOR to Coin Conversion */}
              <div className="card p-4 border-dashed border-primary/40 bg-primary/5 relative overflow-hidden group">
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-lg">
                  <div className="bg-card px-3 py-1 rounded-full shadow-sm border text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                    Coming Soon
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground">KOR to Coins Transfer</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    1 KOR = 10 Coins
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex-1 bg-primary/10 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-primary">
                      {formatNumber(userStats.korBalance)}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">KOR</p>
                  </div>

                  <IconChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />

                  <div className="flex-1 bg-yellow-500/10 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-yellow-600">
                      {formatNumber(userStats.korBalance * 10)}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Coins</p>
                  </div>
                </div>

                <button
                  onClick={() => onKorToCoinsRequest(userStats.korBalance)}
                  disabled={!canConvertKor}
                  className={cn(
                    "btn w-full h-11",
                    canConvertKor ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/20" : "btn-secondary opacity-50",
                  )}
                >
                  <IconArrowUp className="w-4 h-4 mr-2" />
                  {canConvertKor ? "Convert to Coins" : `Min ${minKorForCoins} KOR Required`}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {formatNumber(userStats.referralEarnings)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Referral Earnings
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {formatNumber(userStats.biggestWin)}
                  </p>
                  <p className="text-xs text-muted-foreground">Biggest Win</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-3">
              {userStats.transactions && userStats.transactions.length > 0 ? (
                userStats.transactions.map((tx) => (
                  <div
                    key={tx.hash}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          tx.type === "win" ||
                            tx.type === "redeem" ||
                            tx.type === "referral" ||
                            tx.type === "bonus" ||
                            tx.type === "convert"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        {tx.type === "win" ||
                        tx.type === "redeem" ||
                        tx.type === "referral" ||
                        tx.type === "bonus" ||
                        tx.type === "convert" ? (
                          <IconArrowUp className="w-5 h-5 rotate-45" />
                        ) : (
                          <IconArrowDown className="w-5 h-5 -rotate-45" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground capitalize truncate">
                          {tx.type.replace("_", " ")}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                          {tx.description || formatDate(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={cn(
                          "font-bold text-sm",
                          tx.type === "win" ||
                            tx.type === "redeem" ||
                            tx.type === "referral" ||
                            tx.type === "bonus" ||
                            tx.type === "convert"
                            ? "text-green-500"
                            : "text-foreground",
                        )}
                      >
                        {tx.type === "win" ||
                        tx.type === "redeem" ||
                        tx.type === "referral" ||
                        tx.type === "bonus" ||
                        tx.type === "convert"
                          ? "+"
                          : "-"}
                        {formatNumber(tx.amount)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">
                        {tx.currency}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No transactions found. Start playing to see your history!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button onClick={onClose} className="btn btn-outline w-full h-11">
            Close
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default WalletModal;
