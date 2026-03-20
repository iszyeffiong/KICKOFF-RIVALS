import { db } from "./app/lib/db";
import { sql } from "drizzle-orm";

async function globalSearch() {
  try {
    const tables = ['quests', 'user_quests', 'users', 'matches', 'bets'];
    for (const t of tables) {
      console.log(`Searching table: ${t}...`);
      const r = await db.execute(sql`SELECT * FROM ${sql.identifier(t)}`);
      const rows = JSON.stringify(r.rows);
      if (rows.includes("110") || rows.includes("113")) {
        console.log(`Found in table ${t}!`);
        r.rows.forEach(row => {
          if (JSON.stringify(row).includes("110") || JSON.stringify(row).includes("113")) {
            console.log("Row:", row);
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

globalSearch();
