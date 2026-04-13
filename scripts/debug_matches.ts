import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = "postgresql://postgres:SDdgXKUnLwyfkfFYmWRWMZAgqibSvMUx@metro.proxy.rlwy.net:19221/railway";

async function debugMatches() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("Checking for active seasons and their matches...");
  
  const seasons = await client.query("SELECT * FROM seasons WHERE is_active = true ORDER BY id DESC");
  console.log(`Found ${seasons.rows.length} active seasons.`);

  for (const s of seasons.rows) {
    const res = await client.query("SELECT count(*) FROM matches WHERE season_id = $1", [s.id]);
    console.log(`Season ${s.id} (Started: ${s.started_at}) has ${res.rows[0].count} matches.`);
    
    if (parseInt(res.rows[0].count) > 0) {
        const statuses = await client.query("SELECT status, count(*) FROM matches WHERE season_id = $1 GROUP BY status", [s.id]);
        console.log(`Match breakdown for season ${s.id}:`, statuses.rows);
    }
  }

  const latestMatches = await client.query("SELECT * FROM matches ORDER BY start_time DESC LIMIT 5");
  console.log("Latest 5 matches found in DB:", latestMatches.rows.map(m => `id:${m.id} season:${m.season_id} status:${m.status}`));

  await client.end();
}

debugMatches();
