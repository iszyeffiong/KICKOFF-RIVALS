import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = "postgresql://postgres:SDdgXKUnLwyfkfFYmWRWMZAgqibSvMUx@metro.proxy.rlwy.net:19221/railway";

async function debug() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();

  const res = await client.query("SELECT * FROM matches WHERE season_id = 92 ORDER BY start_time ASC LIMIT 10");
  console.log("Season 92 Match Sample:");
  res.rows.forEach(m => {
    console.log(`ID: ${m.id}, Status: ${m.status}, Start: ${m.start_time}`);
  });

  const now = new Date();
  console.log("Current Server Time:", now.toISOString());

  const bettingMatches = await client.query("SELECT count(*) FROM matches WHERE status = 'SCHEDULED' AND start_time > $1", [now]);
  console.log(`Matches eligible for betting (SCHEDULED and in future): ${bettingMatches.rows[0].count}`);

  await client.end();
}

debug();
