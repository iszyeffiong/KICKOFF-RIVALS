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
  const [historyLimit, setHistoryLimit] = useState(10);

  // 1. Group raw bets into Unified Tickets (Singles and Accumulators)
  const tickets: { type: 'single' | 'accumulator', id: string, bets: Bet[], timestamp: number, settledAt: number | null, status: 'pending' | 'ended' }[] = [];
  
  const accMap = new Map<string, Bet[]>();
  activeBets.forEach(b => {
    if (b.betType === 'accumulator' && b.accumulatorId) {
      if (!accMap.has(b.accumulatorId)) accMap.set(b.accumulatorId, []);
      accMap.get(b.accumulatorId)!.push(b);
    } else {
      tickets.push({
        type: 'single',
        id: b.id,
        bets: [b],
        timestamp: b.timestamp,
        settledAt: b.settledAt || null,
        status: b.status === 'pending' ? 'pending' : 'ended'
      });
    }
  });

  // Process Accumulators into single combined tickets
  Array.from(accMap.entries()).forEach(([accId, legs]) => {
     // An accumulator is pending if even ONE leg is still pending
     const isPending = legs.some(l => l.status === 'pending');
     const timestamp = legs[0]?.timestamp || Date.now();
     // Get the most recent settled time among all legs
     const settledAt = legs.reduce((max, l) => Math.max(max, l.settledAt || 0), 0) || null;

     tickets.push({
       type: 'accumulator',
       id: accId,
       bets: legs,
       timestamp,
       settledAt: isPending ? null : settledAt,
       status: isPending ? 'pending' : 'ended'
     });
  });

  // 2. Filter by active tab
  const filteredTickets = tickets.filter(t => t.status === (betTab === 'ongoing' ? 'pending' : 'ended'));

  // 3. Sort chronologically (History sorts precisely by settledAt completion time!)
  filteredTickets.sort((a, b) => {
     if (betTab === 'ended') {
        const timeA = a.settledAt || a.timestamp;
        const timeB = b.settledAt || b.timestamp;
        return timeB - timeA;
     }
     // Ongoing bets sort strictly by exact placement time
     return b.timestamp - a.timestamp;
  });

  // 4. Paginate strictly for the History view
  const visibleTickets = betTab === 'ongoing' ? filteredTickets : filteredTickets.slice(0, historyLimit);

  return (
    <main className="p-3 max-w-md mx-auto w-full space-y-4 pb-20 mt-4">
      <BetTabToggle active={betTab} onChange={setBetTab} />

      <div className="space-y-4 mt-4">
        {visibleTickets.map((t, i) => 
           t.type === 'single' ? (
              <SingleBetCard key={`single-${t.id}-${i}`} bet={t.bets[0]} />
           ) : (
              <AccumulatorBetCard key={`acc-${t.id}-${i}`} accId={t.id} legs={t.bets} />
           )
        )}

        {filteredTickets.length === 0 && <EmptyBetsState tab={betTab} />}
        
        {betTab === "ended" && filteredTickets.length > historyLimit && (
          <div className="pt-2 pb-6 flex justify-center">
            <button 
              onClick={() => setHistoryLimit(prev => prev + 15)}
              className="inline-flex items-center justify-center space-x-2 bg-gray-50 text-gray-600 font-bold text-xs py-2 px-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors max-w-[250px] w-full"
            >
              <span>Load 15 More</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        )}
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
