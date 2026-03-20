import { db } from "./app/lib/db";
import { sql } from "drizzle-orm";

async function findIds() {
  try {
    console.log("Searching for 110/113 in 'quests' table...");
    const q = await db.execute(sql`SELECT * FROM quests WHERE id LIKE '%110%' OR id LIKE '%113%' OR title LIKE '%110%' OR title LIKE '%113%'`);
    console.log("Quests results:", JSON.stringify(q.rows, null, 2));

    console.log("Searching for 110/113 in 'user_quests' table...");
    const uq = await db.execute(sql`SELECT * FROM user_quests WHERE quest_id LIKE '%110%' OR quest_id LIKE '%113%'`);
    console.log("User Quests results:", JSON.stringify(uq.rows, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

findIds();
