import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Onboarding } from "../components/Onboarding";
import { useGame } from "../contexts/GameContext";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingRoute,
});

function OnboardingRoute() {
  const navigate = useNavigate();
  const { setRegistrationData } = useGame();

  const handleFinish = (username: string) => {
    // Store the chosen username so it's available when the wallet connects
    // leagueId / teamId will be filled in by AllianceSetup next
    setRegistrationData({
      username,
      leagueId: "",
      teamId: "",
    });
    navigate({ to: "/alliance" });
  };

  return <Onboarding onFinish={handleFinish} />;
}
