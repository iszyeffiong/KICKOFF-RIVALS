import { db, users, userQuests } from "./app/lib/db/index";
import { eq } from "drizzle-orm";
import fs from "fs";

async function checkQuests() {
  try {
    const allUsers = await db.select().from(users);
    if (allUsers.length === 0) {
      fs.writeFileSync('check_quests_report.txt', "No users found.");
      process.exit(0);
    }
    
    let report = "";
    for (const user of allUsers.slice(0, 5)) {
      report += `\n--- User: ${user.username} (${user.walletAddress}) ---\n`;
      const quests = await db.query.userQuests.findMany({
        where: eq(userQuests.walletAddress, user.walletAddress)
      });
      report += `Found ${quests.length} quests.\n`;
      report += JSON.stringify(quests, null, 2) + "\n";
    }
    
    fs.writeFileSync('check_quests_report.txt', report);
    console.log("Report generated in check_quests_report.txt");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkQuests();
