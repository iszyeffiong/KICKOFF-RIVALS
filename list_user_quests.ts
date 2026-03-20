import { db } from "./app/lib/db";
import { sql } from "drizzle-orm";

async function findUserQuests() {
  try {
    const res = await db.execute(sql`SELECT * FROM user_quests`);
    res.rows.forEach(r => {
      console.log(`Quest: ${r.quest_id} - ${r.title} (User: ${r.wallet_address})`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

findUserQuests();
