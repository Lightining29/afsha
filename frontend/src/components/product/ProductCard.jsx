import { Star, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, getProductPrice } from '../../api';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const navigate   = useNavigate();
  const finalPrice = getProductPrice(product);
  const hasDiscount = product.discountPercent > 0;

  return (
    <Link to={`/products/${product.slug}`} className="product-card-link">
      <div className="product-card">

        {/* ── Product Image ─────────────────────────── */}
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
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
