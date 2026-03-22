import { db } from "./app/lib/db/index";
import { sql } from "drizzle-orm";

async function checkIndex() {
  try {
    const res = await db.execute(sql`SELECT indexname FROM pg_indexes WHERE tablename = 'user_quests';`);
    console.log(JSON.stringify(res.rows));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkIndex();
