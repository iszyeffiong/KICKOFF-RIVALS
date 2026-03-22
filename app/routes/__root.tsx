import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
} from "@tanstack/react-router";
import { IconTrophy, IconChevronRight } from "../components/Icons";
import type { ReactNode } from "react";
import appCss from "../styles/globals.css?url";
import { GameProvider } from "../contexts/GameContext";
import { Toaster } from "react-hot-toast";
import { AppKitProvider } from "../config/appkit";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content: "The ultimate virtual football betting league.",
      },
      { title: "KickOff Rivals" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <div className="p-6 rounded-full bg-primary/20 mb-6 font-bold text-primary animate-bounce">
          <IconTrophy className="w-16 h-16" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2">404</h1>
        <p className="text-slate-400 mb-8 max-w-xs">
          This page hasn't hit the stadium yet. Let's get you back to the game.
        </p>
        <Link 
          to="/" 
          className="btn btn-primary h-14 px-8 font-bold text-lg shadow-lg shadow-primary/20"
        >
          Return to Pitch
          <IconChevronRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    )
  }
});

function RootComponent() {
  // Register service worker for PWA support
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registered:", reg.scope))
        .catch((err) => console.log("SW failed:", err));
    });
  }

  return (
    <RootDocument>
      <AppKitProvider>
        <GameProvider>
          <Outlet />
          <Toaster position="top-center" />
        </GameProvider>
      </AppKitProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="root">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}
