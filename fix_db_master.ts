import { db, quests } from "./app/lib/db";

async function populateMaster() {
  const socialQuests = [
    {
      id: "q-follow-x",
      title: "Follow @kickoffrivals",
      reward: 2000,
      type: "social",
      category: "social",
      frequency: "daily",
      target: 1,
      status: "LIVE",
      requiresVerification: true,
      verificationPlaceholder: "@username",
      verificationType: "username",
      externalUrl: "https://x.com/KICKOFFRIVALS",
    },
    {
      id: "q-lcr-post",
      title: "Like, Comment & Retweet Post",
      reward: 2000,
      type: "social",
      category: "social",
      frequency: "daily",
      target: 1,
      status: "LIVE",
      requiresVerification: true,
      verificationPlaceholder: "Paste your comment url",
      verificationType: "link",
      externalUrl: "https://x.com/i/status/2034928785825431674",
    }
  ];

  for (const q of socialQuests) {
    console.log(`Pushing ${q.id} to DB master...`);
    await db.insert(quests).values(q).onConflictDoUpdate({
      target: [quests.id],
      set: q
    });
  }

  console.log("Master Quest Table Synced!");
  process.exit(0);
}

populateMaster().catch(err => { console.error(err); process.exit(1); });
