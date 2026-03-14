import { db, leagues } from "./app/lib/db/index";

async function check() {
  try {
    const allLeagues = await db.select().from(leagues);
    console.log("Leagues count:", allLeagues.length);
    console.log("Leagues:", JSON.stringify(allLeagues, null, 2));
    process.exit(0);
  } catch (e) {
    console.error("Failed to fetch leagues:", e);
    process.exit(1);
  }
}

check();
