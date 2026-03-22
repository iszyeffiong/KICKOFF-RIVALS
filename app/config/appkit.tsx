import { createAppKit } from "@reown/appkit/react";
import { avalanche } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";

// 1. Get projectId from environment variable
const projectId =
  typeof window !== "undefined"
    ? (import.meta as any).env?.VITE_REOWN_PROJECT_ID || ""
    : process.env.VITE_REOWN_PROJECT_ID || "";

// 2. Create a metadata object
const metadata = {
  name: "KickOff Rivals",
  description: "The ultimate virtual football betting league.",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "https://kickoffrivals.com",
  icons: [
    typeof window !== "undefined"
      ? `${window.location.origin}/logo.png`
      : "https://kickoffrivals.com/logo.png",
  ],
};

// 3. Set the networks
const networks = [avalanche] as any;

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. AppKit initialization singleton
let appKitInitialized = false;

// 6. Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export { queryClient };

// 7. Export provider wrapper with SSR support
export function AppKitProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !appKitInitialized) {
      const appKit = createAppKit({
        adapters: [wagmiAdapter],
        networks,
        projectId,
        metadata: {
          ...metadata,
          icons: ["https://avatars.githubusercontent.com/u/179229932"] // Stable fallback icon
        },
        features: {
          analytics: false, // Disable analytics to reduce load
          email: false,
          socials: false,
        },
        themeMode: "dark",
        themeVariables: {
          "--w3m-accent": "#1d4ed8",
          "--w3m-border-radius-master": "2px",
          "--w3m-z-index": 10000, // Ensure it's above other elements
        },
      });

      // Expose for global access if needed
      (window as any).appKit = appKit;
      appKitInitialized = true;
      console.log("AppKit initialized smoothly");
    }
    setReady(true);
  }, []);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
