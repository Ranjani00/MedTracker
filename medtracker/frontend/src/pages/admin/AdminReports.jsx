import React, { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminReports() {
  const [data, setData] = useState({});
  useEffect(() => { api.get('/admin/reports').then(r => setData(r.data)).catch(() => {}); }, []);

  const cards = [
    { label: 'Total Users',    value: data.totalUsers    || 0, icon: '👥', color: 'purple' },
    { label: 'Total Orders',   value: data.totalOrders   || 0, icon: '📦', color: 'amber' },
    { label: 'Total Revenue',  value: `₹${(data.totalRevenue||0).toFixed(0)}`, icon: '💰', color: 'green' },
    { label: 'Total Medicines',value: data.totalMedicines|| 0, icon: '💊', color: 'blue' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📈 Reports</div>
        <div className="page-sub">System analytics and statistics</div>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className={`stat-card ${c.color}`}>
            <div className={`stat-icon ${c.color}`}>{c.icon}</div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>📊 Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            ['Platform', 'MedTracker v1.0'],
            ['Backend', 'Node.js Express'],
            ['Database', 'In-Memory'],
            ['Auth', 'JWT Bearer Token'],
          ].map(([k, v]) => (
            <div key={k} style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.04)',
              borderRadius: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.85rem' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
