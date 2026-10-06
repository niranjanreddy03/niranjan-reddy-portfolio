import nextEnv from "@next/env";
import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url?.startsWith("libsql://") || !authToken) {
  throw new Error("Set TURSO_DATABASE_URL=libsql://... and TURSO_AUTH_TOKEN before initializing the hosted database.");
}

const client = createClient({ url, authToken });
try {
  const existing = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'User'");
  if (existing.rows.length) throw new Error("The hosted database already has a MoneyFlow schema. This setup command only accepts a new, empty database.");

  for (const folder of [
    "20261002_moneyflow_init",
    "20261002_moneyflow_shared_expenses",
    "20261002_moneyflow_subscription_debits",
  ]) {
    const sql = readFileSync(resolve("prisma", "migrations", folder, "migration.sql"), "utf8");
    await client.executeMultiple(sql);
  }
  console.log("MoneyFlow hosted SQLite schema created. Run npm run moneyflow:provision next.");
} finally {
  client.close();
}
