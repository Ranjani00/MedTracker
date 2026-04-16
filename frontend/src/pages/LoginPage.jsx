import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AnimatedBackground from '../components/AnimatedBackground';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post(mode === 'login' ? '/auth/login' : '/auth/register', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', position: 'relative' }}>
      <AnimatedBackground />

      <div style={{
        position: 'relative', zIndex: 1,
        width: 440, padding: 40,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 20px 60px rgba(99,102,241,0.15)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 14px',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          }}>💊</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e1b4b' }}>MedTracker</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: 4 }}>Your professional health companion</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(99,102,241,0.06)',
          borderRadius: 14, padding: 4, marginBottom: 24, gap: 4 }}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '9px', border: 'none', borderRadius: 11, cursor: 'pointer',
              fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s',
              background: mode === m ? 'white' : 'transparent',
              color: mode === m ? '#6366f1' : '#6b7280',
              boxShadow: mode === m ? '0 2px 8px rgba(99,102,241,0.15)' : 'none',
            }}>
              {m === 'login' ? '🔑 Login' : '✨ Register'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Full Name</label>
              <input className="input" placeholder="Your full name"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
          )}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Email Address</label>
            <input className="input" type="email" placeholder="your@email.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
              padding: '10px 14px', color: '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', marginTop: 4 }}>
            {loading ? '⏳ Please wait...' : mode === 'login' ? '🔑 Login' : '✨ Create Account'}
          </button>
        </form>

        <div style={{ marginTop: 20, padding: '14px 16px',
          background: 'rgba(99,102,241,0.05)', borderRadius: 12,
          border: '1px solid rgba(99,102,241,0.1)', fontSize: '0.8rem', color: '#6b7280' }}>
          <div style={{ fontWeight: 700, color: '#6366f1', marginBottom: 4 }}>Demo Credentials</div>
          <div>👑 Admin: admin@medtracker.com / admin123</div>
          <div>👤 User: user@medtracker.com / admin123</div>
        </div>
      </div>
    </div>
  );
}
