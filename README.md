# Joonseo Moon — Portfolio

Personal portfolio site built with React + TypeScript (Vite) on the frontend, Supabase (PostgreSQL) as the database, and Supabase Edge Functions for server-side logic.

---

## Stack

| Layer          | Technology                           |
|----------------|--------------------------------------|
| Frontend       | React, TypeScript, Vite, Tailwind v4 |
| Database       | Supabase (PostgreSQL)                |
| Storage        | Supabase Storage                     |
| Edge Functions | Supabase Edge Functions (Deno)       |
| Email          | Resend                               |
| CI             | GitHub Actions (type check + build)  |

---

## Project Structure

```
portfolio/
├── frontend/                  # Vite + React app (port 5173 in dev)
│   └── src/
│       ├── pages/             # One file per route
│       ├── components/        # Navbar
│       ├── lib/
│       │   └── supabase.ts    # Supabase client instance
│       ├── api.ts             # All Supabase query functions + types
│       └── vite-env.d.ts      # Env var type declarations
└── supabase/
    └── functions/
        └── send-contact-email/ # Edge function — calls Resend API
```

---

## Running Locally

```bash
cd frontend && npm run dev
```

Create `frontend/.env.local` with your Supabase credentials (see `frontend/.env.example`).

---

## Environment Variables

| Variable               | Where          | Purpose                    |
|------------------------|----------------|----------------------------|
| `VITE_SUPABASE_URL`    | `.env.local`   | Supabase project URL       |
| `VITE_SUPABASE_ANON_KEY` | `.env.local` | Supabase anon public key   |
| `RESEND_API_KEY`       | Supabase secret | Resend API key (send-only) |
| `CONTACT_EMAIL`        | Supabase secret | Email address to receive contact form submissions |

Set Supabase secrets via CLI:
```bash
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set CONTACT_EMAIL=your_email
```

---

## Edge Functions

### `send-contact-email`

Receives `{ name, email, subject, message }` from the contact form and sends an email via Resend.

Deploy:
```bash
supabase functions deploy send-contact-email
```

> **Note:** The `from` address is `onboarding@resend.dev` until a custom domain is verified in Resend. The `reply_to` is set to the sender's email so replies go directly to them.

---

## Database (Supabase)

All data is managed through the [Supabase Table Editor](https://supabase.com/dashboard) — no SQL needed for day-to-day updates.

### `experiences`

| Column       | Type   | Required | Notes                                |
|--------------|--------|----------|--------------------------------------|
| id           | uuid   | auto     | Primary key                          |
| title        | text   | yes      | Job title                            |
| company_name | text   | yes      |                                      |
| start_date   | date   | yes      | Used to sort (most recent first)     |
| timeframe    | text   | yes      | Display string e.g. "May – Aug 2024" |
| location     | text   | yes      |                                      |
| description  | text[] | no       | Bullet points                        |
| company_url  | text   | no       | Makes the card a clickable link      |

### `portfolio_items`

| Column      | Type    | Required | Notes                          |
|-------------|---------|----------|--------------------------------|
| id          | uuid    | auto     | Primary key                    |
| title       | text    | yes      |                                |
| description | text    | yes      |                                |
| image_url   | text    | yes      | Project screenshot URL         |
| icon_urls   | text[]  | no       | Tech stack icon URLs           |
| featured    | boolean | yes      | Shows in carousel if true      |

### `skills`

| Column   | Type | Required | Notes                                          |
|----------|------|----------|------------------------------------------------|
| id       | uuid | auto     | Primary key                                    |
| title    | text | yes      | e.g. TypeScript                                |
| icon_url | text | yes      | Icon image URL                                 |
| category | text | no       | Groups skills on About page (Languages, etc.)  |

---

## Frontend Pages

| Route         | File                       | Status                          |
|---------------|----------------------------|---------------------------------|
| `/`           | `src/pages/Home.tsx`       | Done                            |
| `/about`      | `src/pages/About.tsx`      | Done                            |
| `/experience` | `src/pages/Experience.tsx` | Done                            |
| `/portfolio`  | `src/pages/Portfolio.tsx`  | Done                            |
| `/contact`    | `src/pages/Contact.tsx`    | Done                            |
| Resume        | —                          | External link (Supabase Storage)|

---

## Design System

Moon theme. All colors applied via inline styles or Tailwind arbitrary values.

| Token           | Value                   | Usage                       |
|-----------------|-------------------------|-----------------------------|
| Deep space bg   | `#03030f`               | Page backgrounds            |
| Lunar white     | `#e8eeff`               | Primary headings            |
| Lunar silver    | `#c8d8ff`               | Accents, active nav, CTAs   |
| Muted starlight | `#6b7fa3`               | Eyebrows, secondary text    |
| Dim             | `#4f607a`               | Tertiary text, separators   |
| Glow            | `rgba(200,216,255,0.x)` | Drop shadows, radial glows  |

Custom keyframes in `frontend/src/index.css`: `twinkle`, `moonFloat`, `fadeSlideUp`, `pulse`.

---

## CI

GitHub Actions runs on every push to `main` and every pull request:
- `tsc --noEmit` — type check
- `vite build` — production build

Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set as GitHub repository secrets.

---

## Future Development Notes

- **Admin UI** — content is managed via the Supabase Table Editor. A protected `/admin` page built with Supabase Auth is a future priority.
- **Custom email domain** — verify a domain in Resend to send contact emails from a personal address instead of `onboarding@resend.dev`.
- **Deployment** — frontend deploys to Vercel/Netlify. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the hosting dashboard. No separate backend to deploy.

---

## TODO

- **Portfolio item links** — add a `project_url` (and optionally `github_url`) column to `portfolio_items`. Update the Portfolio page so each card links out to the live site or GitHub repo. Both URLs should be stored in Supabase and rendered as icon buttons (e.g. globe + GitHub mark) on the card.

- **Experience company logos** — add a `logo_url` column to the `experiences` table. Replace the animated dot on the centre timeline node with a circular company logo image (white background, `rounded-full`, `object-contain`). Falls back to the current dot if no logo is provided. Upload logos to Supabase Storage.

- **Portfolio images** — take a screenshot of each project's frontend UI, upload to a `portfolio-images` Supabase Storage bucket, and paste the public URL as `image_url` when adding the row to `portfolio_items`.
