import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";
import { BetSlipSelection } from "../types";
import {
  IconX,
  IconTrash,
  IconChevronUp,
  IconChevronDown,
  IconCheck,
  IconTicket,
} from "./Icons";

interface BetSlipProps {
  selections: BetSlipSelection[];
  balance: number;
  onRemoveSelection: (matchId: string) => void;
  onClearAll: () => void;
  onPlaceBet: (
    stake: number,
    betType: "single" | "accumulator",
  ) => Promise<boolean>;
}

export function BetSlip({
  selections,
  balance,
  onRemoveSelection,
  onClearAll,
  onPlaceBet,
}: BetSlipProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [stake, setStake] = useState(10);
  const [betType, setBetType] = useState<"single" | "accumulator">("single");
  const [prevCount, setPrevCount] = useState(selections.length);

  // Update default bet type logic
  useEffect(() => {
    // When adding a second selection, default to accumulator once
    if (prevCount === 1 && selections.length === 2) {
      setBetType("accumulator");
    }
    // If we go back to 1 or 0, always revert to single
    else if (selections.length <= 1 && betType === "accumulator") {
      setBetType("single");
    }
    setPrevCount(selections.length);
  }, [selections.length, betType, prevCount]);

  if (selections.length === 0) {
    return null;
  }

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialWin =
    betType === "accumulator"
      ? stake * totalOdds
      : selections.reduce((acc, sel) => acc + stake * sel.odds, 0);

  const canPlaceBet = stake > 0 && stake <= balance;

  const handlePlaceBet = async () => {
    if (canPlaceBet) {
      setIsLoading(true);
      try {
        // For singles, we're placing multiple bets, so the stake passed to onPlaceBet
        // should be the PER BET stake, which is what the state 'stake' holds.
        // For accumulator, 'stake' holds the total stake.
        // The parent handler (GameContext) expects 'stake' to be the amount wagered on THAT transaction.

        const success = await onPlaceBet(stake, betType);
        if (success) {
          toast.success("Bets placed successfully!");
          // onClearAll(); // usually handled by context
        } else {
          toast.error("Failed to place bets.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getSelectionLabel = (sel: BetSlipSelection) => {
    switch (sel.selection) {
      case "home":
        return `${sel.match.homeTeam.name} Win`;
      case "away":
        return `${sel.match.awayTeam.name} Win`;
      case "draw":
        return "Draw";
      case "gg":
        return "Both Teams Score";
      case "nogg":
        return "No GG";
      default:
        return sel.selectionLabel;
    }
  };

  return (
    <div
      className={cn(
        "fixed z-[100] bg-background transition-all duration-500 ease-in-out flex flex-col",
        // Mobile (bottom sheet)
        "bottom-0 left-0 right-0 border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.15)] rounded-t-2xl",
        isExpanded ? "max-h-[60vh] h-[60vh]" : "max-h-[76px] h-[76px]",
        // Desktop (right sidebar)
        "lg:top-0 lg:bottom-0 lg:left-auto lg:right-0 lg:w-[400px] lg:h-screen lg:max-h-screen lg:border-l lg:border-t-0 lg:shadow-[-8px_0_30px_rgba(0,0,0,0.15)] lg:rounded-t-none",
      )}
    >
      {/* Mobile Draggable Indicator */}
      <div
        className="lg:hidden w-full flex justify-center pt-2 pb-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
      </div>

      {/* Header - Always Visible */}
      <div
        className="w-full flex items-center justify-between px-4 py-2 lg:py-4 bg-background border-b border-muted cursor-pointer lg:cursor-default"
        onClick={() =>
          !window.matchMedia("(min-width: 1024px)").matches &&
          setIsExpanded(!isExpanded)
        }
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <IconTicket className="w-6 h-6 text-primary" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {selections.length}
            </span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground leading-tight">
              Bet Slip
            </p>
            <p className="text-xs text-muted-foreground">
              {selections.length} selection{selections.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground leading-tight">
              Potential Win
            </p>
            <p className="font-bold text-primary leading-tight">
              {potentialWin.toFixed(2)} KOR
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors"
          >
            {isExpanded ? (
              <IconChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <IconChevronUp className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <div
        className={cn(
          "px-4 py-4 overflow-y-auto flex-1 bg-muted/10",
          // Hidden on mobile if not expanded, but always visible on desktop
          isExpanded ? "flex flex-col" : "hidden lg:flex lg:flex-col",
        )}
      >
        {/* Bet Type Toggle */}
        {selections.length > 1 && (
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-4 border border-border/50">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBetType("single");
              }}
              className={cn(
                "flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all",
                betType === "single"
                  ? "bg-background text-primary shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Singles ({selections.length})
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBetType("accumulator");
              }}
              className={cn(
                "flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all",
                betType === "accumulator"
                  ? "bg-background text-primary shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Accumulator
            </button>
          </div>
        )}

        {/* Selections List */}
        <div className="space-y-2 mb-4">
          {selections.map((sel) => (
            <div
              key={sel.matchId}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {sel.match.homeTeam.name} vs {sel.match.awayTeam.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {getSelectionLabel(sel)}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    @{sel.odds.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemoveSelection(sel.matchId)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Total Odds (for accumulator) */}
        {betType === "accumulator" && selections.length > 1 && (
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg mb-4">
            <span className="text-sm font-medium text-foreground">
              Combined Odds
            </span>
            <span className="text-lg font-bold text-primary">
              {totalOdds.toFixed(2)}
            </span>
          </div>
        )}

        {/* Stake Input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-muted-foreground">
              {betType === "single" ? "Stake per bet" : "Total Stake"}
            </label>
            <span className="text-sma text-muted-foreground">
              Balance: {balance.toLocaleString()} KOR
            </span>
          </div>
          <div className="flex gap-2">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => setStake(amount)}
                disabled={amount > balance}
                className={cn(
                  "flex-1 py-2  px-4 rounded-lg text-sm font-medium transition-all",
                  stake === amount
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                  amount > balance && "opacity-50 cursor-not-allowed",
                )}
              >
                {amount}
              </button>
            ))}
            <input
              type="number"
              value={stake}
              onChange={(e) =>
                setStake(Math.min(Number(e.target.value), balance))
              }
              className="input w-24 text-center"
              min={1}
              max={balance}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {betType === "single"
                ? `${selections.length} x ${stake} KOR`
                : "Total Stake"}
            </span>
            <span className="text-sm font-medium text-foreground">
              {betType === "single"
                ? (selections.length * stake).toFixed(2)
                : stake.toFixed(2)}{" "}
              KOR
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2">
            <span className="text-sm font-medium text-foreground">
              Potential Win
            </span>
            <span className="text-lg font-bold text-primary">
              {potentialWin.toFixed(2)} KOR
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClearAll} className="btn btn-outline h-12 px-4">
            <IconTrash className="w-4 h-4 mr-2" />
            Clear
          </button>
          <button
            onClick={handlePlaceBet}
            disabled={!canPlaceBet || isLoading}
            className={cn(
              "btn btn-primary flex-1 h-12 font-semibold",
              (!canPlaceBet || isLoading) && "opacity-50 cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Placing...</span>
              </div>
            ) : stake > balance ? (
              "Insufficient Balance"
            ) : (
              <>
                <IconCheck className="w-5 h-5 mr-2" />
                {`Place ${betType === "single" ? "Bets" : "Bet"}`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BetSlip;
