# Joonseo Moon — Portfolio

Personal portfolio site built with React + TypeScript on the frontend and Express + MongoDB on the backend.

---

## Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, TypeScript, Vite, Tailwind v4 |
| Backend   | Node.js, Express, TypeScript        |
| Database  | MongoDB (Mongoose)                  |

---

## Project Structure

```
portfolio/
├── frontend/          # Vite + React app (port 5173 in dev)
│   └── src/
│       ├── pages/     # One file per route
│       ├── components/
│       └── api.ts     # All fetch calls to the backend
└── backend/           # Express API (port 1000)
    ├── models/        # Mongoose schemas
    └── routes/        # REST endpoints
```

---

## Running Locally

```bash
# Backend
cd backend && npm run dev

# Frontend (separate terminal)
cd frontend && npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:1000` — no CORS config needed.

---

## Backend API

Base URL (dev): `http://localhost:1000`

### Experience — `/api/experience`

| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| GET    | `/api/experience` | Get all experiences (sorted by startDate descending) |
| POST   | `/api/experience` | Create a new experience |

**Schema**

```ts
{
  title:       string   // required — job title
  companyName: string   // required
  startDate:   Date     // required — used for sort order (most recent first)
  timeframe:   string   // required — display string e.g. "May 2024 – Aug 2024"
  location:    string   // required
  description: string[] // bullet points
  companyURL:  string   // optional — makes the card a clickable link
}
```

**Example POST body**

```json
{
  "title": "Software Engineer Intern",
  "companyName": "Acme Corp",
  "startDate": "2024-05-01",
  "timeframe": "May 2024 – Aug 2024",
  "location": "San Francisco, CA",
  "description": [
    "Built and shipped a full-stack feature used by 10k+ users",
    "Reduced API response time by 40% through query optimization"
  ],
  "companyURL": "https://acme.com"
}
```

### Portfolio — `/api/portfolio`

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| GET    | `/api/portfolio` | Get all projects    |
| POST   | `/api/portfolio` | Create a new project |

**Schema**

```ts
{
  title:       string   // required
  description: string   // required
  imageURLs:   string   // required — URL to project screenshot/image
  iconURL:     string[] // tech stack icons
}
```

### Skills — `/api/skills`

| Method | Endpoint      | Description      |
|--------|---------------|------------------|
| GET    | `/api/skills` | Get all skills   |
| POST   | `/api/skills` | Create a skill   |

**Schema**

```ts
{
  title:   string  // required — e.g. "TypeScript"
  iconURL: string  // required — URL to skill icon
}
```

---

## Frontend Pages

| Route        | File                      | Status      |
|--------------|---------------------------|-------------|
| `/`          | `src/pages/Home.tsx`      | Done        |
| `/experience`| `src/pages/Experience.tsx`| Done        |
| `/about`     | `src/pages/About.tsx`     | Stub        |
| `/portfolio` | —                         | Not started |
| `/resume`    | —                         | Not started |
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

- **Admin UI** — no admin page exists yet. Content is added via `curl` or MongoDB Compass directly. Priority task before the site goes live.
- **Authentication** — admin routes need to be protected before deploying. Consider a simple JWT or session-based auth since this is a single-user site.
- **Skills page** — the backend model and route exist; the frontend page does not. Skills are likely best shown on the About page.
- **Portfolio page** — backend model and route exist; frontend page not started. Intended to be a card grid.
- **Resume page** — likely a PDF embed or download link. No backend model needed.
- **Contact page** — will need a third-party email service (e.g. Resend, EmailJS) since the backend has no email model.
- **Deployment** — frontend can be deployed to Vercel/Netlify; backend to Render/Railway. Update the Vite proxy target from `localhost:1000` to the deployed backend URL via an environment variable.
