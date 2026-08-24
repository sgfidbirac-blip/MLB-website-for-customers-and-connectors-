# 🚀 Publishing My Loan Bazaar - Step-by-Step Deployment Guide

This app is **full-stack**: 
- Frontend = Vite + React (builds to `/dist`)
- Backend = Express API (serves both API + frontend in production via `npm start`)

The easiest way to publish is **ONE web service** that does both. You have 3 solid options.

---

## OPTION A: Recommended - Single Click Deploy on Render.com (FREE, 5 min) ⭐

Best for this codebase because backend + frontend run together and `db.json` persists with a Render Disk (or you can later plug MongoDB).

### Step 1: Push your code to GitHub
You already have repo `sgfidbirac-blip/MLB-website-for-customers-and-connectors-`. If you made local changes:
```bash
git add .
git commit -m "ready for deploy"
git push origin arena/019fcc76-mlb-website-for-customers-and
# Or push to main after merging PR
```

### Step 2: Create Render account
1. Go to https://render.com → Sign Up with GitHub
2. Click **New +** → **Web Service**
3. Connect your repository `MLB-website-for-customers-and-connectors-`

### Step 3: Configure Web Service
Fill these exact fields:

- **Name**: `my-loan-bazaar`
- **Runtime**: `Node`
- **Root Directory**: leave blank (repo root)
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Start Command**:
  ```
  npm start
  ```
- **Node Version**: `22` (auto detected)
- **Instance Type**: Free

### Step 4: Environment Variables (Optional but Recommended)
Click **Advanced** → **Add Environment Variable**:
- `NODE_ENV` = `production`
- `DB_PATH` = `/data/db.json` (only if you add a Disk in next step, else skip)

### Step 5: Add Persistent Disk (So your loan files don't vanish on restart)
Render free instances have ephemeral filesystem. For your business you NEED persistence.

1. In your Web Service → left menu **Disks** → **Add Disk**
2. Name: `mlb-data`
3. Mount Path: `/data`
4. Size: `1 GB` (Free tier gives 1GB)
5. Save → Render will set `DB_PATH=/data/db.json` automatically (you added env above)

Without Disk: Data will reset on every deploy/restart. With Disk: lives forever.

### Step 6: Deploy
Click **Create Web Service** → Wait 2-3 min for build logs:
```
vite build ✓
🚀 MLB Server running on http://0.0.0.0:10000
📁 DB file: /data/db.json
```
Render will give you URL like: `https://my-loan-bazaar.onrender.com`

**DONE!** Open it:
- Home `/` works
- Apply for Loan → generates MLB-XXX code
- Track bar → enter code
- Connector login `/connector-login` → Demo CON-101 / connector123
- Admin `/admin-bazaar` → admin786 / dsapassword123

### Step 7: Custom Domain (myloanbazaar.com)
1. In Render service → **Settings** → **Custom Domains** → Add `www.myloanbazaar.com`
2. Go to your domain registrar (GoDaddy, Namecheap, Hostinger):
   - Add CNAME Record: `www` → `my-loan-bazaar.onrender.com`
3. In Render, it will auto issue SSL (https).

---

## OPTION B: Split Deploy - Frontend on Vercel + Backend on Render

Use this if you want super-fast frontend (CDN) + separate API.

### Backend on Render (same as Option A but API only)
- Follow Option A Steps 1-5, but your backend will be at `https://mlb-api.onrender.com`
- Note its URL.

### Frontend on Vercel
1. Go to https://vercel.com → Import your GitHub repo
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. **Environment Variable**: 
   - `VITE_API_URL` = `https://mlb-api.onrender.com/api`
6. Deploy → Vercel gives `https://my-loan-bazaar.vercel.app`

**Important**: In `src/utils/constants.js`, we already read `VITE_API_URL`, so frontend will call remote API.

**Pros**: Frontend faster, free unlimited bandwidth.
**Cons**: Two services to manage, need CORS (already enabled).

---

## OPTION C: Hostinger / VPS / cPanel with Node.js (India-friendly, ₹149/mo)

If you already have Hostinger Business Hosting / VPS:

### On Hostinger hPanel:
1. Go to **Websites** → **Your Domain** → **Advanced** → **Node.js**
2. Create Node.js app → Node 22 → Application Root: `my-loan-bazaar`
3. Application Startup File: `server/index.js`
4. Upload files via File Manager or Git:
   ```bash
   git clone https://github.com/sgfidbirac-blip/MLB-website-for-customers-and-connectors-.git
   cd MLB-website-for-customers-and-connectors-
   npm install
   npm run build
   ```
