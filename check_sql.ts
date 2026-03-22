import { db, users } from "./app/lib/db/index";
import { eq } from "drizzle-orm";
import fs from "fs";

async function checkQuery() {
  try {
    const normalized = "0x...".toLowerCase();
    const query = db.query.users.findFirst({
      where: eq(users.walletAddress, normalized),
      with: { quests: true },
    }).toSQL();
    
    fs.writeFileSync('generated_sql.txt', query.sql);
    console.log("SQL DONE, check generated_sql.txt");
    process.exit(0);
  } catch (error) {
    console.error("FAILED TO GENERATE SQL:", error);
    process.exit(1);
  }
}

checkQuery();
