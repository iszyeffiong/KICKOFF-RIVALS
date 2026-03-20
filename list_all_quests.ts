import { db, quests } from "./app/lib/db";

async function listAllQuests() {
  const all = await db.select().from(quests);
  console.log("ALL_QUESTS:", JSON.stringify(all, null, 2));
  process.exit(0);
}

listAllQuests().catch(err => { console.error(err); process.exit(1); });
