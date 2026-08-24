# My Loan Bazaar – Render Publish Guide (Updated – No Disk on Free)

### You said: "There is no section like Add Disk" – You're 100% Right! Here's why + what to do.

**On Render FREE plan, Disk option is HIDDEN.** Disk only appears if you select **Starter $7/month** or higher. On Free, you have 2 choices:

**Choice 1 (FREE, quick testing):** Deploy WITHOUT disk – site works 100%, but loan data resets when server restarts/deploys. OK for initial testing.

**Choice 2 (FREE + Permanent, Recommended for Production):** Use **MongoDB Atlas FREE** (0$ forever, 512MB – stores lakhs of loan files). Your data NEVER deletes, even on free Render.

**Choice 3 (PAID, simplest):** Upgrade to Starter $7/month → Disk option appears → data permanent.

I fixed your code to support MongoDB Atlas free. So you can do Choice 2 and stay 100% free forever.

Below are **both paths** explained click-by-click for ZERO experience.

---

## PATH A: Deploy FREE Without Disk (2 Min Test) – Data Resets But Site Works

This is what you see now – no Disk section. That's OK.

1. Render → New Web Service → Connect repo `MLB-...`
2. Fill:
   - Name: `my-loan-bazaar`
   - Region: Singapore
   - Branch: `main` or `arena/...`
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Instance: **Free**
3. Env Vars: Only `NODE_ENV=production` (skip DB_PATH)
4. Click **Create Web Service**
5. Logs show `🚀 MLB Server running...` + `DB Mode: File...`
6. Open URL `https://my-loan-bazaar.onrender.com` → Test apply/track.

**Limitation:** Every time Render restarts (after deploy or inactivity), `db.json` resets to only demo connector CON-101. So for real business, do Path B below after testing.

---

## PATH B: FREE Forever + Permanent Data (MongoDB Atlas) – Recommended

This keeps your data FOREVER even on free Render, no Disk needed.

### Step B1: Create FREE MongoDB Atlas Account (2 min)

1. Open **https://www.mongodb.com/cloud/atlas/register** → Sign up with Google.
2. After login, click **Create** → Choose **FREE M0 Cluster** (512MB).
   - Provider: AWS
   - Region: **Mumbai (ap-south-1)** – closest to Bengaluru
   - Cluster Name: `MLBCluster` → Create (takes 1-2 min).
3. It asks **Security Quickstart**: 
   - Username: `mlbadmin` 
   - Password: Click Autogenerate → **COPY this password** and save somewhere (e.g., `MyLoanPass123`)
   - Click Create User.

4. **Where would you like to connect from?** → Choose **My Local Environment** → Add IP: `0.0.0.0/0` (Allow from anywhere – needed for Render) → Add Entry.

5. Click **Finish and Close**.

### Step B2: Get Connection String

1. In Atlas Dashboard → Click **Connect** on your cluster → **Drivers** → Node.js → Copy connection string like:
```
mongodb+srv://mlbadmin:<password>@mlbcluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
2. Replace `<password>` with your actual password you copied (e.g., `MyLoanPass123`).

Final string example:
```
mongodb+srv://mlbadmin:MyLoanPass123@mlbcluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**COPY this full string – you need it.**

### Step B3: Add it to Render

1. Go back to Render Dashboard → Your Web Service `my-loan-bazaar` → Left menu **Environment**
2. Click **Add Environment Variable**
   - Key: `MONGODB_URI`
   - Value: Paste your Atlas connection string from Step B2
3. Click **Save Changes** → Render will auto-restart.
4. Watch logs – now you should see:
```
✅ Connected to MongoDB Atlas
✅ Seeded demo connector CON-101
📁 DB Mode: MongoDB Atlas
```

**DONE!** Now your loan files are saved in MongoDB Atlas cloud – permanent, free, never deletes, syncs live across devices, works even on free Render!

### Step B4: Test Permanent Persistence

1. Open your live URL → Apply a loan → Get code `MLB-XXX`
2. Now go to Render Dashboard → **Manual Deploy → Deploy latest commit** → Wait restart.
3. Open site again → Track same `MLB-XXX` → If it still shows (with MongoDB path), data persisted! With file-only, it would be gone.
4. With MongoDB, loan files stay forever, even after 100 restarts.

---

## PATH C: Paid $7 – Get Disk Option Back

If you don't want MongoDB, pay $7 to unlock Disk:

1. Render Service → **Scale** → Change Instance Type from Free to **Starter** ($7/month)
2. Now left menu shows **Disks**! Click **Disks → Add Disk** → Name `mlb-data` Mount `/data` 1GB
3. Add env var `DB_PATH=/data/db.json` → Save → Restart.
4. Logs show `DB file: /data/db.json` – now permanent even without MongoDB.

---

## Which Path Should You Choose?

- **Just testing today, no real customers yet:** Path A – Free without disk, quickest.
- **Real business with 60 connectors, want 100% free forever:** Path B – MongoDB Atlas (I recommend this).
- **Want simplest, no external DB, willing to pay ₹600/month:** Path C – Starter + Disk.

**My recommendation for you in Bengaluru:** Do **Path A now to see site live in 2 min**, then **do Path B (MongoDB Atlas) for permanent free production**. Total cost ₹0.

---

## Updated Render Steps Summary (No Disk)

1. Render.com → Sign up with GitHub
2. New → Web Service → Connect repo
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Env: `NODE_ENV=production` (and `MONGODB_URI=...` if doing Path B)
6. Create → Wait 3 min → Click URL
7. Test Apply → Track → Connector CON-101 / connector123 → Admin admin786 / dsapassword123

You said no Disk section – that's because free plan hides it. Now you have 2 working solutions without it.

Tell me which path (A, B, or C) you want to do and I will give you exact next click.
