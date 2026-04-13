import { lazy, Suspense } from "react";
import { useWallets } from "@privy-io/react-auth";
import { parseEther, getAddress } from "viem";
import { useGame } from "@/contexts/GameContext";
import { useProfile } from "@/hooks/useProfile";
import { CONVERSION_RATE, CONVERSION_YIELD } from "../../constants";
import { WalletModal } from "../WalletModal";
import { SwapConfirm } from "../SwapConfirm";
import { SwapKorConfirm } from "../SwapKorConfirm";
import { SimulationScreen } from "../SimulationScreen";
import { BetModal } from "../BetModal";
import { BetSlip } from "../BetSlip";
import { AdminAuth } from "../AdminAuth";
import { UpdateUsernameModal } from "../UpdateUsernameModal";

const AdminPortal = lazy(() =>
  import("../AdminPortal").then((mod) => ({
    default: mod.AdminPortal,
  })),
);

const API_URL = "";

/**
 * All the floating modals and the persistent BetSlip bar.
 * Rendered once in the dashboard layout so they survive tab navigation.
 */
export function DashboardModals() {
  const { profile, refresh: refreshProfile } = useProfile();
  const {
    showWallet,
    setShowWallet,
    showSwapConfirm,
    setShowSwapConfirm,
    showSwapKorConfirm,
    setShowSwapKorConfirm,
    showAdminAuth,
    setShowAdminAuth,
    showAdmin,
    setShowAdmin,
    watchingMatchId,
    setWatchingMatchId,
    bettingOn,
    setBettingOn,
    matches,
    setBalance,
    addTransaction,
    getCurrentGameMinute,
    handleBetPlacement,
    handleRemoveFromBetSlip,
    handleClearBetSlip,
    handlePlaceBetSlip,
    handleAdminAuthSuccess,
    handleAdminLogout,
    betSlipSelections,
    coupons,
    setCoupons,
    fetchMatches,
    adminSessionToken,
    showUpdateUsername,
    setShowUpdateUsername,
    handleUpdateUsername,
  } = useGame();
  const { wallets } = useWallets();
  const privyWallet = wallets[0];
  const TREASURY_WALLET = (import.meta as any).env.VITE_TREASURY_WALLET || "0x7AcbaEf80145c363941F480072b260909A64B294";
  const CLAIM_FEE = (import.meta as any).env.VITE_CLAIM_FEE || "0.000022";

  if (!profile) return null;

  return (
    <>
      {showWallet && (
        <WalletModal
          onClose={() => setShowWallet(false)}
          onSwapRequest={() => {
            setShowWallet(false);
            setShowSwapConfirm(true);
          }}
          onKorToCoinsRequest={() => {
            setShowWallet(false);
            setShowSwapKorConfirm(true);
          }}
          currentBalance={profile.korBalance}
          userStats={profile}
          onWalkReward={() => {}}
        />
      )}

      {showSwapConfirm && (
        <SwapConfirm
          coins={profile.coins}
          onConfirm={async (selectedAmount) => {
            try {
              // GAS FEE REQUIREMENT via Privy wallet
              if (!privyWallet) throw new Error("No wallet connected");
              const provider = await privyWallet.getEthereumProvider();
              const txHash = await provider.request({
                method: "eth_sendTransaction",
                params: [{
                  to: getAddress(TREASURY_WALLET),
                  value: `0x${parseEther(CLAIM_FEE).toString(16)}`,
                  from: privyWallet.address,
                }],
              });

              const res = await fetch(`${API_URL}/api/user/swap-coins-to-kor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  walletAddress: profile.walletAddress,
                  coins: selectedAmount,
                  txHash,
                }),
              });
              const data = await res.json();
              if (data.success) {
                // Refresh profile to pick up new balances
                refreshProfile();
                setBalance(data.newKor);
                addTransaction("convert", selectedAmount, "coins", "Swapped for KOR");
              } else {
                alert("Swap failed: " + data.error);
              }
            } catch (e) {
              console.error(e);
            }
            setShowSwapConfirm(false);
          }}
          onCancel={() => setShowSwapConfirm(false)}
        />
      )}

      {showSwapKorConfirm && (
        <SwapKorConfirm
          kor={profile.korBalance}
          onConfirm={async () => {
            alert("KOR to Coins conversion is coming soon!");
            setShowSwapKorConfirm(false);
          }}
          onCancel={() => setShowSwapKorConfirm(false)}
        />
      )}

      {watchingMatchId && matches.find((m) => m.id === watchingMatchId) && (
        <SimulationScreen
          match={matches.find((m) => m.id === watchingMatchId)!}
          result={matches.find((m) => m.id === watchingMatchId)!.result!}
          currentMinute={getCurrentGameMinute()}
          onFinish={() => setWatchingMatchId(null)}
        />
      )}

      {bettingOn && (
        <BetModal
          match={bettingOn}
          balance={profile.korBalance}
          onClose={() => setBettingOn(null)}
          onPlaceBet={handleBetPlacement}
        />
      )}

      {showAdminAuth && (
        <AdminAuth
          onAuthSuccess={handleAdminAuthSuccess}
          onCancel={() => setShowAdminAuth(false)}
        />
      )}

      {showAdmin && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[600] flex items-center justify-center">
              Loading admin...
            </div>
          }
        >
          <AdminPortal
            coupons={coupons}
            setCoupons={setCoupons}
            quests={profile.quests}
            setQuests={() => {}} // Handle separately if needed, but for now just disable
            onClose={() => setShowAdmin(false)}
            sessionToken={adminSessionToken || ""}
            matches={matches}
            onRefreshMatches={fetchMatches}
          />
        </Suspense>
      )}

      {showUpdateUsername && (
        <UpdateUsernameModal
          onClose={() => setShowUpdateUsername(false)}
          onConfirm={handleUpdateUsername}
        />
      )}

      <BetSlip
        selections={betSlipSelections}
        balance={profile.korBalance}
        onRemoveSelection={handleRemoveFromBetSlip}
        onClearAll={handleClearBetSlip}
        onPlaceBet={handlePlaceBetSlip}
      />
    </>
  );
}
