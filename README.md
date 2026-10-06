# Niranjan Reddy Portfolio

Personal portfolio for cybersecurity, cloud security, projects, and verified credentials.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Moodify preview

Moodify is available at `http://localhost:3000/moodify`. It runs with a curated local track library, so Apple Music credentials are not needed to try the mood-to-playlist flow. Without a connection, track actions open Apple Music search.

To enable Apple Music account connection, in-app playback, and adding a generated mix to the user's library, create a MusicKit identifier and private key in an Apple Developer Program account. Copy `.env.example` to `.env.local`, set the Team ID and Key ID, then set `APPLE_MUSIC_PRIVATE_KEY_BASE64` to the base64-encoded contents of the `.p8` key. Update `APPLE_MUSIC_ALLOWED_ORIGINS` for the local preview port and deployed domain. Keep `.env.local` out of Git. The server signs short-lived developer tokens; the private key is never sent to the browser. Users authorize their own Apple Music account through MusicKit.

The preview stores recent mixes, favorites, and liked tracks in the browser's local storage. Shared links encode the playlist settings and seed, so the same mix can be regenerated on another device.
# MoneyFlow preview

Open `http://localhost:3032/moneyflow` after `npm run dev -- --port 3032`. MoneyFlow is a private, Google-only workspace. An unsigned visitor is redirected to its sign-in page. The dashboard starts empty and uses only data saved in a local SQLite file. PNB, Bank of Baroda, and Jio Finance are quick account name choices; Blinkit, Zepto, petrol, and misc are quick expense choices. Prime, Netflix, Instagram, WhatsApp, and iCloud are subscription choices. These choices never create sample balances, charges, or transactions. Each subscription needs a tracked account; on or after its renewal date, the next workspace load records one expense and updates that tracked balance. This does not initiate a bank charge. A manual Splitwise section tracks who owes whom and settlements without syncing to a Splitwise account or changing bank balances. The app also supports budgets, planned payments, goals, CSV import/export, analytics, and receipt text extraction.

Set `DATABASE_URL=file:./moneyflow.db`, a random `MONEYFLOW_AUTH_SECRET` of at least 32 characters, `MONEYFLOW_ALLOWED_EMAIL=your-allowed-email@example.com`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in `.env.local`. Run `npm run moneyflow:init`, `npx prisma generate`, and `npm run moneyflow:provision`; restart Next.js. Register `http://localhost:3032/api/moneyflow/auth/google/callback` as a Google OAuth redirect URI for local testing, plus the matching callback URL on the eventual live origin. Google SSO is the only sign-in method. The server accepts only the configured email and an existing backend-provisioned user row; no public registration exists. Financial amounts are stored as integer paise in SQLite. Authentication uses an expiring HttpOnly cookie. A live deployment needs a persistent filesystem for this SQLite file or a hosted database before publishing.

Before public launch, set up production database backups and a security review. Receipt OCR runs in the browser; the selected image is not saved by this app.

For the `moneyflow.niranjanreddy.tech` deployment, see [MONEYFLOW_DEPLOY.md](MONEYFLOW_DEPLOY.md).
