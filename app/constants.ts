import { Team, DailyQuest } from "./types";

export const LEAGUES = [
  {
    id: "l1",
    name: "Rivals Premier",
    color: "bg-purple-100 border-purple-300",
    logo: "/assets/rivals_premier.svg",
  },
  {
    id: "l2",
    name: "Elite LaLiga",
    color: "bg-yellow-100 border-yellow-300",
    logo: "/assets/elite_laliga.svg",
  },
  {
    id: "l3",
    name: "Prime Serie A",
    color: "bg-green-100 border-green-300",
    logo: "/assets/prime_serie_a.svg",
  },
];

export const TEAMS: Record<string, Team[]> = {
  l1: [
    {
      id: "t1",
      name: "Rivals Utd",
      strength: 88,
      leagueId: "l1",
      color: "#ef4444",
      logo: "/assets/rivals_premier/rivals_utd.svg",
    }, // Red
    {
      id: "t2",
      name: "KOR City",
      strength: 90,
      leagueId: "l1",
      color: "#0ea5e9",
      logo: "/assets/rivals_premier/kor_city.svg",
    }, // Sky Blue
    {
      id: "t3",
      name: "Elite FC",
      strength: 75,
      leagueId: "l1",
      color: "#111827",
      logo: "/assets/rivals_premier/elite_fc.svg",
    }, // Dark
    {
      id: "t4",
      name: "Striker Athletic",
      strength: 78,
      leagueId: "l1",
      color: "#f97316",
      logo: "/assets/rivals_premier/striker_athletic.svg",
    }, // Orange
    {
      id: "t5",
      name: "Goal Rovers",
      strength: 70,
      leagueId: "l1",
      color: "#22c55e",
      logo: "/assets/rivals_premier/goal_rovers.svg",
    }, // Green
    {
      id: "t6",
      name: "Pitch Hotspur",
      strength: 82,
      leagueId: "l1",
      color: "#1e3a8a",
      logo: "/assets/rivals_premier/pitch_hotspur.svg",
    }, // Navy
    {
      id: "t19",
      name: "Vector Chelsea",
      strength: 84,
      leagueId: "l1",
      color: "#2563eb",
      logo: "/assets/rivals_premier/vector_chelsea.svg",
    }, // Blue
    {
      id: "t20",
      name: "Villa Vibe",
      strength: 79,
      leagueId: "l1",
      color: "#7f1d1d",
      logo: "/assets/rivals_premier/villa_vibe.svg",
    }, // Claret
    {
      id: "t21",
      name: "Newcastle Net",
      strength: 81,
      leagueId: "l1",
      color: "#000000",
      logo: "/assets/rivals_premier/newcastle_net.svg",
    }, // Black
    {
      id: "t22",
      name: "Brighton Ballers",
      strength: 76,
      leagueId: "l1",
      color: "#2dd4bf",
      logo: "/assets/rivals_premier/brighton_ballers.svg",
    }, // Teal
    {
      id: "t23",
      name: "West Ham Win",
      strength: 74,
      leagueId: "l1",
      color: "#9f1239",
      logo: "/assets/rivals_premier/west_ham_win.svg",
    }, // Maroon
    {
      id: "t24",
      name: "Everton Edge",
      strength: 72,
      leagueId: "l1",
      color: "#1d4ed8",
      logo: "/assets/rivals_premier/everton_edge.svg",
    }, // Royal Blue
  ],
  l2: [
    {
      id: "t7",
      name: "Real Rivals",
      strength: 92,
      leagueId: "l2",
      color: "#eab308",
      logo: "/assets/elite_laliga/real_rivals.svg",
    }, // Gold
    {
      id: "t8",
      name: "Barca Bold",
      strength: 89,
      leagueId: "l2",
      color: "#be185d",
      logo: "/assets/elite_laliga/barca_bold.svg",
    }, // Pink/Red
    {
      id: "t9",
      name: "Atletico Ace",
      strength: 80,
      leagueId: "l2",
      color: "#ef4444",
      logo: "/assets/elite_laliga/atletico_ace.svg",
    }, // Red
    {
      id: "t10",
      name: "Sevilla Striker",
      strength: 76,
      leagueId: "l2",
      color: "#dc2626",
      logo: "/assets/elite_laliga/sevilla_striker.svg",
    }, // Red
    {
      id: "t11",
      name: "Valencia Victory",
      strength: 74,
      leagueId: "l2",
      color: "#f97316",
      logo: "/assets/elite_laliga/valencia_victory.svg",
    }, // Orange
    {
      id: "t12",
      name: "Villarreal Vision",
      strength: 72,
      leagueId: "l2",
      color: "#facc15",
      logo: "/assets/elite_laliga/villarreal_vision.svg",
    }, // Yellow
    {
      id: "t25",
      name: "Betis Brave",
      strength: 77,
      leagueId: "l2",
      color: "#16a34a",
      logo: "/assets/elite_laliga/betis_brave.svg",
    }, // Green
    {
      id: "t26",
      name: "Sociedad Sharp",
      strength: 78,
      leagueId: "l2",
      color: "#3b82f6",
      logo: "/assets/elite_laliga/sociedad_sharp.svg",
    }, // Blue
    {
      id: "t27",
      name: "Bilbao Blast",
      strength: 75,
      leagueId: "l2",
      color: "#dc2626",
      logo: "/assets/elite_laliga/bilbao_blast.svg",
    }, // Red
    {
      id: "t28",
      name: "Getafe Glory",
      strength: 70,
      leagueId: "l2",
      color: "#2563eb",
      logo: "/assets/elite_laliga/getafe_glory.svg",
    }, // Blue
    {
      id: "t29",
      name: "Celta Champion",
      strength: 71,
      leagueId: "l2",
      color: "#60a5fa",
      logo: "/assets/elite_laliga/celta_champion.svg",
    }, // Light Blue
    {
      id: "t30",
      name: "Mallorca Master",
      strength: 69,
      leagueId: "l2",
      color: "#b91c1c",
      logo: "/assets/elite_laliga/mallorca_master.svg",
    }, // Red
  ],
  l3: [
    {
      id: "t13",
      name: "Juve Jet",
      strength: 85,
      leagueId: "l3",
      color: "#000000",
      logo: "/assets/prime_serie_a/juve_jet.svg",
    }, // Black
    {
      id: "t14",
      name: "Milan Master",
      strength: 84,
      leagueId: "l3",
      color: "#b91c1c",
      logo: "/assets/prime_serie_a/milan_master.svg",
    }, // Red
    {
      id: "t15",
      name: "Inter Icon",
      strength: 86,
      leagueId: "l3",
      color: "#1e3a8a",
      logo: "/assets/prime_serie_a/inter_icon.svg",
    }, // Blue
    {
      id: "t16",
      name: "Roma Royal",
      strength: 77,
      leagueId: "l3",
      color: "#9f1239",
      logo: "/assets/prime_serie_a/roma_royal.svg",
    }, // Maroon
    {
      id: "t17",
      name: "Napoli Noble",
      strength: 81,
      leagueId: "l3",
      color: "#0ea5e9",
      logo: "/assets/prime_serie_a/napoli_noble.svg",
    }, // Sky Blue
    {
      id: "t18",
      name: "Lazio Legend",
      strength: 73,
      leagueId: "l3",
      color: "#06b6d4",
      logo: "/assets/prime_serie_a/lazio_legend.svg",
    }, // Cyan
    {
      id: "t31",
      name: "Atalanta Ace",
      strength: 79,
      leagueId: "l3",
      color: "#1e40af",
      logo: "/assets/prime_serie_a/atalanta_ace.svg",
    }, // Blue
    {
      id: "t32",
      name: "Fiorentina Flash",
      strength: 76,
      leagueId: "l3",
      color: "#7e22ce",
      logo: "/assets/prime_serie_a/fiorentina_flash.svg",
    }, // Purple
    {
      id: "t33",
      name: "Torino Titan",
      strength: 72,
      leagueId: "l3",
      color: "#991b1b",
      logo: "/assets/prime_serie_a/torino_titan.svg",
    }, // Dark Red
    {
      id: "t34",
      name: "Bologna Bold",
      strength: 74,
      leagueId: "l3",
      color: "#be123c",
      logo: "/assets/prime_serie_a/bologna_bold.svg",
    }, // Red
    {
      id: "t35",
      name: "Monza Major",
      strength: 70,
      leagueId: "l3",
      color: "#dc2626",
      logo: "/assets/prime_serie_a/monza_major.svg",
    }, // Red
    {
      id: "t36",
      name: "Sassuolo Star",
      strength: 71,
      leagueId: "l3",
      color: "#15803d",
      logo: "/assets/prime_serie_a/sassuolo_star.svg",
    }, // Green
  ],
};

