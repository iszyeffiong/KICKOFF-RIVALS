import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { base } from "viem/chains";

const privyAppId = (
  (import.meta as any).env?.VITE_PRIVY_APP_ID || 
  (typeof process !== 'undefined' ? process.env?.VITE_PRIVY_APP_ID : '') || 
  ""
).trim();

console.log("DEBUG: Privy App ID is:", privyAppId ? "[EXISTS]" : "[EMPTY]");

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

export function PrivyClientProvider({ children }: { children: ReactNode }) {
  if (!privyAppId) {
    return (
      <div style={{ padding: '20px', color: 'red', background: '#fee' }}>
        <strong>Privy Error:</strong> VITE_PRIVY_APP_ID is missing from environment variables.
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#1d4ed8",
          logo: "/logo.png",
          walletChainType: "ethereum-only",
          showWalletLoginFirst: true,
        },
        // Default chain
        defaultChain: base,
        supportedChains: [base],
        // Login methods — wallets + embedded
        loginMethods: ["wallet", "email"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PrivyProvider>
  );
}
