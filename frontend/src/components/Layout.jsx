import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import { useTheme } from '../ThemeContext';

const NAV = [
  { section: 'Main', items: [
    { path: '/dashboard',       icon: '🏠', label: 'Dashboard' },
    { path: '/search-medicine', icon: '💊', label: 'Medicines' },
    { path: '/find-medicine',   icon: '📍', label: 'Pharmacies' },
    { path: '/my-orders',       icon: '📦', label: 'Orders' },
  ]},
  { section: 'Tools', items: [
    { path: '/daily-tracker',   icon: '📅', label: 'Daily Tracker' },
    { path: '/ai-assistant',    icon: '🤖', label: 'AI Assistant' },
    { path: '/favorites',       icon: '⭐', label: 'Favorites' },
    { path: '/subscriptions',   icon: '🔔', label: 'Subscriptions' },
    { path: '/prescriptions',   icon: '📋', label: 'Prescriptions' },
  ]},
  { section: 'Community', items: [
    { path: '/donations',       icon: '💝', label: 'Donations' },
    { path: '/requests',        icon: '📨', label: 'Requests' },
    { path: '/emergency',       icon: '🚨', label: 'Emergency' },
  ]},
  { section: 'Account', items: [
    { path: '/notifications',   icon: '🔔', label: 'Notifications', badge: 3 },
    { path: '/profile',         icon: '👤', label: 'Profile' },
  ]},
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [search, setSearch] = useState('');
  const { dark, toggle } = useTheme();

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const darkStyle = dark ? {
    filter: 'none',
    background: '#0f172a',
  } : {};

  const darkOverlay = dark ? {
    position: 'fixed', inset: 0, zIndex: 0,
    background: 'linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0a1628 100%)',
    pointerEvents: 'none',
  } : null;

  return (
    <div style={{ position: 'relative', ...(dark ? { background: '#0f172a', minHeight: '100vh' } : {}) }}>
      {dark && <div style={darkOverlay} />}
      {!dark && <AnimatedBackground />}
      <div className="app-layout">

        {/* Sidebar */}
        <div className="sidebar" style={dark ? {
          background: 'rgba(15,23,42,0.98)',
          borderRight: '1px solid rgba(99,102,241,0.25)',
        } : {}}>
          <div className="sidebar-logo">
            <div className="logo-icon-wrap">💊</div>
            <div>
              <div className="logo-text" style={dark ? { color: '#e2e8f0' } : {}}>MedTracker</div>
              <div className="logo-sub" style={dark ? { color: '#475569' } : {}}>HEALTH PLATFORM</div>
            </div>
          </div>

          <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {NAV.map(g => (
              <div key={g.section}>
                <div className="nav-section-label" style={dark ? { color: '#475569' } : {}}>{g.section}</div>
                {g.items.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <div key={item.path} className={`nav-item ${active ? 'active' : ''}`}
                      onClick={() => navigate(item.path)}
                      style={dark ? {
                        color: active ? '#a5b4fc' : '#94a3b8',
                        background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
                      } : {}}>
                      <span className="nav-icon">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>

          <div style={{ padding: '12px 10px', borderTop: dark ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(99,102,241,0.1)' }}>
            {user.role === 'ADMIN' && (
              <div className="nav-item" onClick={() => navigate('/admin')}
                style={{ marginBottom: 4, ...(dark ? { color: '#94a3b8' } : {}) }}>
                <span className="nav-icon">⚙️</span>
                <span>Admin Panel</span>
              </div>
            )}
            <div className="nav-item" onClick={logout}
              style={{ color: '#ef4444' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span className="nav-icon">🚪</span>
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Topbar */}
        <div className="topbar" style={dark ? {
          background: 'rgba(15,23,42,0.97)',
          borderBottom: '1px solid rgba(99,102,241,0.2)',
        } : {}}>
          <div className="topbar-search" style={dark ? {
            background: 'rgba(99,102,241,0.1)',
            border: '1.5px solid rgba(99,102,241,0.25)',
          } : {}}>
            <span style={{ fontSize: '1rem', color: dark ? '#475569' : '#9ca3af' }}>🔍</span>
            <input placeholder="Search medicines, orders, pharmacies..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={dark ? { color: '#e2e8f0' } : {}} />
          </div>

          <div className="topbar-actions">
            <button onClick={toggle} title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                width: 40, height: 40, borderRadius: 12, border: '1.5px solid',
                borderColor: dark ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.15)',
                cursor: 'pointer',
                background: dark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.06)',
                fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              {dark ? '☀️' : '🌙'}
            </button>
            <div className="icon-btn" title="Notifications" onClick={() => navigate('/notifications')}>
              🔔
              <span className="notif-dot" />
            </div>
            <div className="icon-btn" title="Emergency" onClick={() => navigate('/emergency')}>🚨</div>
            <div className="user-chip" onClick={() => navigate('/profile')}>
              <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name || 'User'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="main-content" style={dark ? { background: 'transparent' } : {}}>
          <div className="page-body" style={dark ? {
            background: 'transparent',
          } : {}}>
            <Outlet context={{ dark }} />
          </div>
        </div>
      </div>
    </div>
  );
}
