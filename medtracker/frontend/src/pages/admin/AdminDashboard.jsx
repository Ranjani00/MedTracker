import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/admin/orders').then(r => setOrders(r.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users',    value: stats.totalUsers    || 0, icon: '👥', color: 'purple', path: '/admin/users' },
    { label: 'Total Medicines',value: stats.totalMedicines|| 0, icon: '💊', color: 'green',  path: '/admin/medicines' },
    { label: 'Total Orders',   value: stats.totalOrders   || 0, icon: '📦', color: 'amber',  path: '/admin/orders' },
    { label: 'Revenue',        value: `₹${(stats.totalRevenue||0).toFixed(0)}`, icon: '💰', color: 'blue', path: '/admin/reports' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📊 Admin Dashboard</div>
        <div className="page-sub">System overview and quick actions</div>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className={`stat-card ${c.color}`} onClick={() => navigate(c.path)}>
            <div className={`stat-icon ${c.color}`}>{c.icon}</div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Add Medicine', icon: '➕', path: '/admin/medicines' },
          { label: 'View Orders', icon: '📦', path: '/admin/orders' },
          { label: 'Manage Users', icon: '👥', path: '/admin/users' },
          { label: 'Inventory', icon: '🏪', path: '/admin/inventory' },
          { label: 'Voice Trainer', icon: '🎙️', path: '/admin/voice-trainer' },
          { label: 'Reports', icon: '📈', path: '/admin/reports' },
        ].map(q => (
          <button key={q.label} className="btn btn-secondary" onClick={() => navigate(q.path)}
            style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: 'auto' }}>
            <span style={{ fontSize: '1.5rem' }}>{q.icon}</span>
            <span style={{ fontSize: '0.82rem' }}>{q.label}</span>
          </button>
        ))}
      </div>

      {/* Recent orders */}
      <div className="glass-panel">
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(99,102,241,0.08)',
          fontWeight: 700, fontSize: '1rem', color: '#1e1b4b' }}>📦 Recent Orders</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="med-table">
            <thead><tr><th>ID</th><th>User</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.slice(0, 6).map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>#{o.id}</td>
                  <td>{o.user?.name || '—'}</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>₹{o.total?.toFixed(2)}</td>
                  <td><span className="status-badge in-stock">{o.status}</span></td>
                  <td style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af', padding: 24 }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
