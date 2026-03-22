import { db, users, userQuests, transactions } from "./app/lib/db/index";
import { eq, and, sql } from "drizzle-orm";

async function forceClaim() {
  // 1. Get first user
  const firstUser = await db.query.users.findFirst();
  if (!firstUser) {
    console.log("No users found.");
    process.exit(1);
  }

  const walletAddress = firstUser.walletAddress;
  const questId = "dq_win15";
  const rewardAmount = 50;

  console.log(`\n--- Force Claiming ${questId} for ${walletAddress} ---`);

  try {
    console.log(`Balance before: ${firstUser.coins}`);

    const questBefore = await db.query.userQuests.findFirst({ 
      where: and(eq(userQuests.walletAddress, walletAddress), eq(userQuests.questId, questId)) 
    });
    console.log(`Quest before: found=${!!questBefore}, completed=${questBefore?.completed}, progress=${questBefore?.progress}`);

    await db.transaction(async (tx) => {
      console.log("Starting transaction...");
      
      await tx.update(userQuests)
        .set({ completed: true, progress: 15 })
        .where(and(eq(userQuests.walletAddress, walletAddress), eq(userQuests.questId, questId)));
      console.log("Updated userQuests");

      await tx.update(users)
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
