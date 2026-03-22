import { db, users, userQuests, transactions } from "./app/lib/db/index";
import { eq, and, sql } from "drizzle-orm";

async function verifyUpdate() {
  const walletAddress = "0x238edb31e379b7513a36bae5780ccafb757f4a431"; // Full address I found
  
  console.log(`\n--- Verifying Row Counts ---`);
  
  const res = await db.update(users)
    .set({ coins: sql`${users.coins} + 0` })
    .where(eq(users.walletAddress, walletAddress.toLowerCase()));
    
  console.log("Update result:", JSON.stringify(res));
  
  process.exit(0);
}

verifyUpdate();
