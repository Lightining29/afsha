import { Heart, Star, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getProductPrice, addToWishlist, removeFromWishlist } from '../../api';
import { toastWishlist } from '../../utils/toast.js';
import './ProductCard.css';

export default function ProductCard({ product, onWishlistRemove }) {
  const { toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const navigate    = useNavigate();
  const wished      = isInWishlist(product._id);
  const finalPrice  = getProductPrice(product);
  const hasDiscount = product.discountPercent > 0;

  const handleWishlist = async () => {
    if (!isAuthenticated) { setShowLoginModal(true); return; }
    toggleWishlist(product);
    toastWishlist(!wished);
    try {
      if (wished) { await removeFromWishlist(product._id); onWishlistRemove?.(); }
      else        { await addToWishlist(product._id); }
    } catch { toggleWishlist(product); }
  };

  const getBadgeClass = (badgeName) => {
    if (!badgeName) return 'badge-custom';
    const lower = badgeName.toLowerCase();
    if (lower.includes('natural') || lower.includes('organic')) return 'badge-natural';
    if (lower.includes('warranty'))  return 'badge-warranty';
    if (lower.includes('limited'))   return 'badge-limited';
    if (lower.includes('flash'))     return 'badge-flash';
    if (lower.includes('vip'))       return 'badge-vip';
    if (lower.includes('top rated') || lower.includes('rated')) return 'badge-toprated';
    if (lower.includes('bestseller') || lower.includes('best seller')) return 'badge-bestseller';
    if (lower.includes('trending') || lower.includes('hot')) return 'badge-trending';
    if (lower.includes('new'))       return 'badge-new';
    return 'badge-custom';
  };

  return (
    <Link to={`/products/${product.slug}`} className="product-card-link">
      <div className="product-card">

        {/* ── Product Image ─────────────────────────── */}
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />

          <div className="product-badges-stack">
            {hasDiscount && <span className="product-badge-chip badge-discount">-{product.discountPercent}% OFF</span>}
            {product.isTrending     && <span className="product-badge-chip badge-trending">🔥 Trending</span>}
            {product.isBestseller   && <span className="product-badge-chip badge-bestseller">⭐ Bestseller</span>}
            {product.isNewArrival   && <span className="product-badge-chip badge-new">✨ New</span>}
            {product.isLimitedEdition && <span className="product-badge-chip badge-limited">💎 Limited</span>}
            {product.badge && <span className={`product-badge-chip ${getBadgeClass(product.badge)}`}>✨ {product.badge}</span>}
            {!hasDiscount && !product.isTrending && !product.isBestseller && !product.isNewArrival && !product.isLimitedEdition && !product.badge && (
              (product.rating || 5) >= 4.5
                ? <span className="product-badge-chip badge-toprated">⭐ Top Rated</span>
                : <span className="product-badge-chip badge-premium">✨ Quality Tested</span>
            )}
          </div>

          <button
            className={`wishlist-btn ${wished ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleWishlist(); }}
            aria-label="Add to wishlist"
          >
            <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
          </button>
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
