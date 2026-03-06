import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LandingPage } from "../components/LandingPage";
import { useUserStore } from "../stores/userStore";

export const Route = createFileRoute("/")({
  component: LandingRoute,
});

function LandingRoute() {
  const navigate = useNavigate();
  const { walletState, onboardingComplete } = useUserStore();

  // Auto-redirect if already verified and setup
  useEffect(() => {
    if (walletState.isConnected && walletState.isVerified && onboardingComplete) {
      navigate({ to: "/dashboard" });
    }
  }, [walletState.isConnected, walletState.isVerified, onboardingComplete, navigate]);

  return <LandingPage onEnter={() => navigate({ to: "/play" })} />;
}
