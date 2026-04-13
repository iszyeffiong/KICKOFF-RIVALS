import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = "postgresql://postgres:SDdgXKUnLwyfkfFYmWRWMZAgqibSvMUx@metro.proxy.rlwy.net:19221/railway";

async function finalReset() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("Starting FINAL RESET of migration era data...");
  
  // Wipe all seasons/matches >= 90
  await client.query("DELETE FROM matches WHERE season_id >= 90");
  await client.query("DELETE FROM seasons WHERE id >= 90");
  
  // Set all imported seasons (<= 89) to inactive
  await client.query("UPDATE seasons SET is_active = false");
  
  // Reset ID sequence for seasons to 89
  await client.query("SELECT setval(pg_get_serial_sequence('seasons', 'id'), 89)");
  
  console.log("Cleanup complete. Everything is back to the state of the initial export.");
  console.log("The next call to the game engine will start Season 90 fresh with current time.");

  await client.end();
}

finalReset();
