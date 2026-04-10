import { db } from "../app/lib/db/index";
import { users, bets, matches } from "../app/lib/db/schema";
import { gt, eq, sql } from "drizzle-orm";

async function run() {
  console.log("=== STARTING ECONOMY SECURE PATCH ===");
  
  // 1. Fix massively inflated balances caused by the old accumulator loop bug
  console.log("-> Scanning for hyper-inflated user balances...");
  const richUsers = await db.select().from(users).where(gt(users.doodlBalance, 100000));
  
  for (const user of richUsers) {
    if (user.doodlBalance > 100000) {
      console.log(`[PATCH] User ${user.walletAddress} has ${user.doodlBalance} KOR. Resetting to 1500 KOR.`);
      await db.update(users).set({ doodlBalance: 1500 }).where(eq(users.walletAddress, user.walletAddress));
    }
  }

  // 2. Clear out any ghost bets that got stuck in 'pending' status due to the previous server catch-up desync
  console.log("-> Scanning for stuck pending 'ghost' bets...");
  const allPending = await db.select().from(bets).where(eq(bets.status, "pending"));
  let deletedCount = 0;
  
  for (const bet of allPending) {
    const match = await db.query.matches.findFirst({
      where: eq(matches.id, bet.matchId)
    });
    
    // If the match doesn't exist anymore or is completely finished, refund it and clear the stuck bet
    if (!match || match.status === "FINISHED") {
      console.log(`[PATCH] Refunding and clearing stuck bet ${bet.id} for match ${bet.matchId} (Status: ${match ? match.status : 'NOT FOUND'})`);
      
      await db.update(users)
        .set({
          doodlBalance: sql`${users.doodlBalance} + ${bet.stake}`
        })
        .where(eq(users.walletAddress, bet.walletAddress));
        
      await db.delete(bets).where(eq(bets.id, bet.id));
      deletedCount++;
    }
  }
  
  console.log(`[PATCH] Cleaned up ${deletedCount} stuck ghost bets.`);
  console.log("=== ECONOMY PATCH COMPLETE ===");
  process.exit(0);
}

run().catch(console.error);
