import { usePrivy } from "@privy-io/react-auth";
import { cn } from "../lib/utils";
import { RivalsLogo } from "./RivalsLogo";
import { useEffect } from "react";
import {
  IconWallet,
  IconChevronRight,
  IconCheck,
  IconLoader,
  IconShield,
} from "./Icons";

export function ConnectWallet() {
  const { login, ready, authenticated, user } = usePrivy();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <RivalsLogo size="md" variant="full" className="text-white" />
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-primary/20 text-primary">
              <IconWallet className="w-16 h-16" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            Connect Your Wallet
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Connect your wallet to start playing and earning rewards
          </p>

          {/* Connection State */}
          {!ready ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <IconLoader className="w-12 h-12 text-primary animate-spin" />
              <p className="text-slate-400">Loading...</p>
            </div>
          ) : authenticated && user?.wallet?.address ? (
            <div className="bg-slate-800/50 border border-primary/50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <IconCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-white font-semibold">Connected</p>
                  <p className="text-slate-400 text-sm font-mono">
                    {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {/* Privy Connect Button */}
              <button
                id="privy-connect-btn"
                onClick={login}
                className={cn(
                  "w-full p-4 rounded-xl border transition-all",
                  "flex items-center justify-between",
                  "border-primary bg-primary/10 hover:bg-primary/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <IconWallet className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Connect Wallet</div>
                    <div className="text-slate-400 text-sm">
                      MetaMask, Coinbase, WalletConnect & more
                    </div>
                  </div>
                </div>
                <IconChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>
          )}

          {/* Security note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700">
            <IconShield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Your wallet is safe</p>
              <p className="text-slate-400 text-xs">
                We never have access to your private keys. Privy handles authentication
                securely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-slate-500 text-sm">
        <p>New to crypto wallets?</p>
        <a
          href="https://ethereum.org/en/wallets/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Learn about wallets →
        </a>
      </footer>
    </div>
  );
}

export default ConnectWallet;
