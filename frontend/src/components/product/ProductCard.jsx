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


  return (
    <Link to={`/products/${product.slug}`} className="product-card-link">
      <div className="product-card">

        {/* ── Product Image ─────────────────────────── */}
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />


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
