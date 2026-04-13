import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignMessage } from "../components/SignMessage";
import { useGame } from "@/contexts/GameContext";
import { useUserStore } from "@/stores/userStore";
import { usePrivy } from "@privy-io/react-auth";

export const Route = createFileRoute("/sign")({
  component: SignRoute,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      address: (search.address as string) || "",
    };
  },
});

function SignRoute() {
  const navigate = useNavigate();
  const { address: searchAddress } = Route.useSearch();
  const { walletState, logout: storeLogout } = useUserStore();
  const { handleLogout: contextLogout } = useGame();
  const { logout: privyLogout } = usePrivy();

  const finalAddress = searchAddress || walletState.address || "";

  return (
    <SignMessage
      address={finalAddress}
      isProfileLoading={false}
      onCancel={async () => {
        storeLogout();
        contextLogout();
        await privyLogout();
        navigate({ to: "/" });
      }}
    />
  );
}
