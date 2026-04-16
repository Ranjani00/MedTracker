import React, { useEffect, useState } from 'react';
import api from '../../api';

const EMPTY = { name: '', genericName: '', category: '', price: '', manufacturer: '', description: '', requiresPrescription: false };

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const admin = JSON.parse(localStorage.getItem('user') || '{}');

  const load = () => {
    api.get('/admin/medicines').then(r => setMedicines(r.data)).catch(() => {});
    api.get('/pharmacies').then(r => setPharmacies(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const save = async e => {
    e.preventDefault();
    if (editId) await api.put(`/admin/medicines/${editId}`, form);
    else await api.post('/admin/medicines', form);
    setForm(EMPTY); setAdding(false); setEditId(null); load();
  };

  const remove = async id => { if (confirm('Delete this medicine?')) { await api.delete(`/admin/medicines/${id}`); load(); } };
  const startEdit = m => { setForm({...m}); setEditId(m.id); setAdding(true); };

  const filtered = medicines.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">💊 Medicine Management</div>
          <div className="page-sub">Add, edit and manage medicines</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.78rem', color: '#6b7280', background: 'rgba(99,102,241,0.08)',
            padding: '5px 12px', borderRadius: 20, fontWeight: 600 }}>
            Admin #{admin.id}
          </span>
          <button className="btn btn-primary" onClick={() => { setAdding(!adding); setEditId(null); setForm(EMPTY); }}>
            {adding ? '✕ Cancel' : '+ Add Medicine'}
          </button>
        </div>
      </div>

      {adding && (
        <div className="glass-panel" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b', marginBottom: 18 }}>
            {editId ? '✏️ Edit Medicine' : '➕ Add New Medicine'}
          </div>
          <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Medicine Name *</label>
              <input className="input" placeholder="Enter medicine name here"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Generic Name</label>
              <input className="input" placeholder="Generic / chemical name"
                value={form.genericName} onChange={e => setForm({...form, genericName: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Category</label>
              <input className="input" placeholder="e.g. Antibiotic, Analgesic"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Price (₹)</label>
              <input className="input" type="number" placeholder="0.00"
                value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Manufacturer</label>
              <input className="input" placeholder="Manufacturer name"
                value={form.manufacturer} onChange={e => setForm({...form, manufacturer: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Description</label>
              <input className="input" placeholder="Brief description of the medicine"
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="rx" style={{ width: 16, height: 16 }}
                checked={form.requiresPrescription}
                onChange={e => setForm({...form, requiresPrescription: e.target.checked})} />
              <label htmlFor="rx" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                Requires Prescription (Rx)
              </label>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" type="submit">{editId ? '💾 Update' : '💾 Save Medicine'}</button>
              <button className="btn btn-secondary" type="button" onClick={() => { setAdding(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel">
        <div className="table-toolbar">
          <div className="search-box" style={{ flex: 1 }}>
            <span style={{ color: '#9ca3af' }}>🔍</span>
            <input placeholder="Search medicines..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{filtered.length} medicines</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="med-table">
            <thead>
              <tr><th>Medicine</th><th>Generic</th><th>Category</th><th>Price</th><th>Rx</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e1b4b' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{m.manufacturer}</div>
                  </td>
                  <td style={{ color: '#6b7280' }}>{m.genericName || '—'}</td>
                  <td><span style={{ padding: '3px 10px', background: 'rgba(99,102,241,0.08)',
                    color: '#6366f1', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>{m.category || '—'}</span></td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>₹{m.price}</td>
                  <td>{m.requiresPrescription ? <span className="status-badge low-stock">Rx</span> : <span className="status-badge in-stock">OTC</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="action-btn edit" onClick={() => startEdit(m)}>✏️ Edit</button>
                      <button className="action-btn delete" onClick={() => remove(m.id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
