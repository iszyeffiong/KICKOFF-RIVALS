import type { Bet } from "../../types";

// ─── Status badge style ──────────────────────────────────────────────────────

function statusStyle(status: string) {
  if (status === "won") return "bg-green-50 text-green-700 border-green-200";
  if (status === "lost") return "bg-red-50 text-red-700 border-red-200";
  return "bg-yellow-50 text-yellow-700 border-yellow-200";
}

// ─── Single Bet Card ─────────────────────────────────────────────────────────

interface SingleBetCardProps {
  bet: Bet;
}

export function SingleBetCard({ bet: b }: SingleBetCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-brand/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            Single Bet
          </div>
          <div className="font-mono text-xs font-bold text-dark">
            {b.homeTeamName && b.awayTeamName
              ? `${b.homeTeamName} vs ${b.awayTeamName}`
              : `Match #${b.matchId.slice(-4)}`}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Pick:{" "}
            <span className="font-semibold text-brand">
              {b.selection.toUpperCase()}
            </span>{" "}
            <span className="text-gray-400">@ {Number(b.odds).toFixed(2)}</span>
          </div>
        </div>
        <span
          className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${statusStyle(b.status)}`}
        >
          {b.status}
        </span>
      </div>

      <div className="flex justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-2 mt-1">
        <span>
          Stake: <span className="font-semibold text-dark">{b.stake} KOR</span>
        </span>
        <BetReturn bet={b} />
      </div>
    </div>
  );
}

// ─── Accumulator Bet Card ─────────────────────────────────────────────────────

interface AccumulatorBetCardProps {
  accId: string;
  legs: Bet[];
}

export function AccumulatorBetCard({ accId, legs }: AccumulatorBetCardProps) {
  const firstLeg = legs[0];
  const accStatus = legs.every((l) => l.status === "won")
    ? "won"
    : legs.some((l) => l.status === "lost")
      ? "lost"
      : "pending";
  const totalOdds = legs.reduce((p, l) => p * l.odds, 1);
  const stake = firstLeg.stake;
  const potentialReturn = stake * totalOdds;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-brand/30 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            Accumulator · {legs.length} selections
          </div>
          <div className="text-[11px] text-gray-500">
            Combined Odds:{" "}
            <span className="font-bold text-brand">{totalOdds.toFixed(2)}</span>
          </div>
        </div>
        <span
          className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${statusStyle(accStatus)}`}
        >
          {accStatus}
        </span>
      </div>

      <div className="space-y-1.5 mb-3">
        {legs.map((leg, li) => (
          <AccLeg key={`leg-${leg.id}-${li}`} leg={leg} />
        ))}
      </div>

      <div className="flex justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-2">
        <span>
          Stake: <span className="font-semibold text-dark">{stake} KOR</span>
        </span>
        <AccReturn status={accStatus} potentialReturn={potentialReturn} />
      </div>
    </div>
  );
}

function AccLeg({ leg }: { leg: Bet }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
      <div className="text-[11px] text-gray-600">
        {leg.homeTeamName && leg.awayTeamName
          ? `${leg.homeTeamName} vs ${leg.awayTeamName}`
          : `Match #${leg.matchId.slice(-4)}`}
        {" · "}
        <span className="font-semibold text-dark">
          {leg.selection.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-brand font-bold">
          @{Number(leg.odds).toFixed(2)}
        </span>
        <span
          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${statusStyle(leg.status)}`}
        >
          {leg.status}
        </span>
      </div>
    </div>
  );
}

function BetReturn({ bet: b }: { bet: Bet }) {
  if (b.status === "won") {
    return (
      <span className="text-green-600 font-bold">
        +{b.potentialReturn.toFixed(0)} KOR
      </span>
    );
  }
  if (b.status === "lost") {
    return <span className="text-red-500 font-medium">Cashout: 0 KOR</span>;
  }
  return (
    <span className="text-brand font-semibold">
      Win: {b.potentialReturn.toFixed(0)} KOR
    </span>
  );
}

function AccReturn({
  status,
  potentialReturn,
}: {
  status: string;
  potentialReturn: number;
}) {
  if (status === "won") {
    return (
      <span className="text-green-600 font-bold">
        +{potentialReturn.toFixed(0)} KOR
      </span>
    );
  }
  if (status === "lost") {
    return (
      <span className="text-red-500 font-medium">Cashout: 0 KOR (Lost)</span>
    );
  }
  return (
    <span className="text-brand font-semibold">
      Win: {potentialReturn.toFixed(0)} KOR
    </span>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyBetsState({ tab }: { tab: "ongoing" | "ended" }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <div className="text-4xl mb-3">🎫</div>
      <div className="font-semibold">
        No {tab === "ongoing" ? "active" : "past"} bets
      </div>
      <div className="text-xs mt-1">
        {tab === "ongoing"
          ? "Place a bet from the Matches tab"
          : "Your bet history will appear here"}
      </div>
    </div>
  );
}
