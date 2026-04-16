import React, { useState } from 'react';
import api from '../api';

export default function SearchMedicine() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState({});

  const search = async e => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/medicines/search?q=${encodeURIComponent(q)}`);
      setResults(data);
    } catch { setResults([]); } finally { setLoading(false); }
  };

  const addToCart = async m => {
    try {
      await api.post('/cart', { medicineId: m.id, pharmacyId: 1, price: m.price, quantity: 1 });
      setAdded(prev => ({ ...prev, [m.id]: true }));
      setTimeout(() => setAdded(prev => ({ ...prev, [m.id]: false })), 2000);
    } catch {}
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">💊 Medicine Search</div>
        <div className="page-sub">Search by name, generic name or category</div>
      </div>

      <form onSubmit={search} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div className="search-box" style={{ flex: 1, maxWidth: 520 }}>
          <span style={{ color: '#9ca3af' }}>🔍</span>
          <input placeholder="Search medicines e.g. Paracetamol, Amoxicillin..."
            value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? '⏳ Searching...' : '🔍 Search'}
        </button>
      </form>

      {results.length === 0 && q && !loading && (
        <div className="glass-panel" style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔍</div>
          <div>No medicines found for "{q}"</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {results.map(m => (
          <div key={m.id} className="glass-panel" style={{ padding: 20, transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>💊</div>
              <span style={{ padding: '4px 10px', background: 'rgba(99,102,241,0.08)',
                color: '#6366f1', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                {m.category}
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b', marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 4 }}>{m.genericName}</div>
            <div style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: 12 }}>{m.description}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#059669' }}>₹{m.price}</span>
                {m.requiresPrescription && (
                  <span style={{ marginLeft: 8, fontSize: '0.72rem', background: '#fef3c7',
                    color: '#d97706', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>Rx</span>
                )}
              </div>
              <button className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.82rem' }}
                onClick={() => addToCart(m)}>
                {added[m.id] ? '✅ Added!' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
