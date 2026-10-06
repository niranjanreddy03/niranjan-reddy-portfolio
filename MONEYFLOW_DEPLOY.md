# MoneyFlow production setup

Target: `https://moneyflow.niranjanreddy.tech` on the existing AWS Amplify Next.js app, with Cloudflare DNS and a hosted SQLite database.

## 1. Move the local data to hosted SQLite

The local `prisma/moneyflow.db` already contains your MoneyFlow account and entries. Preserve it when going live.

1. Stop the local MoneyFlow server so no new entries arrive during export.
2. In this repository, run `npm run moneyflow:export-hosted`. It creates an ignored, consistent snapshot at `prisma/moneyflow-import.db` and prepares it for Turso's SQLite import.
3. Install and sign in to the [Turso Cloud CLI](https://docs.turso.tech/cli/installation), then run `turso db import prisma/moneyflow-import.db`. The imported database name is `moneyflow-import` unless you rename the snapshot before import.
4. Get the database URL with `turso db show moneyflow-import --url` and create a database token with `turso db tokens create moneyflow-import`. Keep the token private. The database URL should begin with `libsql://`.
5. Confirm the imported database contains the existing `User`, `Account`, `Transaction`, and `Subscription` tables. Keep `prisma/moneyflow.db` as a local backup. Delete `prisma/moneyflow-import.db` securely after you have checked the hosted copy.

For a **new, empty** hosted database instead, set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in the command's environment, then run `npm run moneyflow:setup-hosted` followed by `npm run moneyflow:provision`. Do not run the schema setup command on an imported database. The app requires an existing provisioned user and does not offer public registration.

## 2. Add production settings in AWS Amplify

In the existing Amplify app's **Hosting → Environment variables**, add these server variables to the production branch:

| Variable | Value |
| --- | --- |
| `TURSO_DATABASE_URL` | The imported database's `libsql://` URL |
| `TURSO_AUTH_TOKEN` | The token created for that database |
| `MONEYFLOW_AUTH_SECRET` | A new random value of at least 32 characters |
| `MONEYFLOW_ALLOWED_EMAIL` | Your sole authorized Google account email |
| `MONEYFLOW_PUBLIC_ORIGIN` | `https://moneyflow.niranjanreddy.tech` |
| `GOOGLE_CLIENT_ID` | The `client_id` in the supplied production OAuth JSON |
| `GOOGLE_CLIENT_SECRET` | The `client_secret` in that JSON |
| `DATABASE_URL` | `file:./moneyflow.db` for Prisma's build-time schema; runtime uses Turso |

Use the production OAuth JSON you supplied. Keep that file and its secret outside Git. It is configured for the exact callback `https://moneyflow.niranjanreddy.tech/api/moneyflow/auth/google/callback`. Leave `.env.local` with the local test client so localhost sign-in keeps working.

In the Amplify build settings, place `npm run amplify:prepare-env` **after** `npm ci` and **before** `npm run build`. Keep the existing output directory `.next`. For example, the build commands are:

```text
npm ci
npm run amplify:prepare-env
npm run build
```

Amplify makes console variables available during builds, while Next.js SSR needs them in its runtime environment file. The prepare command writes only this app's selected server values to ignored `.env.production` without logging their values. AWS warns that people with access to deployment artifacts may read secrets in this file; restrict artifact access to trusted AWS administrators. Review the existing Amplify build settings before changing them, especially if the portfolio already has other build commands.

## 3. Connect only the MoneyFlow subdomain

In the existing Amplify app, go to **Hosting → Custom domains**. For `niranjanreddy.tech`, open **Domain configuration → Subdomains → Add new**, enter `moneyflow`, and map it to the production branch. If that domain has not been associated with this Amplify app yet, use **Add domain**, choose **Manual configuration**, and configure only the `moneyflow` subdomain. Copy the DNS values shown by Amplify; do not guess its CloudFront target.

In Cloudflare **DNS → Records**, create:

1. A `CNAME` with name `moneyflow`, target equal to the Amplify subdomain target, and **DNS only** status initially.
2. The `CNAME` certificate validation record with the exact name and target shown by Amplify. Keep this record **DNS only** permanently.

Wait until Amplify marks the domain available and HTTPS works. Then, if you want Cloudflare proxying, use Cloudflare **SSL/TLS → Full (Strict)** and turn proxying on only for the `moneyflow` record. The certificate validation record stays DNS only. Do not alter the existing apex or `www` records.

## 4. Verify live sign-in

Open `https://moneyflow.niranjanreddy.tech`. It should show the MoneyFlow sign-in page. Continue with Google using only the authorized account; confirm that the dashboard opens and the existing local entries appear. Check a subscription and account balance. The selected production OAuth client must keep the exact redirect URI above. If login fails, check the Amplify SSR logs, production environment variables, and callback URI without sharing secret values.

References: [Turso SQLite import](https://docs.turso.tech/cli/db/import), [Prisma with Turso](https://www.prisma.io/docs/orm/v6/overview/databases/turso), [Amplify subdomains](https://docs.aws.amazon.com/amplify/latest/userguide/to-manage-subdomains.html), [Amplify with Cloudflare DNS](https://docs.aws.amazon.com/amplify/latest/userguide/to-add-a-custom-domain-managed-by-cloudflare.html), [Amplify SSR variables](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html).
