import React, { useState } from 'react';
import api from '../../api';

const HISTORY = [
  { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance on March 25', type: 'WARNING', date: '2026-03-18', sent: 320 },
  { id: 2, title: 'New Medicines Added', message: '15 new medicines added to inventory', type: 'INFO', date: '2026-03-15', sent: 320 },
  { id: 3, title: 'Order Delivered', message: 'Bulk order delivery completed', type: 'SUCCESS', date: '2026-03-12', sent: 45 },
];

const typeConfig = {
  INFO: { color: '#3b82f6', bg: '#eff6ff', icon: 'ℹ️' },
  WARNING: { color: '#d97706', bg: '#fffbeb', icon: '⚠️' },
  SUCCESS: { color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
  ERROR: { color: '#dc2626', bg: '#fef2f2', icon: '🚨' },
};

export default function AdminNotifications() {
  const [form, setForm] = useState({ title: '', message: '', type: 'INFO' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState('send');

  const send = async e => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/admin/notifications', form);
      setSent(true);
      setForm({ title: '', message: '', type: 'INFO' });
      setTimeout(() => setSent(false), 4000);
    } catch { /* ignore */ }
    setSending(false);
  };

  const cfg = typeConfig[form.type] || typeConfig.INFO;

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>🔔 Notifications</h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: '0.9rem' }}>Send announcements and alerts to all users</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { icon: '📤', label: 'Total Sent', value: '48' },
          { icon: '👥', label: 'Total Users', value: '320' },
          { icon: '📖', label: 'Avg Read Rate', value: '74%' },
          { icon: '⚡', label: 'This Month', value: '12' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6366f1' }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['send', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600,
              fontSize: '0.88rem', transition: 'all 0.2s',
              background: tab === t ? '#6366f1' : '#f1f5f9',
              color: tab === t ? '#fff' : '#374151' }}>
            {t === 'send' ? '📤 Send Notification' : '📋 History'}
          </button>
        ))}
      </div>

      {tab === 'send' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
          {/* Form */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>Compose Notification</h3>

            {sent && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
                padding: '10px 16px', color: '#16a34a', fontWeight: 600, marginBottom: 16 }}>
                ✅ Notification sent to all users!
              </div>
            )}

            <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Type
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {Object.entries(typeConfig).map(([key, val]) => (
                    <button key={key} type="button"
                      onClick={() => setForm(f => ({ ...f, type: key }))}
                      style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: '2px solid',
                        borderColor: form.type === key ? val.color : '#e2e8f0',
                        background: form.type === key ? val.bg : '#fff',
                        color: form.type === key ? val.color : '#94a3b8',
                        cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s' }}>
                      {val.icon} {key}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Title
                </label>
                <input className="input" placeholder="Notification title"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Message
                </label>
                <textarea className="input" style={{ minHeight: 100, resize: 'vertical' }}
                  placeholder="Write your notification message..."
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={sending} style={{ width: '100%' }}>
                {sending ? 'Sending...' : '📤 Send to All Users (320)'}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>Preview</h3>
            <div style={{ border: `1px solid ${cfg.color}40`, borderRadius: 12, padding: 16,
              background: cfg.bg, borderLeft: `4px solid ${cfg.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{cfg.icon}</span>
                <span style={{ fontWeight: 700, color: cfg.color, fontSize: '0.9rem' }}>
                  {form.type}
                </span>
              </div>
              <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                {form.title || 'Notification Title'}
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {form.message || 'Your notification message will appear here...'}
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: 10 }}>
                Just now · MedTracker
              </p>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 10 }}>
              <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                📊 Estimated Reach
              </p>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>320 users</p>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>All registered users will receive this</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {HISTORY.map(n => {
            const c = typeConfig[n.type] || typeConfig.INFO;
            return (
              <div key={n.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                    border: `1px solid ${c.color}30` }}>{c.icon}</div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{n.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748b' }}>{n.message}</p>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{n.date} · {n.sent} users</p>
                  </div>
                </div>
                <span style={{ background: c.bg, color: c.color, borderRadius: 20,
                  padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700 }}>{n.type}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
