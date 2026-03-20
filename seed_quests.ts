import { db } from "./app/lib/db";
import { sql } from "drizzle-orm";

const ALL_QUESTS = [
  { id: "dq_play5", title: "Play 5 games", reward: 1000, type: "play", frequency: "daily", target: 5, completed: false, status: "LIVE" },
  { id: "dq_win10", title: "Win 10 games", reward: 10000, type: "win", frequency: "daily", target: 10, completed: false, status: "LIVE" },
  { id: "dq_win15", title: "Win 15 games", reward: 12000, type: "win", frequency: "daily", target: 15, completed: false, status: "LIVE" },
  { id: "wq_play30", title: "Play 30 games", reward: 10000, type: "play", frequency: "weekly", target: 30, completed: false, status: "LIVE" },
  { id: "wq_win30", title: "Win 30 games", reward: 15000, type: "win", frequency: "weekly", target: 30, completed: false, status: "LIVE" },
  { id: "wq_win10acc", title: "Win 10 Accumulated games", reward: 25000, type: "win", frequency: "weekly", target: 10, completed: false, status: "LIVE" },
];

async function seedQuests() {
  console.log("Starting to seed quests...");

  try {
    // 1. Create table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS quests (
        "id" varchar(50) PRIMARY KEY,
        "title" varchar(255) NOT NULL,
        "reward" integer NOT NULL,
        "type" varchar(20) NOT NULL,
        "frequency" varchar(20) NOT NULL,
        "target" integer NOT NULL,
        "external_url" text,
        "status" varchar(20) DEFAULT 'LIVE' NOT NULL,
        "category" varchar(50),
        "requires_verification" boolean DEFAULT false,
        "verification_placeholder" varchar(255),
        "verification_type" varchar(50),
        "verification_time" integer,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Add columns if they missed the previous run (for safety)
    try { await db.execute(sql`ALTER TABLE quests ADD COLUMN category varchar(50)`); } catch (e) { }
    try { await db.execute(sql`ALTER TABLE quests ADD COLUMN requires_verification boolean DEFAULT false`); } catch (e) { }
    try { await db.execute(sql`ALTER TABLE quests ADD COLUMN verification_placeholder varchar(255)`); } catch (e) { }
    try { await db.execute(sql`ALTER TABLE quests ADD COLUMN verification_type varchar(50)`); } catch (e) { }
    try { await db.execute(sql`ALTER TABLE quests ADD COLUMN verification_time integer`); } catch (e) { }

    console.log("Quests table ready. Inserting quests...");

    for (const q of ALL_QUESTS) {
      const quest = q as any;
      console.log(`Inserting quest: ${quest.id} - ${quest.title}`);

      const query = sql`
        INSERT INTO quests (id, title, reward, type, frequency, target, external_url, status, category, requires_verification, verification_placeholder, verification_type)
        VALUES (${quest.id}, ${quest.title}, ${quest.reward}, ${quest.type}, ${quest.frequency}, ${quest.target}, ${quest.externalUrl || null}, ${quest.status || 'LIVE'}, ${quest.category || null}, ${quest.requiresVerification || false}, ${quest.verificationPlaceholder || null}, ${quest.verificationType || null})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          reward = EXCLUDED.reward,
          type = EXCLUDED.type,
          frequency = EXCLUDED.frequency,
          target = EXCLUDED.target,
          external_url = EXCLUDED.external_url,
          status = EXCLUDED.status,
          category = EXCLUDED.category,
          requires_verification = EXCLUDED.requires_verification,
          verification_placeholder = EXCLUDED.verification_placeholder,
          verification_type = EXCLUDED.verification_type;
      `;

      await db.execute(query);
    }
    console.log("Quests seeded successfully!");
  } catch (error) {
    console.error("Error seeding quests:", error);
  } finally {
    process.exit(0);
  }
}

seedQuests();
