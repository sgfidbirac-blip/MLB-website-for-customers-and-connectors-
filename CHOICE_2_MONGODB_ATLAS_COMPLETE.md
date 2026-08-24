# CHOICE 2: FREE Forever Permanent – MongoDB Atlas Step-by-Step (Zero Experience)

This makes your loan files **NEVER delete**, even on Render FREE plan, no Disk needed. Cost ₹0 forever.

Total time: 7 minutes.

---

### WHAT IS MongoDB Atlas?

- Your current code saves files in `db.json` file. On free Render, that file deletes on restart.
- MongoDB Atlas is a FREE cloud database (like Google Drive for data) that lives forever.
- We will tell your Render server: "Don't save to file, save to Atlas cloud".
- Then even if Render sleeps/restarts 100 times, data stays.

You will do 2 parts:
- **Part A (4 min):** Create free Atlas database in browser
- **Part B (2 min):** Paste its connection link into Render

---

## PART A – CREATE ATLAS FREE DATABASE

### A1 – Create Account
1. Open `https://www.mongodb.com/cloud/atlas/register`
2. Click **Sign Up with Google** (easiest) → Select your Gmail.
3. It asks few questions: "What is your goal?" → Select **Learn MongoDB**, Role **Developer**, Language **JavaScript/Node.js** → Finish.
4. It may ask Company Name → Type `My Loan Bazaar` → Continue.

### A2 – Create FREE Cluster (Your Database Computer)
1. You see screen "Create a deployment" → Choose **M0 FREE** (512MB) – It says FREE, 3 options. Click **M0** and **Create**.
2. Choose:
   - **Provider:** `AWS`
   - **Region:** **Mumbai (ap-south-1)** – Closest to Bengaluru = Fastest
   - Cluster Name: Leave `Cluster0` or rename to `MLBCluster`
3. Click **Create Deployment** → Wait 1-3 minutes. It says "Creating your cluster...". Wait till it says "Congratulations".
   - Do NOT close tab.

### A3 – Create Database User (Username + Password)

While cluster is creating, it shows popup "Security Quickstart".

1.  **Username:** Type `mlbadmin`
2.  **Password:** Click **Autogenerate Secure Password** → It generates like `aB3xY9q...` → **CLICK COPY ICON** and **SAVE IN NOTEPAD** on your computer/phone. SUPER IMPORTANT.
    - Example: `MyAtlasPass123` – save it.
3.  Click **Create User**.

**What is this?** This is login for your database, like `admin786` for your site, but for database.

### A4 – Add Network Access (Allow Render to Connect)

Same popup next step: "Where would you like to connect from?"

1.  Click **Add My Current IP Address** (it fills your home IP)
2.  **ALSO** Click **Add IP Address** → Type `0.0.0.0/0` → Description `Allow Render` → Click **Add Entry**
    - Why 0.0.0.0/0? It means "allow from anywhere on internet" – needed because Render's server IP changes. Without this, Render cannot connect and you get error.
3.  Click **Finish and Close** or **Close**.

If you missed this step later: Left menu → **Network Access** → **Add IP Address** → `0.0.0.0/0` → Confirm.

### A5 – Wait Cluster Ready

Top bar says "Cluster0" – when it turns green and says **Created** (not "Creating"), you are ready for next part. Takes 1-2 min.

---

## PART B – GET CONNECTION STRING (The Link)

This is a long link like a website address that your Render server uses to talk to Atlas.

### B1 – Click Connect Button
1.  In Atlas Dashboard, you see your cluster box → Click **Connect** button (middle of cluster card).
2.  Popup: "Connect to Cluster0"
3.  Choose **Drivers** (NOT Compass, NOT Shell) → Click **Drivers**
4.  Driver: **Node.js** → Version: **5.5 or later** (leave default)
5.  You see a string like:
```
mongodb+srv://mlbadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
6.  Click **Copy** icon next to it.

### B2 – Replace Password
The copied string has `<password>` placeholder. You need to replace it with your real password you saved in A3.

Example:
- Copied: `mongodb+srv://mlbadmin:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority`
- Your password saved: `MyAtlasPass123`
- **Final:** `mongodb+srv://mlbadmin:MyAtlasPass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority`

