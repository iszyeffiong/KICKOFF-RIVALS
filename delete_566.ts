import { db, userQuests, quests } from "./app/lib/db";
import { sql, eq, or } from "drizzle-orm";

async function deleteQuest566() {
  console.log("Checking for user quest with serial ID 566...");
  const existing = await db.select().from(userQuests).where(eq(userQuests.id, 566));
  
  if (existing.length > 0) {
    console.log("Found Quest 566. Deleting...");
    await db.delete(userQuests).where(eq(userQuests.id, 566));
  } else {
    console.log("Quest 566 not found in user_quests.");
  }

  console.log("Cleaning up any legacy string IDs (525, etc.) from all tables...");
  // Delete from user_quests where questId is old
  await db.delete(userQuests).where(sql`quest_id IN ('525', 'q-like-1', 'q-like-2', 'q-retweet', 'q-like-comment')`);
  
  // Delete from master quests too just in case
  await db.delete(quests).where(sql`id IN ('525', 'q-like-1', 'q-like-2', 'q-retweet', 'q-like-comment')`);

  console.log("Cleanup Complete!");
  process.exit(0);
}

deleteQuest566().catch(err => { console.error(err); process.exit(1); });
