import { db, userQuests, quests } from "./app/lib/db";
import { sql, eq } from "drizzle-orm";

async function finalQuestUpdate() {
  console.log("Renaming 525 to q-lcr-post in Quests Master...");
  // 1. Rename in Quests table
  await db.update(quests).set({ id: "q-lcr-post" }).where(eq(quests.id, "525"));

  console.log("Renaming 525 to q-lcr-post in User Boards...");
  // 2. Rename in UserQuests table
  await db.update(userQuests).set({ questId: "q-lcr-post" }).where(eq(userQuests.questId, "525"));

  console.log("Deleting old redundant IDs...");
  // 3. Delete orphans
  await db.execute(sql`DELETE FROM quests WHERE id IN ('q-like-1', 'q-like-2', 'q-retweet', 'q-like-comment')`);
  await db.execute(sql`DELETE FROM user_quests WHERE quest_id IN ('q-like-1', 'q-like-2', 'q-retweet', 'q-like-comment')`);

  console.log("Final check: Ensuring LCR has the correct URL in DB...");
  await db.update(quests).set({ 
    externalUrl: "https://x.com/i/status/2034928785825431674",
    requiresVerification: true,
    verificationType: "link",
    status: "LIVE"
  }).where(eq(quests.id, "q-lcr-post"));

  console.log("Database Sync Complete!");
  process.exit(0);
}

finalQuestUpdate().catch(err => { console.error(err); process.exit(1); });
