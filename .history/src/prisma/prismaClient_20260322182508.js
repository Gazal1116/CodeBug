import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

// create pool (PostgreSQL connection)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// create adapter
const adapter = new PrismaPg(pool);

// create prisma client
const prisma = new PrismaClient({
  adapter,
});

export default prisma;