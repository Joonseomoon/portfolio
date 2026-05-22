# Joonseo Moon — Portfolio

Personal portfolio site built with React + TypeScript (Vite), Supabase (PostgreSQL + Edge Functions), and deployed to Vercel at [joonseomoon.com](https://joonseomoon.com).

---

## Stack

| Layer          | Technology                           |
|----------------|--------------------------------------|
| Frontend       | React, TypeScript, Vite, Tailwind v4 |
| Animation      | Framer Motion                        |
| Database       | Supabase (PostgreSQL)                |
| Storage        | Supabase Storage                     |
| Edge Functions | Supabase Edge Functions (Deno)       |
| Email          | Resend                               |
| Hosting        | Vercel                               |
| CI             | GitHub Actions (type check + build)  |

---

## Project Structure

```
portfolio/
├── vercel.json                # SPA rewrite rule (all routes → index.html)
├── frontend/                  # Vite + React app (port 5173 in dev)
│   └── src/
│       ├── pages/             # One file per route
│       ├── components/
│       │   ├── Navbar.tsx     # Responsive nav with mobile hamburger drawer
│       │   └── ui/            # Shared UI components
│       ├── lib/
│       │   └── supabase.ts    # Supabase client instance
│       ├── api.ts             # All Supabase query functions + types
│       └── index.css          # Global styles, keyframes, utility classes
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

| Variable                 | Where           | Purpose                                           |
|--------------------------|-----------------|---------------------------------------------------|
| `VITE_SUPABASE_URL`      | `.env.local`    | Supabase project URL                              |
| `VITE_SUPABASE_ANON_KEY` | `.env.local`    | Supabase anon public key                          |
| `RESEND_API_KEY`         | Supabase secret | Resend API key (send-only)                        |
| `CONTACT_EMAIL`          | Supabase secret | Email address to receive contact form submissions |

Set Supabase secrets via CLI:
```bash
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set CONTACT_EMAIL=your_email
```

Vercel deployment requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set as environment variables in the Vercel dashboard, and as GitHub repository secrets for CI.

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
| company_url  | text   | no       | Makes the company name a clickable link |

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

| Column   | Type | Required | Notes                                         |
|----------|------|----------|-----------------------------------------------|
| id       | uuid | auto     | Primary key                                   |
| title    | text | yes      | e.g. TypeScript                               |
| icon_url | text | yes      | Icon image URL                                |
| category | text | no       | Groups skills on About page (Languages, etc.) |

---

## Frontend Pages

| Route         | File                       | Description                                      |
|---------------|----------------------------|--------------------------------------------------|
| `/`           | `src/pages/Home.tsx`       | Landing — large serif name, role, CTAs           |
| `/about`      | `src/pages/About.tsx`      | Bio, profile photo, stats, categorised skills    |
| `/experience` | `src/pages/Experience.tsx` | Timeline of work experience from Supabase        |
| `/portfolio`  | `src/pages/Portfolio.tsx`  | Featured carousel + full projects grid           |
| `/contact`    | `src/pages/Contact.tsx`    | Contact card with form → Supabase Edge Function  |
| Resume        | —                          | External link (Supabase Storage PDF)             |

---

## Design System

Warm monochrome editorial theme. Colors applied via inline styles — no CSS custom properties.

| Token   | Value                    | Usage                              |
|---------|--------------------------|------------------------------------|
| bg      | `#F7F5F0`                | Page backgrounds                   |
| text    | `#1C1917`                | Primary headings, body             |
| secondary | `#57534E`              | Body text                          |
| muted   | `#78716C`                | Secondary text, nav links          |
| label   | `#A8A29E`                | Eyebrows, captions, placeholders   |
| border  | `rgba(28,25,23,0.09–0.2)`| Dividers, card borders             |

**Typography:** DM Serif Display (italic headings) + DM Sans (body, UI)

**Animations:** Framer Motion throughout. All timing values use named constants — no magic numbers. Hover transitions scoped to CSS classes in `index.css` (not inline styles) so they don't fire on mount.

**Grain overlay:** Fixed SVG `feTurbulence` layer at `opacity: 0.025`, `mixBlendMode: multiply` — present on every page.

---

## Deployment

Hosted on Vercel. The `frontend/` directory is set as the Vercel root directory.

- Every push to `main` triggers an automatic redeploy
- `frontend/vercel.json` rewrites all routes to `index.html` for client-side routing

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## CI

GitHub Actions runs on every push to `main` and every pull request:
- `tsc --noEmit` — type check
- `vite build` — production build

---

## Profile Photo

Place your photo at `frontend/public/profile.jpg`. The About page displays it at 260×340 px with `object-fit: cover` and `object-position: center top`.

---

## Future Development Notes

- **Portfolio item links** — add `project_url` / `github_url` columns to `portfolio_items` and render as icon buttons on each card.
- **Experience company logos** — add a `logo_url` column to `experiences` and display logos on the timeline.
- **Custom email domain** — verify a domain in Resend to send contact emails from a personal address instead of `onboarding@resend.dev`.
- **Admin UI** — a protected `/admin` page backed by Supabase Auth for managing content without the Supabase dashboard.
