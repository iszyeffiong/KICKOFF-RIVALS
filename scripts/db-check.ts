/**
 * db-check.ts — Live database diagnostic script
 * Run with:  npx tsx scripts/db-check.ts
 *
 * Checks:
 *  ✅ Connection health
 *  ✅ seasons  — is there an active season?
 *  ✅ leagues  — are leagues seeded?
 *  ✅ teams    — are teams seeded per league?
 *  ✅ matches  — does the current round have matches?
 *  ✅ users    — how many users exist?
 *  ✅ bets     — pending / settled bet counts
 *  ✅ getCurrentMatchesInternal — end-to-end simulation
 */

import * as dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc, count, and } from "drizzle-orm";
import * as schema from "../app/lib/db/schema";

const {
  seasons,
  leagues,
  teams,
  matches,
  users,
  bets,
} = schema;

// ── Colours ────────────────────────────────────────────────────────────────
const G = "\x1b[32m"; // green
const R = "\x1b[31m"; // red
const Y = "\x1b[33m"; // yellow
const B = "\x1b[36m"; // cyan
const W = "\x1b[0m";  // reset

const ok   = (msg: string) => console.log(`${G}  ✔  ${msg}${W}`);
const fail = (msg: string) => console.log(`${R}  ✖  ${msg}${W}`);
const warn = (msg: string) => console.log(`${Y}  ⚠  ${msg}${W}`);
const info = (msg: string) => console.log(`${B}  ℹ  ${msg}${W}`);
const head = (msg: string) => console.log(`\n${B}━━━ ${msg} ━━━${W}`);

// ── DB Setup ───────────────────────────────────────────────────────────────
const url = process.env.DATABASE_URL;
if (!url) {
  fail("DATABASE_URL is not set in your .env file!");
  process.exit(1);
}

const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});
const db = drizzle(pool, { schema });

// ── Helpers ────────────────────────────────────────────────────────────────
async function getCount(table: any): Promise<number> {
  const res = await db.select({ n: count() }).from(table);
  return Number(res[0]?.n ?? 0);
}

// ── Main Checks ────────────────────────────────────────────────────────────
async function run() {
  console.log(`\n${B}========================================${W}`);
  console.log(`${B}   KICKOFF RIVALS — DB Diagnostic Check ${W}`);
  console.log(`${B}========================================${W}`);

  // 1. Connection
  head("1. Connection");
  try {
    await pool.query("SELECT 1");
    ok("Connected to PostgreSQL successfully");
  } catch (e: any) {
    fail(`Cannot connect to DB: ${e.message}`);
    await pool.end();
    process.exit(1);
  }

  // 2. Seasons
  head("2. Seasons");
  const activeSeason = await db.query.seasons.findFirst({
    where: eq(seasons.isActive, true),
    orderBy: desc(seasons.id),
  });
  const totalSeasons = await getCount(seasons);
  info(`Total seasons: ${totalSeasons}`);
  if (!activeSeason) {
    fail("No active season found! The game loop cannot start.");
  } else {
    ok(`Active season found: ID=${activeSeason.id}, round=${activeSeason.currentRound}`);
  }

  // 3. Leagues
  head("3. Leagues");
  const allLeagues = await db.select().from(leagues);
  if (allLeagues.length === 0) {
    fail("No leagues seeded in DB — matches cannot be generated!");
  } else {
    ok(`${allLeagues.length} league(s) found:`);
    allLeagues.forEach(l => info(`   └─ [${l.id}] ${l.name}`));
  }

  // 4. Teams
  head("4. Teams");
  const allTeams = await db.select().from(teams);
  if (allTeams.length === 0) {
    fail("No teams seeded in DB — matches cannot be generated!");
  } else {
    ok(`${allTeams.length} team(s) found`);
    // Group by league
    const byLeague = allTeams.reduce<Record<string, typeof allTeams>>((acc, t) => {
      acc[t.leagueId] = acc[t.leagueId] || [];
      acc[t.leagueId].push(t);
      return acc;
    }, {});
    Object.entries(byLeague).forEach(([lid, ts]) => {
      info(`   League [${lid}]: ${ts.length} team(s) — ${ts.map(t => t.name).join(", ")}`);
    });
  }

  // 5. Matches
  head("5. Matches (current round)");
  const currentRound = activeSeason?.currentRound ?? 1;
  const currentSeasonId = activeSeason?.id ?? -1;

  const currentMatches = await db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.seasonId, currentSeasonId),
        eq(matches.round, currentRound),
      )
    );

  if (currentMatches.length === 0) {
    warn(`No matches found for season ${currentSeasonId}, round ${currentRound}`);
    warn("The game loop may need to seed the first round.");
  } else {
    ok(`${currentMatches.length} match(es) found for round ${currentRound}:`);
    currentMatches.forEach(m => {
      info(`   └─ [${m.id}] ${m.homeTeamId} vs ${m.awayTeamId} | status: ${m.status} | odds: H${m.oddsHome} D${m.oddsDraw} A${m.oddsAway}`);
    });

    // Status breakdown
    const statuses = currentMatches.reduce<Record<string, number>>((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {});
    info(`   Status breakdown: ${JSON.stringify(statuses)}`);
  }

  // All matches total
  const totalMatches = await getCount(matches);
  info(`Total matches in DB (all rounds): ${totalMatches}`);

  // 6. Users
  head("6. Users");
  const totalUsers = await getCount(users);
  if (totalUsers === 0) {
    warn("No users registered yet.");
  } else {
    ok(`${totalUsers} user(s) in DB`);
    // Sample the first user
    const sampleUser = await db.query.users.findFirst();
    if (sampleUser) {
      info(`   Sample user: ${sampleUser.username} | wallet: ${sampleUser.walletAddress.slice(0, 10)}... | balance: ${sampleUser.doodlBalance} KOR`);
    }
  }

  // 7. Bets
  head("7. Bets");
  const totalBets = await getCount(bets);
  if (totalBets === 0) {
    warn("No bets placed yet.");
  } else {
    ok(`${totalBets} total bet(s)`);
    const pendingBets = await db.select().from(bets).where(eq(bets.status, "pending"));
    const wonBets    = await db.select().from(bets).where(eq(bets.status, "won"));
    const lostBets   = await db.select().from(bets).where(eq(bets.status, "lost"));
    info(`   Pending: ${pendingBets.length} | Won: ${wonBets.length} | Lost: ${lostBets.length}`);
  }

  // 8. End-to-end: simulate getCurrentMatchesInternal result
  head("8. End-to-end: getCurrentMatchesInternal simulation");
  try {
    const { getCurrentMatchesInternal } = await import("../app/server/matches");
    const result = await getCurrentMatchesInternal({});
    if (result.success) {
      ok(`getCurrentMatchesInternal returned ${result.matches.length} match(es)`);
      if (result.matches.length === 0) {
        warn("Returned 0 matches — no data will show on the dashboard!");
      } else {
        result.matches.forEach((m: any) => {
          info(`   └─ [${m.id}] ${m.home_team_name} vs ${m.away_team_name} | ${m.status}`);
        });
      }
    } else {
      fail(`getCurrentMatchesInternal returned success: false — error: ${(result as any).error}`);
    }
  } catch (e: any) {
    fail(`getCurrentMatchesInternal threw an exception: ${e.message}`);
  }

  // Done
  console.log(`\n${G}========================================${W}`);
  console.log(`${G}   Diagnostic complete.                 ${W}`);
  console.log(`${G}========================================\n${W}`);

  await pool.end();
}

run().catch(async (e) => {
  fail(`Unhandled error: ${e.message}`);
  await pool.end();
  process.exit(1);
});
