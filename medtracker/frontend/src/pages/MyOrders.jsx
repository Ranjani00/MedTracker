import React, { useEffect, useState } from 'react';
import api from '../api';

const STATUS_STYLE = {
  PENDING:   { bg: '#fef3c7', color: '#d97706' },
  CONFIRMED: { bg: '#dbeafe', color: '#1d4ed8' },
  SHIPPED:   { bg: '#e0e7ff', color: '#4f46e5' },
  DELIVERED: { bg: '#dcfce7', color: '#16a34a' },
  CANCELLED: { bg: '#fee2e2', color: '#dc2626' },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => { api.get('/orders').then(r => setOrders(r.data)).catch(() => {}); }, []);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📦 My Orders</div>
        <div className="page-sub">Track all your medicine orders</div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
        {['All','PENDING','CONFIRMED','DELIVERED','CANCELLED'].map(s => (
          <div key={s} className="glass-panel" style={{ padding: '14px 16px', cursor: 'pointer',
            borderBottom: filter === s ? '3px solid #6366f1' : '3px solid transparent',
            transition: 'all 0.2s' }}
            onClick={() => setFilter(s)}>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1e1b4b' }}>
              {s === 'All' ? orders.length : orders.filter(o => o.status === s).length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>{s}</div>
          </div>
        ))}
      </div>

      {filtered.length === 0
        ? <div className="glass-panel" style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
            <div style={{ fontWeight: 600 }}>No orders yet</div>
          </div>
        : filtered.map(o => {
          const st = STATUS_STYLE[o.status] || { bg: '#f3f4f6', color: '#374151' };
          return (
            <div key={o.id} className="glass-panel" style={{ marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', borderBottom: '1px solid rgba(99,102,241,0.07)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1e1b4b' }}>Order #{o.id}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 2 }}>
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </div>
                </div>
                <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.78rem',
                  fontWeight: 700, background: st.bg, color: st.color }}>
                  {o.status}
                </span>
              </div>
              <div style={{ padding: '12px 20px' }}>
                {(o.items || []).map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0', fontSize: '0.88rem', color: '#374151',
                    borderBottom: i < o.items.length - 1 ? '1px solid rgba(99,102,241,0.05)' : 'none' }}>
                    <span>💊 {item.medicine?.name || 'Medicine'} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10,
                  paddingTop: 10, borderTop: '1px solid rgba(99,102,241,0.08)' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#059669' }}>
                    Total: ₹{o.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}
