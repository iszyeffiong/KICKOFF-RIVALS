import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { ReturningUserWelcome } from "../components/ReturningUserWelcome";
import { useGame } from "../contexts/GameContext";

export const Route = createFileRoute("/welcome")({
  component: WelcomeRoute,
});

function WelcomeRoute() {
  const navigate = useNavigate();
  const { userStats, isNewUser, handleProceedFromWelcome } = useGame();

  const handleProceed = () => {
    handleProceedFromWelcome();
    navigate({ to: "/dashboard" });
  };

  if (isNewUser) {
    return (
      <WelcomeScreen username={userStats.username} onProceed={handleProceed} />
    );
  }

  return (
    <ReturningUserWelcome
      username={userStats.username}
      totalBets={userStats.totalBets}
      wins={userStats.wins}
      korBalance={userStats.korBalance}
      onProceed={handleProceed}
    />
  );
}
