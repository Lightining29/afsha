import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  MoreHorizontal,
  Gift
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getProductPrice } from '../../api';
import { toastInfo, toastSuccess } from '../../utils/toast.js';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const {
    items,
    cartTotal,
    cartRawSubtotal,
    bogoTotalSavings,
    removeFromCart,
    updateQuantity,
    addToCart,
    isItemBogo,
    getItemPayableQty,
    getItemTotalPrice,
    getItemSavings
  } = useCart();
  const { isAuthenticated, setShowLoginModal } = useAuth();

  const handleRemove = (item) => {
    removeFromCart(item._id);
    toastInfo('Item removed', `${item.name} removed from cart.`);
  };

  if (items.length === 0) {
    return (
      <div className="cart-app-container">
        <header className="cart-top-bar">
          <button
            type="button"
            className="cart-circle-btn"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="cart-top-title">My Cart</h1>
          <div style={{ width: 40 }} />
        </header>

        <div className="cart-empty-view">
          <div className="cart-empty-icon-wrap">
            <ShoppingBag size={56} strokeWidth={1.5} color="#94a3b8" />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-gold cart-empty-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-app-container">
      {/* ── Top Header Bar (Screenshot 3) ── */}
      <header className="cart-top-bar">
        <button
          type="button"
          className="cart-circle-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="cart-top-title">My Cart</h1>

        <button
          type="button"
          className="cart-circle-btn"
          onClick={() => {}}
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </header>

      {/* ── Cart Items List (Screenshot 3) ── */}
      <div className="cart-items-container">
        {items.map((item) => {
          const hasBogo = isItemBogo(item);
          const payableQty = getItemPayableQty(item);
          const itemTotal = getItemTotalPrice(item);
          const unitPrice = getProductPrice(item);

          return (
            <div key={item._id} className="cart-card-item">
              <div className="cart-card-img-wrap">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="cart-card-info">
                <div className="cart-card-top-info">
                  <h3 className="cart-card-name">{item.name}</h3>
                  <p className="cart-card-category">
                    {item.category?.name || "Personal Care"}
                  </p>
                </div>

                <div className="cart-card-price-row">
                  <span className="cart-card-price">{formatPrice(unitPrice)}</span>
                  {hasBogo && (
                    <span className="cart-bogo-mini-tag">
                      <Gift size={11} /> {item.quantity === 1 ? '1 Free Included' : `${item.quantity - payableQty} Free`}
                    </span>
                  )}
                </div>
              </div>

              {/* Stepper Quantity Capsule (Screenshot 3) */}
              <div className="cart-card-stepper">
                <button
                  type="button"
                  className="cart-stepper-btn"
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  aria-label="Decrease"
                >
                  <Minus size={13} />
                </button>
                <span className="cart-stepper-num">{item.quantity}</span>
                <button
                  type="button"
                  className="cart-stepper-btn"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  aria-label="Increase"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Delete Trash Button */}
              <button
                type="button"
                className="cart-trash-btn"
                onClick={() => handleRemove(item)}
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Order Summary (Screenshot 3) ── */}
      <div className="cart-order-summary-card">
        <div className="cart-summary-line">
          <span className="cart-sum-label">Subtotal :</span>
          <span className="cart-sum-val">{formatPrice(cartRawSubtotal)}</span>
        </div>

        <div className="cart-summary-line">
          <span className="cart-sum-label">Delivery Fee :</span>
          <span className="cart-sum-val free-text">Free</span>
        </div>

        {bogoTotalSavings > 0 && (
          <div className="cart-summary-line discount-line">
            <span className="cart-sum-label">Discount :</span>
            <span className="cart-sum-val discount-val">-{formatPrice(bogoTotalSavings)}</span>
          </div>
        )}

        <div className="cart-summary-divider" />

        <div className="cart-summary-line total-line">
          <span className="cart-sum-label">Total :</span>
          <span className="cart-sum-val total-val">{formatPrice(cartTotal)}</span>
        </div>
      </div>

      {/* ── Fixed Bottom Checkout Button (Screenshot 3) ── */}
      <div className="cart-fixed-bottom-bar">
        {isAuthenticated ? (
          <Link to="/checkout" className="cart-checkout-yellow-btn">
            Check out
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="cart-checkout-yellow-btn"
          >
            Check out
          </button>
        )}
      </div>
    </div>
  );
}
