import { db, users } from "./app/lib/db/index";

async function countUsers() {
  const allUsers = await db.select().from(users);
  console.log(`Total users: ${allUsers.length}`);
  if (allUsers.length > 0) {
    console.log(`First user: ${allUsers[0].username}`);
  }
}

countUsers().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
