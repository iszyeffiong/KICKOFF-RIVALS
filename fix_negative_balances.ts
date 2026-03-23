import { db } from "./app/lib/db";
import { users } from "./app/lib/db/schema";
import { lt } from "drizzle-orm";

async function fixNegativeBalances() {
  console.log("Searching for users with negative balances...");
  
  try {
    const affectedUsers = await db.select().from(users).where(lt(users.coins, 0));
    
    console.log(`Found ${affectedUsers.length} users with negative coins.`);
    
    if (affectedUsers.length > 0) {
      for (const user of affectedUsers) {
        console.log(`Fixing balance for ${user.username} (${user.walletAddress}): ${user.coins} -> 0`);
        await db.update(users)
          .set({ coins: 0 })
          .where(lt(users.coins, 0));
      }
      console.log("All negative balances have been set to zero.");
    } else {
      console.log("No negative balances found.");
    }
  } catch (error) {
    console.error("DB Error:", error);
  }
}

fixNegativeBalances().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
