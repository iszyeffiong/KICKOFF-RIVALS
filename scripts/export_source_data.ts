import { pgTable, text, varchar, integer, timestamp, boolean, real, json, serial } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import fs from "fs";
import path from "path";

const SOURCE_URL = "postgresql://postgres:klgpgJguYwvVdHuHARMzUXytrMhArCfb@tramway.proxy.rlwy.net:16472/railway";

async function exportData() {
  const client = new pg.Client({ connectionString: SOURCE_URL });
  await client.connect();
  console.log("Connected to Source DB.");

  const tables = [
    "leagues", "teams", "seasons", "users", "matches", "bets", 
    "transactions", "coupons", "coupon_redemptions", "user_quests", 
    "push_subscriptions", "audit_logs", "quests"
  ];

  const exportDir = "db_backup";
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

  for (const table of tables) {
    try {
      console.log(`Exporting ${table}...`);
      const res = await client.query(`SELECT * FROM ${table}`);
      fs.writeFileSync(path.join(exportDir, `${table}.json`), JSON.stringify(res.rows, null, 2));
      console.log(`Exported ${res.rowCount} rows from ${table}.`);
    } catch (err) {
      console.error(`Failed to export ${table}:`, err.message);
    }
  }

  await client.end();
  console.log("Export complete! Files saved in ./db_backup");
}

exportData();
