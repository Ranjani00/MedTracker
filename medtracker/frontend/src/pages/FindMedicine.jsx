import React, { useEffect, useState } from 'react';
import api from '../api';

export default function FindMedicine() {
  const [pharmacies, setPharmacies] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { api.get('/pharmacies').then(r => setPharmacies(r.data)).catch(() => {}); }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📍 Find Medicine</div>
        <div className="page-sub">Locate medicines at nearby pharmacies</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {pharmacies.map(p => (
          <div key={p.id} className="glass-panel" style={{ padding: 20, cursor: 'pointer',
            transition: 'all 0.2s', border: selected === p.id ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.9)' }}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg,#10b981,#059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🏥</div>
              <span style={{ padding: '4px 10px', background: '#fef3c7', color: '#d97706',
                borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>⭐ {p.rating}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b' }}>{p.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 600, marginTop: 2 }}>{p.branch}</div>
            <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 8 }}>📍 {p.address}</div>
            <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 4 }}>📞 {p.phone}</div>
            {selected === p.id && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(99,102,241,0.06)',
                borderRadius: 10, fontSize: '0.82rem', color: '#6366f1', fontWeight: 500 }}>
                ✅ Selected — medicines from this pharmacy will be added to your cart
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
