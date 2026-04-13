import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

// Use public URL for the fix
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}

async function fixSequences() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("Connected to DB to fix sequences.");

  const tables = [
    { table: "seasons", col: "id" },
    { table: "coupon_redemptions", col: "id" },
    { table: "user_quests", col: "id" },
    { table: "push_subscriptions", col: "id" },
    { table: "audit_logs", col: "id" }
  ];

  for (const item of tables) {
    try {
      console.log(`Syncing sequence for ${item.table}...`);
      
      // Standard Postgres way to sync a serial sequence
      const res = await client.query(`
        SELECT setval(
          pg_get_serial_sequence('${item.table}', '${item.col}'),
          COALESCE(MAX(${item.col}), 1)
        ) FROM ${item.table};
      `);
      
      console.log(`Successfully synced ${item.table}. Next ID will be:`, parseInt(res.rows[0].setval) + 1);
    } catch (err: any) {
      console.error(`Failed to sync ${item.table}:`, err.message);
    }
  }

  await client.end();
  console.log("All sequences synced!");
}

fixSequences();
