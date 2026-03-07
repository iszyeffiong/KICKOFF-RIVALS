import { db, leagues, teams, seasons, users, matches, bets, transactions, coupons, couponRedemptions, userQuests, auditLogs } from "./index";
import { sql } from "drizzle-orm";

async function reset() {
  console.log("🗑️ Clearing database...");

  try {
    // Delete in order to satisfy foreign key constraints
    console.log("Deleting audit logs...");
    await db.delete(auditLogs);
    
    console.log("Deleting coupon redemptions...");
    await db.delete(couponRedemptions);
    
    console.log("Deleting user quests...");
    await db.delete(userQuests);
    
    console.log("Deleting transactions...");
    await db.delete(transactions);
    
    console.log("Deleting bets...");
    await db.delete(bets);
    
    console.log("Deleting matches...");
    await db.delete(matches);
    
    console.log("Deleting users...");
    await db.delete(users);
    
    console.log("Deleting teams...");
    await db.delete(teams);
    
    console.log("Deleting seasons...");
    await db.delete(seasons);
    
    console.log("Deleting leagues...");
    await db.delete(leagues);
    
    console.log("Deleting coupons...");
    await db.delete(coupons);

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Reset failed:", error);
    throw error;
  }
}

reset()
  .then(() => {
    console.log("Reset script finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Reset script failed:", error);
    process.exit(1);
  });
