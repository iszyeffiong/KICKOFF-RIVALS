import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { ConnectWallet } from "../components/ConnectWallet";
import { useGame } from "@/contexts/GameContext";
import { useUserStore } from "@/stores/userStore";

export const Route = createFileRoute("/connect")({
  component: ConnectRoute,
});

function ConnectRoute() {
  const navigate = useNavigate();
  const { intent } = Route.useSearch() as any;
  const { handleWalletConnected, walletState } = useGame();
  const { authenticated, user } = usePrivy();
  const { setIsNewUser } = useUserStore();

  // If already authenticated via Privy, skip connect screen
  useEffect(() => {
    if (intent === "returning") {
      setIsNewUser(false);
    }
  }, [intent, setIsNewUser]);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      // Ensure store is updated with current address
      if (walletState.address?.toLowerCase() !== user.wallet.address.toLowerCase()) {
        handleWalletConnected(user.wallet.address);
      }
      
      console.log("[CONNECT] Authenticated, moving to /sign", user.wallet.address);
      navigate({ 
        to: "/sign", 
        search: { address: user.wallet.address } as any 
      });
    }
  }, [authenticated, user?.wallet?.address, handleWalletConnected, navigate, walletState.address]);

  return <ConnectWallet />;
}
