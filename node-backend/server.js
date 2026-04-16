import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const SECRET = 'medtracker-secret-2024';

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── In-memory DB ──────────────────────────────────────────────
const db = {
  users: [
    { id: 1, name: 'Admin', email: 'admin@medtracker.com', password: bcrypt.hashSync('admin123', 10), role: 'ADMIN' },
    { id: 2, name: 'Demo User', email: 'user@medtracker.com', password: bcrypt.hashSync('admin123', 10), role: 'USER' },
  ],
  medications: [],
  cart: [],
  orders: [],
  prebooks: [],
  favorites: [],
  subscriptions: [],
  voiceCommands: [
    { id: 1, phrase: 'dashboard sellavum', action: 'NAVIGATE:/dashboard', description: 'Go to Dashboard', language: 'ta-IN' },
    { id: 2, phrase: 'marunthagam sellavum', action: 'NAVIGATE:/search-medicine', description: 'Search Medicine', language: 'ta-IN' },
    { id: 3, phrase: 'marunthu kedaikum idangal', action: 'NAVIGATE:/find-medicine', description: 'Find Medicine', language: 'ta-IN' },
    { id: 4, phrase: 'en orders', action: 'NAVIGATE:/my-orders', description: 'My Orders', language: 'ta-IN' },
  ],
  nextId: { user: 3, med: 1, cart: 1, order: 1, prebook: 1, fav: 1, sub: 1, vc: 5 },
};

const pharmacies = [
  { id: 1, name: 'Apollo Pharmacy', branch: 'Anna Nagar', address: '15 Anna Nagar, Chennai', phone: '044-12345678', rating: 4.5 },
  { id: 2, name: 'Apollo Pharmacy', branch: 'T Nagar', address: '22 T Nagar, Chennai', phone: '044-87654321', rating: 4.3 },
  { id: 3, name: 'MedPlus', branch: 'Velachery', address: '8 Velachery Main Rd, Chennai', phone: '044-11223344', rating: 4.1 },
  { id: 4, name: 'Netmeds', branch: 'Online', address: 'Online Delivery', phone: '1800-123-456', rating: 4.7 },
];

const medicines = [
  { id: 1, name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Analgesic', price: 15, manufacturer: 'Cipla', description: 'Pain and fever relief', requiresPrescription: false },
  { id: 2, name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotic', price: 45, manufacturer: 'Sun Pharma', description: 'Broad spectrum antibiotic', requiresPrescription: true },
  { id: 3, name: 'Metformin 500mg', genericName: 'Metformin HCl', category: 'Antidiabetic', price: 30, manufacturer: 'Dr Reddys', description: 'Type 2 diabetes management', requiresPrescription: true },
  { id: 4, name: 'Atorvastatin 10mg', genericName: 'Atorvastatin', category: 'Statin', price: 55, manufacturer: 'Pfizer', description: 'Cholesterol management', requiresPrescription: true },
  { id: 5, name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Antacid', price: 25, manufacturer: 'Cipla', description: 'Acid reflux treatment', requiresPrescription: false },
  { id: 6, name: 'Cetirizine 10mg', genericName: 'Cetirizine HCl', category: 'Antihistamine', price: 20, manufacturer: 'GSK', description: 'Allergy relief', requiresPrescription: false },
  { id: 7, name: 'Azithromycin 500mg', genericName: 'Azithromycin', category: 'Antibiotic', price: 85, manufacturer: 'Cipla', description: 'Bacterial infections', requiresPrescription: true },
  { id: 8, name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'NSAID', price: 18, manufacturer: 'Abbott', description: 'Pain and inflammation', requiresPrescription: false },
];

let adminMedicines = [...medicines];
let nextMedId = 9;

const pmStock = [
  { id:1, pharmacyId:1, medicineId:1, stock:100, price:15 }, { id:2, pharmacyId:1, medicineId:2, stock:50, price:45 },
  { id:3, pharmacyId:1, medicineId:3, stock:75, price:30 }, { id:4, pharmacyId:1, medicineId:5, stock:60, price:25 },
  { id:5, pharmacyId:2, medicineId:1, stock:80, price:14 }, { id:6, pharmacyId:2, medicineId:4, stock:40, price:55 },
  { id:7, pharmacyId:2, medicineId:6, stock:90, price:20 }, { id:8, pharmacyId:2, medicineId:8, stock:70, price:18 },
  { id:9, pharmacyId:3, medicineId:1, stock:120, price:13.5 }, { id:10, pharmacyId:3, medicineId:2, stock:30, price:44 },
  { id:11, pharmacyId:3, medicineId:7, stock:25, price:85 }, { id:12, pharmacyId:3, medicineId:3, stock:55, price:29 },
  { id:13, pharmacyId:4, medicineId:1, stock:200, price:12 }, { id:14, pharmacyId:4, medicineId:5, stock:150, price:23 },
  { id:15, pharmacyId:4, medicineId:6, stock:180, price:19 }, { id:16, pharmacyId:4, medicineId:8, stock:160, price:17 },
];

// ── Auth middleware ───────────────────────────────────────────
const auth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(h.replace('Bearer ', ''), SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
  next();
};

// ── Auth routes ───────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
  const user = { id: db.nextId.user++, name, email, password: bcrypt.hashSync(password, 10), role: 'USER' };
  db.users.push(user);
  const token = jwt.sign({ id: user.id, email, role: user.role }, SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name, email, role: user.role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email, role: user.role }, SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name, email, role: user.role } });
});

