import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

// ── Knowledge Base ────────────────────────────────────────────
const KB = [
  // Medicines
  { keys: ['paracetamol','acetaminophen','crocin','dolo'],
    answer: '💊 Paracetamol (Acetaminophen) is used for pain relief and fever. Adult dose: 500mg–1g every 4–6 hours. Max 4g/day. Avoid alcohol. Safe for most people including pregnant women when used correctly.' },
  { keys: ['amoxicillin','amox'],
    answer: '💊 Amoxicillin is a penicillin antibiotic for bacterial infections (throat, ear, chest, UTI). Take the full course even if you feel better. Common side effects: nausea, diarrhea, rash. Avoid if allergic to penicillin.' },
  { keys: ['metformin','glucophage'],
    answer: '💊 Metformin is the first-line medicine for Type 2 diabetes. Take with meals to reduce stomach upset. It lowers blood sugar by reducing liver glucose production. Monitor kidney function regularly.' },
  { keys: ['atorvastatin','lipitor','statin'],
    answer: '💊 Atorvastatin is a statin used to lower cholesterol and reduce heart disease risk. Take at night. Side effects: muscle pain, liver issues (rare). Avoid grapefruit juice.' },
  { keys: ['omeprazole','prilosec','pantoprazole'],
    answer: '💊 Omeprazole is a proton pump inhibitor (PPI) for acid reflux, GERD, and stomach ulcers. Take 30 minutes before meals. Long-term use may affect magnesium and B12 levels.' },
  { keys: ['cetirizine','zyrtec','antihistamine'],
    answer: '💊 Cetirizine is an antihistamine for allergies, hay fever, and hives. Take once daily. May cause drowsiness in some people. Avoid alcohol.' },
  { keys: ['azithromycin','zithromax','z-pack'],
    answer: '💊 Azithromycin is a macrolide antibiotic for respiratory, skin, and ear infections. Usually a 3–5 day course. Take on empty stomach. Can cause stomach upset.' },
  { keys: ['ibuprofen','brufen','advil','nsaid'],
    answer: '💊 Ibuprofen is an NSAID for pain, fever, and inflammation. Take with food to protect stomach. Avoid if you have ulcers, kidney disease, or are pregnant. Max 1200mg/day OTC.' },
  { keys: ['aspirin'],
    answer: '💊 Aspirin is used for pain, fever, and as a blood thinner to prevent heart attacks/strokes. Low-dose (75–100mg) is used daily for heart protection. Avoid in children under 16.' },
  { keys: ['insulin'],
    answer: '💉 Insulin is used to manage blood sugar in diabetes. Types: rapid-acting, short-acting, intermediate, long-acting. Store unopened vials in fridge. Opened vials can be kept at room temperature for 28 days.' },
  { keys: ['vitamin d','vitamin c','vitamin b12','vitamins'],
    answer: '🌟 Vitamins are essential nutrients. Vitamin D: bone health, immunity (sun exposure + supplements). Vitamin C: immunity, skin (citrus fruits). Vitamin B12: nerve function, energy (meat, dairy, supplements for vegans).' },

  // Symptoms
  { keys: ['fever','temperature','high temp'],
    answer: '🌡️ Fever (>38°C/100.4°F): Rest, stay hydrated, take paracetamol or ibuprofen. See a doctor if fever exceeds 39.5°C, lasts more than 3 days, or is accompanied by severe symptoms.' },
  { keys: ['headache','migraine'],
    answer: '🤕 For headaches: rest in a quiet dark room, stay hydrated, try paracetamol or ibuprofen. For migraines: triptans may be prescribed. See a doctor for sudden severe headaches.' },
  { keys: ['cold','cough','flu','runny nose'],
    answer: '🤧 For cold/flu: rest, drink fluids, honey + lemon for sore throat. Paracetamol for fever/aches. Antibiotics don\'t work for viral infections. See a doctor if symptoms worsen after 7 days.' },
  { keys: ['stomach','nausea','vomiting','diarrhea','gastro'],
    answer: '🤢 For stomach issues: stay hydrated with ORS (oral rehydration salts). Avoid solid food initially. BRAT diet (banana, rice, applesauce, toast) helps. See a doctor if symptoms persist over 48 hours.' },
  { keys: ['blood pressure','hypertension','bp'],
    answer: '❤️ Normal BP: 120/80 mmHg. High BP (>140/90): reduce salt, exercise, lose weight, limit alcohol. Medicines: amlodipine, lisinopril, losartan. Monitor regularly at home.' },
  { keys: ['diabetes','blood sugar','glucose'],
    answer: '🩸 Normal fasting blood sugar: 70–100 mg/dL. Diabetes: >126 mg/dL fasting. Manage with diet, exercise, metformin, insulin. Monitor HbA1c every 3 months. Avoid sugary foods.' },
  { keys: ['allergy','allergic','rash','hives'],
    answer: '🌿 For mild allergies: antihistamines (cetirizine, loratadine). Avoid known triggers. For severe reactions (anaphylaxis): use epinephrine (EpiPen) and call emergency services immediately.' },
  { keys: ['pain','ache','hurt'],
    answer: '💊 For mild to moderate pain: paracetamol (safest option) or ibuprofen (with food). For severe pain, consult a doctor. Don\'t mask pain without identifying the cause.' },
  { keys: ['sleep','insomnia','cant sleep'],
    answer: '😴 For better sleep: maintain a regular schedule, avoid screens 1 hour before bed, limit caffeine after 2pm, keep room cool and dark. Melatonin supplements may help. See a doctor for chronic insomnia.' },
  { keys: ['anxiety','stress','mental health'],
    answer: '🧠 For anxiety/stress: deep breathing, regular exercise, adequate sleep, limit caffeine. Therapy (CBT) is very effective. Medicines: SSRIs, buspirone (prescribed by doctor). Don\'t hesitate to seek help.' },

  // Medicine topics
  { keys: ['dosage','dose','how much','how many'],
    answer: '📋 Always follow your doctor\'s prescribed dosage. Never exceed the recommended amount. Dosage depends on age, weight, and condition. When in doubt, ask your pharmacist.' },
  { keys: ['side effect','side effects','adverse'],
    answer: '⚠️ Common side effects: nausea, headache, dizziness, stomach upset. Serious side effects: allergic reactions, liver damage, bleeding. Always read the medicine leaflet and report severe side effects to your doctor.' },
  { keys: ['expiry','expired','expiration'],
    answer: '⏰ Never use expired medicines — they may be less effective or harmful. Check the expiry date before taking any medication. Dispose of expired medicines at a pharmacy, not in the trash or toilet.' },
  { keys: ['storage','store','keep medicine'],
    answer: '🌡️ Most medicines: cool, dry place (15–25°C), away from sunlight and moisture. Some require refrigeration (insulin, eye drops). Keep all medicines out of reach of children.' },
  { keys: ['prescription','rx','doctor'],
    answer: '📋 Prescription medicines require a valid doctor\'s prescription. Never share prescription medicines. Never self-medicate with prescription drugs. Always complete the full course of antibiotics.' },
  { keys: ['generic','brand','generic medicine'],
    answer: '💊 Generic medicines contain the same active ingredient as brand-name drugs but cost less. They are equally safe and effective. Ask your pharmacist about generic alternatives to save money.' },
  { keys: ['antibiotic','antibiotics','resistance'],
    answer: '🦠 Antibiotics only work against bacterial infections, not viruses. Always complete the full course. Never share antibiotics. Overuse leads to antibiotic resistance — a global health threat.' },
  { keys: ['overdose','too much medicine'],
    answer: '🚨 If you suspect an overdose: call emergency services (108) immediately. Do NOT induce vomiting unless instructed. Keep the medicine packaging to show doctors. Time is critical.' },
  { keys: ['interaction','drug interaction','mixing medicine'],
    answer: '⚠️ Drug interactions can be dangerous. Always tell your doctor about ALL medicines you take (including supplements). Common interactions: blood thinners + aspirin, MAOIs + many antidepressants.' },
  { keys: ['pregnancy','pregnant','breastfeed'],
    answer: '🤰 Many medicines are unsafe during pregnancy or breastfeeding. Always consult your doctor before taking any medicine. Safe options: paracetamol for pain/fever. Avoid ibuprofen, especially in 3rd trimester.' },
  { keys: ['child','children','baby','infant','kids'],
    answer: '👶 Children\'s doses are based on weight, not age. Never give adult medicines to children without medical advice. Avoid aspirin in children under 16. Use liquid formulations for young children.' },

  // MedTracker app help
  { keys: ['how to order','place order','buy medicine'],
    answer: '🛒 To order medicines: go to Medicines page → search for your medicine → click "Cart" → go to Dashboard → view Cart panel → click Checkout. Your order will appear in My Orders.' },
  { keys: ['track order','order status','my order'],
    answer: '📦 To track your orders: click "Orders" in the sidebar → you\'ll see all orders with status (Pending, Processing, Shipped, Delivered). You can filter by status.' },
  { keys: ['subscription','subscribe','weekly delivery'],
    answer: '🔔 To set up a subscription: go to Subscriptions page → click "New Subscription" → enter medicine name and choose frequency (weekly/monthly/quarterly) → click Subscribe.' },
  { keys: ['daily tracker','medication reminder','reminder'],
    answer: '📅 To use Daily Tracker: go to Daily Tracker page → click "Add Medication" → enter medicine name, dosage, frequency, and time → click Save. Mark medicines as taken each day.' },
  { keys: ['find pharmacy','pharmacy','near me'],
    answer: '📍 To find pharmacies: go to "Pharmacies" in the sidebar. You\'ll see Apollo Pharmacy, MedPlus, Netmeds and more with their locations and contact details.' },
  { keys: ['favorite','favourites','save medicine'],
    answer: '⭐ To save a medicine as favourite: go to Medicines page → find the medicine → click the heart/star icon. View all favourites in the Favourites page.' },
  { keys: ['prebook','pre-book','out of stock'],
    answer: '📋 To prebook an out-of-stock medicine: search for the medicine → if out of stock, click "Prebook" → you\'ll be notified when it becomes available.' },
  { keys: ['profile','account','settings'],
    answer: '👤 To update your profile: click your name/avatar in the top right → go to Profile page → update your name, phone, address → click Save.' },
  { keys: ['emergency','emergency contact','sos'],
    answer: '🚨 Emergency contacts: Ambulance: 108, Police: 100, Fire: 101. Go to Emergency page in the sidebar for more contacts and first aid tips.' },
  { keys: ['donate','donation','unused medicine'],
    answer: '💝 To donate unused medicines: go to Donations page → click "Donate Medicine" → fill in medicine name, quantity, and expiry date → submit. Help others in need!' },
  { keys: ['login','sign in','password'],
    answer: '🔐 To login: go to the login page → enter your email and password. Default credentials: user@medtracker.com / admin123. Forgot password? Contact support.' },
  { keys: ['admin','admin panel','admin login'],
    answer: '⚙️ Admin panel is accessible at /admin. Admin login: admin@medtracker.com / admin123. Admins can manage medicines, orders, users, inventory, and send notifications.' },

  // General health
  { keys: ['diet','nutrition','healthy eating','food'],
    answer: '🥗 Healthy diet tips: eat plenty of fruits and vegetables, whole grains, lean proteins. Limit sugar, salt, and processed foods. Drink 8 glasses of water daily. Eat regular meals.' },
  { keys: ['exercise','workout','physical activity'],
    answer: '🏃 Exercise recommendations: 150 minutes of moderate activity per week (brisk walking, cycling). Strength training 2x/week. Even 30 minutes of walking daily makes a big difference.' },
  { keys: ['water','hydration','drink water'],
    answer: '💧 Stay hydrated! Adults need 2–3 litres of water daily. More if exercising or in hot weather. Signs of dehydration: dark urine, headache, fatigue, dizziness.' },
  { keys: ['hello','hi','hey','good morning','good evening'],
    answer: '👋 Hello! I\'m your MedTracker AI assistant. I can help with:\n• Medicine information & dosages\n• Symptom guidance\n• Health tips\n• App navigation help\n\nWhat would you like to know?' },
  { keys: ['thank','thanks','thank you'],
    answer: '😊 You\'re welcome! Stay healthy and take your medicines on time. Is there anything else I can help you with?' },
  { keys: ['help','what can you do','features'],
    answer: '🤖 I can help you with:\n💊 Medicine info (dosage, side effects, storage)\n🤒 Symptom guidance\n🏥 Health tips\n📱 MedTracker app navigation\n\nJust type your question!' },
];

