import { db } from "./app/lib/db";
import { sql } from "drizzle-orm";

async function listQuests() {
  console.log("Fetching all quests from database...");
  
  try {
    const questsRes = await db.execute(sql`SELECT * FROM quests`);
    console.log("--- MASTER QUESTS ---");
    console.log(JSON.stringify(questsRes.rows, null, 2));

    const userQuestsRes = await db.execute(sql`SELECT * FROM user_quests LIMIT 20`);
    console.log("--- USER QUESTS ---");
    console.log(JSON.stringify(userQuestsRes.rows, null, 2));

  } catch (error) {
    console.error("Error fetching quests:", error);
  } finally {
    process.exit(0);
  }
}

listQuests();
