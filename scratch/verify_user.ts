import { db, users } from './app/lib/db';
import { eq, ilike } from 'drizzle-orm';

async function checkSpecificUser() {
  const address1 = '0x351e71ebc0ec030f59426e262bcdc19c1791789';
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
    console.log("- Created At:", match2.createdAt);
    console.log("- Alliance Team:", match2.allianceTeamId);
  }

  process.exit(0);
}

checkSpecificUser();
