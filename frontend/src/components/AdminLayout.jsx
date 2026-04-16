import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import { useTheme } from '../ThemeContext';

const NAV = [
  { path: '/admin',                  icon: '📊', label: 'Dashboard' },
  { path: '/admin/users',            icon: '👥', label: 'Users' },
  { path: '/admin/medicines',        icon: '💊', label: 'Medicines' },
  { path: '/admin/orders',           icon: '📦', label: 'Orders' },
  { path: '/admin/inventory',        icon: '🏪', label: 'Inventory' },
  { path: '/admin/voice-trainer',    icon: '🎙️', label: 'Voice Trainer' },
  { path: '/admin/notifications',    icon: '🔔', label: 'Notifications' },
  { path: '/admin/reports',          icon: '📈', label: 'Reports' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { dark, toggle } = useTheme();

  return (
    <div style={{ position: 'relative' }}>
      <AnimatedBackground />
      <div className="app-layout">

        {/* Admin Sidebar */}
        <div className="sidebar" style={{
          background: 'rgba(15,23,42,0.92)',
          borderRight: '1px solid rgba(99,102,241,0.2)',
        }}>
          <div className="sidebar-logo">
            <div className="logo-icon-wrap" style={{ background: 'linear-gradient(135deg,#6366f1,#06b6d4)' }}>⚕️</div>
            <div>
              <div className="logo-text" style={{ color: 'white' }}>Admin Panel</div>
              <div className="logo-sub" style={{ color: '#475569' }}>MEDTRACKER</div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: '8px 0' }}>
            <div className="nav-section-label" style={{ color: '#475569' }}>Management</div>
            {NAV.map(item => {
              const active = location.pathname === item.path;
              return (
                <div key={item.path}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  style={{
                    color: active ? '#6366f1' : '#94a3b8',
                    background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}}>
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </nav>

          <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="nav-item" onClick={() => navigate('/dashboard')}
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
              <span className="nav-icon">←</span><span>User View</span>
            </div>
            <div className="nav-item" onClick={() => { localStorage.clear(); navigate('/login'); }}
              style={{ color: '#ef4444' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <span className="nav-icon">🚪</span><span>Logout</span>
            </div>
          </div>
        </div>

        {/* Topbar */}
        <div className="topbar" style={{ background: 'rgba(15,23,42,0.88)', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>
            {NAV.find(n => n.path === location.pathname)?.label || 'Admin'}
          </div>
          <div className="topbar-actions">
            <button onClick={toggle} title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                width: 40, height: 40, borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.08)', fontSize: '1.1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              {dark ? '☀️' : '🌙'}
            </button>
            <div className="icon-btn" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>🔔</div>
            <div className="user-chip" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'A'}</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>{user.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#6366f1' }}>ADMIN</div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="page-body">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
