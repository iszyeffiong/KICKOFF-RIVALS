import { db, userQuests } from "./app/lib/db";
import { eq } from "drizzle-orm";

async function findRogue() {
  const q = await db.select().from(userQuests).where(eq(userQuests.id, 566));
  console.log("ROGUE_QUEST:", JSON.stringify(q, null, 2));
  process.exit(0);
}

findRogue().catch(err => { console.error(err); process.exit(1); });
