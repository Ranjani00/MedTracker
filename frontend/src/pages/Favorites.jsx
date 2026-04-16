import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Favorites() {
  const [favs, setFavs] = useState([]);
  const load = () => api.get('/favorites').then(r => setFavs(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const remove = async medicineId => {
    await api.delete(`/favorites/${medicineId}`);
    load();
  };

  const addToCart = async m => {
    await api.post('/cart', { medicineId: m.id, pharmacyId: 1, price: m.price, quantity: 1 });
    alert('Added to cart!');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">⭐ Favorites</div>
        <div className="page-sub">Your saved medicines</div>
      </div>

      {favs.length === 0
        ? <div className="glass-panel" style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⭐</div>
            <div style={{ fontWeight: 600 }}>No favorites yet</div>
            <div style={{ fontSize: '0.85rem', marginTop: 4 }}>Search medicines and save your favorites</div>
          </div>
        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {favs.map(f => (
              <div key={f.id} className="glass-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12,
                    background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>⭐</div>
                  <span style={{ padding: '4px 10px', background: 'rgba(99,102,241,0.08)',
                    color: '#6366f1', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                    {f.medicine?.category}
                  </span>
                </div>
                <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{f.medicine?.name}</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 2 }}>{f.medicine?.genericName}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#059669' }}>₹{f.medicine?.price}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => addToCart(f.medicine)}>🛒</button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => remove(f.medicine?.id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
