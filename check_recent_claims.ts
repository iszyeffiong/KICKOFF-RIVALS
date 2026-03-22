import { db, transactions, userQuests, users } from "./app/lib/db/index";
import { desc } from "drizzle-orm";

async function check() {
  try {
    console.log("--- Checking Recent Quest Claims ---");
    const recentClaims = await db.query.transactions.findMany({
      where: (tx, { eq }) => eq(tx.type, "redeem"),
      orderBy: [desc(transactions.createdAt)],
      limit: 10
    });

    console.log(`Found ${recentClaims.length} recent redeem transactions.`);
    for (const tx of recentClaims) {
      console.log(`\nTX ID: ${tx.id}`);
      console.log(`User: ${tx.walletAddress}`);
      console.log(`Amount: ${tx.amount} ${tx.currency}`);
      console.log(`Description: ${tx.description}`);

      // Check user balance
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.walletAddress, tx.walletAddress)
      });
      console.log(`Current User Balance: ${user?.coins} coins`);
    }

    process.exit(0);
  } catch (e) {
    console.error("Failed:", e);
    process.exit(1);
  }
}

check();
