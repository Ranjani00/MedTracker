import React, { useState } from 'react';
import api from '../api';

const PRESCRIPTION_TYPES = [
  { icon: '📸', label: 'Photo Upload', desc: 'Take a photo of your prescription' },
  { icon: '📄', label: 'PDF Upload', desc: 'Upload a PDF document' },
  { icon: '✍️', label: 'Manual Entry', desc: 'Type prescription details manually' },
];

export default function Prescriptions() {
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [prescriptions] = useState([
    { id: 1, doctor: 'Dr. Ramesh Kumar', date: '2026-03-10', medicines: 'Paracetamol, Amoxicillin', status: 'Verified' },
    { id: 2, doctor: 'Dr. Priya Nair', date: '2026-02-22', medicines: 'Metformin 500mg', status: 'Pending' },
  ]);

  const upload = async () => {
    if (!note.trim()) { setMsg('Please add a note or description.'); setMsgType('error'); return; }
    setUploading(true);
    try {
      await api.post('/prescriptions', { note });
      setMsg('Prescription uploaded successfully!');
      setMsgType('success');
      setNote('');
    } catch { setMsg('Upload failed. Please try again.'); setMsgType('error'); }
    setUploading(false);
    setTimeout(() => setMsg(''), 4000);
  };

  const statusColor = s => s === 'Verified' ? '#16a34a' : s === 'Pending' ? '#d97706' : '#dc2626';

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>📋 Prescriptions</h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: '0.9rem' }}>Upload and manage your medical prescriptions</p>
      </div>

      {msg && (
        <div style={{
          background: msgType === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${msgType === 'success' ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: 10, padding: '10px 16px',
          color: msgType === 'success' ? '#16a34a' : '#dc2626',
          fontWeight: 600, marginBottom: 16
        }}>{msg}</div>
      )}

      {/* Upload options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {PRESCRIPTION_TYPES.map(t => (
          <div key={t.label} className="card" style={{ textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.2s' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{t.icon}</div>
            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4, fontSize: '0.9rem' }}>{t.label}</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Upload form */}
      <div className="card" style={{ maxWidth: 520, marginBottom: 28 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>Upload Prescription</h3>

        {/* File drop zone */}
        <div style={{ border: '2px dashed #c7d2fe', borderRadius: 12, padding: '32px 24px',
          textAlign: 'center', background: '#f8f7ff', marginBottom: 16, cursor: 'pointer' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📁</div>
          <p style={{ color: '#6366f1', fontWeight: 600, marginBottom: 4 }}>Drop file here or click to browse</p>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Supports JPG, PNG, PDF (max 5MB)</p>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
            Notes / Description
          </label>
          <textarea className="input" style={{ minHeight: 80, resize: 'vertical' }}
            placeholder="Add doctor name, date, or any notes..."
            value={note} onChange={e => setNote(e.target.value)} />
        </div>

        <button className="btn btn-primary" onClick={upload} disabled={uploading}
          style={{ width: '100%' }}>
          {uploading ? 'Uploading...' : '📤 Upload Prescription'}
        </button>
      </div>

      {/* Previous prescriptions */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
        Previous Prescriptions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {prescriptions.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ede9fe',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>📋</div>
              <div>
                <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{p.doctor}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>{p.medicines}</p>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{p.date}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: statusColor(p.status) + '20', color: statusColor(p.status),
                borderRadius: 20, padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
                {p.status}
              </span>
              <button className="btn" style={{ padding: '6px 14px', fontSize: '0.82rem',
                background: '#f1f5f9', color: '#374151' }}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
