import { db, quests } from "./app/lib/db";
import { eq } from "drizzle-orm";

async function checkLCR() {
  const q = await db.query.quests.findFirst({
    where: eq(quests.id, "q-lcr-post")
  });
  console.log("FLAGS:", q.requiresVerification, q.verificationType, q.status);
  process.exit(0);
}

checkLCR().catch(err => { console.error(err); process.exit(1); });
