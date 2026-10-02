import nextEnv from "@next/env";
import { DatabaseSync } from "node:sqlite";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

nextEnv.loadEnvConfig(process.cwd());

if (process.env.DATABASE_URL !== "file:./moneyflow.db") {
  throw new Error("This initializer expects DATABASE_URL=file:./moneyflow.db in .env.local.");
}

const databasePath = resolve("prisma", "moneyflow.db");
const migrationPath = resolve("prisma", "migrations", "20261002_moneyflow_init", "migration.sql");
const sharedExpensesMigrationPath = resolve("prisma", "migrations", "20261002_moneyflow_shared_expenses", "migration.sql");
const isNewDatabase = !existsSync(databasePath);
const database = new DatabaseSync(databasePath);
try {
  database.exec("PRAGMA foreign_keys = ON;");
  if (isNewDatabase) database.exec(readFileSync(migrationPath, "utf8"));
  database.exec(readFileSync(sharedExpensesMigrationPath, "utf8"));
  const subscriptionColumns = new Set(database.prepare('PRAGMA table_info("Subscription")').all().map((column) => column.name));
  const recurringColumns = new Set(database.prepare('PRAGMA table_info("RecurringTransaction")').all().map((column) => column.name));
  if (!subscriptionColumns.has("accountId")) database.exec('ALTER TABLE "Subscription" ADD COLUMN "accountId" TEXT;');
  if (!subscriptionColumns.has("nextDueAt")) database.exec('ALTER TABLE "Subscription" ADD COLUMN "nextDueAt" DATETIME;');
  if (!recurringColumns.has("subscriptionId")) database.exec('ALTER TABLE "RecurringTransaction" ADD COLUMN "subscriptionId" TEXT;');
  console.log(isNewDatabase ? "MoneyFlow SQLite database created at prisma/moneyflow.db." : "MoneyFlow SQLite schema updated; existing data preserved.");
} finally {
  database.close();
}
