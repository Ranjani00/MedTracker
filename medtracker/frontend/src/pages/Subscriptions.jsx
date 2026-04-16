import React, { useEffect, useState } from 'react';
import api from '../api';

const PLANS = [
  { id: 'weekly', label: 'Weekly', icon: '📅', desc: 'Delivered every week', price: '₹49/week' },
  { id: 'monthly', label: 'Monthly', icon: '🗓️', desc: 'Delivered every month', price: '₹149/month' },
  { id: 'quarterly', label: 'Quarterly', icon: '📆', desc: 'Delivered every 3 months', price: '₹399/quarter' },
];

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ medicineName: '', frequency: 'monthly' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/subscriptions').then(r => setSubs(r.data)).catch(() => setSubs([]));
  useEffect(() => { load(); }, []);

  const cancel = async id => {
    await api.delete(`/subscriptions/${id}`);
    load();
  };

  const subscribe = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/subscriptions', form);
      setMsg('Subscription created!');
      setShowForm(false);
      setForm({ medicineName: '', frequency: 'monthly' });
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Failed to subscribe.'); }
    setLoading(false);
  };

  const statusColor = s => s === 'ACTIVE' ? '#16a34a' : s === 'PAUSED' ? '#d97706' : '#dc2626';

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>🔔 Subscriptions</h1>
          <p style={{ color: '#64748b', marginTop: 4, fontSize: '0.9rem' }}>Manage your medicine delivery plans</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {showForm ? '✕ Close' : '+ New Subscription'}
        </button>
      </div>

      {msg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px',
          color: '#16a34a', fontWeight: 600, marginBottom: 16 }}>{msg}</div>
      )}

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {PLANS.map(p => (
          <div key={p.id} className="card" style={{ textAlign: 'center', cursor: 'pointer',
            border: form.frequency === p.id && showForm ? '2px solid #6366f1' : '2px solid transparent',
            transition: 'all 0.2s' }}
            onClick={() => { setForm(f => ({ ...f, frequency: p.id })); setShowForm(true); }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{p.icon}</div>
            <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{p.label}</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 8 }}>{p.desc}</p>
            <span style={{ background: '#ede9fe', color: '#6366f1', borderRadius: 20, padding: '3px 12px',
              fontSize: '0.82rem', fontWeight: 700 }}>{p.price}</span>
          </div>
        ))}
      </div>

      {/* New subscription form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, maxWidth: 480 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>New Subscription</h3>
          <form onSubmit={subscribe} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Medicine Name
              </label>
              <input className="input" placeholder="e.g. Paracetamol 500mg"
                value={form.medicineName}
                onChange={e => setForm(f => ({ ...f, medicineName: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Frequency
              </label>
              <select className="input" value={form.frequency}
                onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Subscribing...' : '🔔 Subscribe'}
            </button>
          </form>
        </div>
      )}

      {/* Active subscriptions */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
        Active Subscriptions ({subs.length})
      </h2>
      {subs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔕</div>
          <p style={{ color: '#9ca3af', fontWeight: 500 }}>No active subscriptions yet</p>
          <p style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Click "New Subscription" to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {subs.map(s => (
            <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ede9fe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>💊</div>
                <div>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                    {s.medicine?.name || s.medicineName || 'Medicine'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {s.frequency} · Next delivery: {s.nextDelivery || 'Scheduled'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ background: statusColor(s.status) + '20', color: statusColor(s.status),
                  borderRadius: 20, padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {s.status || 'ACTIVE'}
                </span>
                <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  onClick={() => cancel(s.id)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
