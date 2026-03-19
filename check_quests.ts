import { db, userQuests, transactions, users } from "./app/lib/db/index";
import { desc, eq, gt } from "drizzle-orm";

async function check() {
  try {
    console.log("--- Checking Quest Completions ---");
    const allQuests = await db.select().from(userQuests).orderBy(desc(userQuests.createdAt));
    console.log(`Total social quests found: ${allQuests.length}`);
    console.log(JSON.stringify(allQuests.slice(0, 10), null, 2));

    console.log("\n--- Checking Recent Reward Transactions ---");
    const recentTx = await db.select().from(transactions).where(eq(transactions.type, "redeem")).orderBy(desc(transactions.createdAt)).limit(10);
    console.log(JSON.stringify(recentTx, null, 2));

    console.log("\n--- Checking Rich Users (coins > 5000) ---");
    const richUsers = await db.select().from(users).where(gt(users.coins, 5000)).orderBy(desc(users.coins)).limit(10);
    console.log(JSON.stringify(richUsers, null, 2));

    process.exit(0);
  } catch (e) {
    console.error("Failed to fetch database data:", e);
    process.exit(1);
  }
}

check();
