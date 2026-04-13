import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import fs from "fs";
import path from "path";

const TARGET_URL = process.env.DATABASE_URL || "postgresql://postgres:SDdgXKUnLwyfkfFYmWRWMZAgqibSvMUx@postgres.railway.internal:5432/railway";

async function importData() {
  const client = new pg.Client({ connectionString: TARGET_URL });
  try {
    await client.connect();
    console.log("Connected to Target DB.");
  } catch (err) {
    console.error("Could not reach Target DB from this environment. (Check if the internal URL works for you)");
    process.exit(1);
  }

  const tables = [
    "leagues", "teams", "seasons", "users", "matches", "bets", 
    "transactions", "coupons", "coupon_redemptions", "user_quests", 
    "push_subscriptions", "audit_logs", "quests"
  ];

  const backupDir = "db_backup";
  if (!fs.existsSync(backupDir)) {
    console.error("Backup folder ./db_backup not found. Run export first!");
    process.exit(1);
  }

  // Deactivate foreign key checks for the session
  await client.query("SET session_replication_role = 'replica';");

  for (const table of tables) {
    try {
      const dataFile = table === "matches" 
        ? path.join(backupDir, "matches_clean.json") 
        : path.join(backupDir, `${table}.json`);
      if (!fs.existsSync(dataFile)) continue;

      const rows = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      if (rows.length === 0) continue;

      console.log(`Importing ${rows.length} rows into ${table}...`);
      
      // Batch insert logic
      const columns = Object.keys(rows[0]);
      const columnNames = columns.join(", ");
      
      for (let i = 0; i < rows.length; i += 100) {
        const batch = rows.slice(i, i + 100);
        const values = batch.map((row: any) => 
          `(${columns.map(col => {
            const val = row[col];
            if (val === null) return "NULL";
            if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
            if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
            return val;
          }).join(", ")})`
        ).join(", ");

        await client.query(`INSERT INTO ${table} (${columnNames}) VALUES ${values} ON CONFLICT DO NOTHING;`);
      }
      console.log(`Successfully imported ${table}.`);
    } catch (err) {
      console.error(`Failed to import ${table}:`, err.message);
    }
  }

  await client.query("SET session_replication_role = 'origin';");
  await client.end();
  console.log("Migration complete!");
}

importData();
