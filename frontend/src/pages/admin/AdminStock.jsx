import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, RotateCcw, History } from 'lucide-react';
import {
  fetchStockLevels,
  fetchProductStockHistory,
  addStock,
  removeStock,
  adjustStock,
  formatPrice,
} from '../../api';
import '../../styles/Panel.css';

export default function AdminStock() {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('levels');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    reason: '',
    notes: '',
  });

  const loadStockLevels = () => {
    fetchStockLevels()
      .then(setStockData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStockLevels();
  }, []);

  const openModal = (type, productId = null) => {
    setModalType(type);
    setFormData({ productId: productId || '', quantity: '', reason: '', notes: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ productId: '', quantity: '', reason: '', notes: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.quantity) {
      alert('Product and quantity are required');
      return;
    }

    try {
      if (modalType === 'add') {
        await addStock(formData.productId, parseInt(formData.quantity), formData.reason, formData.notes);
      } else if (modalType === 'remove') {
        await removeStock(formData.productId, parseInt(formData.quantity), formData.reason, formData.notes);
      } else if (modalType === 'adjust') {
        await adjustStock(formData.productId, parseInt(formData.quantity), formData.reason, formData.notes);
      }
      closeModal();
      loadStockLevels();
    } catch (err) {
      alert(err.message);
    }
  };

  const viewHistory = async (productId) => {
    try {
      const data = await fetchProductStockHistory(productId);
      setSelectedProduct(productId);
      setHistory(data);
      setActiveTab('history');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading-spinner" style={{ margin: '40px auto' }} />;

  return (
    <>
<<<<<<< HEAD
      <div className="admin-page-header">
        <h1>Stock Management</h1>
        <div className="admin-action-group">
=======
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1>Stock Management</h1>
        <div style={{ display: 'flex', gap: 8 }}>
>>>>>>> 715b6936714f9861f1b1425fa1a3286b176524c1
          <button className="btn btn-sky btn-sm" onClick={() => openModal('add')}>
            <ArrowUp size={16} /> Add Stock
          </button>
          <button className="btn btn-orange btn-sm" onClick={() => openModal('remove')}>
            <ArrowDown size={16} /> Remove Stock
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => openModal('adjust')}>
            <RotateCcw size={16} /> Adjust Stock
          </button>
        </div>
      </div>
      <p className="panel-subtitle">Monitor and manage inventory levels</p>

      {/* Tabs */}
<<<<<<< HEAD
      <div className="admin-tabs">
=======
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
>>>>>>> 715b6936714f9861f1b1425fa1a3286b176524c1
        <button
          onClick={() => setActiveTab('levels')}
          style={{
            background: activeTab === 'levels' ? 'var(--sky-blue)' : 'transparent',
            color: activeTab === 'levels' ? 'white' : 'var(--text-muted)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Stock Levels
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            background: activeTab === 'history' ? 'var(--sky-blue)' : 'transparent',
            color: activeTab === 'history' ? 'white' : 'var(--text-muted)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <History size={16} style={{ display: 'inline', marginRight: 4 }} />
          Transaction History
        </button>
      </div>

      {/* Stock Levels Tab */}
      {activeTab === 'levels' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="stat-label" style={{ color: 'white' }}>Total Products</div>
              <div className="stat-value" style={{ color: 'white' }}>{stockData?.totalProducts}</div>
            </div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <div className="stat-label" style={{ color: 'white' }}>Low Stock</div>
              <div className="stat-value" style={{ color: 'white' }}>{stockData?.lowStock}</div>
            </div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <div className="stat-label" style={{ color: 'white' }}>Out of Stock</div>
              <div className="stat-value" style={{ color: 'white' }}>{stockData?.outOfStock}</div>
            </div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
              <div className="stat-label" style={{ color: 'white' }}>Adequate Stock</div>
              <div className="stat-value" style={{ color: 'white' }}>{stockData?.adequateStock}</div>
            </div>
          </div>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockData?.products?.map((product) => {
                  let status = 'Adequate';
                  let statusColor = '#10B981';
                  if (!product.inStock || product.stockQuantity === 0) {
                    status = 'Out of Stock';
                    statusColor = '#EF4444';
                  } else if (product.stockQuantity <= 10) {
                    status = 'Low Stock';
                    statusColor = '#F59E0B';
                  }

                  return (
                    <tr key={product._id}>
<<<<<<< HEAD
                      <td data-label="Product" data-full style={{ fontWeight: 500 }}>{product.name}</td>
                      <td data-label="Category">{product.category?.name || '—'}</td>
                      <td data-label="Stock Level" style={{ fontSize: 16, fontWeight: 600 }}>{product.stockQuantity}</td>
                      <td data-label="Status">
=======
                      <td style={{ fontWeight: 500 }}>{product.name}</td>
                      <td>{product.category?.name || '—'}</td>
                      <td style={{ fontSize: 16, fontWeight: 600 }}>{product.stockQuantity}</td>
                      <td>
>>>>>>> 715b6936714f9861f1b1425fa1a3286b176524c1
                        <span className="status-badge" style={{ background: `${statusColor}20`, color: statusColor }}>
                          {status}
                        </span>
                      </td>
<<<<<<< HEAD
                      <td data-label="Actions">
=======
                      <td>
>>>>>>> 715b6936714f9861f1b1425fa1a3286b176524c1
                        <div className="panel-actions" style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-sm btn-sky" onClick={() => openModal('add', product._id)}>
                            Add
                          </button>
                          <button className="btn btn-sm btn-orange" onClick={() => openModal('remove', product._id)}>
                            Remove
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={() => viewHistory(product._id)}>
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Transaction History Tab */}
      {activeTab === 'history' && (
        <>
          <h3 style={{ marginBottom: 16 }}>Transaction History</h3>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Before</th>
                  <th>After</th>
                  <th>Reason</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  history.map((tx) => (
                    <tr key={tx._id}>
<<<<<<< HEAD
                      <td data-label="Date">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td data-label="Type">
=======
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td>
>>>>>>> 715b6936714f9861f1b1425fa1a3286b176524c1
                        <span className="status-badge" style={{
                          background: tx.transactionType === 'add' ? '#10B98120' : tx.transactionType === 'remove' ? '#EF444420' : '#F59E0B20',
                          color: tx.transactionType === 'add' ? '#10B981' : tx.transactionType === 'remove' ? '#EF4444' : '#F59E0B',
                        }}>
                          {tx.transactionType.charAt(0).toUpperCase() + tx.transactionType.slice(1)}
                        </span>
                      </td>
<<<<<<< HEAD
                      <td data-label="Quantity" style={{ fontWeight: 600 }}>{tx.quantity}</td>
                      <td data-label="Before">{tx.previousQuantity}</td>
                      <td data-label="After">{tx.newQuantity}</td>
                      <td data-label="Reason">{tx.reason || '—'}</td>
                      <td data-label="Notes">{tx.notes || '—'}</td>
=======
                      <td style={{ fontWeight: 600 }}>{tx.quantity}</td>
                      <td>{tx.previousQuantity}</td>
                      <td>{tx.newQuantity}</td>
                      <td>{tx.reason || '—'}</td>
                      <td>{tx.notes || '—'}</td>
>>>>>>> 715b6936714f9861f1b1425fa1a3286b176524c1
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
<<<<<<< HEAD
          <div className="stock-modal" style={{
=======
          <div style={{
>>>>>>> 715b6936714f9861f1b1425fa1a3286b176524c1
            background: 'white',
            borderRadius: 8,
            padding: 24,
            maxWidth: 500,
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}>
            <h2>{modalType === 'add' ? 'Add Stock' : modalType === 'remove' ? 'Remove Stock' : 'Adjust Stock'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Product</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid var(--border-color)',
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                >
                  <option value="">Select a product</option>
                  {stockData?.products?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Current: {p.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>
                  {modalType === 'adjust' ? 'New Quantity' : 'Quantity'}
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  min="0"
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid var(--border-color)',
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Reason</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid var(--border-color)',
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                >
                  <option value="">Select a reason</option>
                  <option value="New Purchase">New Purchase</option>
                  <option value="Damage">Damage</option>
                  <option value="Return">Return</option>
                  <option value="Recount">Recount</option>
                  <option value="Adjustment">Adjustment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes about this transaction"
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid var(--border-color)',
                    borderRadius: 4,
                    fontSize: 14,
                    minHeight: 80,
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sky">
                  {modalType === 'add' ? 'Add Stock' : modalType === 'remove' ? 'Remove Stock' : 'Adjust Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