5. In hPanel, click **Restart App** → Open your domain.

### On Any Ubuntu VPS (DigitalOcean, AWS, Hostinger VPS):
```bash
# 1. SSH into server
ssh root@YOUR_SERVER_IP

# 2. Install Node 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs git

# 3. Clone & build
git clone https://github.com/sgfidbirac-blip/MLB-website-for-customers-and-connectors-.git
cd MLB-website-for-customers-and-connectors-
npm install
npm run build

# 4. Use PM2 to keep alive
npm install -g pm2
pm2 start server/index.js --name mlb
pm2 startup
pm2 save

# 5. Setup Nginx reverse proxy + SSL
apt install nginx certbot python3-certbot-nginx -y
nano /etc/nginx/sites-available/mlb

# Paste:
server {
  server_name myloanbazaar.com www.myloanbazaar.com;
  location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

ln -s /etc/nginx/sites-available/mlb /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
certbot --nginx -d myloanbazaar.com -d www.myloanbazaar.com
```

---

## OPTION D: Upgrade to True Cloud DB (For Vercel/Netlify which have no disk)

If you deploy to **Vercel** only (serverless), `db.json` won't persist. Upgrade to Firestore/Supabase/Mongo Atlas:

### Quick MongoDB Atlas Upgrade (Free 512MB):
1. Create Atlas account https://cloud.mongodb.com → Create free cluster → Get connection string.
2. In `server/index.js`, replace `readDB/writeDB` with MongoDB:
```js
import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('mlb');
const appsCol = db.collection('applications');
const connectorsCol = db.collection('connectors');
```
3. Set env var `MONGODB_URI=mongodb+srv://...` in Render/Vercel.

**OR Firestore** (Best for live sync you requested):
- Create Firebase project, enable Firestore
- Replace file logic with `getDocs(collection(db, 'applications'))`
- Real-time listeners give true multi-device live sync.

We can help you wire Firestore if you choose this.

---

## Post-Deploy Checklist

- [ ] Open `https://your-url.com` → Home loads
- [ ] Click **Apply for Loan Directly** → Submit → Note code like `MLB-402`
- [ ] Scroll to **Track Your Loan Status** → Enter code → Should show ONLY status + loan type (secure check)
- [ ] Go to `/connector-login` → Register new connector → Get `CON-XXX` → Login → Add customer file → See isolated view
- [ ] Go to `/admin-bazaar` → Login `admin786` / `dsapassword123` → See ALL files → Change status via dropdown → Track again to see updated status
- [ ] Test on mobile browser (Chrome Android / Safari iPhone) → responsive check
- [ ] Set custom domain + SSL

---

## Environment Variables Cheat Sheet

| Variable | Where | Value | Purpose |
|----------|-------|-------|---------|
| `PORT` | Auto by host | 10000 / 5000 | Server port |
| `DB_PATH` | Render Disk only | `/data/db.json` | Persistent file location |
| `VITE_API_URL` | Vercel frontend only | `https://api-url/api` | Points frontend to backend |
| `MONGODB_URI` | If upgrading | `mongodb+srv://...` | Cloud DB |

---

## What About Backend API Rate Limits / Security?

For your 60+ connectors + walk-ins, current file-based DB handles ~1000s of files fine. For scale beyond:
- Add bcrypt for connector passwords (currently plain for demo)
- Add JWT for admin/connector auth
- Rate limit track endpoint: `express-rate-limit`

We kept app lightweight per spec, but can add when needed.

---

## Need Help Choosing?

- **You want cheapest & fastest TODAY**: Use **Option A Render** (1 click, 5 min, free)
- **You want myloanbazaar.com with Hostinger you already pay**: Use **Option C**
- **You want super-fast + true cloud sync across devices globally**: Use **Option B + MongoDB Atlas**

Tell me which option you want and I'll generate the exact commands for your domain.

---

## Quick Commands Summary

```bash
# Local test before deploy
npm install
npm run build
npm start
# Open http://localhost:5000

# Push to GitHub
git add .
git commit -m "production ready"
git push origin main
```

Your hardcoded admin credentials remain permanent for lifetime: `admin786` / `dsapassword123` at `/admin-bazaar`.

Good luck! My Loan Bazaar is ready to go live. 🏦
