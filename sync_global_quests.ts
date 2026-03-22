import { db, users, userQuests } from "./app/lib/db/index";
import { INITIAL_QUESTS } from "./app/constants";
import { and, eq } from "drizzle-orm";

async function globalSync() {
  try {
    console.log("--- Global User Quest Sync Started ---");
    const allUsers = await db.select({ walletAddress: users.walletAddress }).from(users);
    console.log(`Found ${allUsers.length} users to sync.`);

    for (const user of allUsers) {
      const normalized = user.walletAddress.toLowerCase();
      
      // Get current user quests to avoid duplicates
      const existing = await db.query.userQuests.findMany({
        where: eq(userQuests.walletAddress, normalized)
      });
      const existingIds = new Set(existing.map(q => q.questId || q.id));

      const missingQuests = INITIAL_QUESTS.filter(q => !existingIds.has(q.id));
      
      if (missingQuests.length > 0) {
        console.log(`User ${normalized}: adding ${missingQuests.length} missing quests.`);
        const values = missingQuests.map(q => ({
          walletAddress: normalized,
          questId: q.id,
          reward: q.reward,
          title: q.title,
          type: q.type,
          frequency: q.frequency,
          target: q.target,
          progress: 0,
          completed: false,
          status: q.status || "LIVE"
        }));
        
        await db.insert(userQuests).values(values);
      }
    }

    console.log("✅ Global sync complete.");
    process.exit(0);
  } catch (e) {
    console.error("Global sync failed:", e);
    process.exit(1);
  }
}

globalSync();
