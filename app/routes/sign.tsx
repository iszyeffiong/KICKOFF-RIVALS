import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SignMessage } from "../components/SignMessage";
import { useGame } from "../contexts/GameContext";
import { useUserStore } from "../stores/userStore";

export const Route = createFileRoute("/sign")({
  component: SignRoute,
});

function SignRoute() {
  const navigate = useNavigate();
  const { walletState, logout: storeLogout } = useUserStore();
  const { handleMessageSigned, handleLogout: contextLogout } = useGame();

  // Auto-skip if already verified
  useEffect(() => {
    if (walletState.isConnected && walletState.isVerified) {
      handleMessageSigned();
      navigate({ to: "/welcome" });
    }
  }, [walletState.isConnected, walletState.isVerified, handleMessageSigned, navigate]);

  return (
    <SignMessage
      address={walletState.address || ""}
      onSigned={() => {
        handleMessageSigned();
        navigate({ to: "/welcome" });
      }}
      onCancel={() => {
        storeLogout();
        contextLogout();
        navigate({ to: "/" });
      }}
    />
  );
}