**IMPORTANT:**
- If your password has special symbols like `@ # %` – it may fail. If so, generate new password without symbols (only letters + numbers) in Atlas → Database Access → Edit User → Generate new.
- Best to use simple password like `MlbAtlas2024` for first time.

**COPY FINAL STRING** – keep in notepad. This is your `MONGODB_URI`.

---

## PART C – ADD TO RENDER (Makes Data Permanent)

### C1 – Open Render Service
1. Open **render.com** → Dashboard → Click your service `my-loan-bazaar`
2. Left menu → Click **Environment**

### C2 – Add Variable MONGODB_URI
1. Click **Add Environment Variable**
2.  Key: Exactly `MONGODB_URI` (capital, underscore)
3.  Value: Paste your FINAL connection string from B2
4.  Click **Save Changes**

Render will say "Deploying..." and restart automatically. Takes 1-2 min.

### C3 – Check Logs (Proof it Works)
1. In Render → Your Service → Top menu **Logs**
2. Wait for new logs after restart – you should see:
```
✅ Connected to MongoDB Atlas
✅ Seeded demo connector CON-101
📁 DB Mode: MongoDB Atlas
🚀 MLB Server running on http://0.0.0.0:10000
```
If you see `✅ Connected to MongoDB Atlas` → **SUCCESS!** Your data is now permanent.

If you see `❌ MongoDB connection failed`:
- Check password replacement correct? No `<password>` left?
- Check Network Access has `0.0.0.0/0`
- Check MONGODB_URI has no extra spaces

### C4 – Test Permanent Persistence (Important Test)

1.  Open your live site `https://my-loan-bazaar.onrender.com`
2.  Click **Apply for Loan Directly** → Add test loan → Get code like `MLB-123` → **Copy it**
3.  Now go to Render → **Manual Deploy → Deploy latest commit** → Wait restart (1 min)
4.  Open site again → Track same `MLB-123` → If it STILL shows status → **Permanent confirmed!** With old file method, it would have vanished after restart. Now it stays forever.

---

## PART D – See Your Data in Atlas (Optional, Nice to See)

1. Atlas Dashboard → Left menu **Database** → Click your cluster → **Browse Collections**
2. You see database `myloanbazaar` → Collections:
   - `applications` → All loan files (direct + connector)
   - `connectors` → All agent codes
3. You can see, export, backup from here. Atlas auto-backups free.

---

## FINAL CHECKLIST FOR CHOICE 2

- [ ] Atlas account created
- [ ] FREE M0 Cluster in Mumbai created and green
- [ ] DB User `mlbadmin` with password saved
- [ ] Network Access has `0.0.0.0/0`
- [ ] Connection string copied and `<password>` replaced with real password
- [ ] Added to Render as `MONGODB_URI`
- [ ] Logs show `✅ Connected to MongoDB Atlas`
- [ ] Tested apply → restart Render → track again still works

**Cost:** ₹0 forever. Atlas M0 free 512MB = ~ 200,000 loan files (more than enough for 60 connectors x 1000 files).

**What to share with connectors now:** Same link, but now you can tell them data will never delete.

---

## TROUBLESHOOTING – If You Get Error

**Error: "Authentication failed"**
- Password wrong. Go Atlas → Database Access → Edit User `mlbadmin` → Generate new password → Update Render env var MONGODB_URI with new password → Save → Restart.

**Error: "MongoServerError: IP not whitelisted"**
- Atlas → Network Access → Add IP → `0.0.0.0/0` → Confirm.

**Error: "Invalid connection string"**
- You didn't replace `<password>` placeholder, or you have spaces. Copy again, ensure starts with `mongodb+srv://`

**Error: Site still shows file mode, not MongoDB**
- Render env var name must be EXACTLY `MONGODB_URI` (capital). Check spelling.
- After adding, click Save, wait deploy finished (check logs).

**Need Help?**
Copy your connection string BUT hide password like `mongodb+srv://mlbadmin:****@cluster0...` and send me screenshot of Render logs + Atlas Network Access page – I will fix.

---

## DONE!

Your My Loan Bazaar is now **FREE + Permanent + Live Sync across devices**.

Next: Share link with your 60 connectors, start collecting files. All files auto-tagged, tracking codes like MLB-402, admin can update status to Sanctioned/Disbursed from `/admin-bazaar`.

Welcome to production! 🏦
