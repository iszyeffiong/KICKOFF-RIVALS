# 🏆 KickOff Rivals

**KickOff Rivals** is a high-performance, verifiable virtual sports betting platform built on the **Avalanche** network. It brings total transparency and cryptographic fairness to the virtual football betting industry using **Chainlink VRF**.

![KickOff Rivals Banner](public/logo.png)

## 🚀 Vision
In the world of virtual sports, users often have to "trust" that the house isn't manipulating results. KickOff Rivals solves this by making every match outcome verifiable on-chain. We combine the speed and UX of a modern web application with the security and decentralization of the Avalanche blockchain.

---

## ✨ Key Features
- **Verifiable Fairness**: Every match result is generated using a random seed provided by **Chainlink VRF v2.5** on the Avalanche Fuji Testnet.
- **Premium UX/UI**: A custom-designed, dark-themed interface with glassmorphism, aerodynamic animations, and sub-second responsiveness.
- **Automated Game Loop**: A robust server-side engine that handles betting phases, live simulations, and automatic bet settlements.
- **Player Progression**: A deep 'RPG-style' progression system with XP, levels, win streaks, and detailed betting statistics.
- **Avalanche Speed**: Near-instant bet placement and balance updates leveraging Avalanche's industry-leading finality.

---

## ⚙️ Technical Implementation Details

### 🔒 Cryptographic Fairness
One of the core problems in virtual sports betting is transparency. KickOff Rivals solves this by integrating **Chainlink VRF v2.5** (Verifiable Random Function) on the **Avalanche Fuji Testnet**.
- **Contract Address**: `0x9184eDc88Ff4e212d90716429B90D78ba6B41B4a`
- **Provable Entropy**: Every match result is deterministic based on a random seed generated on-chain. This makes it impossible for the application to manipulate outcomes "behind the scenes."
- **Efficiency**: We use an asynchronous request/fulfillment model where the seed for an entire round of football matches is requested from the blockchain and stored in our database for auditability.

### 🔄 Automated Match Loop
The server maintains a continuous **GameState Loop**:
1. **Betting Phase (60s)**: Users browse odds and place bets.
2. **Live Phase (90s)**: The server simulates game events based on the VRF seed and calculates real-time scores.
3. **Result Phase (30s)**: Results are shown, and the **Auto-Settler** automatically credits winnings to users, awards XP, and starts the next round.

---

## 🏗️ Technical Architecture

KickOff Rivals uses a hybrid architecture to balance performance and trust:
- **On-Chain**: Randomness requests (VRF) and optional settlement verification.
- **Server Functions**: High-speed match logic, odds calculation, and state management via TanStack server functions to minimize latency.
- **Database**: Real-time storage of user stats, match history, and transaction logs for instant frontend access.

### Architecture Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                   │
├─────────────────────────────────────────────────────────────────┤
│  Components → Routes → Contexts → Services                      │
│       ↓          ↓         ↓          ↓                         │
│  [UI Layer]  [Pages]  [State]   [API Calls]                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API ROUTES                                  │
│  app/routes/api/*.ts                                            │
│  (TanStack Start Server Handlers)                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER FUNCTIONS                              │
│  app/server/*.ts                                                │
│  (Business Logic + Drizzle Queries)                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE                                    │
│  Drizzle ORM → PostgreSQL (Neon/Local)                          │
│  Schema: app/lib/db/schema.ts                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Feature | Technology |
| :--- | :--- |
| **Framework** | [TanStack Start](https://tanstack.com/start) & [Router](https://tanstack.com/router) (React) |
| **Blockchain** | **Avalanche Fuji Testnet** |
| **Randomness** | **Chainlink VRF v2.5** |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Database** | **PostgreSQL** (Supabase/Neon) |
| **Web3 Integration** | [Reown AppKit](https://reown.com/appkit) & [Wagmi](https://wagmi.sh/) |
| **Design System** | Tailwind CSS + Custom Design Tokens |

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- A wallet with Avalanche Fuji Testnet AVAX (for contract interactions)
- Environment variables configured (see `.env.local.example`)

### Installation & Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/iszyeffiong/KICKOFF-RIVALS.git
   cd kickoff-rivals
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   ```bash
   cp .env.local.example .env
   # Edit .env with your configuration
   ```
4. **Database Setup**:
   - **Local Development with Docker**:
     ```bash
     npm run docker:up          # Start PostgreSQL container
     npm run db:push            # Push schema to database
     npm run db:seed            # (Optional) Seed with initial data
     ```
   - **Production (e.g., Neon)**:
     ```bash
     npm run db:generate        # Generate migrations
     npm run db:migrate         # Run migrations
     ```
5. **Run the development server**:
   ```bash
   npm run dev
   ```
6. **Access the app** at `http://localhost:3000`

---

## 💻 Quick Commands Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build production | `npm run build` |
| Start production | `npm run start` |
| Push DB schema | `npm run db:push` |
| Generate migrations | `npm run db:generate` |
| Run migrations | `npm run db:migrate` |
| Open DB studio | `npm run db:studio` |
| Seed database | `npm run db:seed` |
| Start Docker DB | `npm run docker:up` |
| Stop Docker DB | `npm run docker:down` |

---

## 📂 Project Structure Overview

| Directory/File | Description |
|----------------|-------------|
| `app/components/` | Reusable UI components |
| `app/routes/` | Page routes and API endpoints |
| `app/server/` | Server-side business logic |
| `app/lib/db/` | Database schema and configuration |
| `contracts/` | Solidity smart contracts (VRF Integration) |
| `public/` | Static assets (images, icons) |
| `scripts/` | Debug and utility scripts |
| `docs/` | Detailed technical documentation |

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with 💚 for the Avalanche Build Games.
