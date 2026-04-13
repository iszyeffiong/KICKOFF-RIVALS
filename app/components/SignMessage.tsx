/**
 * SignMessage — now a smart redirect component.
 *
 * With Privy, authentication happens at wallet connection time.
 * This component simply confirms auth and redirects appropriately.
 * No manual message signing required.
 */
import { usePrivy } from "@privy-io/react-auth";
import { useUserStore } from "@/stores/userStore";
import { useProfile } from "@/hooks/useProfile";
import { RivalsLogo } from "./RivalsLogo";
import { Navigate } from "@tanstack/react-router";
import { IconLoader, IconShield } from "./Icons";

interface SignMessageProps {
  address: string;
  onCancel: () => void;
  isProfileLoading?: boolean;
}

export function SignMessage({
  address,
  onCancel,
  isProfileLoading = false,
}: SignMessageProps) {
  const { authenticated, ready } = usePrivy();
  const { registrationData } = useUserStore();
  const { profile, isLoading: isProfileSyncing, isError } = useProfile({
    // Only use checkOnly mode if we aren't in the middle of a new user registration
    checkOnly: !registrationData,
    address
  });

  // 1. Check Privy Auth State
  if (ready && !authenticated) {
    return <Navigate to="/connect" />;
  }

  // 2. Handle Profile Success
  if (profile && !isProfileSyncing) {
    const isReturning = !profile.isNew && profile.username && profile.allianceTeamId;
    
    if (!isReturning) {
      console.log("[SignMessage] No DB record found, redirecting to /entry");
      return <Navigate to="/entry" />;
    } else {
      console.log("[SignMessage] Returning user, redirecting to /welcome");
      return <Navigate to="/welcome" />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <RivalsLogo size="md" variant="full" className="text-white" />
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-primary/20 text-primary">
              <IconShield className="w-16 h-16" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {isError ? "Sync Failed" : (isProfileLoading || isProfileSyncing ? "Syncing Profile..." : "Authenticated!")}
          </h1>
          <p className="text-slate-400 mb-8">
            {isError 
              ? "We couldn't reach the game server. Please check your connection."
              : (isProfileLoading || isProfileSyncing
                ? "Fetching your player record..."
                : "Verified via Privy. Redirecting...")}
          </p>

          {/* Wallet address */}
          {address && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Wallet</span>
                <span className="text-white font-mono text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            </div>
          )}

          <IconLoader className="w-8 h-8 text-primary animate-spin mx-auto" />
        </div>
      </div>

      <footer className="relative z-10 p-6 text-center text-slate-500 text-xs">
        Secured by Privy
      </footer>
    </div>
  );
}

export default SignMessage;
