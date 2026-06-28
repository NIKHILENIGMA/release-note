import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Explicitly load .env.local variables for drizzle-kit
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL is not set in environment variables or .env.local file");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgrespassword@localhost:5432/releasecheck",
  },
});
