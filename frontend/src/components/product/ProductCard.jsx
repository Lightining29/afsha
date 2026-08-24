import { Gift, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProduct, formatPrice, getProductPrice } from '../../api';
import { useCart } from '../../context/CartContext';
import CountdownTimer from '../shop/CountdownTimer';
import './ProductCard.css';

export default function ProductCard({ product, variant = 'standard' }) {
  const { toggleWishlist, isInWishlist } = useCart();
  const finalPrice = getProductPrice(product);
  const hasDiscount = product.discountPercent > 0;
  const isBogo = product.isBogoActive ?? (product.isBogo && (!product.bogoEndsAt || new Date(product.bogoEndsAt) > new Date()));
  const isLiked = isInWishlist(product._id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const prefetchProduct = () => {
    fetchProduct(product.slug).catch(() => {});
    if (product.image) {
      const image = new Image();
      image.src = product.image;
    }
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className={`product-card-link ${variant === 'carousel' ? 'carousel-card' : ''}`}
      onPointerEnter={prefetchProduct}
      onFocus={prefetchProduct}
    >
      <div className="product-card">
        {/* ── Product Image Wrap ── */}
        <div className="product-image-wrap">
          <img
            src={product.image || '/hair-remover-transparent.png'}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.src = '/hair-remover-transparent.png'; }}
          />

          {/* Diagonal Corner Ribbon (Screenshot match) */}
          {hasDiscount && (
            <div className="product-corner-ribbon">
              <span>{product.discountPercent}% off</span>
            </div>
          )}

          {/* BOGO Floating Badge */}
          {isBogo && (
            <div className="product-card-bogo-badge">
              <Gift size={11} className="bogo-gift-icon" />
              <span>{product.bogoBadgeText || 'BOGO FREE'}</span>
            </div>
          )}

          {/* BOGO Countdown Timer */}
          {isBogo && product.bogoEndsAt && (
            <div className="product-card-timer-wrap">
              <CountdownTimer targetDate={product.bogoEndsAt} compact />
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category-sub">
            {product.category?.name || "Personal Care"}
          </p>

          <div className="product-bottom">
            <div className="product-prices">
              <span className="price-current">{formatPrice(finalPrice)}</span>
              {(hasDiscount || product.originalPrice) && (
                <span className="price-original">
                  {formatPrice(hasDiscount ? product.price : product.originalPrice)}
                </span>
              )}
            </div>

            {/* Floating Wishlist Heart */}
            <button
              type="button"
              className={`product-heart-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleHeartClick}
              aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={15}
                fill={isLiked ? '#ef4444' : 'none'}
                color={isLiked ? '#ef4444' : '#94a3b8'}
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
