import { db, users, userQuests, transactions } from "./app/lib/db/index";
import { eq, and, sql } from "drizzle-orm";

async function forceClaim() {
  const walletAddress = "0x238edb31498a5da8cb080bdead73038670da4aea"; // One of the users I saw
  const questId = "dq_win15";
  const rewardAmount = 50;

  console.log(`\n--- Force Claiming ${questId} for ${walletAddress} ---`);

  try {
    const userBefore = await db.query.users.findFirst({ where: eq(users.walletAddress, walletAddress) });
    console.log(`Balance before: ${userBefore?.coins}`);

    const questBefore = await db.query.userQuests.findFirst({ 
      where: and(eq(userQuests.walletAddress, walletAddress), eq(userQuests.questId, questId)) 
    });
    console.log(`Quest before: completed=${questBefore?.completed}, progress=${questBefore?.progress}`);

    await db.transaction(async (tx) => {
      console.log("Starting transaction...");
      
      const res1 = await tx.update(userQuests)
        .set({ completed: true, progress: questBefore?.target || 15 })
        .where(and(eq(userQuests.walletAddress, walletAddress), eq(userQuests.questId, questId)));
      console.log("Updated userQuests");

      const res2 = await tx.update(users)
        .set({ coins: sql`${users.coins} + ${rewardAmount}` })
        .where(eq(users.walletAddress, walletAddress));
      console.log("Updated users coins");

      await tx.insert(transactions).values({
        id: `tx-force-${Date.now()}`,
        walletAddress: walletAddress,
        type: "redeem",
        amount: rewardAmount,
        currency: "coins",
        description: `FORCE Quest Reward: ${questId}`
      });
      console.log("Inserted transaction");
    });

    const userAfter = await db.query.users.findFirst({ where: eq(users.walletAddress, walletAddress) });
    console.log(`Balance after: ${userAfter?.coins}`);

    process.exit(0);
  } catch (e) {
    console.error("Force claim failed:", e);
    process.exit(1);
  }
}

forceClaim();
