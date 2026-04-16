import React, { useState } from 'react';

const SAMPLE_REQUESTS = [
  { id: 1, user: 'Karthik M.', medicine: 'Insulin Glargine 100U', urgency: 'High', location: 'Chennai', date: '2026-03-19', responses: 3 },
  { id: 2, user: 'Lakshmi R.', medicine: 'Methotrexate 2.5mg', urgency: 'Medium', location: 'Coimbatore', date: '2026-03-18', responses: 1 },
  { id: 3, user: 'Suresh B.', medicine: 'Clonazepam 0.5mg', urgency: 'Low', location: 'Madurai', date: '2026-03-17', responses: 0 },
];

const urgencyColor = u => u === 'High' ? '#dc2626' : u === 'Medium' ? '#d97706' : '#16a34a';

export default function Requests() {
  const [tab, setTab] = useState('browse');
  const [form, setForm] = useState({ medicine: '', urgency: 'Medium', location: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ medicine: '', urgency: 'Medium', location: '', note: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const filtered = SAMPLE_REQUESTS.filter(r =>
    r.medicine.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>📨 Community Requests</h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: '0.9rem' }}>
          Request hard-to-find medicines from the community
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { icon: '📨', label: 'Open Requests', value: '47' },
          { icon: '✅', label: 'Fulfilled', value: '128' },
          { icon: '👥', label: 'Active Members', value: '320' },
          { icon: '⚡', label: 'Avg Response', value: '2h' },
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
        {['browse', 'post'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600,
              fontSize: '0.88rem', transition: 'all 0.2s',
              background: tab === t ? '#6366f1' : '#f1f5f9',
              color: tab === t ? '#fff' : '#374151' }}>
            {t === 'browse' ? '🔍 Browse Requests' : '+ Post Request'}
          </button>
        ))}
      </div>

      {tab === 'browse' && (
        <>
          <input className="input" style={{ marginBottom: 16, maxWidth: 360 }}
            placeholder="🔍 Search medicine or location..."
            value={search} onChange={e => setSearch(e.target.value)} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px 24px', color: '#9ca3af' }}>
                No requests found
              </div>
            ) : filtered.map(r => (
              <div key={r.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12,
                      background: urgencyColor(r.urgency) + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>📨</div>
                    <div>
                      <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{r.medicine}</h3>
                      <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        📍 {r.location} · by {r.user}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{r.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{ background: urgencyColor(r.urgency) + '20', color: urgencyColor(r.urgency),
                      borderRadius: 20, padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
                      {r.urgency} Priority
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      💬 {r.responses} response{r.responses !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9',
                  display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
                    I Can Help
                  </button>
                  <button className="btn" style={{ padding: '6px 16px', fontSize: '0.82rem',
                    background: '#f1f5f9', color: '#374151' }}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'post' && (
        <div className="card" style={{ maxWidth: 520 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>Post a Medicine Request</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 18 }}>
            Let the community know what medicine you need. Members can respond with availability.
          </p>

          {submitted && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
              padding: '10px 16px', color: '#16a34a', fontWeight: 600, marginBottom: 16 }}>
              ✅ Your request has been posted to the community!
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Medicine Name
              </label>
              <input className="input" placeholder="e.g. Insulin Glargine 100U"
                value={form.medicine} onChange={e => setForm(f => ({ ...f, medicine: e.target.value }))} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Urgency
                </label>
                <select className="input" value={form.urgency}
                  onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Your Location
                </label>
                <input className="input" placeholder="e.g. Chennai"
                  value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Additional Details
              </label>
              <textarea className="input" style={{ minHeight: 70, resize: 'vertical' }}
                placeholder="Dosage, quantity needed, any specific brand..."
                value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              📨 Post Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
