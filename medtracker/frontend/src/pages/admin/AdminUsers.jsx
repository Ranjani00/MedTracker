import React, { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const load = () => api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const toggleRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role: role === 'ADMIN' ? 'USER' : 'ADMIN' });
    load();
  };

  const filtered = users.filter(u => !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div className="page-title">👥 User Management</div>
        <div className="page-sub">Manage user accounts and roles</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Users', value: users.length, icon: '👥', color: '#6366f1' },
          { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, icon: '👑', color: '#f59e0b' },
          { label: 'Regular Users', value: users.filter(u => u.role === 'USER').length, icon: '👤', color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel">
        <div className="table-toolbar">
          <div className="search-box" style={{ flex: 1 }}>
            <span style={{ color: '#9ca3af' }}>🔍</span>
            <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="med-table">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600, color: '#9ca3af' }}>#{u.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', color: 'white', fontWeight: 700 }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: '#6b7280' }}>{u.email}</td>
                <td>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                    background: u.role === 'ADMIN' ? '#fef3c7' : 'rgba(99,102,241,0.08)',
                    color: u.role === 'ADMIN' ? '#d97706' : '#6366f1' }}>{u.role}</span>
                </td>
                <td>
                  <button className="action-btn edit" onClick={() => toggleRole(u.id, u.role)}>
                    {u.role === 'ADMIN' ? '→ Make User' : '→ Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