app.get('/api/auth/verify', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// ── Pharmacies ────────────────────────────────────────────────
app.get('/api/pharmacies', auth, (req, res) => res.json(pharmacies));

// ── Medicines ─────────────────────────────────────────────────
app.get('/api/medicines/search', auth, (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  res.json(adminMedicines.filter(m => m.name.toLowerCase().includes(q) || (m.genericName||'').toLowerCase().includes(q)));
});

app.get('/api/medicines/availability/search', auth, (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const found = adminMedicines.filter(m => m.name.toLowerCase().includes(q));
  res.json(found);
});

app.get('/api/medicines/:id/pharmacies', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const avail = pmStock.filter(p => p.medicineId === id).map(p => ({
    ...p, pharmacy: pharmacies.find(ph => ph.id === p.pharmacyId),
    medicine: adminMedicines.find(m => m.id === id)
  }));
  res.json(avail);
});

app.get('/api/medicines/:id/alternatives', auth, (req, res) => {
  const med = adminMedicines.find(m => m.id === parseInt(req.params.id));
  if (!med) return res.status(404).json({ error: 'Not found' });
  res.json(adminMedicines.filter(m => m.category === med.category && m.id !== med.id));
});

app.get('/api/medicines/:id', auth, (req, res) => {
  const med = adminMedicines.find(m => m.id === parseInt(req.params.id));
  med ? res.json(med) : res.status(404).json({ error: 'Not found' });
});

// ── Medications ───────────────────────────────────────────────
app.get('/api/medications', auth, (req, res) => res.json(db.medications.filter(m => m.userId === req.user.id)));
app.post('/api/medications', auth, (req, res) => {
  const med = { id: db.nextId.med++, userId: req.user.id, taken: false, ...req.body };
  db.medications.push(med); res.json(med);
});
app.put('/api/medications/:id', auth, (req, res) => {
  const med = db.medications.find(m => m.id === parseInt(req.params.id) && m.userId === req.user.id);
  if (!med) return res.status(404).json({ error: 'Not found' });
  Object.assign(med, req.body); res.json(med);
});
app.delete('/api/medications/:id', auth, (req, res) => {
  db.medications = db.medications.filter(m => !(m.id === parseInt(req.params.id) && m.userId === req.user.id));
  res.json({ message: 'Deleted' });
});
app.post('/api/medications/:id/taken', auth, (req, res) => {
  const med = db.medications.find(m => m.id === parseInt(req.params.id) && m.userId === req.user.id);
  if (!med) return res.status(404).json({ error: 'Not found' });
  med.taken = true; res.json(med);
});

// ── Cart & Orders ─────────────────────────────────────────────
app.get('/api/cart', auth, (req, res) => {
  res.json(db.cart.filter(c => c.userId === req.user.id).map(c => ({
    ...c,
    medicine: adminMedicines.find(m => m.id === c.medicineId),
    pharmacy: pharmacies.find(p => p.id === c.pharmacyId)
  })));
});

