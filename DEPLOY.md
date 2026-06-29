# Deploy ARMAAN to Render (free)

## Steps

1. Push this project to GitHub (create a new repo on github.com, then run):

```bash
git init
git add .
git commit -m "Initial ARMAAN website"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to [https://render.com](https://render.com) and sign up (free).

3. Click **New +** → **Blueprint** → connect your GitHub repo.

4. Render reads `render.yaml` automatically. Click **Apply**.

5. Set environment variable in Render dashboard:
   - `ADMIN_PASSWORD` = your secure password (e.g. `armaan2024` or something stronger)

6. Wait for deploy (~2–3 min). Your site will be live at:
   `https://armaan-visuals.onrender.com` (or similar)

## Admin login (live site)

- Sign in: `https://YOUR-SITE.onrender.com/admin/login`
- Username: `arya`
- Password: whatever you set as `ADMIN_PASSWORD`

## Note on uploads

On Render's free plan, uploaded files may reset when the server redeploys. For permanent file storage, upgrade to a paid disk or switch to cloud storage later.
