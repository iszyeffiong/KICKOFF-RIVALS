import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import {
  TEAMS,
  INITIAL_BALANCE,
  LEAGUES,
  ROUND_DURATION_SEC,
  MATCH_DURATION_SEC,
  RESULT_DURATION_SEC,
  INITIAL_QUESTS,
  CONVERSION_RATE,
  CONVERSION_YIELD,
} from "../constants";
import type {
  Match,
  Bet,
  LeagueEntry,
  Transaction,
  UserStats,
  GameState,
  Coupon,
  DailyQuest,
  WalletState,
  BetSlipSelection,
} from "../types";
import { generateMatchResult, calculateOdds } from "../services/matchService";
import {
  hasValidAdminSession,
  getSessionToken,
  logoutAdmin,
  clearSessionToken,
} from "../services/adminAuthService";

const API_URL = "";

const generateHash = () =>
  "0x" +
  Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");

const generate6DigitCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ==========================================
// CONTEXT TYPE
// ==========================================

interface GameContextType {
  // Wallet
  walletState: WalletState;
  setWalletState: React.Dispatch<React.SetStateAction<WalletState>>;
  isInitializing: boolean;

  // User
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  isNewUser: boolean;
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;

  // Registration
  registrationData: {
    username: string;
    leagueId: string;
    teamId: string;
  } | null;
  setRegistrationData: React.Dispatch<
    React.SetStateAction<{
      username: string;
      leagueId: string;
      teamId: string;
    } | null>
  >;

  // Balance
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;

  // Game State
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  roundNumber: number;
  setRoundNumber: React.Dispatch<React.SetStateAction<number>>;
  seasonId: number;
  setSeasonId: React.Dispatch<React.SetStateAction<number>>;

  // Matches
  matches: Match[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;

  // Bets
  activeBets: Bet[];
  setActiveBets: React.Dispatch<React.SetStateAction<Bet[]>>;
  betSlipSelections: BetSlipSelection[];
  setBetSlipSelections: React.Dispatch<
    React.SetStateAction<BetSlipSelection[]>
  >;

  // League Tables
  leagueTables: Record<string, LeagueEntry[]>;
  setLeagueTables: React.Dispatch<
    React.SetStateAction<Record<string, LeagueEntry[]>>
  >;

  // Transactions
  transactions: Transaction[];
  addTransaction: (
    type: Transaction["type"],
    amount: number,
    currency: "kor" | "coins",
    description: string,
  ) => void;

  // Coupons
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;

  // Handlers
  handleWalletConnected: (address: string) => void;
  handleMessageSigned: () => void;
  handleProceedFromWelcome: () => void;
  handleLogout: () => void;
  refreshProfile: (address: string) => Promise<void>;
  handleBetPlacement: (
    match: Match,
    selection: Bet["selection"],
    stake: number,
  ) => Promise<boolean>;
  handleAddToBetSlip: (
    match: Match,
    selection: "home" | "draw" | "away" | "gg" | "nogg",
    odds: number,
  ) => void;
  handleRemoveFromBetSlip: (matchId: string) => void;
  handleClearBetSlip: () => void;
  handlePlaceBetSlip: (
    stake: number,
    betType: "single" | "accumulator",
  ) => Promise<boolean>;
  handleQuestAction: (id: string) => void;
  handleQuestClaim: (id: string) => void;
  handleRedeem: (
    code: string,
  ) => Promise<{ success: boolean; message?: string }>;
  handleReferral: (
    code: string,
  ) => Promise<{ success: boolean; message?: string }>;
  handleClaimAllianceRewards: () => Promise<void>;
  handleAdminSyncRequest: () => void;
  handleAdminAuthSuccess: () => void;
  handleAdminLogout: () => Promise<void>;

  // UI State
  bettingOn: Match | null;
  setBettingOn: React.Dispatch<React.SetStateAction<Match | null>>;
  watchingMatchId: string | null;
  setWatchingMatchId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedLeagueId: string;
  setSelectedLeagueId: React.Dispatch<React.SetStateAction<string>>;
  showWallet: boolean;
  setShowWallet: React.Dispatch<React.SetStateAction<boolean>>;
  showSwapConfirm: boolean;
  setShowSwapConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  showAdmin: boolean;
  setShowAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  showAdminAuth: boolean;
  setShowAdminAuth: React.Dispatch<React.SetStateAction<boolean>>;
  adminSessionValid: boolean;
  adminSessionToken: string | null;

  // Game Loop
  generateRoundMatches: (
    round: number,
    sId: number,
    clientSeed: string,
  ) => Promise<void>;
  handleStateTransition: () => void;
  updateLiveScores: () => void;
  processResults: () => Promise<void>;
  fetchMatches: () => Promise<void>;
  fetchStandings: () => Promise<void>;
  fetchActiveBets: () => Promise<void>;
  getCurrentGameMinute: () => number;
  dashboardMounted: boolean;
  setDashboardMounted: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

// ==========================================
// PROVIDER
// ==========================================

export function GameProvider({ children }: { children: React.ReactNode }) {
  const {
    address: wagmiAddress,
    isConnected: isWagmiConnected,
    status: wagmiStatus,
  } = useAccount();
  const [isInitializing, setIsInitializing] = useState(true);

  // Session token management
  const adminSessionTokenRef = useRef<string | null>(null);

  // Wallet
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    isVerified: false,
    verificationSignature: null,
    verificationTimestamp: null,
  });