app.post('/api/cart', auth, (req, res) => {
  const { medicineId, pharmacyId, price, quantity = 1 } = req.body;
  const existing = db.cart.find(c => c.userId === req.user.id && c.medicineId === medicineId && c.pharmacyId === pharmacyId);
  if (existing) { existing.quantity += quantity; return res.json(existing); }
  const item = { id: db.nextId.cart++, userId: req.user.id, medicineId, pharmacyId, price, quantity };
  db.cart.push(item); res.json(item);
});

app.delete('/api/cart/:medicineId/:pharmacyId', auth, (req, res) => {
  db.cart = db.cart.filter(c => !(c.userId === req.user.id &&
    c.medicineId === parseInt(req.params.medicineId) && c.pharmacyId === parseInt(req.params.pharmacyId)));
  res.json({ message: 'Removed' });
});

app.post('/api/orders', auth, (req, res) => {
  const cartItems = db.cart.filter(c => c.userId === req.user.id);
  if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });
  const items = cartItems.map(c => ({
    medicine: adminMedicines.find(m => m.id === c.medicineId),
    pharmacy: pharmacies.find(p => p.id === c.pharmacyId),
    quantity: c.quantity, price: c.price
  }));
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const order = { id: db.nextId.order++, userId: req.user.id, items, total, status: 'PENDING', createdAt: new Date(), address: req.body.address || '' };
  db.orders.push(order);
  db.cart = db.cart.filter(c => c.userId !== req.user.id);
  res.json(order);
});

app.get('/api/orders', auth, (req, res) => res.json(db.orders.filter(o => o.userId === req.user.id).reverse()));

// ── Prebooks ──────────────────────────────────────────────────
app.get('/api/prebooks', auth, (req, res) => res.json(db.prebooks.filter(p => p.userId === req.user.id)));
app.post('/api/prebooks', auth, (req, res) => {
  const pb = { id: db.nextId.prebook++, userId: req.user.id, status: 'PENDING', ...req.body,
    medicine: adminMedicines.find(m => m.id === req.body.medicineId),
    pharmacy: pharmacies.find(p => p.id === req.body.pharmacyId) };
  db.prebooks.push(pb); res.json(pb);
});
app.delete('/api/prebooks/:id', auth, (req, res) => {
  const pb = db.prebooks.find(p => p.id === parseInt(req.params.id));
  if (pb) pb.status = 'CANCELLED';
  res.json(pb || { message: 'Not found' });
});

// ── Favorites ─────────────────────────────────────────────────
app.get('/api/favorites', auth, (req, res) => res.json(db.favorites.filter(f => f.userId === req.user.id).map(f => ({
  ...f, medicine: adminMedicines.find(m => m.id === f.medicineId)
}))));
app.post('/api/favorites', auth, (req, res) => {
  const { medicineId } = req.body;
  if (db.favorites.find(f => f.userId === req.user.id && f.medicineId === medicineId))
    return res.json({ message: 'Already in favorites' });
  const fav = { id: db.nextId.fav++, userId: req.user.id, medicineId };
  db.favorites.push(fav); res.json(fav);
});
app.delete('/api/favorites/:medicineId', auth, (req, res) => {
  db.favorites = db.favorites.filter(f => !(f.userId === req.user.id && f.medicineId === parseInt(req.params.medicineId)));
  res.json({ message: 'Removed' });
});

// ── Subscriptions ─────────────────────────────────────────────
app.get('/api/subscriptions', auth, (req, res) => res.json(db.subscriptions.filter(s => s.userId === req.user.id).map(s => ({
  ...s, medicine: adminMedicines.find(m => m.id === s.medicineId)
}))));
app.post('/api/subscriptions', auth, (req, res) => {
  const sub = { id: db.nextId.sub++, userId: req.user.id, status: 'ACTIVE', ...req.body };
  db.subscriptions.push(sub); res.json(sub);
});
app.put('/api/subscriptions/:id', auth, (req, res) => {
  const sub = db.subscriptions.find(s => s.id === parseInt(req.params.id));
  if (sub) Object.assign(sub, req.body);
  res.json(sub || { error: 'Not found' });
});
app.delete('/api/subscriptions/:id', auth, (req, res) => {
  const sub = db.subscriptions.find(s => s.id === parseInt(req.params.id));
  if (sub) sub.status = 'CANCELLED';
  res.json(sub || { error: 'Not found' });
});

