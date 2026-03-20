import { db, userQuests, users } from "./app/lib/db/index";
import { eq, and, gte, sql } from "drizzle-orm";

async function check() {
  try {
    console.log("--- Checking Quest Status for All Users ---");
    
    // 1. Get all user quests where progress >= target or completed is true
    const quests = await db.select().from(userQuests);
    
    const completedCount = quests.filter(q => q.completed).length;
    const readyToClaimCount = quests.filter(q => !q.completed && q.progress >= q.target).length;
    const inProgressCount = quests.filter(q => !q.completed && q.progress < q.target).length;

    console.log(`Total User-Quest Records: ${quests.length}`);
    console.log(`✅ Fully Completed: ${completedCount}`);
    console.log(`💎 Ready to Claim (Progress >= Target): ${readyToClaimCount}`);
    console.log(`⏳ Still in Progress: ${inProgressCount}`);

    console.log("\n--- Top 10 Users Ready to Claim ---");
    const readyToClaim = quests
      .filter(q => !q.completed && q.progress >= q.target)
      .slice(0, 10);
      
    if (readyToClaim.length === 0) {
      console.log("No users currently have unclaimed completed quests.");
    } else {
      readyToClaim.forEach(q => {
        console.log(`User: ${q.walletAddress} | Quest: ${q.title} (${q.questId}) | Progress: ${q.progress}/${q.target}`);
      });
    }

    console.log("\n--- Top 10 Recently Completed ---");
    const completed = quests
      .filter(q => q.completed)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, 10);

    completed.forEach(q => {
      console.log(`User: ${q.walletAddress} | Quest: ${q.title} (${q.questId}) | COMPLETED ✅`);
    });

    process.exit(0);
  } catch (e) {
    console.error("Failed to check quests:", e);
    process.exit(1);
  }
}

check();
