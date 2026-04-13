import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SignMessage } from "../components/SignMessage";
import { useGame } from "../contexts/GameContext";
import { useUserStore } from "../stores/userStore";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/sign")({
  component: SignRoute,
});

function SignRoute() {
  const navigate = useNavigate();
  const { walletState, logout: storeLogout } = useUserStore();
  const {
    handleMessageSigned,
    handleLogout: contextLogout,
    profile,
  } = useGame();
  const { isPending: isProfileLoading } = useProfile();
  const [waitingForProfile, setWaitingForProfile] = useState(false);

  // Auto-skip if already verified AND profile is loaded
  useEffect(() => {
    if (walletState.isConnected && walletState.isVerified && profile) {
      handleMessageSigned();
      
      if (profile.isNew || !profile.allianceLeagueId || !profile.allianceTeamId) {
        navigate({ to: "/onboarding" });
      } else {
        navigate({ to: "/welcome" });
      }
    }
  }, [
    walletState.isConnected,
    walletState.isVerified,
    profile,
    handleMessageSigned,
    navigate,
  ]);

  // Handle transition once profile settles
  useEffect(() => {
    if (waitingForProfile && profile && !isProfileLoading) {
      handleMessageSigned();
      
      // If the user is NEW (mistakenly used sign-in) or incomplete (no team/league),
      // redirect them back to onboarding setup
      if (profile.isNew || !profile.allianceLeagueId || !profile.allianceTeamId) {
        console.log("[SIGN] New or incomplete user detected, redirecting to onboarding...");
        navigate({ to: "/onboarding" });
      } else {
        navigate({ to: "/welcome" });
      }
    }
  }, [
    waitingForProfile,
    profile,
    isProfileLoading,
    handleMessageSigned,
    navigate,
  ]);

  return (
    <SignMessage
      address={walletState.address || ""}
      isProfileLoading={waitingForProfile && isProfileLoading}
      onSigned={() => {
        setWaitingForProfile(true);
      }}
      onCancel={() => {
        setWaitingForProfile(false);
        storeLogout();
        contextLogout();
        navigate({ to: "/" });
      }}
    />
  );
}
