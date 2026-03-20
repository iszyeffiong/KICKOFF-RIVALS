import { db, userQuests, users } from "./app/lib/db/index";
import { eq, and, gte, sql } from "drizzle-orm";

async function check() {
  try {
    const quests = await db.select().from(userQuests);
    
    const completedCount = quests.filter(q => q.completed).length;
    const readyToClaimCount = quests.filter(q => !q.completed && q.progress >= q.target).length;
    const inProgressCount = quests.filter(q => !q.completed && q.progress < q.target).length;

    console.log(`SUMMARY:TOTAL:${quests.length}`);
    console.log(`SUMMARY:COMPLETED:${completedCount}`);
    console.log(`SUMMARY:READY:${readyToClaimCount}`);
    console.log(`SUMMARY:INPROGRESS:${inProgressCount}`);

    process.exit(0);
  } catch (e) {
    console.error("Failed:", e);
    process.exit(1);
  }
}

check();
