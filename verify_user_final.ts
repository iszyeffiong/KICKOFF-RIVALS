import { db, users } from './app/lib/db';
import { eq } from 'drizzle-orm';

async function checkSpecificUser() {
  // Truncated version provided in last prompt
  const address1 = '0x351e71ebc0ec030f59426e262bcdc19c1791789';
  // Full version from previous prompts
  const address2 = '0x351e71ebc0ec030f59426e262bcdc19c1791789a';
  
  console.log("--- DB Existence Check ---");

  const match1 = await db.query.users.findFirst({
    where: eq(users.walletAddress, address1)
  });
  console.log(`Checking [${address1}]:`, match1 ? "FOUND" : "NOT FOUND");

  const match2 = await db.query.users.findFirst({
    where: eq(users.walletAddress, address2)
  });
  console.log(`Checking [${address2}]:`, match2 ? "FOUND" : "NOT FOUND");

  if (match2) {
    console.log("\nUser Details for 0x...89a:");
    console.log("- Username:", match2.username);
    console.log("- Alliance Team:", match2.allianceTeamId);
    console.log("- Status:", match2.hasChangedUsername ? "Returning (Set)" : "Returning (Original)");
  }

  process.exit(0);
}

checkSpecificUser();
