import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AllianceSetup } from "../components/AllianceSetup";
import { useGame } from "../contexts/GameContext";

export const Route = createFileRoute("/alliance")({
  component: AllianceRoute,
});

function AllianceRoute() {
  const navigate = useNavigate();
  const { registrationData, setRegistrationData, walletState } = useGame();

  const isAlreadyVerified = walletState.isConnected && walletState.isVerified;

  return (
    <AllianceSetup
      apiUrl=""
      // Pass the username already collected during onboarding so AllianceSetup
      // skips its own username step and goes straight to league/team selection
      initialUsername={registrationData?.username ?? ""}
      onComplete={(data) => {
        // Merge league + team with the username that was set during onboarding
        setRegistrationData({
          username: registrationData?.username || data.username,
          leagueId: data.leagueId,
          teamId: data.teamId,
        });
        
        if (isAlreadyVerified) {
          // Returning user who was incomplete - skip connect/sign and go to welcome
          // The useProfile hook will pick up the registrationData and update the DB
          console.log("[ALLIANCE] User already verified, skipping connect & going to welcome");
          navigate({ to: "/welcome" });
        } else {
          navigate({ to: "/connect" });
        }
      }}
    />
  );
}
