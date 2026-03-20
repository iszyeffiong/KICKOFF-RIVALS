import { db } from "./app/lib/db";
import { sql } from "drizzle-orm";
import fs from "fs";

async function dumpQuests() {
  try {
    const questsRes = await db.execute(sql`SELECT id, title FROM quests`);
    fs.writeFileSync("db_dump.json", JSON.stringify(questsRes.rows, null, 2));
    console.log("Dump successful!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

dumpQuests();
