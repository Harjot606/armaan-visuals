# Deploy ARMAAN to Vercel (recommended)

## 1. Push to GitHub

The repo should already be connected to Vercel at `https://armaan-visuals.vercel.app`.

```bash
git add .
git commit -m "Fix admin routes and API for Vercel"
git push
```

## 2. Connect Vercel Blob (for uploads)

Uploaded images/videos need persistent storage on Vercel:

1. Open your project on [vercel.com](https://vercel.com)
2. Go to **Storage** → **Create Database** → **Blob**
3. Connect it to the `armaan-visuals` project

Vercel will automatically add `BLOB_READ_WRITE_TOKEN` to your environment variables.

## 3. Set environment variables

In Vercel → **Settings** → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `ADMIN_USERNAME` | `arya` |
| `ADMIN_PASSWORD` | your secure password |
| `JWT_SECRET` | a long random secret string |

`BLOB_READ_WRITE_TOKEN` is set automatically when Blob storage is connected.

## 4. Redeploy

After saving env vars, redeploy from the **Deployments** tab (or push again).

## Admin login (live site)

- Sign in: `https://armaan-visuals.vercel.app/admin/login`
- Dashboard: `https://armaan-visuals.vercel.app/admin`
- Username: `arya`
- Password: whatever you set as `ADMIN_PASSWORD`

---

# Alternative: Deploy to Render (free)

See steps below if you prefer a single-server deploy instead of Vercel.

## Steps

1. Push this project to GitHub.

2. Go to [https://render.com](https://render.com) and sign up (free).

3. Click **New +** → **Blueprint** → connect your GitHub repo.

4. Render reads `render.yaml` automatically. Click **Apply**.

5. Set environment variable in Render dashboard:
   - `ADMIN_PASSWORD` = your secure password

6. Wait for deploy (~2–3 min). Your site will be live at:
   `https://armaan-visuals.onrender.com` (or similar)

## Admin login (Render)

- Sign in: `https://YOUR-SITE.onrender.com/admin/login`
- Username: `arya`
- Password: whatever you set as `ADMIN_PASSWORD`

## Note on uploads (Render)

On Render's free plan, uploaded files may reset when the server redeploys. For permanent file storage, use Vercel with Blob (above) or upgrade Render storage.
