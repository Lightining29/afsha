import { useEffect, useState } from 'react';
import { Zap, Trash2, Clock } from 'lucide-react';
import {
  fetchAdminFlashSale,
  updateAdminFlashSale,
  removeAdminFlashSale,
  formatPrice,
  getProductPrice,
} from '../../api';
import { toastSuccess, toastError, confirmDialog } from '../../utils/toast.js';
import '../../styles/Panel.css';
import './AdminFlashSale.css';

// Format a Date object to datetime-local input value (YYYY-MM-DDTHH:MM)
function toDatetimeLocal(date) {
  if (!date) return '';
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function timeLeft(endsAt) {
  if (!endsAt) return '∞';
  const diff = new Date(endsAt) - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function AdminFlashSale() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [editing, setEditing]     = useState({}); // { [id]: { price, endsAt } }

  const load = () => {
    setLoading(true);
    fetchAdminFlashSale()
      .then(setProducts)
      .catch(() => toastError('Load failed', 'Could not fetch products'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Separate flash-sale active products from the rest
  const active  = products.filter((p) => p.flashSale);
  const all     = products.filter((p) => !p.flashSale);
  const visible = all.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnable = async (product) => {
    const ed = editing[product._id] || {};
    const flashSalePrice = parseFloat(ed.price || product.price * 0.8);
    if (isNaN(flashSalePrice) || flashSalePrice <= 0) {
      return toastError('Invalid price', 'Enter a valid flash sale price.');
    }
    if (flashSalePrice >= product.price) {
      return toastError('Price too high', 'Flash sale price must be lower than regular price.');
    }
    try {
      await updateAdminFlashSale(product._id, {
        flashSale: true,
        flashSalePrice,
        flashSaleEndsAt: ed.endsAt || null,
      });
      toastSuccess('Flash sale enabled!', `${product.name} is now on flash sale.`);
      setEditing((prev) => { const n = { ...prev }; delete n[product._id]; return n; });
      load();
    } catch (err) {
      toastError('Error', err.message);
    }
  };

  const handleUpdate = async (product) => {
    const ed = editing[product._id] || {};
    const flashSalePrice = ed.price !== undefined ? parseFloat(ed.price) : product.flashSalePrice;
    try {
      await updateAdminFlashSale(product._id, {
        flashSale: true,
        flashSalePrice,
        flashSaleEndsAt: ed.endsAt !== undefined ? ed.endsAt : product.flashSaleEndsAt,
      });
      toastSuccess('Updated!', 'Flash sale updated.');
      setEditing((prev) => { const n = { ...prev }; delete n[product._id]; return n; });
      load();
    } catch (err) {
      toastError('Error', err.message);
    }
  };

  const handleRemove = async (product) => {
    const result = await confirmDialog(
      'Remove from flash sale?',
      `${product.name} will revert to its regular price.`,
      'Yes, remove it'
    );
    if (!result.isConfirmed) return;
    try {
      await removeAdminFlashSale(product._id);
      toastSuccess('Removed', `${product.name} removed from flash sale.`);
      load();
    } catch (err) {
      toastError('Error', err.message);
    }
  };

  const setField = (id, field, value) =>
    setEditing((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  if (loading) return <div className="loading-spinner" style={{ margin: '40px auto' }} />;

  return (
    <>
      <div className="admin-page-header">
        <h1><Zap size={22} style={{ color: '#f59e0b', marginRight: 8 }} />Flash Sale</h1>
      </div>
      <p className="panel-subtitle">Set special limited-time prices on products. Active sales appear on the storefront with a countdown timer.</p>

      {/* ── Active flash sales ── */}
      {active.length > 0 && (
        <div className="fs-section">
          <h3 className="fs-section-title">
            <span className="fs-badge-live">⚡ LIVE</span> Active Flash Sales
          </h3>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Regular</th>
                  <th>Flash Price</th>
                  <th>Saving</th>
                  <th>Ends In</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {active.map((p) => {
                  const ed = editing[p._id] || {};
                  const saving = p.price - (p.flashSalePrice || p.price);
                  const savePct = Math.round((saving / p.price) * 100);
                  return (
                    <tr key={p._id} className="fs-active-row">
                      <td data-label="Product">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            <span className="fs-badge-active">Active</span>
                          </div>
                        </div>
                      </td>
                      <td data-label="Regular">
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                          {formatPrice(p.price)}
                        </span>
                      </td>
                      <td data-label="Flash Price">
                        <input
                          type="number"
                          className="fs-input"
                          defaultValue={p.flashSalePrice}
                          min={1}
                          max={p.price - 1}
                          onChange={(e) => setField(p._id, 'price', e.target.value)}
                        />
                      </td>
                      <td data-label="Saving">
                        <span className="fs-saving">-{savePct}% · {formatPrice(saving)}</span>
                      </td>
                      <td data-label="Ends In">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span className={`fs-timer ${timeLeft(p.flashSaleEndsAt) === 'Expired' ? 'expired' : ''}`}>
                            <Clock size={13} /> {timeLeft(p.flashSaleEndsAt)}
                          </span>
                          <input
                            type="datetime-local"
                            className="fs-input"
                            defaultValue={toDatetimeLocal(p.flashSaleEndsAt)}
                            onChange={(e) => setField(p._id, 'endsAt', e.target.value)}
                          />
                        </div>
                      </td>
                      <td data-label="Actions">
                        <div className="panel-actions">
                          <button
                            className="btn btn-sm btn-sky"
                            onClick={() => handleUpdate(p)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemove(p)}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add products to flash sale ── */}
      <div className="fs-section">
        <h3 className="fs-section-title">Add Products to Flash Sale</h3>
        <input
          type="text"
          className="fs-search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Regular Price</th>
                <th>Flash Sale Price</th>
                <th>End Date/Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  {search ? 'No products match your search.' : 'All products are already in flash sale.'}
                </td></tr>
              ) : visible.map((p) => {
                const ed = editing[p._id] || {};
                const suggested = Math.round(p.price * 0.8);
                return (
                  <tr key={p._id}>
                    <td data-label="Product">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td data-label="Regular Price">{formatPrice(p.price)}</td>
                    <td data-label="Flash Sale Price">
                      <input
                        type="number"
                        className="fs-input"
                        placeholder={`e.g. ${suggested}`}
                        min={1}
                        max={p.price - 1}
                        value={ed.price ?? ''}
                        onChange={(e) => setField(p._id, 'price', e.target.value)}
                      />
                    </td>
                    <td data-label="End Date/Time">
                      <input
                        type="datetime-local"
                        className="fs-input"
                        value={ed.endsAt ?? ''}
                        onChange={(e) => setField(p._id, 'endsAt', e.target.value)}
                      />
                    </td>
                    <td data-label="Action">
                      <button
                        className="btn btn-sm btn-sky"
                        onClick={() => handleEnable(p)}
                        disabled={!ed.price}
                      >
                        <Zap size={14} /> Add to Sale
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
