import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ConnectWallet } from "../components/ConnectWallet";
import { useGame } from "../contexts/GameContext";

export const Route = createFileRoute("/connect")({
  component: ConnectRoute,
});

function ConnectRoute() {
  const navigate = useNavigate();
  const { handleWalletConnected } = useGame();
  const { intent } = Route.useSearch() as { intent?: string };

  return (
    <ConnectWallet
      onConnected={(address: string) => {
        handleWalletConnected(address, intent === "returning");
        navigate({ to: "/sign" });
      }}
    />
  );
}