export const INITIAL_BALANCE = 1000;
export const ROUND_DURATION_SEC = 480; // 8 minutes
export const MATCH_DURATION_SEC = 120; // 2 minutes
export const RESULT_DURATION_SEC = 240; // 4 minutes

export const CONVERSION_RATE = 1000; // 1000 Coins = 100 Tokens
export const CONVERSION_YIELD = 100;

// Fix: Added required 'status' property to the initial quests
export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: "q1",
    title: "Follow @kickoffrivals",
    reward: 200,
    type: "click",
    frequency: "daily",
    target: 1,
    progress: 0,
    completed: false,
    status: "LIVE",
  },
  {
    id: "q2",
    title: "Play 5 games",
    reward: 100,
    type: "play",
    frequency: "daily",
    target: 5,
    progress: 0,
    completed: false,
    status: "LIVE",
  },
  {
    id: "q3",
    title: "Win 5 matches",
    reward: 500,
    type: "win",
    frequency: "daily",
    target: 5,
    progress: 0,
    completed: false,
    status: "LIVE",
  },
  {
    id: "q4",
    title: "High Roller: Wager 1000",
    reward: 300,
    type: "bet",
    frequency: "daily",
    target: 1000,
    progress: 0,
    completed: false,
    status: "LIVE",
  },
  {
    id: "w1",
    title: "Weekly Warrior: 50 Games",
    reward: 2000,
    type: "play",
    frequency: "weekly",
    target: 50,
    progress: 0,
    completed: false,
    status: "LIVE",
  },
  {
    id: "w2",
    title: "Elite Punter: 20 Wins",
    reward: 5000,
    type: "win",
    frequency: "weekly",
    target: 20,
    progress: 0,
    completed: false,
    status: "LIVE",
  },
];
