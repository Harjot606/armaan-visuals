# ARMAAN — Graphic Design by Arya

A simple, fresh personal website for showcasing graphic design work and taking orders via WhatsApp.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + Multer (file uploads)
- **Auth:** JWT (admin only)
- **Storage:** JSON database + local file uploads

## Getting Started

```bash
npm install
npm run dev
```

This starts both:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## Admin Upload

Only Arya can upload portfolio work. The admin area is not linked in the public navbar:

- **Sign in:** `/admin/login`
- **Dashboard:** `/admin`

Default credentials (change in `.env`):

| Field    | Value        |
|----------|--------------|
| Username | `arya`       |
| Password | `armaan2024` |

From the dashboard Arya can upload images/videos (up to 100 MB), add title/category/description, and delete projects.

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/portfolio` | No | List all portfolio items |
| POST | `/api/portfolio` | Yes | Upload new project (multipart) |
| DELETE | `/api/portfolio/:id` | Yes | Delete project + file |
| POST | `/api/portfolio/seed` | Yes | Reset to sample placeholders |

Uploaded files are saved in `server/uploads/`. Metadata is stored in `server/data/portfolio.json`.

## Production

### Vercel (live site)

See `DEPLOY.md` for full steps. After deploy:

- **Sign in:** `https://armaan-visuals.vercel.app/admin/login`
- **Dashboard:** `https://armaan-visuals.vercel.app/admin`

Connect **Vercel Blob** storage in the Vercel dashboard so uploads persist.

### Self-hosted / Render

```bash
npm run build
npm run start
```

The Express server serves the built frontend and handles API/uploads on one port (default 3001).

Set strong values in `.env`:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `JWT_SECRET`

## WhatsApp

Update the phone number in `src/constants.js` (`WHATSAPP_NUMBER`).
