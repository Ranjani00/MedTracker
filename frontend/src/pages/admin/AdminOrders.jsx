import React, { useEffect, useState } from 'react';
import api from '../../api';

const STATUSES = ['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const load = () => api.get('/admin/orders').then(r => setOrders(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    load();
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📦 Order Management</div>
        <div className="page-sub">View and update all customer orders</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['All', ...STATUSES].map(s => (
          <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '7px 16px', fontSize: '0.82rem' }}
            onClick={() => setFilter(s)}>{s} ({s === 'All' ? orders.length : orders.filter(o => o.status === s).length})</button>
        ))}
      </div>

      <div className="glass-panel">
        <div style={{ overflowX: 'auto' }}>
          <table className="med-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th></tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>#{o.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.user?.name || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{o.user?.email}</div>
                  </td>
                  <td style={{ color: '#6b7280' }}>{(o.items||[]).length} item(s)</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>₹{o.total?.toFixed(2)}</td>
                  <td><span className="status-badge in-stock">{o.status}</span></td>
                  <td style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select className="filter-select" style={{ fontSize: '0.82rem', padding: '5px 10px' }}
                      value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
