import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const { Pool } = pg;

type DrizzleDb = ReturnType<typeof drizzlePg<typeof schema>> | ReturnType<typeof drizzlePglite<typeof schema>>;

let globalDb: DrizzleDb | null = null;

export function getDatabase(): DrizzleDb {
  if (globalDb) return globalDb;

  const databaseUrl = process.env.DATABASE_URL;

  // If a live PostgreSQL connection URL is provided and not default localhost test
  if (databaseUrl && !databaseUrl.includes("user:password@localhost:5432")) {
    try {
      const pool = new Pool({
        connectionString: databaseUrl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
      globalDb = drizzlePg(pool, { schema });
      return globalDb;
    } catch (e) {
      console.warn("Failed to connect to external PostgreSQL, falling back to embedded PGlite:", e);
    }
  }

  // Fallback to embedded PGlite (genuine WASM PostgreSQL on disk/in-memory)
  const dataDir = path.join(process.cwd(), ".data", "pglite");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const client = new PGlite(dataDir);
  globalDb = drizzlePglite(client, { schema });
  return globalDb;
}

export { schema };
