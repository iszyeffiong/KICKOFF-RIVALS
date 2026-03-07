# 🏆 KickOff Rivals

**KickOff Rivals** is a high-performance, verifiable virtual sports betting platform built on the **Avalanche** network. It brings total transparency and cryptographic fairness to the virtual football betting industry using **Chainlink VRF**.

![KickOff Rivals Banner](public/logo.png)

## 🚀 Vision
In the world of virtual sports, users often have to "trust" that the house isn't manipulating results. KickOff Rivals solves this by making every match outcome verifiable on-chain. We combine the speed and UX of a modern web application with the security and decentralization of the Avalanche blockchain.

## ✨ Key Features
- **Verifiable Fairness**: Every match result is generated using a random seed provided by **Chainlink VRF v2.5** on the Avalanche Fuji Testnet.
- **Premium UX/UI**: A custom-designed, dark-themed interface with glassmorphism, aerodynamic animations, and sub-second responsiveness.
- **Automated Game Loop**: A robust server-side engine that handles betting phases, live simulations, and automatic bet settlements.
- **Player Progression**: A deep 'RPG-style' progression system with XP, levels, win streaks, and detailed betting statistics.
- **Avalanche Speed**: Near-instant bet placement and balance updates leveraging Avalanche's industry-leading finality.

## 🛠️ Technology Stack
- **Frontend/Fullstack**: [TanStack Start](https://tanstack.com/start) & [Router](https://tanstack.com/router) (React)
- **Database/ORM**: [Drizzle ORM](https://orm.drizzle.team/) with **PostgreSQL** (Supabase)
- **Web3 Integration**: [Reown AppKit](https://reown.com/appkit) (formerly Web3Modal) & [Wagmi](https://wagmi.sh/)
- **Oracle Infrastructure**: [Chainlink VRF v2.5](https://docs.chain.link/vrf) for entropy
- **Blockchain**: **Avalanche Fuji Testnet**

## 🏗️ Technical Architecture
KickOff Rivals uses a hybrid architecture to balance performance and trust:
- **On-Chain**: Randomness requests (VRF) and optional settlement verification.
- **Server Functions**: High-speed match logic, odds calculation, and state management via TanStack server functions to minimize latency.
- **Database**: Real-time storage of user stats, match history, and transaction logs for instant frontend access.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- A wallet with Avalanche Fuji Testnet AVAX (for contract interactions)
- Environment variables configured (see `.env.example`)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/iszyeffiong/KICKOFF-RIVALS.git
   cd kickoff-rivals
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:3000`

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with 💚 for the Avalanche Build Games.
