import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LandingPage } from "../components/LandingPage";
import { useUserStore } from "../stores/userStore";
import { useProfile } from "../hooks/useProfile";

export const Route = createFileRoute("/")({
  component: LandingRoute,
});

function LandingRoute() {
  const navigate = useNavigate();
  const { walletState, onboardingComplete } = useUserStore();
  
  // Background profile check - will auto-complete onboarding state if player found
  useProfile();

  // Auto-redirect if already verified
  useEffect(() => {
    if (walletState.isConnected && walletState.isVerified) {
      if (onboardingComplete) {
        navigate({ to: "/dashboard" });
      } else {
        // Connected but haven't finished the flow? Resume at the sport selection
        navigate({ to: "/play" });
      }
    }
  }, [walletState.isConnected, walletState.isVerified, onboardingComplete, navigate]);

  return <LandingPage onEnter={() => navigate({ to: "/play" })} />;
}