  // User
  const [isNewUser, setIsNewUser] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    username: "",
    level: 1,
    xp: 0,
    totalBets: 0,
    wins: 0,
    biggestWin: 0,
    walletAddress: "",
    currentStreak: 0,
    longestStreak: 0,
    bestOddsWon: 0,
    dailyWalkPoints: 0,
    lastWalkDate: "",
    coins: 5000,
    korBalance: 1000,
    referralCode: generate6DigitCode(),
    hasReferred: false,
    referralCount: 0,
    referralEarnings: 0,
    loginStreak: 1,
    lastLoginDate: "",
    quests: [...INITIAL_QUESTS],
    activeTheme: "default",
    unclaimedAllianceRewards: 0,
  });

  // Registration
  const [registrationData, setRegistrationData] = useState<{
    username: string;
    leagueId: string;
    teamId: string;
  } | null>(null);

  // Balance
  const [balance, setBalance] = useState(INITIAL_BALANCE);

  // Game State
  const [gameState, setGameState] = useState<GameState>("BETTING");
  const [timer, setTimer] = useState(ROUND_DURATION_SEC);
  const [roundNumber, setRoundNumber] = useState(1);
  const [seasonId, setSeasonId] = useState(1);

  // Matches
  const [matches, setMatches] = useState<Match[]>([]);
  const serverSeedsRef = useRef<Record<string, string>>({});

  // Bets
  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [betSlipSelections, setBetSlipSelections] = useState<
    BetSlipSelection[]
  >([]);

  // League Tables
  const [leagueTables, setLeagueTables] = useState<
    Record<string, LeagueEntry[]>
  >({});

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // UI State
  const [bettingOn, setBettingOn] = useState<Match | null>(null);
  const [watchingMatchId, setWatchingMatchId] = useState<string | null>(null);
  const [selectedLeagueId, setSelectedLeagueId] = useState(LEAGUES[0].id);
  const [showWallet, setShowWallet] = useState(false);
  const [showSwapConfirm, setShowSwapConfirm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminSessionValid, setAdminSessionValid] = useState(false);

  // Dashboard tracking
  const [dashboardMounted, setDashboardMounted] = useState(false);

  // ==========================================
  // HANDLERS
  // ==========================================

  const addTransaction = useCallback(
    (
      type: Transaction["type"],
      amount: number,
      currency: "kor" | "coins",
      description: string,
    ) => {
      setTransactions((prev) => [
        {
          id: `t${Date.now()}`,
          type,
          amount,
          currency,
          description,
          timestamp: Date.now(),
          hash: generateHash(),
        },
        ...prev.slice(0, 49),
      ]);
    },
    [],
  );

  const refreshProfile = useCallback(async (address: string) => {
    try {
      const res = await fetch(
        `${API_URL}/api/user/profile?walletAddress=${address.toLowerCase()}`,
      );
      const data = await res.json();
      console.log("[refreshProfile] API response:", data);
      // The API returns fields FLAT (not nested under data.user)
      if (data.success && data.username) {
        setUserStats((prev) => ({
          ...prev,
          username: data.username || prev.username,
          walletAddress: data.walletAddress || address.toLowerCase(),
          coins: data.coins ?? prev.coins,
          korBalance: data.korBalance ?? prev.korBalance,
          totalBets: data.totalBets ?? prev.totalBets,
          wins: data.wins ?? prev.wins,
          referralCode: data.referralCode || prev.referralCode,
          referralCount: data.referralCount ?? prev.referralCount,
          referralEarnings: data.referralEarnings ?? prev.referralEarnings,
          allianceLeagueId: data.allianceLeagueId || prev.allianceLeagueId,
          allianceTeamId: data.allianceTeamId || prev.allianceTeamId,
          unclaimedAllianceRewards:
            data.unclaimedAllianceRewards ?? prev.unclaimedAllianceRewards,
        }));
        setBalance(data.korBalance ?? INITIAL_BALANCE);
        setIsNewUser(data.isNew ?? false);
      } else {
        // Fallback: wallet connected but profile fetch failed
        const shortAddr = address.slice(0, 6);
        setUserStats((prev) => ({
          ...prev,
          username: prev.username || `User_${shortAddr}`,
          walletAddress: prev.walletAddress || address.toLowerCase(),
        }));
      }
    } catch (err) {
      console.error("Profile refresh failed:", err);
      const shortAddr = address.slice(0, 6);
      setUserStats((prev) => ({
        ...prev,
        username: prev.username || `User_${shortAddr}`,
        walletAddress: prev.walletAddress || address.toLowerCase(),
      }));
    }
  }, []);

  const handleWalletConnected = useCallback(
    (address: string) => {
      setWalletState((prev) => ({ ...prev, address, isConnected: true }));
      refreshProfile(address);
    },
    [refreshProfile],
  );

  const handleMessageSigned = useCallback(() => {
    setWalletState((prev) => ({
      ...prev,
      isVerified: true,
      verificationTimestamp: Date.now(),
    }));
    if (walletState.address) {
      localStorage.setItem(`verified_${walletState.address}`, "true");
    }
  }, [walletState.address]);

  const handleProceedFromWelcome = useCallback(() => {
    localStorage.setItem(`user_${userStats.walletAddress}`, userStats.username);
    localStorage.setItem("onboarding_complete", "true");
  }, [userStats.walletAddress, userStats.username]);

  const handleLogout = useCallback(() => {
    setBalance(INITIAL_BALANCE);
    setActiveBets([]);
    setTransactions([]);
    setUserStats({
      username: "",
      level: 1,
      xp: 0,
      totalBets: 0,
      wins: 0,
      biggestWin: 0,
      walletAddress: "",
      currentStreak: 0,
      longestStreak: 0,
      bestOddsWon: 0,
      dailyWalkPoints: 0,
      lastWalkDate: "",
      coins: 5000,
      korBalance: 1000,
      referralCode: generate6DigitCode(),
      hasReferred: false,
      referralCount: 0,
      referralEarnings: 0,
      loginStreak: 1,
      lastLoginDate: "",
      quests: [...INITIAL_QUESTS],
      activeTheme: "default",
      unclaimedAllianceRewards: 0,
    });
    setWalletState({
      address: null,
      isConnected: false,
      chainId: null,
      isVerified: false,
      verificationSignature: null,
      verificationTimestamp: null,
    });
    localStorage.removeItem("onboarding_complete");
  }, []);

  // ==========================================
  // SYNC WAGMI STATE
  // ==========================================

  useEffect(() => {
    const sync = async () => {
      console.log("Sync Check:", {
        wagmiStatus,
        isWagmiConnected,
        wagmiAddress,
        currentWallet: walletState.address,
        isInitializing,
      });

      if (
        wagmiStatus === "reconnecting" ||
        (wagmiStatus === "connecting" && !walletState.isConnected)
      ) {
        console.log(
          "[SYNC] Wagmi reconnecting or connecting without walletState.isConnected. Skipping sync.",
        );
        return;
      }

      if (isWagmiConnected && wagmiAddress) {
        if (walletState.address !== wagmiAddress) {
          console.log("[SYNC] Address mismatch/init. Syncing...", wagmiAddress);
          setWalletState((prev) => ({
            ...prev,
            address: wagmiAddress,
            isConnected: true,
          }));
          try {
            await refreshProfile(wagmiAddress);
          } catch (e) {
            console.error("[SYNC] Profile refresh failed", e);
          }
        } else {
          // Address matches, but make sure we have a username
          // If username is missing, we MUST refresh the profile, even (and especially) during initialization
          if (!userStats.username) {
            console.log(
              "[SYNC] Address matched but no username. Refreshing profile...",
            );
            await refreshProfile(wagmiAddress);
          }
        }
      } else if (wagmiStatus === "disconnected") {
        console.log("[SYNC] Wagmi disconnected.");
        if (walletState.isConnected) {
          console.log("[SYNC] Wallet was connected, logging out.");
          handleLogout();
        } else {
          // Check local storage for manual onboarding completion if needed
          const completed = localStorage.getItem("onboarding_complete");
          if (completed === "true") {
            // If we were manually onboarded but disconnected, maybe we shouldn't fully logout?
            // For now, let's allow the disconnect to handle state clean up
          }
        }
      }

      // Delay finishing initialization slightly to ensure state propagation
      if (isInitializing) {
        console.log(
          "[SYNC] Initialization complete. Setting isInitializing to false in 500ms.",
        );
        setTimeout(() => setIsInitializing(false), 500);
      }
    };
    sync();
  }, [
    wagmiAddress,
    isWagmiConnected,
    wagmiStatus,
    refreshProfile,
    handleLogout,
    walletState.address,
    walletState.isConnected,
    userStats.username,
    isInitializing,
  ]);

  // ==========================================
  // BETTING HANDLERS
  // ==========================================

  const handleBetPlacement = useCallback(
    async (match: Match, selection: Bet["selection"], stake: number) => {
      if (stake > userStats.korBalance) return false;
      if (!match.odds) return false;

      try {
        const oddValue =
          match.odds[selection as keyof typeof match.odds] || 1.5;
        const res = await fetch(`${API_URL}/api/minigame/bet`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress:
              walletState.address ||
              userStats.walletAddress ||
              (userStats.username
                ? `guest-${userStats.username}`
                : "guest-user"),
            matchId: match.id,
            selection,
            stake,
            odds: oddValue,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setBalance(data.newBalance);
          setUserStats((prev) => ({ ...prev, korBalance: data.newBalance }));
          const bet: Bet = {
            id: data.bet.id,
            matchId: match.id,
            selection,
            odds: oddValue,
            stake,
            potentialReturn: stake * oddValue,
            status: "pending",
            timestamp: Date.now(),
            txHash: generateHash(),
          };
          setActiveBets((prev) => [bet, ...prev]);
          addTransaction("bet", stake, "kor", "Match wager");
          setUserStats((prev) => ({
            ...prev,
            quests: prev.quests.map((q) =>
              q.type === "bet"
                ? { ...q, progress: q.progress + Number(stake) }
                : q,
            ),
          }));
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.error("Bet placement failed", e);
        return false;
      }
    },
    [userStats.korBalance, userStats.walletAddress, addTransaction],
  );

  const handleAddToBetSlip = useCallback(
    (
      match: Match,
      selection: "home" | "draw" | "away" | "gg" | "nogg",
      odds: number,
    ) => {
      const exists = betSlipSelections.some(
        (sel) => sel.matchId === match.id && sel.selection === selection,
      );
      if (exists) {
        setBetSlipSelections((prev) =>
          prev.filter(
            (sel) => !(sel.matchId === match.id && sel.selection === selection),
          ),
        );
        return;
      }
      // Generate label from selection
      const labels = {
        home: match.homeTeam.name,
        away: match.awayTeam.name,
        draw: "Draw",
        gg: "Both Teams Score",
        nogg: "No Goals",
      };
      const label = labels[selection] || selection;
      setBetSlipSelections((prev) => [
        ...prev,
        { matchId: match.id, match, selection, odds, selectionLabel: label },
      ]);
    },
    [betSlipSelections],
  );

  const handleRemoveFromBetSlip = useCallback((matchId: string) => {
    setBetSlipSelections((prev) =>
      prev.filter((sel) => sel.matchId !== matchId),
    );
  }, []);

  const handleClearBetSlip = useCallback(() => {
    setBetSlipSelections([]);
  }, []);

  const fetchActiveBets = useCallback(async () => {
    const activeAddress =
      walletState.address ||
      userStats.walletAddress ||
      (userStats.username ? `guest-${userStats.username}` : "guest-user");

    // Don't fetch if no valid user/guest identifier found
    if (!activeAddress) return;

    try {
      const res = await fetch(
        `${API_URL}/api/bets/active?walletAddress=${activeAddress}`,
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.bets)) {
        setActiveBets(data.bets);
      }
    } catch (error) {
      console.error("Failed to fetch active bets:", error);
    }
  }, [walletState.address, userStats.walletAddress, userStats.username]);

  const handlePlaceBetSlip = useCallback(
    async (stake: number, betType: "single" | "accumulator") => {
      if (betSlipSelections.length === 0) return false;

      // Determine the best wallet address to use
      const userWallet =
        walletState.address ||
        userStats.walletAddress ||
        (userStats.username ? `guest-${userStats.username}` : "guest-user");

      console.log("Placing bet slip:", { betType, stake, userWallet });

      try {
        if (betType === "single") {
          for (const sel of betSlipSelections) {
            const res = await fetch(`${API_URL}/api/minigame/bet`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                walletAddress: userWallet,
                matchId: sel.matchId,
                selection: sel.selection,
                stake,
                odds: sel.odds,
                betType: "single",
              }),
            });
            const data = await res.json();
            if (data.success) {
              setActiveBets((prev) => [
                ...prev,
                {
                  id: data.betId || `bet-${Date.now()}-${Math.random()}`,
                  matchId: sel.matchId,
                  selection: sel.selection,
                  odds: sel.odds,
                  stake,
                  potentialReturn: stake * sel.odds,
                  status: "pending",
                  timestamp: Date.now(),
                  txHash: generateHash(),
                  betType: "single",
                },
              ]);
              if (data.newBalance !== undefined) {
                setBalance(data.newBalance);
                setUserStats((prev) => ({
                  ...prev,
                  korBalance: data.newBalance,
                }));
              }
            } else {
              console.error("Single bet failed:", data);
            }
          }
          const totalStake = stake * betSlipSelections.length;
          setUserStats((s) => ({
            ...s,
            totalBets: s.totalBets + betSlipSelections.length,
          }));

          addTransaction(
            "bet",
            totalStake,
            "kor",
            `${betSlipSelections.length} single bets`,
          );
          setBetSlipSelections([]); // Clear slip on success
          return true;
        } else {
          // Accumulator Logic
          const accumulatorId = `acc-${Date.now()}`;
          const totalOdds = betSlipSelections.reduce(
            (acc, sel) => acc * sel.odds,
            1,
          );

          console.log("Placing accumulator bet:", {
            accumulatorId,
            stake,
            totalOdds,
            selections: betSlipSelections.length,
            userWallet,
          });

          const res = await fetch(`${API_URL}/api/minigame/bet-accumulator`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              walletAddress: userWallet,
              selections: betSlipSelections.map((sel) => ({
                matchId: sel.matchId,
                selection: sel.selection,
                odds: sel.odds,
              })),
              stake,
              totalOdds,
              accumulatorId,
            }),
          });
          const data = await res.json();

          if (!data.success) {
            console.error("Accumulator bet failed (server response):", data);
            // Assuming 'toast' is available in the scope, e.g., from a library like react-hot-toast
            toast.error(data.error || "Failed to place bet. Please try again.");
            return false;
          }

          if (data.success) {
            console.log(
              "[ACCUMULATOR] Bet success, new balance:",
              data.newBalance,
            );
            const newBets: Bet[] = betSlipSelections.map((sel) => ({
              id: `${accumulatorId}-${sel.matchId}`,
              matchId: sel.matchId,
              selection: sel.selection,
              odds: sel.odds,
              stake,
              potentialReturn: stake * totalOdds,
              status: "pending",
              timestamp: Date.now(),
              txHash: generateHash(),
              betType: "accumulator",
              accumulatorId,
            }));

            // Batch update active bets
            setActiveBets((prev) => [...newBets, ...prev]);

            if (data.newBalance !== undefined) {
              setBalance(data.newBalance);
            }

            setUserStats((prev) => ({
              ...prev,
              korBalance:
                data.newBalance !== undefined
                  ? data.newBalance
                  : prev.korBalance,
              totalBets: prev.totalBets + 1,
            }));

            addTransaction(
              "bet",
              stake,
              "kor",
              `Accumulator (${betSlipSelections.length} selections)`,
            );
          } else {
            return false;
          }
        }
        fetchActiveBets();
        setBetSlipSelections([]);
        return true;
      } catch (e) {
        console.error("Bet slip placement execution error:", e);
        return false;
      }
    },
    [
      betSlipSelections,
      walletState.address,
      userStats.walletAddress,
      userStats.username,
      addTransaction,
      fetchActiveBets,
    ],
  );

  // ==========================================
  // QUEST & PROFILE HANDLERS
  // ==========================================

  const handleQuestAction = useCallback((id: string) => {
    setUserStats((prev) => ({
      ...prev,
      quests: prev.quests.map((q) =>
        q.id === id && q.type === "click"
          ? { ...q, progress: q.target, completed: true }
          : q,
      ),
    }));
  }, []);

  const handleQuestClaim = useCallback(
    (id: string) => {
      const quest = userStats.quests.find((q) => q.id === id);
      if (!quest || !quest.completed) return;
      setUserStats((prev) => ({
        ...prev,
        coins: prev.coins + quest.reward,
        quests: prev.quests.filter((q) => q.id !== id),
      }));
      addTransaction(
        "bonus",
        quest.reward,
        "coins",
        `Quest reward: ${quest.title}`,
      );
    },
    [userStats.quests, addTransaction],
  );

  const handleRedeem = useCallback(
    async (code: string): Promise<{ success: boolean; message?: string }> => {
      try {
        const res = await fetch(`${API_URL}/api/coupons/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            walletAddress: userStats.walletAddress,
          }),
        });
        const data = await res.json();
        if (data.success) {
          if (data.type === "coins") {
            setUserStats((prev) => ({
              ...prev,
              coins: prev.coins + data.value,
            }));
            addTransaction(
              "redeem",
              data.value,
              "coins",
              `Redeemed code: ${code}`,
            );
          } else if (data.type === "theme") {
            setUserStats((prev) => ({ ...prev, activeTheme: data.value }));
          }
          return { success: true, message: data.message || "Code redeemed!" };
        }
        return { success: false, message: data.error || "Invalid code" };
      } catch {
        return { success: false, message: "Connection failed" };
      }
    },
    [userStats.walletAddress, addTransaction],
  );

  const handleReferral = useCallback(
    async (code: string): Promise<{ success: boolean; message?: string }> => {
      try {
        if (!walletState.address)
          return { success: false, message: "Wallet not connected" };
        const res = await fetch(`${API_URL}/api/user/register-referral`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: walletState.address,
            referralCode: code,
          }),
        });
        const json = await res.json();
        if (!res.ok) return { success: false, message: json.error || "Failed" };
        return { success: true, message: "Referral linked!" };
      } catch {
        return { success: false, message: "Connection failed" };
      }
    },
    [walletState.address],
  );

  const handleClaimAllianceRewards = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/claim-alliance-rewards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: userStats.walletAddress }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`SUCCESS! Claimed ${data.claimed} KOR from Alliance matches.`);
        if (userStats.walletAddress) refreshProfile(userStats.walletAddress);
      } else {
        alert(data.error || "Claim failed");
      }
    } catch (e) {
      console.error("Claim error", e);
    }
  }, [userStats.walletAddress, refreshProfile]);

  // ==========================================
  // ADMIN HANDLERS
  // ==========================================

  const handleAdminSyncRequest = useCallback(() => {
    setShowAdminAuth(true);
  }, []);

  const handleAdminAuthSuccess = useCallback(() => {
    adminSessionTokenRef.current = getSessionToken();
    setAdminSessionValid(true);
    setShowAdminAuth(false);
    setShowAdmin(true);
  }, []);

  const handleAdminLogout = useCallback(async () => {
    if (adminSessionTokenRef.current) {
      await logoutAdmin(adminSessionTokenRef.current);
    }
    clearSessionToken();
    adminSessionTokenRef.current = null;
    setAdminSessionValid(false);
    setShowAdmin(false);
  }, []);

  // Check for existing admin session on mount
  useEffect(() => {
    const check = async () => {
      const hasSession = await hasValidAdminSession();
      if (hasSession) {
        adminSessionTokenRef.current = getSessionToken();
        setAdminSessionValid(true);
      }
    };
    check();
  }, []);

  // ==========================================
  // GAME LOOP & DATA FETCHING
  // ==========================================

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/matches/current`);
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);

        // Update Round Info & Timer from Server Logic
        if (data.matches.length > 0) {
          const first = data.matches[0];
          setRoundNumber(first.round);
          setSeasonId(first.seasonId);

          if (data.serverTime && first.startTime) {
            const serverTime = new Date(data.serverTime).getTime();
            const roundStartTime = new Date(first.startTime).getTime();
            const bettingEndTime = roundStartTime + ROUND_DURATION_SEC * 1000;
            const matchEndTime = bettingEndTime + MATCH_DURATION_SEC * 1000;

            if (serverTime < bettingEndTime) {
              // BETTING PHASE
              setGameState("BETTING");
              const remaining = Math.max(
                0,
                Math.floor((bettingEndTime - serverTime) / 1000),
              );
              setTimer(remaining);
            } else if (serverTime < matchEndTime) {
              // LIVE PHASE
              setGameState("LIVE");
              const elapsed = Math.floor((serverTime - bettingEndTime) / 1000);
              setTimer(elapsed);
            } else {
              // FINISHED PHASE (Intermission)
              const finishedEndTime = matchEndTime + RESULT_DURATION_SEC * 1000;
              if (serverTime < finishedEndTime) {
                setGameState("FINISHED");
                const remaining = Math.max(
                  0,
                  Math.floor((finishedEndTime - serverTime) / 1000),
                );
                setTimer(remaining);
              } else {
                // Round truly over, waiting for next generation
                setGameState("FINISHED");
                setTimer(0);
              }
            }
          }
        }

        // Update game state based on matches status
        const hasLiveMatches = data.matches.some(
          (m: Match) => m.status === "LIVE",
        );
        const hasFinishedMatches = data.matches.some(
          (m: Match) => m.status === "FINISHED",
        );

        if (hasLiveMatches) {
          setGameState("LIVE");
        } else if (hasFinishedMatches && !hasLiveMatches) {
          // Keep it as FINISHED, but rely on time logic above for timer
          if (gameState !== "FINISHED") setGameState("FINISHED");
        } else {
          if (gameState === "FINISHED" && timer === 0) {
            // Only switch to betting if we are done with finished phase
            setGameState("BETTING");
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    }
  }, [selectedLeagueId, gameState, timer]); // Added dependencies

  // Define fetchActiveBets before useEffect

  // Timer logic for visual countdown/countup
  useEffect(() => {
    if (!dashboardMounted) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (gameState === "BETTING") {
          if (prev <= 0) {
            fetchMatches();
            return 0;
          }
          return prev - 1;
        } else if (gameState === "LIVE") {
          // Count UP
          if (prev >= MATCH_DURATION_SEC) {
            fetchMatches();
            return prev;
          }
          return prev + 1;
        } else if (gameState === "FINISHED") {
          // Count DOWN (Intermission)
          if (prev <= 0) {
            fetchMatches();
            return 0;
          }
          return prev - 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dashboardMounted, fetchMatches, gameState]);

  // Unused placeholders kept to satisfy interface
  const generateRoundMatches = useCallback(async () => {
    console.log("Client generation disabled - waiting for server");
  }, []);
  const handleStateTransition = useCallback(() => {
    fetchMatches();
  }, [fetchMatches]);
  const updateLiveScores = useCallback(() => {
    // Only used for client-side visual interpolation if needed
    // But real data comes from polling
  }, []);
  const processResults = useCallback(async () => {
    fetchMatches();
  }, [fetchMatches]);
  const fetchStandings = useCallback(
    async (overrideSeasonId?: number) => {
      try {
        // Use active seasonId if not overridden. If both are null/0, send undefined.
        // Server handles undefined by finding active season.
        const targetSeasonId = overrideSeasonId || seasonId;

        const query = targetSeasonId ? `?seasonId=${targetSeasonId}` : "";

        const res = await fetch(`${API_URL}/api/leagues/standings${query}`);
        const data = await res.json();

        console.log("fetchStandings response:", data);

        if (data && data.success && Array.isArray(data.standings)) {
          // Group by leagueId
          const grouped: Record<string, LeagueEntry[]> = {};
          data.standings.forEach((team: any) => {
            if (!grouped[team.leagueId]) grouped[team.leagueId] = [];
            grouped[team.leagueId].push(team);
          });
          console.log("Grouped Standings:", grouped);
          setLeagueTables(grouped);
        } else if (
          data &&
          typeof data === "object" &&
          !data.error &&
          !data.standings
        ) {
          console.log("Setting League Tables (Standard Object):", data);
          setLeagueTables(data);
        } else {
          console.warn("Unexpected standings format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch standings:", error);
      }
    },
    [seasonId],
  );
  // Poll for matches and bets
  useEffect(() => {
    if (!dashboardMounted) return;

    fetchMatches();
    fetchStandings(); // Initial fetch

    // Poll matches and standings
    const interval = setInterval(() => {
      fetchMatches();
      fetchStandings();
    }, 5000);

    // Poll bets if user is connected
    let betInterval: ReturnType<typeof setInterval>;
    if (walletState.isConnected && walletState.address) {
      fetchActiveBets();
      betInterval = setInterval(fetchActiveBets, 5000);
    }

    return () => {
      clearInterval(interval);
      if (betInterval) clearInterval(betInterval);
    };
  }, [
    dashboardMounted,
    fetchMatches,
    fetchStandings,
    fetchActiveBets,
    walletState.isConnected,
    walletState.address,
  ]);

  const getCurrentGameMinute = useCallback(() => {
    if (gameState !== "LIVE") return 0;
    const total = MATCH_DURATION_SEC;
    const elapsed = timer;
    const minute = Math.floor((elapsed / total) * 90);
    return Math.min(90, Math.max(0, minute));
  }, [gameState, timer]);

  return (
    <GameContext.Provider
      value={{
        walletState,
        setWalletState,
        isInitializing,
        userStats,
        setUserStats,
        isNewUser,
        setIsNewUser,
        registrationData,
        setRegistrationData,
        balance,
        setBalance,
        gameState,
        setGameState,
        timer,
        setTimer,
        roundNumber,
        setRoundNumber,
        seasonId,
        setSeasonId,
        matches,
        setMatches,
        activeBets,
        setActiveBets,
        betSlipSelections,
        setBetSlipSelections,
        leagueTables,
        setLeagueTables,
        transactions,
        addTransaction,
        coupons,
        setCoupons,
        bettingOn,
        setBettingOn,
        watchingMatchId,
        setWatchingMatchId,
        selectedLeagueId,
        setSelectedLeagueId,
        showWallet,
        setShowWallet,
        showSwapConfirm,
        setShowSwapConfirm,
        showAdmin,
        setShowAdmin,
        showAdminAuth,
        setShowAdminAuth,
        adminSessionValid,
        adminSessionToken: adminSessionTokenRef.current,
        generateRoundMatches,
        handleStateTransition,
        updateLiveScores,
        processResults,
        fetchMatches,
        fetchStandings,
        fetchActiveBets,
        getCurrentGameMinute,
        dashboardMounted,
        setDashboardMounted,
        handleWalletConnected,
        handleMessageSigned,
        handleProceedFromWelcome,
        handleLogout,
        refreshProfile,
        handleBetPlacement,
        handleAddToBetSlip,
        handleRemoveFromBetSlip,
        handleClearBetSlip,
        handlePlaceBetSlip,
        handleQuestAction,
        handleQuestClaim,
        handleRedeem,
        handleReferral,
        handleClaimAllianceRewards,
        handleAdminSyncRequest,
        handleAdminAuthSuccess,
        handleAdminLogout,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