const SUGGESTIONS = [
  'What is paracetamol?',
  'How to place an order?',
  'Ibuprofen side effects',
  'How to track my order?',
  'Medicine storage tips',
  'What is metformin used for?',
  'How to set up subscription?',
  'Fever treatment tips',
];

function getResponse(text) {
  const lower = text.toLowerCase();
  const match = KB.find(item => item.keys.some(k => lower.includes(k)));
  return match
    ? match.answer
    : '🤖 I\'m not sure about that. Try asking about a specific medicine (e.g. "paracetamol"), a symptom (e.g. "fever"), or app help (e.g. "how to order"). Type "help" to see what I can do.';
}

export default function AIAssistant() {
  const ctx = useOutletContext() || {};
  const dark = ctx.dark || document.documentElement.classList.contains('dark');
  const [messages, setMessages] = useState([
    { role: 'ai', text: '👋 Hello! I\'m your MedTracker AI assistant.\n\nI can help with medicine information, dosages, side effects, health tips, and app navigation.\n\nWhat would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (text = input) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: getResponse(text) }]);
      setTyping(false);
    }, 600);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🤖 AI Assistant</div>
        <div className="page-sub">Ask about medicines, symptoms, health tips, or app help</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

        {/* Chat window */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: 560 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                {m.role === 'ai' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', flexShrink: 0 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '12px 16px',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                    : dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.07)',
                  color: m.role === 'user' ? 'white' : dark ? '#e2e8f0' : '#374151',
                  fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line',
                  boxShadow: m.role === 'user' ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                }}>
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#10b981,#059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', flexShrink: 0, color: 'white', fontWeight: 700 }}>U</div>
                )}
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🤖</div>
                <div style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px',
                  background: 'rgba(99,102,241,0.07)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1',
                      animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '14px 20px', borderTop: dark ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(99,102,241,0.08)', display: 'flex', gap: 10 }}>
            <input className="input" placeholder="Ask about medicines, symptoms, or app help..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()} />
            <button className="btn btn-primary" onClick={() => send()} style={{ flexShrink: 0, padding: '10px 18px' }}>
              Send ➤
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-panel" style={{ padding: 18 }}>
            <div style={{ fontWeight: 700, color: dark ? '#e2e8f0' : '#1e1b4b', marginBottom: 12, fontSize: '0.9rem' }}>💡 Quick Questions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} className="btn btn-secondary"
                  style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px' }}
                  onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, color: dark ? '#e2e8f0' : '#1e1b4b', marginBottom: 10, fontSize: '0.88rem' }}>📚 I can help with</div>
            {[
              { icon: '💊', text: 'Medicine info & dosages' },
              { icon: '🤒', text: 'Symptom guidance' },
              { icon: '⚠️', text: 'Side effects & interactions' },
              { icon: '🏥', text: 'Health & wellness tips' },
              { icon: '📱', text: 'App navigation help' },
            ].map(t => (
              <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 0', fontSize: '0.8rem', color: '#6b7280', borderBottom: '1px solid rgba(99,102,241,0.06)' }}>
                <span>{t.icon}</span><span>{t.text}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: 12, background: 'rgba(239,68,68,0.06)', borderRadius: 12,
            border: '1px solid rgba(239,68,68,0.15)' }}>
            <div style={{ fontSize: '0.75rem', color: '#dc2626', lineHeight: 1.6, fontWeight: 500 }}>
              ⚠️ This AI provides general information only. Always consult a qualified healthcare professional for medical advice.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