// ── Emergency / Reviews / Prescriptions ──────────────────────
app.get('/api/emergency-contacts', auth, (req, res) => res.json([
  { name: 'Ambulance', number: '108', type: 'emergency' },
  { name: 'Police', number: '100', type: 'emergency' },
  { name: 'Fire', number: '101', type: 'emergency' },
]));
app.post('/api/reviews', auth, (req, res) => res.json({ message: 'Review submitted' }));
app.post('/api/prescriptions', auth, (req, res) => res.json({ message: 'Prescription uploaded' }));

// ── Admin routes ──────────────────────────────────────────────
app.get('/api/admin/stats', auth, adminOnly, (req, res) => {
  const revenue = db.orders.reduce((s, o) => s + (o.total || 0), 0);
  res.json({ totalUsers: db.users.length, totalMedicines: adminMedicines.length, totalOrders: db.orders.length, totalRevenue: revenue });
});

app.get('/api/admin/users', auth, adminOnly, (req, res) => res.json(db.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))));
app.put('/api/admin/users/:id/role', auth, adminOnly, (req, res) => {
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (user) user.role = req.body.role;
  res.json(user ? { id: user.id, name: user.name, email: user.email, role: user.role } : { error: 'Not found' });
});

app.get('/api/admin/medicines', auth, adminOnly, (req, res) => res.json(adminMedicines));
app.post('/api/admin/medicines', auth, adminOnly, (req, res) => {
  const med = { id: nextMedId++, ...req.body };
  adminMedicines.push(med); res.json(med);
});
app.put('/api/admin/medicines/:id', auth, adminOnly, (req, res) => {
  const med = adminMedicines.find(m => m.id === parseInt(req.params.id));
  if (med) Object.assign(med, req.body);
  res.json(med || { error: 'Not found' });
});
app.delete('/api/admin/medicines/:id', auth, adminOnly, (req, res) => {
  adminMedicines = adminMedicines.filter(m => m.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted' });
});

app.get('/api/admin/orders', auth, adminOnly, (req, res) => res.json(db.orders.map(o => ({
  ...o, user: db.users.find(u => u.id === o.userId)
}))));
app.put('/api/admin/orders/:id/status', auth, adminOnly, (req, res) => {
  const order = db.orders.find(o => o.id === parseInt(req.params.id));
  if (order) order.status = req.body.status;
  res.json(order || { error: 'Not found' });
});

app.get('/api/admin/inventory', auth, adminOnly, (req, res) => res.json(pmStock.map(p => ({
  ...p, pharmacy: pharmacies.find(ph => ph.id === p.pharmacyId),
  medicine: adminMedicines.find(m => m.id === p.medicineId)
}))));
app.put('/api/admin/inventory/:id', auth, adminOnly, (req, res) => {
  const item = pmStock.find(p => p.id === parseInt(req.params.id));
  if (item) Object.assign(item, req.body);
  res.json(item || { error: 'Not found' });
});

app.get('/api/admin/voice-commands', auth, adminOnly, (req, res) => res.json(db.voiceCommands));
app.post('/api/admin/voice-commands', auth, adminOnly, (req, res) => {
  const vc = { id: db.nextId.vc++, ...req.body };
  db.voiceCommands.push(vc); res.json(vc);
});
app.put('/api/admin/voice-commands/:id', auth, adminOnly, (req, res) => {
  const vc = db.voiceCommands.find(v => v.id === parseInt(req.params.id));
  if (vc) Object.assign(vc, req.body);
  res.json(vc || { error: 'Not found' });
});
app.delete('/api/admin/voice-commands/:id', auth, adminOnly, (req, res) => {
  db.voiceCommands = db.voiceCommands.filter(v => v.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted' });
});

app.get('/api/admin/notifications', auth, adminOnly, (req, res) => res.json({ notifications: [] }));
app.post('/api/admin/notifications', auth, adminOnly, (req, res) => res.json({ message: 'Notification sent', data: req.body }));

app.get('/api/admin/reports', auth, adminOnly, (req, res) => {
  const revenue = db.orders.reduce((s, o) => s + (o.total || 0), 0);
  res.json({ totalUsers: db.users.length, totalOrders: db.orders.length, totalRevenue: revenue, totalMedicines: adminMedicines.length });
});

app.listen(8080, () => console.log('MedTracker backend running on http://localhost:8080'));
