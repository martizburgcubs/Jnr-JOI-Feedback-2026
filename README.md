# Junior JOI 2026 Tournament Feedback

A mobile-friendly tournament survey with a protected organiser dashboard, live summaries, CSV export and print-to-PDF reporting.

This repository is configured for:

- GitHub source control
- Cloudflare Workers hosting
- An existing Supabase project for response storage

The survey design and questions are complete. Supabase only needs one isolated table named `joi_feedback`; it will not modify the other projects or tables already in your account.

## 1. Add the table to an existing Supabase project

1. Sign in to Supabase and open the project you want to reuse.
2. Open **SQL Editor** and select **New query**.
3. Open `supabase/joi_feedback_setup.sql` from this repository.
4. Copy the complete SQL script into the editor and select **Run**.
5. Confirm that `joi_feedback` appears under **Table Editor**.

The script enables Row Level Security. Anonymous visitors may submit responses, but they cannot read, edit or delete any responses. The protected dashboard reads through a server-only secret key.

## 2. Collect the Supabase connection values

Open the project's **Connect** dialog or **Project Settings → API Keys** and copy:

- Project URL
- Publishable key (`sb_publishable_...`)
- Secret key (`sb_secret_...`)

Existing projects that only show the older `anon` and `service_role` keys are also supported. Never put the secret or service-role key in GitHub.

## 3. Push the code to GitHub

Create a new private GitHub repository called `junior-joi-2026-feedback`. Do not add a README or `.gitignore` on GitHub because they are already included here.

From the extracted project folder, run:

```bash
git init
git add .
git commit -m "Initial Junior JOI feedback survey"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/junior-joi-2026-feedback.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## 4. Connect GitHub to Cloudflare Workers

1. Sign in to Cloudflare.
2. Open **Workers & Pages**.
3. Select **Create application**, then import an existing Git repository.
4. Connect GitHub and choose `junior-joi-2026-feedback`.
5. Use `main` as the production branch.
6. Use these build settings:

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Build command | `npm run build` |
| Deploy command | `npm run deploy:cloudflare` |

Cloudflare will deploy the full Worker application, including the form, API routes and protected dashboard.

## 5. Add the Cloudflare environment values

In the deployed Worker, open **Settings → Variables and Secrets** and add:

| Name | Type | Value |
| --- | --- | --- |
| `SUPABASE_URL` | Variable | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Variable | Your publishable key |
| `SUPABASE_SECRET_KEY` | Secret | Your Supabase secret key |
| `ADMIN_PASSCODE` | Secret | A private passcode for the organiser dashboard |
| `ADMIN_SESSION_SECRET` | Secret | A long random value of at least 32 characters |

For an older Supabase project, use `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` instead of the two newer key names.

After adding the values, redeploy the latest Git commit from **Deployments**.

## 6. Test before sharing

1. Open the Cloudflare `workers.dev` address.
2. Submit one test response.
3. Open `/admin` and sign in with `ADMIN_PASSCODE`.
4. Confirm that the test response appears.
5. Test **Export CSV** and **Save PDF**.
6. Delete the test row from the Supabase Table Editor.

The free address will look similar to:

`https://junior-joi-2026-feedback.YOUR-SUBDOMAIN.workers.dev`

It will not contain ChatGPT branding.

## 7. Optional custom domain

In the Worker, open **Settings → Domains & Routes → Add → Custom domain** and use an address such as:

`feedback.yourdomain.co.za`

If the domain already uses Cloudflare DNS, Cloudflare will create the required DNS record and certificate.

## Security notes

- Never commit `.env`, Supabase secret keys or the organiser passcode.
- Only the public Supabase key is used for submissions.
- Only the server-side dashboard route receives the Supabase secret key.
- The dashboard passcode is stored as an encrypted Cloudflare secret.
