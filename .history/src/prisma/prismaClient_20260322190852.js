import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Add it to your .env file (Neon connection string)."
  );
}

// create pool (PostgreSQL connection)
const pool = new Pool({
  connectionString,
});

// create adapter
const adapter = new PrismaPg(pool);

// create prisma client
const prisma = new PrismaClient({
  adapter,
});

export default prisma;