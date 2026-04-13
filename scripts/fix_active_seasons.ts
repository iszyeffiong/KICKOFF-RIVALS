import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = "postgresql://postgres:SDdgXKUnLwyfkfFYmWRWMZAgqibSvMUx@metro.proxy.rlwy.net:19221/railway";

async function fixActiveSeasons() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("Cleaning up active seasons...");
  
  // Find the latest season ID
  const latestRes = await client.query("SELECT id FROM seasons ORDER BY id DESC LIMIT 1");
  if (latestRes.rows.length === 0) {
    console.log("No seasons found.");
    await client.end();
    return;
  }

  const latestId = latestRes.rows[0].id;
  console.log(`Latest Season ID is ${latestId}. Setting all others to inactive.`);

  const updateRes = await client.query("UPDATE seasons SET is_active = false WHERE id != $1", [latestId]);
  console.log(`Deactivated ${updateRes.rowCount} seasons.`);

  const activateRes = await client.query("UPDATE seasons SET is_active = true WHERE id = $1", [latestId]);
  console.log(`Ensured Season ${latestId} is active.`);

  await client.end();
  console.log("Clean up finished!");
}

fixActiveSeasons();
