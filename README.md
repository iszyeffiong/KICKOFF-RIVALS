# KickOff Rivals

The ultimate virtual football betting league and other sports that are coming soon built with modern web technologies. Experience the thrill of live sports betting in a completely simulated, 24/7 environment.

## Overview

KickOff Rivals is a cutting-edge virtual sports platform where users can engage in a fully simulated football league ecosystem. The application runs a continuous cycle of seasons, rounds, and matches, allowing users to place bets, track live scores, and compete for leaderboard dominance using a dual-currency system.

Designed as a fully responsive web application with a sleek, dark-mode aesthetic, KickOff Rivals bridges the gap between casual gaming and sports betting simulation, leveraging the speed of the Avalanche blockchain. It works seamlessly across desktops, tablets, and mobile devices.

## Inspiration

We realized that traditional sports betting has a major limitation: **it stops when the game stops.** Fans have to wait for weekends or specific match days to engage with their favorite sports. 

We wanted to create a platform that offers the **excitement of live sports 24/7**. By building a virtual league, we can offer continuous action where a new round starts every few minutes, providing instant gratification and a constant stream of entertainment for users who love the thrill of the game but hate the waiting time.

## How It Works

The platform operates on an automated game loop that simulates a living, breathing football world:

1.  **The Game Loop**: The server manages a continuous cycle of game phases:
    *   **Betting Phase**: (4 minutes) Users analyze upcoming matches, view team stats, and place their bets.
    *   **Live Phase**: (2 minutes) Matches are simulated in real-time. Users can watch goal updates, commentary, and score changes as they happen.
    *   **Result Phase**: (4 minutes) Final scores are displayed, bets are settled, and winnings are distributed.

2.  **Economy & Currencies**:
    *   **Coins**: Free-to-play currency earned through daily logins and quests. Perfect for onboarding new users risk-free.
    *   **KOR Tokens**: Premium currency for high-stakes betting and ranking on the global leaderboard, managed via Web3 wallets.

3.  **Leagues & Teams**:
    *   **Rivals Premier**, **Elite LaLiga**, and **Prime Serie A**. Each league has unique teams with dynamic strength ratings that influence match outcomes.

## How We Built It

KickOff Rivals is built on a modern, full-stack architecture designed for speed and real-time interactivity:

*   **Frontend**: We used **TanStack Start** (React) for its powerful routing and server-side rendering capabilities, ensuring the app is incredibly fast and SEO-friendly.
*   **Styling**: **Tailwind CSS v4** combined with **Framer Motion** allowed us to create a fluid, app-like experience with rich animations and specific "dark mode" aesthetics.
*   **Backend & Database**: We utilized **Neon (Serverless Postgres)** alongside **Drizzle ORM**. This combination allowed us to handle rapid read/write operations for the live game loop without managing complex infrastructure.
*   **Web3 Integration**: We integrated **Reown AppKit** to handle wallet connections seamlessly. This provides a bridge to the **Avalanche Network**, enabling fast and low-cost transactions for our KOR Token economy.
*   **Simulation Engine**: We wrote a custom simulation algorithm in TypeScript that generates realistic match events (goals, cards, corners) based on team stats (Attack vs Defense strength) and random variance.

## Challenges We Ran Into

*   **State Synchronization**: Keeping the client-side countdown timer perfectly synced with the server-side game loop was tricky. We had to implement robust state management to ensure that when the server says "Match Started," every connected client updates instantly without lag.
*   **Wallet Connectivity**: Ensuring a smooth onboarding experience for non-crypto natives was a priority. Integrating Reown AppKit helped, but handling edge cases where a user disconnects mid-bet required careful error handling.
*   **Cross-Device Responsiveness**: designing a data-heavy dashboard (odds, scores, timers, bets) that looks clean and intuitive on everything from widescreen desktops to mobile screens took several iterations of UI refinement.

## Accomplishments That We're Proud Of

*   **The "Live" Feel**: We successfully created a "Live Match" view that feels erratic and exciting, just like watching real scores tick over on a Saturday afternoon.
*   **Dual-Currency System**: We managed to balance a "Coins" (Web2) and "Tokens" (Web3) economy, allowing us to onboard casual gamers while still offering value to crypto-native users.
*   **Zero-Downtime Loop**: The game loop runs autonomously. A new round is generated automatically as soon as the previous one ends, creating a truly infinite league.

## What We Learned

*   **TanStack Start** is powerful: Using server functions directly within our React components streamlined our data fetching and mutation logic significantly.
*   **User Experience in Web3**: We learned that minimizing wallet interactions (only asking for signatures when necessary) drastically improves user retention compared to aggressive prompting.
*   **Simulation Math**: Balancing team strengths to ensure "favorites" win often enough to be realistic, but "underdogs" win often enough to be exciting, is an art form!

## What's Next for KickOff Rivals

*   **PvP Betting**: Allowing users to bet directly against each other rather than against the house.
*   **NFT Player Cards**: Users could own unique players that boost their favorite team's stats.
*   **Mobile App**: wrapping the PWA into a native mobile experience.
*   **More Sports**: Expanding the engine to simulate Basketball and Tennis leagues.

## Built With

*   [TanStack Start](https://tanstack.com/start)
*   [Neon Postgres](https://neon.tech)
*   [Drizzle ORM](https://orm.drizzle.team)
*   [Reown AppKit](https://reown.com)
*   [Avalanche](https://www.avax.network/)
*   [Tailwind CSS](https://tailwindcss.com)

## Getting Started

### Prerequisites
*   Node.js 18+
*   A Web3 Wallet (Metamask, Rainbow, etc.)

## License
MIT
