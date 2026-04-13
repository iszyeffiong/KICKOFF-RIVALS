import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { GameSelection } from "../components/GameSelection";
import { useGame } from "../contexts/GameContext";
import { MaintenanceOverlay } from "../components/MaintenanceOverlay";

// Set to true to enable maintenance mode
const IS_MAINTENANCE = true;

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
  if (IS_MAINTENANCE) {
    return <MaintenanceOverlay />;
  }

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
