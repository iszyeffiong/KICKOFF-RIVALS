import { db } from "./app/lib/db/index";
import { sql } from "drizzle-orm";

async function applyFix() {
  try {
    console.log("Applying missing UNIQUE INDEX fix...");
    await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "user_quests_wallet_quest_idx" ON "user_quests" ("wallet_address", "quest_id");`);
    console.log("✅ Index created successfully!");
    process.exit(0);
  } catch (e) {
    console.error("Failed to create index:", e);
    process.exit(1);
  }
}

applyFix();
