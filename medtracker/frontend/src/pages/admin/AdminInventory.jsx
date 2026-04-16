import React, { useEffect, useState } from 'react';
import api from '../../api';

function Row({ item, onUpdate }) {
  const [stock, setStock] = useState(item.stock);
  const [price, setPrice] = useState(item.price);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await onUpdate(item.id, stock, price);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600 }}>{item.pharmacy?.name}</div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.pharmacy?.branch}</div>
      </td>
      <td style={{ fontWeight: 600, color: '#1e1b4b' }}>{item.medicine?.name}</td>
      <td>
        <input type="number" className="input" style={{ width: 90, padding: '6px 10px', fontSize: '0.85rem' }}
          value={stock} onChange={e => setStock(e.target.value)} />
      </td>
      <td>
        <input type="number" className="input" style={{ width: 90, padding: '6px 10px', fontSize: '0.85rem' }}
          value={price} onChange={e => setPrice(e.target.value)} />
      </td>
      <td>
        <span className={`status-badge ${item.stock > 50 ? 'in-stock' : item.stock > 0 ? 'low-stock' : 'out-stock'}`}>
          {item.stock > 50 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
        </span>
      </td>
      <td>
        <button className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
          style={{ padding: '6px 14px', fontSize: '0.82rem' }} onClick={save}>
          {saved ? '✅ Saved' : '💾 Update'}
        </button>
      </td>
    </tr>
  );
}

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const load = () => api.get('/admin/inventory').then(r => setInventory(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const update = async (id, stock, price) => {
    await api.put(`/admin/inventory/${id}`, { stock: parseInt(stock), price: parseFloat(price) });
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🏪 Inventory</div>
        <div className="page-sub">Manage stock levels and pricing</div>
      </div>

      <div className="glass-panel">
        <div style={{ overflowX: 'auto' }}>
          <table className="med-table">
            <thead>
              <tr><th>Pharmacy</th><th>Medicine</th><th>Stock</th><th>Price (₹)</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {inventory.map(item => <Row key={item.id} item={item} onUpdate={update} />)}
              {inventory.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>Loading inventory...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
