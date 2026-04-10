import { useState } from "react";
import { cn } from "../lib/utils";
import { CONVERSION_RATE, CONVERSION_YIELD } from "../constants";
import {
  IconX,
  IconCoins,
  IconZap,
  IconChevronRight,
  IconCheck,
  IconAlert,
  IconPlus,
  IconMinus,
} from "./Icons";

interface SwapConfirmProps {
  coins: number;
  onConfirm: (amount: number) => void;
  onCancel: () => void;
}

export function SwapConfirm({ coins, onConfirm, onCancel }: SwapConfirmProps) {
  const MIN_CONVERSION = 2000;
  const MAX_CONVERSION = 10000;
  const STEP = 500;

  // Initialize with minimum or total coins if less than min (but button will be disabled)
  const [selectedAmount, setSelectedAmount] = useState(
    Math.min(Math.max(MIN_CONVERSION, 0), Math.floor(coins / STEP) * STEP)
  );

  const resultingKOR = Math.floor(selectedAmount / CONVERSION_RATE) * CONVERSION_YIELD;
  const canConvert = coins >= MIN_CONVERSION && selectedAmount >= MIN_CONVERSION && selectedAmount <= coins;

  const handleIncrease = () => {
    setSelectedAmount((prev) => {
      const next = prev + STEP;
      if (next > MAX_CONVERSION) return prev;
      if (next > coins) return prev;
      return next;
    });
  };

  const handleDecrease = () => {
    setSelectedAmount((prev) => {
      const next = prev - STEP;
      if (next < MIN_CONVERSION) return prev;
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-background rounded-2xl shadow-xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-foreground">Confirm Conversion</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <IconX className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Selector */}
          <div className="flex flex-col items-center mb-8">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Select Amount to Convert
            </span>
            <div className="flex items-center gap-6">
              <button
                onClick={handleDecrease}
                disabled={selectedAmount <= MIN_CONVERSION}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <IconMinus className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="text-3xl font-black text-foreground">
                  {selectedAmount.toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold">
                  Coins
                </div>
              </div>

              <button
                onClick={handleIncrease}
                disabled={selectedAmount + STEP > MAX_CONVERSION || selectedAmount + STEP > coins}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <IconPlus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-4 text-[10px] text-muted-foreground">
              Min: {MIN_CONVERSION.toLocaleString()} • Max: {MAX_CONVERSION.toLocaleString()}
            </div>
          </div>

          {/* Conversion Visual */}
          <div className="flex items-center justify-center gap-4 mb-6 pt-6 border-t border-border/50">
            <div className="flex flex-col items-center">
              <IconCoins className="w-6 h-6 text-yellow-500 mb-1" />
              <p className="text-sm font-bold text-foreground">
                {selectedAmount.toLocaleString()}
              </p>
            </div>

            <IconChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />

            <div className="flex flex-col items-center">
              <IconZap className="w-6 h-6 text-primary mb-1" />
              <p className="text-sm font-bold text-primary">
                {resultingKOR.toLocaleString()} KOR
              </p>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border/50 text-center">
            <span className="text-xs font-medium text-muted-foreground">
              Rate: {CONVERSION_RATE} Coins = {CONVERSION_YIELD} KOR
            </span>
          </div>

          {/* Warnings */}
          {!canConvert ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6">
              <IconAlert className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-destructive">
                {coins < MIN_CONVERSION 
                  ? `You need at least ${MIN_CONVERSION.toLocaleString()} coins to convert.`
                  : "Invalid conversion amount."}
              </p>
            </div>
          ) : (
             <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
              <IconAlert className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                This will convert <span className="text-foreground font-bold">{selectedAmount.toLocaleString()}</span> coins into <span className="text-primary font-bold">{resultingKOR.toLocaleString()} KOR</span>.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl border-2 border-border font-bold text-muted-foreground hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selectedAmount)}
              disabled={!canConvert}
              className={cn(
                "flex-1 h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-95",
                !canConvert && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              Convert Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwapConfirm;
