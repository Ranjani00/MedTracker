import React, { useEffect, useState, useRef } from 'react';
import api from '../../api';

const ACTIONS = [
  { label: 'Go to Dashboard',    value: 'NAVIGATE:/dashboard' },
  { label: 'Search Medicine',    value: 'NAVIGATE:/search-medicine' },
  { label: 'Find Medicine',      value: 'NAVIGATE:/find-medicine' },
  { label: 'My Orders',          value: 'NAVIGATE:/my-orders' },
  { label: 'Profile',            value: 'NAVIGATE:/profile' },
  { label: 'Favorites',          value: 'NAVIGATE:/favorites' },
  { label: 'Daily Tracker',      value: 'NAVIGATE:/daily-tracker' },
  { label: 'Pharmacies',         value: 'NAVIGATE:/pharmacies' },
  { label: 'AI Assistant',       value: 'NAVIGATE:/ai-assistant' },
];

export default function AdminVoiceTrainer() {
  const [commands, setCommands] = useState([]);
  const [phrase, setPhrase] = useState('');
  const [action, setAction] = useState(ACTIONS[0].value);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState('');
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/admin/voice-commands').then(r => setCommands(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStatus('⚠️ Speech recognition not supported in this browser'); return; }
    const recog = new SR();
    recog.lang = 'ta-IN';
    recog.interimResults = false;
    recog.onstart = () => { setListening(true); setStatus('🎤 Listening... Speak now in Tamil'); };
    recog.onresult = e => { setPhrase(e.results[0][0].transcript); setStatus('✅ Captured successfully!'); };
    recog.onerror = () => { setStatus('❌ Error capturing voice. Try again.'); };
    recog.onend = () => setListening(false);
    recog.start();
  };

  const save = async () => {
    if (!phrase.trim()) { setStatus('⚠️ Please record or type a phrase first'); return; }
    const desc = ACTIONS.find(a => a.value === action)?.label || '';
    if (editId) {
      await api.put(`/admin/voice-commands/${editId}`, { phrase, action, description: desc });
      setEditId(null);
    } else {
      await api.post('/admin/voice-commands', { phrase, action, description: desc, language: 'ta-IN' });
    }
    setPhrase(''); setStatus('💾 Saved!'); load();
    setTimeout(() => setStatus(''), 2000);
  };

  const remove = async id => { await api.delete(`/admin/voice-commands/${id}`); load(); };
  const startEdit = c => { setPhrase(c.phrase); setAction(c.action); setEditId(c.id); };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🎙️ Voice Trainer</div>
        <div className="page-sub">Train Tamil voice commands for navigation</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Recorder */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b', marginBottom: 20 }}>
            {editId ? '✏️ Edit Command' : '🎤 Record New Command'}
          </div>

          {/* Mic button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <button onClick={startListening} disabled={listening} style={{
              width: 80, height: 80, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: listening
                ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: 'white', fontSize: '2rem',
              boxShadow: listening
                ? '0 0 0 12px rgba(239,68,68,0.2), 0 8px 24px rgba(239,68,68,0.4)'
                : '0 8px 24px rgba(99,102,241,0.4)',
              transition: 'all 0.3s',
              animation: listening ? 'pulse 1s infinite' : 'none',
            }}>🎤</button>
            <div style={{ marginTop: 12, fontWeight: 600, color: '#1e1b4b', fontSize: '0.9rem' }}>
              {listening ? 'Listening...' : 'Click to Record'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>Language: Tamil (ta-IN)</div>
            {status && (
              <div style={{ marginTop: 10, padding: '8px 16px', background: 'rgba(99,102,241,0.08)',
                borderRadius: 10, fontSize: '0.85rem', color: '#6366f1', fontWeight: 500 }}>{status}</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                Tamil Phrase
              </label>
              <input className="input" placeholder="Phrase will appear after recording, or type manually..."
                value={phrase} onChange={e => setPhrase(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                Assign Navigation Action
              </label>
              <select className="input" value={action} onChange={e => setAction(e.target.value)}>
                {ACTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={save}>💾 {editId ? 'Update' : 'Save Command'}</button>
              {editId && <button className="btn btn-secondary" onClick={() => { setEditId(null); setPhrase(''); }}>Cancel</button>}
            </div>
          </div>
        </div>

        {/* Saved commands */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b', marginBottom: 16 }}>
            📋 Saved Commands ({commands.length})
          </div>
          {commands.length === 0
            ? <div style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎙️</div>
                <div>No commands saved yet</div>
              </div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {commands.map(c => (
                  <div key={c.id} style={{ padding: '14px 16px', background: 'rgba(99,102,241,0.04)',
                    borderRadius: 12, border: '1px solid rgba(99,102,241,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e1b4b' }}>"{c.phrase}"</div>
                        <div style={{ fontSize: '0.78rem', color: '#6366f1', marginTop: 3 }}>{c.description}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>{c.language}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="action-btn edit" onClick={() => startEdit(c)}>✏️</button>
                        <button className="action-btn delete" onClick={() => remove(c.id)}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 0 12px rgba(239,68,68,0.2)} 50%{box-shadow:0 0 0 20px rgba(239,68,68,0.05)} }`}</style>
    </div>
  );
}
