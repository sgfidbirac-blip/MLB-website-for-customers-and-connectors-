import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// DB path logic: Try env var, but fallback to writable locations if permission denied (Render free has no /data without Disk)
let DB_FILE = process.env.DB_PATH || path.join(__dirname, 'db.json');
let FALLBACK_DB_FILE = path.join(__dirname, 'db.json');
let TMP_DB_FILE = '/tmp/mlb-db.json';

const MONGODB_URI = process.env.MONGODB_URI || null;
const useMongo = !!MONGODB_URI;

let mongoClient = null;
let mongoDb = null;
// In-memory fallback if file system is completely read-only
let memoryDB = { applications: [], connectors: [{ id: '1', agentCode: 'CON-101', name: 'Demo Connector', phone: '9999999999', password: 'connector123', createdAt: new Date().toISOString() }] };

app.use(cors());
app.use(express.json());

// --- MongoDB setup ---
async function initMongo() {
  if (!useMongo) return;
  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 MongoDB connect attempt ${attempt}/${MAX_RETRIES}...`);
      mongoClient = new MongoClient(MONGODB_URI, {
        tls: true,
        family: 4,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
        retryWrites: true,
      });
      await mongoClient.connect();
      mongoDb = mongoClient.db(process.env.MONGODB_DB || 'myloanbazaar');
      console.log('✅ Connected to MongoDB Atlas -', mongoDb.databaseName);
      const connectorsCol = mongoDb.collection('connectors');
      const count = await connectorsCol.countDocuments();
      if (count === 0) {
        await connectorsCol.insertOne({
          id: '1',
          agentCode: 'CON-101',
          name: 'Demo Connector',
          phone: '9999999999',
          password: 'connector123',
          createdAt: new Date().toISOString()
        });
        console.log('✅ Seeded demo connector CON-101');
      }
      return;
    } catch (err) {
      console.error(`❌ MongoDB attempt ${attempt} failed:`, err.message);
      if (attempt === MAX_RETRIES) {
        console.error('❌ MongoDB failed after retries, using file mode');
        mongoClient = null; mongoDb = null;
      } else {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
}
initMongo();

// --- File DB with EACCES fallback ---
function getWritableDBPath() {
  // Try primary DB_FILE, if fails due to permission, try fallbacks
  const candidates = [DB_FILE, FALLBACK_DB_FILE, TMP_DB_FILE];
  for (const p of candidates) {
    try {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      // Try to test write permission
      fs.accessSync(dir, fs.constants.W_OK);
      return p;
    } catch (e) {
      // Try next candidate
      continue;
    }
  }
  return null; // Will use memoryDB
}

let ACTIVE_DB_FILE = getWritableDBPath();

function ensureFileDB() {
  try {
    if (!ACTIVE_DB_FILE) {
      // Use memoryDB, nothing to ensure
      return;
    }
    if (!fs.existsSync(ACTIVE_DB_FILE)) {
      const initial = {
        applications: [],
        connectors: [{ id: '1', agentCode: 'CON-101', name: 'Demo Connector', phone: '9999999999', password: 'connector123', createdAt: new Date().toISOString() }]
      };
      fs.mkdirSync(path.dirname(ACTIVE_DB_FILE), { recursive: true });
      fs.writeFileSync(ACTIVE_DB_FILE, JSON.stringify(initial, null, 2));
      console.log('📁 Created new file DB at', ACTIVE_DB_FILE);
    }
  } catch (e) {
    console.error('File DB ensure error:', e.message, 'trying fallback...');
    // Try to switch to fallback path
    ACTIVE_DB_FILE = getWritableDBPath();
    if (!ACTIVE_DB_FILE) {
      console.warn('⚠️ No writable file path, using in-memory DB (data will reset on restart)');
    }
  }
}

function readFileDB() {
  try {
    ensureFileDB();
    if (!ACTIVE_DB_FILE) {
      return memoryDB;
    }
    const raw = fs.readFileSync(ACTIVE_DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Keep memoryDB in sync
    memoryDB = parsed;
    return parsed;
  } catch (e) {
    console.error('readFileDB error:', e.message, 'using memoryDB');
    return memoryDB;
  }
}

function writeFileDB(data) {
  // Always update memoryDB
  memoryDB = data;
  if (!ACTIVE_DB_FILE) {
    console.warn('⚠️ No writable file, keeping data in memory only');
    return;
  }
  try {
    fs.mkdirSync(path.dirname(ACTIVE_DB_FILE), { recursive: true });
    fs.writeFileSync(ACTIVE_DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('writeFileDB error:', e.message, ' - trying fallback path');
    // Try to find another writable path
    ACTIVE_DB_FILE = getWritableDBPath();
    if (ACTIVE_DB_FILE) {
      try {
        fs.mkdirSync(path.dirname(ACTIVE_DB_FILE), { recursive: true });
        fs.writeFileSync(ACTIVE_DB_FILE, JSON.stringify(data, null, 2));
        console.log('✅ Recovered by switching to', ACTIVE_DB_FILE);
        return;
      } catch (e2) {
        console.error('Fallback write also failed:', e2.message);
      }
    }
    // If all fails, keep in memory (throw will be caught by caller, but we already updated memoryDB)
    console.warn('⚠️ Keeping data in memory only, file write failed');
  }
}

async function getAllApplications() {
  if (useMongo && mongoDb) {
    try { return await mongoDb.collection('applications').find().sort({ createdAt: -1 }).toArray(); }
    catch (e) { console.error('Mongo read apps failed, file fallback:', e.message); }
  }
  return readFileDB().applications.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
}
async function getAllConnectors() {
  if (useMongo && mongoDb) {
    try { return await mongoDb.collection('connectors').find().toArray(); }
    catch (e) { console.error('Mongo read connectors failed, file fallback:', e.message); }
  }
  return readFileDB().connectors;
}
async function findApplicationByCode(code) {
  const norm = code.trim().toUpperCase();
  if (useMongo && mongoDb) {
    try {
      const all = await mongoDb.collection('applications').find().toArray();
      return all.find(a => a.trackingCode.toUpperCase() === norm);
    } catch {}
  }
  return readFileDB().applications.find(a => a.trackingCode.toUpperCase() === norm);
}
async function findApplicationsByAgent(agentCode) {
  if (useMongo && mongoDb) {
    try { return await mongoDb.collection('applications').find({ agentCode: { $regex: `^${agentCode}$`, $options: 'i' } }).sort({ createdAt: -1 }).toArray(); } catch {}
  }
  return readFileDB().applications.filter(a => a.agentCode && a.agentCode.toUpperCase() === agentCode.toUpperCase()).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
}
async function createApplication(doc) {
  if (useMongo && mongoDb) {
    try { await mongoDb.collection('applications').insertOne(doc); return doc; } catch (e) { console.error('Mongo insert app failed, file fallback:', e.message); }
  }
  const db = readFileDB(); db.applications.push(doc); writeFileDB(db); return doc;
}
async function createConnector(doc) {
  if (useMongo && mongoDb) {
    try { await mongoDb.collection('connectors').insertOne(doc); const { password, ...safe } = doc; return safe; } catch (e) { console.error('Mongo insert connector failed, file fallback:', e.message); }
  }
  const db = readFileDB(); db.connectors.push(doc); writeFileDB(db); const { password, ...safe } = doc; return safe;
}
async function updateApplicationStatus(id, fileStatus) {
  if (useMongo && mongoDb) {
    try {
      const res = await mongoDb.collection('applications').findOneAndUpdate({ id }, { $set: { fileStatus, updatedAt: new Date().toISOString() } }, { returnDocument: 'after' });
      if (res) return res;
    } catch {}
  }
  const db = readFileDB(); const idx = db.applications.findIndex(a => a.id === id); if (idx === -1) return null;
  db.applications[idx].fileStatus = fileStatus; db.applications[idx].updatedAt = new Date().toISOString(); writeFileDB(db); return db.applications[idx];
}

function generateTrackingCode(existingCodes) {
  let code, attempts = 0;
  do {
    const num = Math.floor(100 + Math.random() * 900);
    const suffix = Math.random() > 0.8 ? Math.floor(10 + Math.random()*90) : '';
    code = suffix ? `MLB-${num}${suffix}` : `MLB-${num}`;
    attempts++; if (attempts > 100) { code = `MLB-${Date.now().toString().slice(-4)}`; break; }
  } while (existingCodes.includes(code));
  return code;
}
function generateAgentCode(existingCodes) {
  let code; do { const num = Math.floor(100 + Math.random() * 900); code = `CON-${num}`; } while (existingCodes.includes(code)); return code;
}

app.get('/api/health', async (req, res) => {
  try {
    const mode = useMongo && mongoDb ? `MongoDB (${mongoDb.databaseName})` : `File (${ACTIVE_DB_FILE || 'memory'})`;
    res.json({ status: 'ok', mode, time: new Date().toISOString() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { customerName, contactNumber, loanType, amount, source, agentCode } = req.body;
    if (!customerName || !contactNumber || !loanType || !amount) return res.status(400).json({ error: 'Missing required fields' });
    const allApps = await getAllApplications();
    const trackingCode = generateTrackingCode(allApps.map(a => a.trackingCode));
    const doc = { id: uuidv4(), trackingCode, customerName: customerName.trim(), contactNumber: contactNumber.trim(), loanType, amount: Number(amount), fileStatus: 'Logged In', source: source || 'direct', agentCode: agentCode || null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const created = await createApplication(doc); res.status(201).json(created);
  } catch (e) { console.error('Create app error:', e); res.status(500).json({ error: e.message }); }
});

app.get('/api/applications/track/:code', async (req, res) => {
  try {
    const found = await findApplicationByCode(req.params.code);
    if (!found) return res.status(404).json({ error: 'File not found. Please check your tracking code.' });
    res.json({ trackingCode: found.trackingCode, fileStatus: found.fileStatus, loanType: found.loanType, updatedAt: found.updatedAt });
  } catch (e) { console.error('Track error:', e); res.status(500).json({ error: e.message }); }
});

app.post('/api/connectors/register', async (req, res) => {
  try {
    console.log('Register attempt:', req.body.phone);
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ error: 'Name, phone, password required' });
    const connectors = await getAllConnectors();
    if (connectors.find(c => c.phone === phone)) return res.status(400).json({ error: 'Phone already registered' });
    const agentCode = generateAgentCode(connectors.map(c => c.agentCode));
    const doc = { id: uuidv4(), agentCode, name: name.trim(), phone: phone.trim(), password, createdAt: new Date().toISOString() };
    const safe = await createConnector(doc);
    console.log('Register success:', agentCode);
    res.status(201).json(safe);
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Server error: ' + e.message });
  }
});

app.post('/api/connectors/login', async (req, res) => {
  try {
    const { agentCode, phone, password } = req.body;
    const connectors = await getAllConnectors();
    let connector = null;
    if (agentCode) connector = connectors.find(c => c.agentCode.toUpperCase() === agentCode.trim().toUpperCase() && c.password === password);
    else if (phone) connector = connectors.find(c => c.phone === phone && c.password === password);
    if (!connector) return res.status(401).json({ error: 'Invalid Agent Code or Password' });
    const { password: _, ...safe } = connector; res.json(safe);
  } catch (e) { console.error('Login error:', e); res.status(500).json({ error: e.message }); }
});

app.get('/api/connectors/:agentCode/applications', async (req, res) => {
  try { res.json(await findApplicationsByAgent(req.params.agentCode)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/applications/by-connector', async (req, res) => {
  try {
    if (!req.query.agentCode) return res.status(400).json({ error: 'agentCode required' });
    res.json(await findApplicationsByAgent(req.query.agentCode.toString()));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/login', (req, res) => {
  try {
    const { userId, password } = req.body;
    if (userId === 'admin786' && password === 'dsapassword123') {
      return res.json({ success: true, token: Buffer.from(`${userId}:${password}`).toString('base64'), userId });
    }
    return res.status(401).json({ error: 'Invalid Admin Credentials' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/admin/applications', async (req, res) => {
  try { res.json(await getAllApplications()); } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/admin/connectors', async (req, res) => {
  try {
    const connectors = await getAllConnectors();
    res.json(connectors.map(({ password, ...rest }) => rest));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.patch('/api/admin/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params; const { fileStatus } = req.body;
    const allowed = ['Logged In', 'Bank Login', 'Sanctioned', 'Disbursed', 'Rejected'];
    if (!allowed.includes(fileStatus)) return res.status(400).json({ error: `Invalid status` });
    const updated = await updateApplicationStatus(id, fileStatus);
    if (!updated) return res.status(404).json({ error: 'Application not found' });
    res.json(updated);
  } catch (e) { console.error('Update status error:', e); res.status(500).json({ error: e.message }); }
});

const frontendDist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API not found' });
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MLB Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 DB File Attempt: ${DB_FILE}`);
  console.log(`📁 Active DB File: ${ACTIVE_DB_FILE || 'memory (fallback)'}`);
  if (useMongo) console.log(`📁 DB Mode: MongoDB Atlas URI set, connecting...`);
});
