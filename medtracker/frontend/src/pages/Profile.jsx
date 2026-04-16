import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [orders, setOrders] = useState([]);
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {});
    api.get('/medications').then(r => setMeds(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">👤 Profile</div>
        <div className="page-sub">Your account information</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Profile card */}
        <div className="glass-panel" style={{ padding: 28, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: 'white', fontWeight: 800,
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
            {user.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e1b4b' }}>{user.name}</div>
          <div style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: 4 }}>{user.email}</div>
          <span style={{ display: 'inline-block', marginTop: 10, padding: '4px 14px',
            background: user.role === 'ADMIN' ? '#fef3c7' : 'rgba(99,102,241,0.1)',
            color: user.role === 'ADMIN' ? '#d97706' : '#6366f1',
            borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
            {user.role}
          </span>
          <div style={{ marginTop: 20, padding: '14px', background: 'rgba(99,102,241,0.05)',
            borderRadius: 12, fontSize: '0.82rem', color: '#6b7280' }}>
            User ID: #{user.id}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[
              { label: 'Total Orders', value: orders.length, icon: '📦', color: '#6366f1' },
              { label: 'Medications', value: meds.length, icon: '💊', color: '#10b981' },
              { label: 'Taken Today', value: meds.filter(m => m.taken).length, icon: '✅', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="glass-panel" style={{ padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.6rem', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 14 }}>Account Details</div>
            {[
              ['Full Name', user.name],
              ['Email', user.email],
              ['Role', user.role],
              ['User ID', `#${user.id}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid rgba(99,102,241,0.06)',
                fontSize: '0.88rem' }}>
                <span style={{ color: '#6b7280', fontWeight: 500 }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#1e1b4b' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
