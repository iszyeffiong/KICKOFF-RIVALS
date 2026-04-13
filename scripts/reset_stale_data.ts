import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = "postgresql://postgres:SDdgXKUnLwyfkfFYmWRWMZAgqibSvMUx@metro.proxy.rlwy.net:19221/railway";

async function reset() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("Cleaning up all seasons and matches created during the migration era...");
  
  // Deactivate all existing seasons
  await client.query("UPDATE seasons SET is_active = false");
  
  // Delete all matches that are SCHEDULED but in the past (they are invalid)
  const now = new Date();
  const res = await client.query("DELETE FROM matches WHERE status = 'SCHEDULED' AND start_time < $1", [now]);
  console.log(`Deleted ${res.rowCount} invalid scheduled matches from the past.`);

  await client.end();
  console.log("Reset complete. The game engine will now create a fresh season with current timestamps.");
}

reset();
