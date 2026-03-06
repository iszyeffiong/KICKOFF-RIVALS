import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { GameSelection } from "../components/GameSelection";
import { useGame } from "../contexts/GameContext";
import { useUserStore } from "../stores/userStore";

export const Route = createFileRoute("/play")({
  component: PlayRoute,
});

function PlayRoute() {
  const navigate = useNavigate();
  const { walletState } = useGame();
  const { onboardingComplete } = useUserStore();

  // Auto-redirect if everything is set
  useEffect(() => {
    if (walletState.isConnected && walletState.isVerified && onboardingComplete) {
      navigate({ to: "/dashboard" });
    }
  }, [walletState.isConnected, walletState.isVerified, onboardingComplete, navigate]);

  return (
    <GameSelection
      onSelectFootball={() => {
        if (walletState.isConnected && walletState.isVerified) {
          if (onboardingComplete) {
            navigate({ to: "/dashboard" });
          } else {
            navigate({ to: "/onboarding" });
          }
        } else {
          navigate({ to: "/entry" });
        }
      }}
    />
  );
}
