import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

function normalizeSslMode(dbUrl) {
  try {
    const parsed = new URL(dbUrl);
    const currentMode = parsed.searchParams.get("sslmode");

    if (["prefer", "require", "verify-ca"].includes(currentMode)) {
      parsed.searchParams.set("sslmode", "verify-full");
    }

    return parsed.toString();
  } catch {
    return dbUrl;
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Add it to your .env file (Neon connection string)."
  );
}

const normalizedConnectionString = normalizeSslMode(connectionString);

// create pool (PostgreSQL connection)
const pool = new Pool({
  connectionString: normalizedConnectionString,
});

// create adapter
const adapter = new PrismaPg(pool);

// create prisma client
const prisma = new PrismaClient({
  adapter,
});

export default prisma;