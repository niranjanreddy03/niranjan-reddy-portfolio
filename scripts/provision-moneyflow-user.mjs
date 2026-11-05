import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const ownerEmail = "indukuriniranjanreddy@gmail.com";
const configuredEmail = process.env.MONEYFLOW_ALLOWED_EMAIL?.trim().toLowerCase();
const email = ownerEmail;
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if ((!process.env.DATABASE_URL && !(tursoUrl && tursoToken)) || Boolean(tursoUrl) !== Boolean(tursoToken) || configuredEmail && configuredEmail !== ownerEmail) {
  throw new Error(`Set a local DATABASE_URL or both Turso credentials. MONEYFLOW_ALLOWED_EMAIL, if set, must be ${ownerEmail}.`);
}

const { PrismaClient } = await import("@prisma/client");
const db = tursoUrl && tursoToken
  ? new PrismaClient({ adapter: new (await import("@prisma/adapter-libsql")).PrismaLibSQL({ url: tursoUrl, authToken: tursoToken }) })
  : new PrismaClient();
try {
  await db.user.upsert({ where: { email }, create: { email }, update: {} });
  console.log(`MoneyFlow account provisioned for ${email}. Google sign-in can now use it.`);
} finally {
  await db.$disconnect();
}
