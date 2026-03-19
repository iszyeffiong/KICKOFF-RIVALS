import { db } from "./app/lib/db";
import { sql } from "drizzle-orm";

async function removeDraftQuests() {
  console.log("Removing draft quests...");
  try {
    await db.execute(sql`DELETE FROM quests WHERE id IN ('q5', 'q6');`);
    console.log("Removed q5 and q6 (Telegram & Discord) successfully!");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}
removeDraftQuests();
