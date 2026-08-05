import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Bookmark, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getProductPrice } from '../../api';
import { toastInfo, toastSuccess } from '../../utils/toast.js';
import './Cart.css';

export default function Cart() {
  const { items, cartTotal, removeFromCart, updateQuantity, addToCart } = useCart();
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const [savedForLater, setSavedForLater] = useState(() => {
    const saved = localStorage.getItem('glowora_saved_for_later');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('glowora_saved_for_later', JSON.stringify(savedForLater));
  }, [savedForLater]);

  const handleRemove = (item) => {
    removeFromCart(item._id);
    toastInfo('Item removed', `${item.name} removed from cart.`);
  };

  const handleSaveForLater = (item) => {
    removeFromCart(item._id);
    setSavedForLater((prev) => [...prev.filter((i) => i._id !== item._id), item]);
    toastSuccess('Saved for Later', `${item.name} moved to your saved list.`);
  };

  const handleMoveToCart = (item) => {
    setSavedForLater((prev) => prev.filter((i) => i._id !== item._id));
    addToCart(item);
    toastSuccess('Moved to Cart', `${item.name} moved back to your active cart.`);
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="cart-page">
        <div className="container cart-empty">
          <ShoppingBag size={64} strokeWidth={1} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-sky">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
        <h1 className="cart-title">Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <span className="cart-item-price">{formatPrice(getProductPrice(item))}</span>
                  <div style={{ marginTop: '8px' }}>
                    <button
                      className="save-later-btn"
                      onClick={() => handleSaveForLater(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#E94057',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0,
                      }}
                    >
                      <Bookmark size={14} /> Save for later
                    </button>
                  </div>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
                <span className="cart-item-total">
                  {formatPrice(getProductPrice(item) * item.quantity)}
                </span>
                <button
                  className="cart-item-remove"
                  onClick={() => handleRemove(item)}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {/* Saved for Later Section */}
            {savedForLater.length > 0 && (
              <div className="saved-for-later-section" style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px dashed #cbd5e1' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1A2B3C', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bookmark size={18} color="#E94057" /> Saved for Later ({savedForLater.length})
                </h3>
                {savedForLater.map((item) => (
                  <div key={item._id} className="cart-item" style={{ background: '#f8fafc', borderRadius: '16px', marginBottom: '12px' }}>
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <span className="cart-item-price">{formatPrice(getProductPrice(item))}</span>
                    </div>
                    <button
                      className="btn btn-sky"
                      style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '20px' }}
                      onClick={() => handleMoveToCart(item)}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="cart-item-remove"
                      onClick={() => setSavedForLater((prev) => prev.filter((i) => i._id !== item._id))}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">Free</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            {isAuthenticated ? (
              <Link to="/checkout" className="btn btn-sky checkout-btn">Proceed to Checkout</Link>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="btn btn-sky checkout-btn"
                style={{ width: '100%', display: 'block', textAlign: 'center' }}
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
