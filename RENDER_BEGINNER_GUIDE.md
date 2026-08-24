# My Loan Bazaar – Publish in 5 Minutes on Render.com
### Super Beginner Guide (No Experience Needed) – Step by Step

> This guide assumes you have ZERO deployment knowledge. I will explain every click.

---

## What is Render.com and Why We Use It?

Think of Render like a computer on the internet that keeps your website ON 24/7.

- Your website code is on **GitHub** (like Google Drive for code). Repo: `sgfidbirac-blip/MLB-website-for-customers-and-connectors-`
- Render will **copy** your code from GitHub, build it (install + compile), and run it.
- Then it gives you a free link like `https://my-loan-bazaar.onrender.com` that anyone can open on mobile/desktop.
- Your customers + 60 connectors will use THIS link – data syncs live because everyone talks to same server.

**Why Disk is Important:**
Normally Render forgets files when it restarts. Your loan files are stored in `server/db.json`. If no Disk, after restart all customer files vanish! So we add a 1GB Disk at `/data` – like a USB pen drive attached permanently. Then we tell server to save at `/data/db.json` via `DB_PATH`.

---

## What You Need Before Starting

1.  **GitHub Account** – Your code is already at: `https://github.com/sgfidbirac-blip/MLB-website-for-customers-and-connectors-`
    - If you don't have account, create at github.com (free)
2.  **Browser** – Chrome recommended
3.  **10 minutes time**

You DO NOT need to install Node, VS Code, or anything. Everything happens in browser.

---

## PART 0: Check Your Code on GitHub (30 seconds)

1. Open https://github.com/sgfidbirac-blip/MLB-website-for-customers-and-connectors-
2. You should see files like `package.json`, `server`, `src`, `README.md`
3. Latest commit should say "Restore full app..." – that means latest My Loan Bazaar code is there.
4. If you see this, you are READY. Keep this tab open.

If code is missing, you need to push:
- Download your project folder from Arena → Go to GitHub → Upload files. But if you are on `arena/019fcc76-mlb-website-for-customers-and` branch, it's already pushed.

---

## PART 1: Create Render Account (2 minutes)

1. Open **https://render.com** in new tab
2. Click **Get Started** → **Sign Up with GitHub**
3. It will ask: "Authorize Render" → Click **Authorize**
4. Render will ask permission to read your repositories → Click **Authorize** / **Install**
5. You will reach Render Dashboard – looks like dark screen with "Create New" button.

**Cost:** Free tier is enough. No credit card needed initially. Free web service sleeps after 15 min inactivity – first visit after sleep takes 20-30 seconds to wake (shows spinning). This is NORMAL for free plan.

---

## PART 2: Create Web Service (Connect GitHub Repo)

1. In Render Dashboard, click **New +** (top right) → **Web Service**
2. It shows list of your GitHub repos. Find `MLB-website-for-customers-and-connectors-`
   - If not visible, click **Configure GitHub** → Give Render access to that repo → Save → Come back, click Refresh.
3. Click **Connect** next to that repo.
4. Now you see a form "Create a new Web Service" – DON'T CLICK CREATE YET. Fill below first.

---

## PART 3: Fill Settings EXACTLY (Most Important)

Scroll through form and fill:

**1. Name:** 
- Type: `my-loan-bazaar`
- This becomes your URL: `my-loan-bazaar.onrender.com` You can change later.

**2. Region:** 
- Choose **Singapore (Southeast Asia)** – closest to Bengaluru, fast for India.

**3. Branch:** 
- Select `arena/019fcc76-mlb-website-for-customers-and` OR `main` (whichever has latest code). If you merged to main, use main.

**4. Root Directory:** 
- Leave BLANK (empty). Don't type anything.

**5. Runtime:** 
- Select `Node`

**6. Build Command:**
- Copy paste EXACTLY:
```
npm install && npm run build
```
What does it mean? `npm install` downloads all libraries, `npm run build` makes your React frontend ready for production (creates `dist` folder). Takes ~1 minute.

**7. Start Command:**
```
npm start
```
What does it mean? Runs `node server/index.js` which starts your backend API AND serves frontend together.

**8. Node Version:** Leave auto or select 22

**9. Instance Type:** Select **Free**

