import { db, userQuests, users } from "./app/lib/db/index";
import { eq, and, gte, sql } from "drizzle-orm";

async function reset() {
  try {
    console.log("--- Resetting All Quest Progress for All Users ---");
    
    // 1. Update all records to progress: 0 and completed: false
    const result = await db.update(userQuests)
      .set({
        progress: 0,
        completed: false,
        verifiedAt: null
      });

    console.log("✅ All user quest records have been reset to 0 progress.");
    console.log("Users will now be able to redo all tasks and claim rewards correctly.");

    process.exit(0);
  } catch (e) {
    console.error("Failed to reset quests:", e);
    process.exit(1);
  }
}

reset();
