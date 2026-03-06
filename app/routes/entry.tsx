import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { EntryChoice } from "../components/EntryChoice";
import { useUserStore } from "../stores/userStore";

export const Route = createFileRoute("/entry")({
  component: EntryRoute,
});

function EntryRoute() {
  const navigate = useNavigate();
  const { walletState, onboardingComplete } = useUserStore();

  // Auto-redirect if already verified
  useEffect(() => {
    if (walletState.isConnected && walletState.isVerified) {
      if (onboardingComplete) {
        navigate({ to: "/dashboard" });
      } else {
        navigate({ to: "/onboarding" });
      }
    }
  }, [walletState.isConnected, walletState.isVerified, onboardingComplete, navigate]);

  return (
    <EntryChoice
      onNewUser={() => navigate({ to: "/onboarding" })}
      onReturningUser={() =>
        navigate({ to: "/connect", search: { intent: "returning" } as any })
      }
    />
  );
}
