import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { useProfile } from "../hooks/useProfile";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardModals } from "../components/dashboard/DashboardModals";
import { MaintenanceOverlay } from "../components/MaintenanceOverlay";

// Set to true to enable maintenance mode
const IS_MAINTENANCE = true;

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  if (IS_MAINTENANCE) {
    return <MaintenanceOverlay />;
  }

  const navigate = useNavigate();
  const { profile, isLoading: isProfileLoading, isFetching } = useProfile();
  const { isInitializing, setDashboardMounted, betSlipSelections, walletState, registrationData } = useGame();

  // Tell the context that the dashboard is mounted (starts game loop)
  useEffect(() => {
    setDashboardMounted(true);
    return () => setDashboardMounted(false);
  }, [setDashboardMounted]);

  // Route Guard: Redirect if no user logged in or incomplete profile
  useEffect(() => {
    // Wait for initialization and first profile fetch
    if (isInitializing || isProfileLoading) return;
    
    // If wallet disconnected, go to landing
    if (!walletState.isConnected) {
      navigate({ to: "/" });
      return;
    }

    const hasPendingData = !!(registrationData?.username && registrationData?.leagueId && registrationData?.teamId);

    // Profile finished loading but we have no username? 
    // This means the user is not in our DB yet
    // If we HAVE pending data, we expect the useProfile hook to finalize the creation shortly, 
    // so we don't redirect yet.
    if (!profile?.username && !hasPendingData) {
      console.log("[DASHBOARD] No profile found and no pending data, redirecting to onboarding...");
      navigate({ to: "/onboarding" });
    } else if (profile?.username && (!profile.allianceLeagueId || !profile.allianceTeamId) && !hasPendingData) {
      console.log("[DASHBOARD] Incomplete profile detected and no pending data, redirecting to onboarding...");
      navigate({ to: "/onboarding" });
    }
  }, [
    profile?.username, 
    profile?.allianceLeagueId, 
    profile?.allianceTeamId, 
    isInitializing, 
    isProfileLoading, 
    walletState.isConnected,
    registrationData,
    navigate
  ]);

  // Only show full-page loader on INITIAL load
  // If we are just refreshing (isFetching), keep the UI visible
  if (isInitializing || (isProfileLoading && !profile)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-bold font-sport italic mb-2 tracking-widest">KICKOFF RIVALS</h1>
        <p className="text-slate-400 animate-pulse">Synchronizing your athlete profile...</p>
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