**DO NOT CLICK CREATE YET.** Go to next part first (Env Vars + Disk).

---

## PART 4: Add Environment Variables + Disk (CRITICAL - Don't Skip!)

### 4A: Add Environment Variables

Scroll down to **Environment Variables** or **Advanced** → **Add Environment Variable**

Click Add and add TWO variables, one by one:

**Variable 1:**
- Key: `NODE_ENV`
- Value: `production`

**Variable 2:**
- Key: `DB_PATH`
- Value: `/data/db.json`

Why?
- `NODE_ENV=production` tells app it's live
- `DB_PATH=/data/db.json` tells server "Don't save in temporary folder, save inside the permanent Disk at /data"

Click **Add** after each.

### 4B: Add Persistent Disk (So loan files NEVER delete)

On left sidebar of this same create page, or after creation, look for **Disks** section.

If you don't see Disks before creation:
- You can create service first, then add disk. It's okay.

To add after creation OR during creation (Render shows "Add Disk"):

1. Click **Add Disk**
2. Fill:
   - **Name:** `mlb-data`
   - **Mount Path:** `/data` (EXACTLY this, with slash)
   - **Size (GB):** `1`
3. Click Save / Create

**What happens?** Render creates a 1GB hard disk and permanently attaches at `/data`. Your `db.json` now lives there forever, even after restart/deploy.

**If you missed Disk during creation:** After deploy, go to your service → Left menu → **Disks** → Add Disk → Save → Render will restart automatically.

---

## PART 5: Deploy – Watch It Build (3 minutes)

1. Now click **Create Web Service** at bottom.
2. You go to logs page – black screen with text scrolling. WAIT.
3. You will see steps:
```
Cloning from GitHub...
npm install ... (installing 100+ packages)
vite build ... transforming 33 modules
dist/index.html 0.97 kB
✓ built in 300ms
🚀 MLB Server running on http://0.0.0.0:10000
📁 DB file: /data/db.json
```
If you see 🚀 MLB Server running, SUCCESS!

If you see red error "Build failed":
- Common fix: Build command typo → Check spelling.
- Root directory not blank → Make blank.
- Start command typo → Should be `npm start`.

4. At top, Render shows your live URL: `https://my-loan-bazaar.onrender.com` – Click it. It opens your site! First time may take 20-30 sec (wakes up).

---

## PART 6: Test Your Live Site Like a Real User (2 minutes)

Open your Render URL and do these 5 checks:

**1. Home Page:**
- Should show blue & gold design, MLB logo, "Apply for Loan Directly" button.

**2. Direct Application:**
- Click **Apply for Loan Directly**
- Fill: Name: `Test Customer`, Number: `9876543210`, Loan Type: `House Purchase`, Amount: `2500000`
- Submit → You get popup **Tracking Code like `MLB-402`** → **COPY IT** and screenshot. This is what real walk-in customers will get.

**3. Track Status (Secure Check):**
- Scroll to **Track Your Loan Status**
- Paste code `MLB-402`
- Click Track → It shows ONLY `File Status: Logged In` + `Loan Type` – NOT phone/other data. This is secure by design. If you see this, your cloud sync works!

**4. Connector Portal:**
- Go to `/connector-login` (add to URL: `https://my-loan-bazaar.onrender.com/connector-login`)
- Use Demo: Agent Code `CON-101`, Password `connector123` → Login
- Dashboard shows `CON-101` profile. Click **Add New Customer File** → Submit → It appears in table, tagged with CON-101. You ONLY see your files, not others – isolation works.

**5. Admin Portal:**
- Go to `/admin-bazaar` → Login `admin786` / `dsapassword123`
- Dashboard shows ALL files (direct + connector). Change status dropdown to `Sanctioned` → Save.
- Now go back Home and track same MLB code again → status should now show `Sanctioned`. Admin exclusive rights work!

If all 5 work, your site is PERFECTLY LIVE.

---

## PART 7: Add Custom Domain Like www.myloanbazaar.com (Optional)

If you own domain from GoDaddy / Hostinger / Namecheap:

1. In Render Dashboard → Your Service → **Settings** tab → Scroll to **Custom Domains** → **Add Custom Domain**
2. Type `www.myloanbazaar.com` → Save
3. Render shows DNS instructions:
```
Type: CNAME | Name: www | Value: my-loan-bazaar.onrender.com
```
4. Go to your domain provider:
   - **Hostinger:** hPanel → Domains → DNS → Add CNAME → www → my-loan-bazaar.onrender.com
   - **GoDaddy:** My Products → DNS → Add → CNAME → www → my-loan-bazaar.onrender.com
   - **Namecheap:** Domain List → Manage → Advanced DNS → Add CNAME → www → my-loan-bazaar.onrender.com
5. Wait 5-30 minutes (DNS propagation). Render auto-issues free SSL (https lock symbol).
6. Also add root domain: `myloanbazaar.com` → Render asks to add A record or redirect. Easiest: Add domain `myloanbazaar.com` in Render too, it will give you IP or redirect to www.

---

## PART 8: How to Update Your Site Later (After Changes)

Whenever you change code and push to GitHub, Render auto-deploys!

1. Edit code locally (or in Arena)
2. 
```bash
git add .
git commit -m "update something"
git push origin main
```
3. Render detects push → auto starts new build → 2 minutes later live site updated, with SAME data (because Disk preserves db.json).

You DON'T need to re-create service.

---

## Troubleshooting – Common Beginners Issues

**Problem: Site shows "Bad Gateway" or 502**
- Wait 1 minute and refresh – free instance sleeps, wakes slow.
- Check Render logs: Is error `Cannot find module`? Then build command wrong.

**Problem: Loan files disappear after deploy**
- You forgot Disk + DB_PATH. Add Disk now → Set env DB_PATH=/data/db.json → Manual Deploy → Re-deploy.

**Problem: Build fails "vite not found"**
- Build command must be `npm install && npm run build` NOT just `npm run build`

**Problem: API not working, tracking shows error**
- Check env var `VITE_API_URL` should NOT be set for single-service deploy (leave empty so it uses `/api`). If you set it wrongly, delete it.

**Problem: Render asks for credit card**
- Free tier has 750 hours/month free – enough for 1 service. If you create many services, it may ask. Delete unused services.

---

## FAQ for Beginners

**Q: Is data safe? Will customer phone numbers leak?**
A: Public track endpoint only returns status + loan type. We tested it. Private data stays in backend.

**Q: How many connectors can handle? Free plan enough for 60+?**
A: Yes. File DB handles 1000s. 60 connectors logging 10 files each = 600 files – fine. Disk is 1GB – stores lakhs of records.

**Q: Cost after free?**
A: Free sleeps. Paid Starter $7/month keeps always on + faster. For DSA business, $7 is worth. Start free, upgrade when you get customers.

**Q: Can I use Hostinger domain with Render?**
A: Yes, that's Part 7 – just add CNAME in Hostinger DNS pointing to Render.

**Q: How to backup data?**
A: Go to Render → Disk → You can snapshot, or download `db.json` via SSH: Render Shell → `cat /data/db.json`. Or later upgrade to MongoDB Atlas (automatic daily backup).

---

## What to Share With Your Team

Once live, send this WhatsApp message to your 60 connectors:

> 🏦 *My Loan Bazaar is LIVE!*
> Link: https://my-loan-bazaar.onrender.com
> Your Agent Code: CON-XXX (register at /connector-login)
> Demo: CON-101 / connector123
> All your files auto-tagged, isolated view, instant tracking code like MLB-402 for customers.
> Admin updates status, customers track via home page. No commission/payment needed, lightweight.
> Save this link!

For customers:
> My Loan Bazaar: https://my-loan-bazaar.onrender.com
> Apply directly → Save your MLB-XXX code → Track status anytime from home page.

---

## Summary in 6 Steps (Copy Paste)

1. Render.com → Sign up with GitHub
2. New Web Service → Connect `MLB-website-for-customers-and-connectors-` repo
3. Build: `npm install && npm run build` | Start: `npm start` | Free instance
4. Env: `NODE_ENV=production` + `DB_PATH=/data/db.json` | Disk: Name `mlb-data` Mount `/data` 1GB
5. Deploy → Wait logs `MLB Server running` → Open URL
6. Test Apply → Track → Connector → Admin

DONE. Your DSA is online.

If stuck at any step, tell me which PART number (1-7) and screenshot error – I will fix.
