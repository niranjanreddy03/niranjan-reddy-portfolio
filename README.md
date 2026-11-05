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

## Contact form

The contact page submits messages to the app's `/api/contact` endpoint and saves them in SQLite/Turso. View them at `https://niranjanreddy.tech/requests` after signing in through Supabase Auth. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_COOKIE_DOMAIN=.niranjanreddy.tech` in the production hosting environment. Enable Google in the Supabase project's Auth providers, set Google's Supabase callback URL in Google Cloud, and add `https://niranjanreddy.tech/auth/callback` and `https://moneyflow.niranjanreddy.tech/auth/callback` to Supabase's allowed redirect URLs. For local use, also allow `http://localhost:3000/auth/callback` and `http://localhost:3032/auth/callback`. Both the private inbox and MoneyFlow accept only `indukuriniranjanreddy@gmail.com`; MoneyFlow also requires an existing provisioned workspace user. Both private areas share one Supabase session. The requests table is created automatically on first use. The portfolio server also needs the hosted database settings (`TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`) so requests persist across deployments.

## Moodify preview

Moodify is available at `http://localhost:3000/moodify`. It runs with a curated local track library, so Apple Music credentials are not needed to try the mood-to-playlist flow. Without a connection, track actions open Apple Music search.

To enable Apple Music account connection, in-app playback, and adding a generated mix to the user's library, create a MusicKit identifier and private key in an Apple Developer Program account. Copy `.env.example` to `.env.local`, set the Team ID and Key ID, then set `APPLE_MUSIC_PRIVATE_KEY_BASE64` to the base64-encoded contents of the `.p8` key. Update `APPLE_MUSIC_ALLOWED_ORIGINS` for the local preview port and deployed domain. Keep `.env.local` out of Git. The server signs short-lived developer tokens; the private key is never sent to the browser. Users authorize their own Apple Music account through MusicKit.

The preview stores recent mixes, favorites, and liked tracks in the browser's local storage. Shared links encode the playlist settings and seed, so the same mix can be regenerated on another device.
# MoneyFlow preview

Open `http://localhost:3032/moneyflow` after `npm run dev -- --port 3032`. MoneyFlow is a private workspace that uses the same Supabase Auth session as the portfolio inbox. An unsigned visitor is redirected to its sign-in page. The dashboard starts empty and uses only data saved in a local SQLite file. PNB, Bank of Baroda, and Jio Finance are quick account name choices; Blinkit, Zepto, petrol, and misc are quick expense choices. Prime, Netflix, Instagram, WhatsApp, and iCloud are subscription choices. These choices never create sample balances, charges, or transactions. Each subscription needs a tracked account; on or after its renewal date, the next workspace load records one expense and updates that tracked balance. This does not initiate a bank charge. A manual Splitwise section tracks who owes whom and settlements without syncing to a Splitwise account or changing bank balances. The app also supports budgets, planned payments, goals, CSV import/export, analytics, and receipt text extraction.

Set `DATABASE_URL=file:./moneyflow.db`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Only `indukuriniranjanreddy@gmail.com` is authorized for MoneyFlow sign-in. Run `npm run moneyflow:init`, `npx prisma generate`, and `npm run moneyflow:provision`; restart Next.js. Enable Google in Supabase Auth and add `http://localhost:3032/auth/callback` to the project's allowed redirect URLs. The server accepts only `indukuriniranjanreddy@gmail.com` and an existing backend-provisioned user row; no public registration exists. Financial amounts are stored as integer paise in SQLite. Supabase sessions use HttpOnly cookies. A live deployment needs a persistent filesystem for this SQLite file or a hosted database before publishing.

Before public launch, set up production database backups and a security review. Receipt OCR runs in the browser; the selected image is not saved by this app.

For the `moneyflow.niranjanreddy.tech` deployment, see [MONEYFLOW_DEPLOY.md](MONEYFLOW_DEPLOY.md).
