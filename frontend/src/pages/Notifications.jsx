import React, { useState } from 'react';

const SAMPLE = [
  { id: 1, title: 'Medication Reminder', msg: 'Time to take Paracetamol 500mg', time: '2 min ago', type: 'reminder', read: false },
  { id: 2, title: 'Order Confirmed', msg: 'Your order #3 has been confirmed', time: '1 hour ago', type: 'order', read: false },
  { id: 3, title: 'Stock Alert', msg: 'Amoxicillin is running low at Apollo Pharmacy', time: '3 hours ago', type: 'alert', read: true },
  { id: 4, title: 'New Offer', msg: '20% off on all antibiotics this week', time: '1 day ago', type: 'promo', read: true },
];

const TYPE_STYLE = {
  reminder: { bg: 'rgba(99,102,241,0.08)', color: '#6366f1', icon: '⏰' },
  order:    { bg: 'rgba(16,185,129,0.08)', color: '#10b981', icon: '📦' },
  alert:    { bg: 'rgba(239,68,68,0.08)',  color: '#ef4444', icon: '⚠️' },
  promo:    { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', icon: '🎁' },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(SAMPLE);

  const markRead = id => setNotifs(n => n.map(x => x.id === id ? {...x, read: true} : x));
  const markAll = () => setNotifs(n => n.map(x => ({...x, read: true})));

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">🔔 Notifications</div>
          <div className="page-sub">{unread} unread notification{unread !== 1 ? 's' : ''}</div>
        </div>
        {unread > 0 && (
          <button className="btn btn-secondary" onClick={markAll}>✓ Mark all read</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map(n => {
          const s = TYPE_STYLE[n.type];
          return (
            <div key={n.id} className="glass-panel" style={{ padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
              opacity: n.read ? 0.7 : 1, transition: 'all 0.2s',
              borderLeft: n.read ? '4px solid transparent' : '4px solid #6366f1' }}
              onClick={() => markRead(n.id)}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.read ? 500 : 700, color: '#1e1b4b' }}>{n.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 2 }}>{n.msg}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{n.time}</div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
