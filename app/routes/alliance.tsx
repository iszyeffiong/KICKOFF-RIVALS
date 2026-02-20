import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AllianceSetup } from "../components/AllianceSetup";
import { useGame } from "../contexts/GameContext";

export const Route = createFileRoute("/alliance")({
  component: AllianceRoute,
});

function AllianceRoute() {
  const navigate = useNavigate();
  const { registrationData, setRegistrationData } = useGame();

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
        navigate({ to: "/connect" });
      }}
    />
  );
}
