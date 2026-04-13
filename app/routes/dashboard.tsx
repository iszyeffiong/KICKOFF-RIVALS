import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { useProfile } from "../hooks/useProfile";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardModals } from "../components/dashboard/DashboardModals";
import { MaintenanceOverlay } from "../components/MaintenanceOverlay";

// Set to true to enable maintenance mode
const IS_MAINTENANCE = false;

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { isInitializing, setDashboardMounted, betSlipSelections } = useGame();

  // Tell the context that the dashboard is mounted (starts game loop)
  useEffect(() => {
    setDashboardMounted(true);
    return () => setDashboardMounted(false);
  }, [setDashboardMounted]);

  // Route Guard: Redirect if no user logged in or incomplete profile
  useEffect(() => {
    if (isInitializing || isProfileLoading) return;
    
    if (!profile?.username) {
      navigate({ to: "/" });
    } else if (!profile.allianceLeagueId || !profile.allianceTeamId) {
      console.log("[DASHBOARD] Incomplete profile detected, redirecting to onboarding...");
      navigate({ to: "/onboarding" });
    }
  }, [profile?.username, profile?.allianceLeagueId, profile?.allianceTeamId, isInitializing, isProfileLoading, navigate]);

  if (IS_MAINTENANCE) {
    return <MaintenanceOverlay />;
  }

  if (isInitializing || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light text-dark font-sport italic text-2xl animate-pulse">
        LOADING...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans text-dark bg-light flex flex-col transition-all ${
        betSlipSelections.length > 0 ? "lg:pr-[400px]" : ""
      }`}
    >
      <DashboardHeader />
      {/* Tab content rendered here via nested routes */}
      <Outlet />
      {/* Floating modals + persistent bet slip — always mounted */}
      <DashboardModals />
    </div>
  );
}
