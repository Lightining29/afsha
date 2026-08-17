/**
 * FlashSaleBanner — shown on the homepage when active flash sale products exist.
 * Features a live countdown timer, horizontal product scroll, and "⚡ Flash Sale" branding.
 */
import { useEffect, useState, useRef } from 'react';
import { Zap, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchFlashSaleProducts, formatPrice, getProductPrice } from '../../api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './FlashSaleBanner.css';

/* ── Countdown hook ── */
function useCountdown(targetDate) {
  const calc = () => {
    if (!targetDate) return null;
    const diff = new Date(targetDate) - Date.now();
    if (diff <= 0) return { h: '00', m: '00', s: '00', expired: true };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, '0');
    return { h: pad(h), m: pad(m), s: pad(s), expired: false };
  };

  const [time, setTime] = useState(calc);
  useEffect(() => {
    if (!targetDate) return;
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);
  return time;
}

/* ── Single product flash card ── */
function FlashCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const finalPrice = getProductPrice(product);
  const saving = product.price - finalPrice;
  const savePct = Math.round((saving / product.price) * 100);

  const handleCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { setShowLoginModal(true); return; }
    addToCart(product);
  };

  return (
    <Link to={`/products/${product.slug}`} className="fs-card-link">
      <div className="fs-card">
        <div className="fs-card-img-wrap">
          <img src={product.image} alt={product.name} loading="lazy" />
          <span className="fs-card-badge">-{savePct}%</span>
        </div>
        <div className="fs-card-info">
          <p className="fs-card-name">{product.name}</p>
          <div className="fs-card-prices">
            <span className="fs-card-price">{formatPrice(finalPrice)}</span>
            <span className="fs-card-original">{formatPrice(product.price)}</span>
          </div>
        </div>
        <button
          className="fs-card-btn"
          onClick={handleCart}
          aria-label="Add to cart"
          disabled={product.inStock === false}
        >
          <ShoppingBag size={16} />
        </button>
      </div>
    </Link>
  );
}

/* ── Main banner ── */
export default function FlashSaleBanner() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const rail = useRef(null);

  useEffect(() => {
    fetchFlashSaleProducts()
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Use the soonest expiry across all products as the countdown target
  const soonestExpiry = products
    .map((p) => p.flashSaleEndsAt)
    .filter(Boolean)
    .sort()[0] || null;

  const countdown = useCountdown(soonestExpiry);

  const scroll = (dir) => {
    rail.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  if (loading || products.length === 0) return null;

  return (
    <section className="flash-sale-banner">
      {/* Header */}
      <div className="fs-header">
        <div className="fs-title-group">
          <span className="fs-icon-pulse"><Zap size={20} /></span>
          <div>
            <p className="fs-eyebrow">Limited Time</p>
            <h2 className="fs-title">Flash Sale</h2>
          </div>
        </div>

        {/* Countdown */}
        {countdown && !countdown.expired && (
          <div className="fs-countdown">
            <span className="fs-countdown-label">Ends in</span>
            <div className="fs-countdown-blocks">
              <div className="fs-count-block">
                <span className="fs-count-num">{countdown.h}</span>
                <span className="fs-count-unit">hrs</span>
              </div>
              <span className="fs-count-sep">:</span>
              <div className="fs-count-block">
                <span className="fs-count-num">{countdown.m}</span>
                <span className="fs-count-unit">min</span>
              </div>
              <span className="fs-count-sep">:</span>
              <div className="fs-count-block">
                <span className="fs-count-num">{countdown.s}</span>
                <span className="fs-count-unit">sec</span>
              </div>
            </div>
          </div>
        )}

        {/* Nav arrows */}
        <div className="fs-nav">
          <button className="fs-arrow" onClick={() => scroll(-1)} aria-label="Scroll left">
            <ChevronLeft size={18} />
          </button>
          <button className="fs-arrow" onClick={() => scroll(1)} aria-label="Scroll right">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Product rail */}
      <div className="fs-rail" ref={rail}>
        {products.map((p) => (
          <FlashCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
