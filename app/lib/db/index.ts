import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import pg from "pg";
import * as schema from "./schema";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Determine if we're using Neon (serverless) or standard PostgreSQL
const isNeonDatabase = (url: string): boolean => {
  return url.includes("neon.tech") || url.includes("neon-");
};

// Get the database URL from environment variables
const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not defined. Please set it in your .env file.\n" +
        "For Railway: DATABASE_URL=postgresql://postgres:password@host:port/railway\n" +
        "For Neon: DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require",
    );
  }
  return url;
};

// Create the appropriate Drizzle client based on DATABASE_URL
const createDatabaseClient = () => {
  const databaseUrl = getDatabaseUrl();

  if (isNeonDatabase(databaseUrl)) {
    // Use Neon HTTP driver for serverless environments
    console.log("🌐 Using Neon serverless database driver");
    const sql = neon(databaseUrl);
    return drizzleNeon(sql, { schema });
  } else {
    // Use node-postgres for Railway / standard PostgreSQL
    // Rate-limiting via pool config: small pool to prevent query bursts
    console.log("🚂 Using Railway PostgreSQL database driver (rate-limited pool)");
    const pool = new pg.Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }, // Required for Railway external proxy
      // --- Rate-limiting / connection control ---
      max: 5,                     // Max simultaneous DB connections (default is 10; lower = fewer concurrent queries)
      min: 1,                     // Keep 1 idle connection alive to avoid cold start overhead
      idleTimeoutMillis: 30000,   // Release idle connections after 30s to free server resources
      connectionTimeoutMillis: 5000, // Wait max 5s for a free connection before erroring
      // query_timeout handled per-query via drizzle; pool itself controls concurrency
    });

    // Attach error handler so the process doesn't crash on idle connection drops
    pool.on("error", (err) => {
      console.error("⚠️  Unexpected DB pool error (connection dropped):", err.message);
    });

    return drizzleNode(pool, { schema });
  }
};

// Lazy-initialize the database client to avoid crashing at module import
// when DATABASE_URL is not yet available (e.g. during SSR build or client bundle)
let _db: ReturnType<typeof createDatabaseClient> | null = null;

export const db = new Proxy({} as ReturnType<typeof createDatabaseClient>, {
  get(_target, prop, receiver) {
    if (!_db) {
      _db = createDatabaseClient();
    }
    const value = Reflect.get(_db, prop, receiver);
    if (typeof value === "function") {
      return value.bind(_db);
    }
    return value;
  },
});

// Re-export schema for convenience
export * from "./schema";

// Export the db type for use in other files
export type Database = ReturnType<typeof createDatabaseClient>;

// Helper to check connection health (useful for debugging)
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const result = await db.query.leagues.findFirst();
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
};
