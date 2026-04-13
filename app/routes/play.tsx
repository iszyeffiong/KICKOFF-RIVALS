import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { GameSelection } from "../components/GameSelection";
import { useGame } from "../contexts/GameContext";
import { useUserStore } from "../stores/userStore";
import { useProfile } from "../hooks/useProfile";

export const Route = createFileRoute("/play")({
  component: PlayRoute,
});

function PlayRoute() {
  const navigate = useNavigate();
  const { walletState, onboardingComplete } = useUserStore();
  
  // Background profile fetch - will auto-update onboardingComplete if user exists
  const { profile, isLoading } = useProfile();

  // Auto-redirect if everything is set
  useEffect(() => {
    if (walletState.isConnected && walletState.isVerified && onboardingComplete) {
      navigate({ to: "/dashboard" });
    } else if (!walletState.isConnected) {
      // Not even connected? Go to entry choice first
      navigate({ to: "/entry" });
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
        } else if (walletState.isConnected && !walletState.isVerified) {
          navigate({ 
            to: "/sign", 
            search: { address: walletState.address || "" } as any 
          });
        } else {
          navigate({ to: "/entry" });
        }
      }}
    />
  );
}