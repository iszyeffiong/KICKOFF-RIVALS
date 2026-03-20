import { db, quests } from "./app/lib/db";
import { eq } from "drizzle-orm";

async function checkQuest() {
  const q = await db.query.quests.findFirst({
    where: eq(quests.id, "q-follow-x")
  });
  
  if (q) {
    console.log("FOUND_QUEST:", JSON.stringify(q, null, 2));
  } else {
    console.log("QUEST_NOT_FOUND");
  }
  process.exit(0);
}

checkQuest().catch(err => { console.error(err); process.exit(1); });
