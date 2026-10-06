import { appendFileSync } from "node:fs";

// Amplify exposes console variables to builds but not automatically to Next.js SSR.
// Only copy the server-side values this application needs. Never print them.
const names = [
  "DATABASE_URL",
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "MONEYFLOW_AUTH_SECRET",
  "MONEYFLOW_ALLOWED_EMAIL",
  "MONEYFLOW_PUBLIC_ORIGIN",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "APPLE_MUSIC_TEAM_ID",
  "APPLE_MUSIC_KEY_ID",
  "APPLE_MUSIC_PRIVATE_KEY_BASE64",
  "APPLE_MUSIC_ALLOWED_ORIGINS",
];

const lines = names.flatMap((name) => process.env[name] ? [`${name}=${JSON.stringify(process.env[name])}`] : []);
if (lines.length) appendFileSync(".env.production", `\n${lines.join("\n")}\n`, { mode: 0o600 });
console.log(`Prepared ${lines.length} server environment variables for the Amplify Next.js build.`);
