import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGame } from "../../contexts/GameContext";
import {
  SingleBetCard,
  AccumulatorBetCard,
  EmptyBetsState,
} from "../../components/dashboard/BetCards";
import type { Bet } from "../../types";

export const Route = createFileRoute("/dashboard/bets")({
  component: BetsTab,
});

function BetsTab() {
  const { activeBets } = useGame();
  const [betTab, setBetTab] = useState<"ongoing" | "ended">("ongoing");

  const filtered = activeBets.filter((b) =>
    betTab === "ongoing" ? b.status === "pending" : b.status !== "pending",
  );

  const singles = filtered.filter((b) => b.betType !== "accumulator");

  const accMap = new Map<string, Bet[]>();
  filtered
    .filter((b) => b.betType === "accumulator" && b.accumulatorId)
    .forEach((b) => {
      const key = b.accumulatorId!;
      if (!accMap.has(key)) accMap.set(key, []);
      accMap.get(key)!.push(b);
    });

  return (
    <main className="p-3 max-w-md mx-auto w-full space-y-4">
      <BetTabToggle active={betTab} onChange={setBetTab} />

      <div className="space-y-3">
        {singles.map((b, i) => (
          <SingleBetCard key={`single-${b.id}-${i}`} bet={b} />
        ))}

        {Array.from(accMap.entries()).map(([accId, legs]) => (
          <AccumulatorBetCard key={`acc-${accId}`} accId={accId} legs={legs} />
        ))}

        {filtered.length === 0 && <EmptyBetsState tab={betTab} />}
      </div>
    </main>
  );
}

interface BetTabToggleProps {
  active: "ongoing" | "ended";
  onChange: (tab: "ongoing" | "ended") => void;
}

function BetTabToggle({ active, onChange }: BetTabToggleProps) {
  return (
    <div className="flex bg-gray-200 p-1 rounded-xl overflow-hidden shadow-inner">
      {(["ongoing", "ended"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            active === tab
              ? "bg-white text-brand shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab === "ongoing" ? "Active" : "History"}
        </button>
      ))}
    </div>
  );
}
