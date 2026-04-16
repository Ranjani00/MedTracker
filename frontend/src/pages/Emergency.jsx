import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Emergency() {
  const [contacts, setContacts] = useState([]);
  useEffect(() => { api.get('/emergency-contacts').then(r => setContacts(r.data)).catch(() => {}); }, []);

  const tips = [
    { icon: '💊', tip: 'Keep a list of all your current medications' },
    { icon: '🩺', tip: 'Know your blood type and allergies' },
    { icon: '📋', tip: 'Carry your prescription copies' },
    { icon: '🏥', tip: 'Know the nearest hospital location' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🚨 Emergency</div>
        <div className="page-sub">Quick access to emergency contacts</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
        {contacts.map((c, i) => (
          <a key={i} href={`tel:${c.number}`} style={{ textDecoration: 'none' }}>
            <div className="glass-panel" style={{ padding: 24, textAlign: 'center', cursor: 'pointer',
              borderTop: '4px solid #ef4444', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🆘</div>
              <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1rem' }}>{c.name}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: 8 }}>{c.number}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>Tap to call</div>
            </div>
          </a>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>💡 Emergency Tips</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {tips.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '12px 14px', background: 'rgba(99,102,241,0.04)', borderRadius: 12 }}>
              <span style={{ fontSize: '1.3rem' }}>{t.icon}</span>
              <span style={{ fontSize: '0.85rem', color: '#374151' }}>{t.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
