import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const STATS = (meds, orders, medications) => [
  { label: 'Total Medicines',   value: meds.length,                                  icon: '💊', color: 'purple', change: '+12%', up: true },
  { label: 'Available Stock',   value: meds.filter(m => !m.requiresPrescription).length, icon: '✅', color: 'green',  change: '+5%',  up: true },
  { label: 'Require Rx',        value: meds.filter(m => m.requiresPrescription).length,  icon: '📋', color: 'amber',  change: '0%',   up: true },
  { label: 'My Orders',         value: orders.length,                                icon: '📦', color: 'blue',   change: '+8%',  up: true },
  { label: 'Medications Today', value: medications.length,                           icon: '⏰', color: 'red',    change: `${medications.filter(m=>m.taken).length} taken`, up: true },
];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [cart, setCart] = useState([]);

  // Table state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  useEffect(() => {
    api.get('/medicines/search?q=').then(r => setMedicines(r.data)).catch(() => {});
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {});
    api.get('/medications').then(r => setMedications(r.data)).catch(() => {});
    api.get('/cart').then(r => setCart(r.data)).catch(() => {});
  }, []);

  // Search all medicines on load
  useEffect(() => {
    api.get('/medicines/search?q=a').then(r => setMedicines(r.data)).catch(() => {});
  }, []);

  const categories = useMemo(() => ['All', ...new Set(medicines.map(m => m.category).filter(Boolean))], [medicines]);

  const filtered = useMemo(() => {
    let list = medicines.filter(m => {
      const q = search.toLowerCase();
      return (!q || m.name.toLowerCase().includes(q) || (m.genericName||'').toLowerCase().includes(q));
    });
    if (categoryFilter !== 'All') list = list.filter(m => m.category === categoryFilter);
    list = [...list].sort((a, b) => {
      const av = a[sortCol] ?? ''; const bv = b[sortCol] ?? '';
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [medicines, search, categoryFilter, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const sort = col => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const sortIcon = col => sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  const addToCart = async m => {
    await api.post('/cart', { medicineId: m.id, pharmacyId: 1, price: m.price, quantity: 1 });
    const r = await api.get('/cart');
    setCart(r.data);
  };

  const updateQty = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty <= 0) {
      await api.delete(`/cart/${item.medicineId || item.medicine?.id}/1`);
    } else {
      await api.post('/cart', { medicineId: item.medicineId || item.medicine?.id, pharmacyId: 1, price: item.price, quantity: delta });
    }
    const r = await api.get('/cart');
    setCart(r.data);
  };

  const cartTotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

  const checkout = async () => {
    await api.post('/orders', { address: 'Home Delivery' });
    setCart([]);
    const r = await api.get('/orders');
    setOrders(r.data);
    alert('Order placed successfully!');
  };

  const stats = STATS(medicines, orders, medications);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">Good day, {user.name || 'User'} 👋</div>
        <div className="page-sub">Here's your MedTracker overview for today</div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
              {s.up ? '↑' : '↓'} {s.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* Medicine Table */}
        <div className="glass-panel">
          <div className="table-toolbar">
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b', marginRight: 8 }}>💊 Medicines</div>
            <div className="search-box">
              <span style={{ color: '#9ca3af' }}>🔍</span>
              <input placeholder="Search medicines..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="filter-select" value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary" onClick={() => navigate('/search-medicine')}>
              + Add
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="med-table">
              <thead>
                <tr>
                  {[['name','Medicine'],['genericName','Generic'],['category','Category'],['price','Price'],['','Status'],['','Actions']].map(([col,label]) => (
                    <th key={label} onClick={() => col && sort(col)}>{label}{col && sortIcon(col)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0
                  ? <tr><td colSpan={6} style={{ textAlign:'center', color:'#9ca3af', padding: 32 }}>No medicines found</td></tr>
                  : paginated.map(m => (
                    <tr key={m.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e1b4b' }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{m.manufacturer}</div>
                      </td>
                      <td style={{ color: '#6b7280' }}>{m.genericName || '—'}</td>
                      <td>
                        <span style={{ padding: '3px 10px', background: 'rgba(99,102,241,0.08)',
                          color: '#6366f1', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                          {m.category || '—'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>₹{m.price}</td>
                      <td>
                        <span className={`status-badge ${m.requiresPrescription ? 'low-stock' : 'in-stock'}`}>
                          {m.requiresPrescription ? '📋 Rx Required' : '✅ OTC'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="action-btn view" onClick={() => navigate('/search-medicine')}>View</button>
                          <button className="action-btn edit" onClick={() => addToCart(m)}>🛒 Cart</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
            <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
              Showing {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
            </div>
            <div className="pagination" style={{ padding: 0 }}>
              <button className="page-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                <button key={p} className={`page-btn ${page===p?'active':''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>›</button>
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="glass-panel" style={{ position: 'sticky', top: 88 }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(99,102,241,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b' }}>🛒 Cart</div>
            <span style={{ background: '#6366f1', color: 'white', borderRadius: 20,
              fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px' }}>{cart.length}</span>
          </div>

          {cart.length === 0
            ? <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🛒</div>
                <div>Your cart is empty</div>
                <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Add medicines from the table</div>
              </div>
            : <>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {cart.map((item, i) => (
                    <div key={i} className="cart-item">
                      <div style={{ width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', flexShrink: 0 }}>💊</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e1b4b',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.medicine?.name || 'Medicine'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>₹{item.price} each</div>
                      </div>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQty(item, -1)}>−</button>
                        <span className="qty-num">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQty(item, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ color: '#6b7280', fontWeight: 500 }}>Subtotal</span>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e1b4b' }}>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }}
                    onClick={checkout}>
                    ✅ Checkout — ₹{cartTotal.toFixed(2)}
                  </button>
                  <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                    onClick={() => navigate('/my-orders')}>
                    View All Orders
                  </button>
                </div>
              </>
          }
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="glass-panel" style={{ marginTop: 20 }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(99,102,241,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b' }}>📦 Recent Orders</div>
            <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => navigate('/my-orders')}>View All</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="med-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0,4).map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700 }}>#{o.id}</td>
                    <td style={{ color: '#6b7280' }}>{(o.items||[]).length} item(s)</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>₹{o.total?.toFixed(2)}</td>
                    <td><span className="status-badge in-stock">{o.status}</span></td>
                    <td style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
