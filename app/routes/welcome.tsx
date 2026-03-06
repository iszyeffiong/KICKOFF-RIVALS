import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { ReturningUserWelcome } from "../components/ReturningUserWelcome";
import { useGame } from "../contexts/GameContext";
import { useUserStore } from "../stores/userStore";
import { useProfile } from "../hooks/useProfile";

export const Route = createFileRoute("/welcome")({
  component: WelcomeRoute,
});

function WelcomeRoute() {
  const navigate = useNavigate();
  const { isNewUser: storeIsNewUser } = useUserStore();
  const { profile, isLoading } = useProfile();
  const { handleProceedFromWelcome } = useGame();

  const handleProceed = () => {
    handleProceedFromWelcome();
    navigate({ to: "/dashboard" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <span className="loading loading-spinner loading-lg text-pitch"></span>
      </div>
    );
  }

  if (!profile) return null;

  // Optional: show new user welcome if storeIsNewUser is true
  // For now, consistent with existing logic (returning welcome)
  return (
    <ReturningUserWelcome
      username={profile.username}
      totalBets={profile.totalBets}
      wins={profile.wins}
      korBalance={profile.korBalance}
      onProceed={handleProceed}
    />
  );
}
