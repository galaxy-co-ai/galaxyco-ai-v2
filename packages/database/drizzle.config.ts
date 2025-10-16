import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from root
dotenv.config({ path: resolve(__dirname, "../../.env.local") });

export default {
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
