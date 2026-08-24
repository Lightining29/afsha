import { Star, Zap, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProduct, formatPrice, getProductPrice } from '../../api';
import CountdownTimer from '../shop/CountdownTimer';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const navigate   = useNavigate();
  const finalPrice = getProductPrice(product);
  const hasDiscount = product.discountPercent > 0;
  const isBogo = product.isBogoActive ?? (product.isBogo && (!product.bogoEndsAt || new Date(product.bogoEndsAt) > new Date()));

  const prefetchProduct = () => {
    fetchProduct(product.slug).catch(() => {});
    if (product.image) {
      const image = new Image();
      image.src = product.image;
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="product-card-link" onPointerEnter={prefetchProduct} onFocus={prefetchProduct}>
      <div className="product-card">

        {/* ── Product Image & Badges ─────────────────────────── */}
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />

          {/* BOGO Floating Badge */}
          {isBogo && (
            <div className="product-card-bogo-badge">
              <Gift size={12} className="bogo-gift-icon" />
              <span>{product.bogoBadgeText || 'BUY 1 GET 1 FREE'}</span>
            </div>
          )}

          {/* BOGO Countdown Timer if expiry date set */}
          {isBogo && product.bogoEndsAt && (
            <div className="product-card-timer-wrap">
              <CountdownTimer targetDate={product.bogoEndsAt} compact />
            </div>
          )}
        </div>

        {/* ── Product Info ──────────────────────────── */}
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>

          <div className="product-rating">
            <Star size={14} fill="#FFD700" color="#FFD700" />
            <span>{product.rating}</span>
            <span className="review-count">({product.reviewCount})</span>
          </div>

          <div className="product-bottom">
            <div className="product-prices">
              <span className="price-current">{formatPrice(finalPrice)}</span>
              {(hasDiscount || product.originalPrice) && (
                <span className="price-original">
                  {formatPrice(hasDiscount ? product.price : product.originalPrice)}
                </span>
              )}
            </div>

            {/* ── Buy Now Button ─── */}
            <button
              className="buy-now-btn"
              onClick={(e) => { e.preventDefault(); navigate(`/products/${product.slug}`); }}
              aria-label="Buy now"
              disabled={product.inStock === false}
            >
              <Zap size={13} />
              <span>{product.inStock === false ? 'Out of Stock' : 'Buy Now'}</span>
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
}
