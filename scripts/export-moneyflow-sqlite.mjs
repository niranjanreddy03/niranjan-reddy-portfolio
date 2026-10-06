import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const sourcePath = resolve("prisma", "moneyflow.db");
const exportPath = resolve("prisma", "moneyflow-import.db");
if (!existsSync(sourcePath)) throw new Error("Local MoneyFlow database not found at prisma/moneyflow.db.");
if (existsSync(exportPath)) throw new Error("prisma/moneyflow-import.db already exists. Move it to a safe backup location before exporting again.");

const source = new DatabaseSync(sourcePath, { readOnly: true });
try {
  const integrity = source.prepare("PRAGMA integrity_check").get();
  if (integrity.integrity_check !== "ok") throw new Error("The local MoneyFlow database did not pass its integrity check.");
  source.exec(`VACUUM INTO '${exportPath.replaceAll("\\", "/").replaceAll("'", "''")}'`);
} finally {
  source.close();
}

const exported = new DatabaseSync(exportPath);
try {
  exported.exec("PRAGMA journal_mode=WAL;");
  exported.exec("PRAGMA wal_checkpoint(TRUNCATE);");
  const integrity = exported.prepare("PRAGMA integrity_check").get();
  if (integrity.integrity_check !== "ok") throw new Error("The exported MoneyFlow database did not pass its integrity check.");
  console.log(`Ready for Turso import: ${exportPath}`);
} finally {
  exported.close();
}
