import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Pharmacies() {
  const [list, setList] = useState([]);
  useEffect(() => { api.get('/pharmacies').then(r => setList(r.data)).catch(() => {}); }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🏥 Pharmacies</div>
        <div className="page-sub">Browse all available pharmacies</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {list.map(p => (
          <div key={p.id} className="glass-panel" style={{ padding: 22, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14,
                background: 'linear-gradient(135deg,#10b981,#059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🏥</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                background: '#fef3c7', borderRadius: 20 }}>
                <span style={{ color: '#f59e0b' }}>★</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#d97706' }}>{p.rating}</span>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e1b4b' }}>{p.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 600, marginTop: 2 }}>{p.branch}</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', display: 'flex', gap: 8 }}>
                <span>📍</span><span>{p.address}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', display: 'flex', gap: 8 }}>
                <span>📞</span><span>{p.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
