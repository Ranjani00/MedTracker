import React, { useState } from 'react';

const RECENT_DONATIONS = [
  { id: 1, donor: 'Ananya S.', medicine: 'Paracetamol 500mg', qty: 20, date: '2026-03-18', status: 'Available' },
  { id: 2, donor: 'Ravi K.', medicine: 'Cetirizine 10mg', qty: 15, date: '2026-03-15', status: 'Claimed' },
  { id: 3, donor: 'Meena P.', medicine: 'Omeprazole 20mg', qty: 10, date: '2026-03-12', status: 'Available' },
];

const STATS = [
  { icon: '💊', label: 'Medicines Donated', value: '1,240' },
  { icon: '👥', label: 'People Helped', value: '380' },
  { icon: '🏥', label: 'Partner NGOs', value: '12' },
  { icon: '🌍', label: 'Cities Covered', value: '8' },
];

export default function Donations() {
  const [form, setForm] = useState({ medicine: '', qty: '', expiry: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState('donate');

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ medicine: '', qty: '', expiry: '', note: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>💝 Donations</h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: '0.9rem' }}>Donate unused medicines to those in need</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
        {STATS.map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6366f1' }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['donate', 'browse'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600,
              fontSize: '0.88rem', transition: 'all 0.2s',
              background: tab === t ? '#6366f1' : '#f1f5f9',
              color: tab === t ? '#fff' : '#374151' }}>
            {t === 'donate' ? '💊 Donate Medicine' : '🔍 Browse Donations'}
          </button>
        ))}
      </div>

      {tab === 'donate' && (
        <div className="card" style={{ maxWidth: 520 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>Donate Unused Medicine</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 18 }}>
            Help others by donating medicines you no longer need. All donations are verified before distribution.
          </p>

          {submitted && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
              padding: '10px 16px', color: '#16a34a', fontWeight: 600, marginBottom: 16 }}>
              ✅ Thank you! Your donation has been submitted for review.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Medicine Name
              </label>
              <input className="input" placeholder="e.g. Paracetamol 500mg"
                value={form.medicine} onChange={e => setForm(f => ({ ...f, medicine: e.target.value }))} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Quantity (tablets)
                </label>
                <input className="input" type="number" placeholder="e.g. 20"
                  value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Expiry Date
                </label>
                <input className="input" type="date"
                  value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} required />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Additional Notes
              </label>
              <textarea className="input" style={{ minHeight: 70, resize: 'vertical' }}
                placeholder="Storage conditions, original packaging, etc."
                value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              💝 Submit Donation
            </button>
          </form>
        </div>
      )}

      {tab === 'browse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RECENT_DONATIONS.map(d => (
            <div key={d.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fce7f3',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>💊</div>
                <div>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{d.medicine}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {d.qty} tablets · Donated by {d.donor}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{d.date}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  background: d.status === 'Available' ? '#f0fdf4' : '#f1f5f9',
                  color: d.status === 'Available' ? '#16a34a' : '#94a3b8',
                  borderRadius: 20, padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700
                }}>{d.status}</span>
                {d.status === 'Available' && (
                  <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                    Claim
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
