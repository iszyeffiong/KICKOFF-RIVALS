import { db } from "./app/lib/db/index";
import { sql } from "drizzle-orm";

async function migrate() {
  try {
    console.log("Adding 'proof' column to 'user_quests' table...");
    await db.execute(sql`
      ALTER TABLE user_quests ADD COLUMN IF NOT EXISTS proof TEXT;
    `);
    console.log("Column added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("MIGRATION FAILED:", error);
    process.exit(1);
  }
}

migrate();
