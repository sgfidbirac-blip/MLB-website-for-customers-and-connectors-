# My Loan Bazaar - Single Office DSA System

**Professional deep blue (#0A2647) & gold (#CCA43B) branded, clean, modern, mobile-responsive web application for a proprietary Loan DSA business handling 60+ connectors and direct walk-in customers.**

Live sync across devices via cloud-ready Express API + JSON persistence (easily swappable to Firestore/MongoDB/Supabase).

### Brand
- Logo: Text/vector-based "MLB" - deep blue background with gold gradient
- Colors: Deep Blue #0A2647 / #061a32 / #144272 and Gold #CCA43B / #E2C275
- Font: Inter + Outfit, professional DSA look

---

## Features Implemented (As Per Spec)

### 1. Public Home Page & Status Tracking `/`
- Welcoming landing page for "My Loan Bazaar" with live file tracker visual
- **Center prominent button**: "Apply for Loan Directly" → opens clean popup form asking:
  - Customer Name, Contact Number, Loan Type (dropdown), Amount
  - Auto-generates unique tracking code e.g., **MLB-402**
- **Public search bar**: "Track Your Loan Status"
  - User types 6-digit file code (e.g., MLB-651)
  - Queries `GET /api/applications/track/:code`
  - **Securely displays ONLY** `File Status` and `Loan Type` - hides all other customer files/private data

### 2. Loan Product Dropdowns (Exact 9 Required)
Every form (direct + connector) uses:
- Plot Purchase
- House Purchase
- Villa Purchase
- Composite Loan (Site + Construction)
- Mortgage Loan
- Construction Loan
- Flat Purchase
- Balance Transfer
- Personal Loans

### 3. Connector Portal (Secure Dashboard)
- **Login page** `/connector-login`
  - Register: Name, Phone, Password → auto-generates permanent `Agent Code` like `CON-101`
  - Login via Agent Code + Password OR Phone + Password
  - Demo connector: `CON-101` / `connector123`
- **Dashboard** `/connector-dashboard` (protected)
  - Profile showing permanent Agent Code
  - "Add New Customer File" button → same form, auto-tagged with Agent Code
  - Isolated history table: `GET /api/connectors/:agentCode/applications` - only own files
  - Stats: total, logged, sanctioned, disbursed
  - Mobile cards + desktop table

### 4. Permanent Admin Portal
- **Dedicated route** `/admin-bazaar` (as spec)
- **Hardcoded lifetime access**:
  - User ID: `admin786`
  - Password: `dsapassword123`
  - Token stored as base64 `admin786:dsapassword123` in header `x-admin-auth`
- **Dashboard** `/admin-dashboard` (protected)
  - Pulls ALL records global (direct + connector) via `GET /api/admin/applications`
  - Connectors directory `GET /api/admin/connectors`
  - **Exclusive dropdown** per row to update File Status:
    - Logged In, Bank Login, Sanctioned, Disbursed, Rejected
  - Filters + search by code/name/agent/loan type
  - Cloud live sync

### 5. Codes and Exclusions
- Auto-generates unique **MLB-XXX** tracking code (e.g., MLB-402) - unique check against DB, 3-4 digits to handle high volume
- **Excluded** (kept lightweight): commission splitting, multi-office, payment gateway, subscription billing
- Optimized for mobile browsers, fast, secure

---

## Tech Stack

- **Frontend**: Vite + React 19 + React Router + Tailwind CSS v4 (@tailwindcss/vite)
- **Backend**: Node.js + Express 5 + lowdb-style JSON file persistence (`server/db.json`)
- **Cloud Ready**: Backend stores in `db.json` (persists when deployed to any cloud like Render, Railway, Vercel). Swap to Firestore/Supabase by replacing readDB/writeDB.
- **API Proxy**: Vite proxies `/api` → `http://localhost:5000` in dev

---

## Quick Start (Local)

```bash
npm install

# Terminal 1 - API server (port 5000)
npm run dev:server
# or: node server/index.js

# Terminal 2 - Frontend (port 5173)
npm run dev
```

Open http://localhost:5173

- **Direct Apply**: Click "Apply for Loan Directly" → submit → save code like MLB-651
- **Track**: Enter code in Track bar → see only status + loan type
- **Connector**: Register new or use CON-101 / connector123
- **Admin**: Go to /admin-bazaar → admin786 / dsapassword123 → update statuses

### Sample Data
Seed included via API - after first start, db.json may be empty, so:
- Demo connector CON-101 exists
- You can create files via Home or Connector dashboard

### Production Build
```bash
npm run build
npm start   # serves both API and frontend dist on port 5000
```

---

## Cloud Database - Live Sync Explained

Current implementation: Express server with `server/db.json` persisted on disk. When deployed to cloud (e.g., Render, Fly.io, VPS):

1. All clients fetch from same `/api` origin → data syncs live across devices
2. To upgrade to true cloud DB, replace `readDB/writeDB` in `server/index.js` with:
   - **Firebase Firestore** (recommended): `collection('applications')`
   - **Supabase**: `supabase.from('applications').select()`
   - **MongoDB Atlas**: `db.collection('applications')`
3. Frontend already uses fetch abstraction (`src/utils/api.js`) - no changes needed

Example Firestore swap (pseudocode):
```js
import { db } from './firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
async function readDB() {
  const snap = await getDocs(collection(db, 'applications'));
  return snap.docs.map(d=>d.data());
}
```

---

## API Endpoints

- `POST /api/applications` - Create (direct or connector)
- `GET /api/applications/track/:code` - Public limited view (status + loanType only)
- `POST /api/connectors/register` - Register
- `POST /api/connectors/login` - Login
- `GET /api/connectors/:agentCode/applications` - Isolated view
- `POST /api/admin/login` - Admin login (hardcoded check)
- `GET /api/admin/applications` - Global view
- `PATCH /api/admin/applications/:id/status` - Update status (admin only)

---

## Mobile Responsiveness

- All tables have desktop table + mobile card fallback
- Bottom nav on mobile for Home / Connector / Admin
- Tailwind responsive utilities, touch-friendly buttons, rounded-full CTAs

---

## Security Notes

- Public track endpoint only exposes fileStatus + loanType
- Connector endpoint filters by agentCode server-side - cannot view others
- Admin route uses hardcoded credentials per spec (in prod, hash passwords + use JWT)
- No commission/payment logic included per spec

---

## Folder Structure
```
/src
  /components - Navbar, ApplyModal
  /pages - Home, ConnectorLogin, ConnectorDashboard, AdminLogin, AdminDashboard
  /utils - constants, api
/server
  index.js - Express API + db.json persistence
  db.json - JSON cloud DB (gitignored in prod)
```

---

Built for My Loan Bazaar - Single Office DSA • 60+ connectors • Lightweight & Secure
