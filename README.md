# Joonseo Moon — Portfolio

Personal portfolio site built with React + TypeScript (Vite) on the frontend and Supabase (PostgreSQL) as the database.

---

## Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React, TypeScript, Vite, Tailwind v4 |
| Database  | Supabase (PostgreSQL)                |
| Storage   | Supabase Storage                     |

---

## Project Structure

```
portfolio/
└── frontend/          # Vite + React app (port 5173 in dev)
    └── src/
        ├── pages/     # One file per route
        ├── components/
        ├── lib/
        │   └── supabase.ts  # Supabase client instance
        └── api.ts           # All Supabase query functions
```

---

## Running Locally

```bash
cd frontend && npm run dev
```

Create `frontend/.env.local` with your Supabase credentials (see `.env.example`).

---

## Database (Supabase)

All data is managed through the [Supabase Table Editor](https://supabase.com/dashboard) — no SQL or curl needed for day-to-day updates.

### `experiences`

| Column       | Type     | Required | Notes                              |
|--------------|----------|----------|------------------------------------|
| id           | uuid     | auto     | Primary key                        |
| title        | text     | yes      | Job title                          |
| company_name | text     | yes      |                                    |
| start_date   | date     | yes      | Used to sort (most recent first)   |
| timeframe    | text     | yes      | Display string e.g. "May – Aug 2024" |
| location     | text     | yes      |                                    |
| description  | text[]   | no       | Bullet points                      |
| company_url  | text     | no       | Makes the card a clickable link    |

### `portfolio_items`

| Column      | Type   | Required | Notes                    |
|-------------|--------|----------|--------------------------|
| id          | uuid   | auto     | Primary key              |
| title       | text   | yes      |                          |
| description | text   | yes      |                          |
| image_url   | text   | yes      | Project screenshot URL   |
| icon_urls   | text[] | no       | Tech stack icon URLs     |

### `skills`

| Column   | Type | Required | Notes           |
|----------|------|----------|-----------------|
| id       | uuid | auto     | Primary key     |
| title    | text | yes      | e.g. TypeScript |
| icon_url | text | yes      | Icon image URL  |

---

## Frontend Pages

| Route        | File                      | Status      |
|--------------|---------------------------|-------------|
| `/`          | `src/pages/Home.tsx`      | Done        |
| `/experience`| `src/pages/Experience.tsx`| Done        |
| `/about`     | `src/pages/About.tsx`     | Stub        |
| `/portfolio` | —                         | Not started |
| `/resume`    | —                         | External link (Supabase Storage) |
| `/contact`   | —                         | Not started |

---

## Design System

Moon theme. All colors are applied via inline styles or Tailwind arbitrary values.

| Token           | Value                  | Usage                        |
|-----------------|------------------------|------------------------------|
| Deep space bg   | `#03030f`              | Page backgrounds             |
| Lunar white     | `#e8eeff`              | Primary headings             |
| Lunar silver    | `#c8d8ff`              | Accents, active nav, CTAs    |
| Muted starlight | `#6b7fa3`              | Eyebrows, secondary text     |
| Dim             | `#4f607a`              | Tertiary text, separators    |
| Glow            | `rgba(200,216,255,0.x)`| Drop shadows, radial glows   |

Custom keyframes in `frontend/src/index.css`: `twinkle`, `moonFloat`, `fadeSlideUp`.

---

## Future Development Notes

- **Admin UI** — no admin page exists yet. Content is managed directly via the Supabase Table Editor. A custom admin UI is a future priority.
- **Authentication** — if an admin UI is built, protect it with Supabase Auth.
- **Skills page** — table exists in Supabase; the frontend page does not. Skills are likely best shown on the About page.
- **Portfolio page** — table exists in Supabase; frontend page not started. Intended to be a card grid.
- **Resume page** — likely a PDF embed or download link. No backend model needed.
- **Contact page** — will need a third-party email service (e.g. Resend, EmailJS) since the backend has no email model.
- **Deployment** — frontend can be deployed to Vercel/Netlify. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the hosting dashboard. No separate backend to deploy.
- **Server-side logic** (e.g. contact form emails) — use Supabase Edge Functions rather than spinning up a new Express server.
