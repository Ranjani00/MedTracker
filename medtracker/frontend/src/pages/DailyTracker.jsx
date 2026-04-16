import React, { useEffect, useState } from 'react';
import api from '../api';

export default function DailyTracker() {
  const [meds, setMeds] = useState([]);
  const [form, setForm] = useState({ name: '', dosage: '', frequency: 'Daily', time: '08:00' });
  const [adding, setAdding] = useState(false);

  const load = () => api.get('/medications').then(r => setMeds(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async e => {
    e.preventDefault();
    await api.post('/medications', form);
    setForm({ name: '', dosage: '', frequency: 'Daily', time: '08:00' });
    setAdding(false);
    load();
  };

  const markTaken = async id => { await api.post(`/medications/${id}/taken`); load(); };
  const remove = async id => { await api.delete(`/medications/${id}`); load(); };

  const taken = meds.filter(m => m.taken).length;
  const progress = meds.length ? Math.round((taken / meds.length) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📅 Daily Tracker</div>
        <div className="page-sub">Track your daily medication schedule</div>
      </div>

      {meds.length > 0 && (
        <div className="glass-panel" style={{ padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600, color: '#1e1b4b' }}>Today's Progress</span>
              <span style={{ fontWeight: 700, color: '#6366f1' }}>{taken}/{meds.length} taken</span>
            </div>
            <div style={{ height: 10, background: 'rgba(99,102,241,0.1)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, borderRadius: 10,
                background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6366f1' }}>{progress}%</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Complete</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setAdding(!adding)}>
          {adding ? '✕ Cancel' : '+ Add Medication'}
        </button>
      </div>

      {adding && (
        <div className="glass-panel" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b', marginBottom: 16 }}>Add New Medication</div>
          <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Medicine Name *</label>
              <input className="input" placeholder="e.g. Paracetamol 500mg"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Dosage</label>
              <input className="input" placeholder="e.g. 1 tablet"
                value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Frequency</label>
              <select className="input" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
                <option>Daily</option>
                <option>Twice Daily</option>
                <option>Three Times Daily</option>
                <option>Weekly</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Time</label>
              <input className="input" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" type="submit">💾 Save Medication</button>
              <button className="btn btn-secondary" type="button" onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {meds.length === 0
          ? (
            <div className="glass-panel" style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>💊</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No medications added yet</div>
              <div style={{ fontSize: '0.85rem' }}>Click "Add Medication" to get started</div>
            </div>
          )
          : meds.map(m => (
            <div key={m.id} className="glass-panel" style={{
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
              borderLeft: `4px solid ${m.taken ? '#10b981' : '#6366f1'}`,
              opacity: m.taken ? 0.75 : 1, transition: 'all 0.2s',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: m.taken ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
              }}>
                {m.taken ? '✅' : '💊'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1e1b4b', textDecoration: m.taken ? 'line-through' : 'none' }}>{m.name}</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 2 }}>
                  {m.dosage && `${m.dosage} · `}{m.frequency} · ⏰ {m.time}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!m.taken && (
                  <button className="btn btn-success" style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                    onClick={() => markTaken(m.id)}>✓ Mark Taken</button>
                )}
                <button className="btn btn-danger" style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                  onClick={() => remove(m.id)}>🗑</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
