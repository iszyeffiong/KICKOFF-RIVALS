import { cn, formatNumber } from "../lib/utils";
import { CONVERSION_RATE, CONVERSION_YIELD } from "../constants";
import {
  IconX,
  IconCoins,
  IconZap,
  IconChevronRight,
  IconCheck,
  IconAlert,
} from "./Icons";

interface SwapKorConfirmProps {
  kor: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SwapKorConfirm({ kor, onConfirm, onCancel }: SwapKorConfirmProps) {
  const minKor = 100;
  const convertibleKor = kor;
  const resultingCoins = kor * (CONVERSION_RATE / CONVERSION_YIELD);

  const canConvert = kor >= minKor;

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
          <h2 className="font-bold text-foreground">Confirm KOR Conversion</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <IconX className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Conversion Visual */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* From: KOR */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <IconZap className="w-8 h-8 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatNumber(convertibleKor)}
              </p>
              <p className="text-sm text-muted-foreground">KOR</p>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center">
              <IconChevronRight className="w-8 h-8 text-muted-foreground" />
            </div>

            {/* To: Coins */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-2">
                <IconCoins className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {formatNumber(resultingCoins)}
              </p>
              <p className="text-sm text-muted-foreground">Coins</p>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Exchange Rate
              </span>
              <span className="text-sm font-medium text-foreground">
                1 KOR = 10 Coins
              </span>
            </div>
          </div>

          {/* Warning */}
          {canConvert && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-6">
              <IconAlert className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                You are converting KOR back to Coins. You will receive 10 coins for every 1 KOR.
              </p>
            </div>
          )}

          {/* Not Enough KOR Warning */}
          {!canConvert && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-6">
              <IconAlert className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">
                You need at least {minKor} KOR to convert back to coins.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="btn btn-outline flex-1 h-11"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConvert}
              className={cn(
                "btn bg-yellow-500 hover:bg-yellow-600 text-white flex-1 h-11",
                !canConvert && "opacity-50 cursor-not-allowed"
              )}
            >
              <IconCheck className="w-4 h-4 mr-2" />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwapKorConfirm;
