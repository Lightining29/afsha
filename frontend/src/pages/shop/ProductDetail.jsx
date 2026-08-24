import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  MoreHorizontal,
  Heart,
  Minus,
  Plus,
  Gift,
  Share2,
  Check
} from 'lucide-react';
import {
  fetchProduct,
  formatPrice,
  getProductPrice,
} from '../../api';
import { useCart } from '../../context/CartContext';
import CountdownTimer from '../../components/shop/CountdownTimer';
import Footer from '../../components/layout/Footer';
import { toastSuccess, toastInfo } from '../../utils/toast.js';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProduct(slug)
      .then((data) => {
        if (!mounted) return;
        setProduct(data);
      })
      .catch(() => {
        if (mounted) navigate('/');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="product-detail-page-wrapper">
        <div className="product-detail-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page-wrapper">
        <div className="product-not-found">
          <h2>Product not found</h2>
          <Link to="/" className="btn btn-gold">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const finalPrice = getProductPrice(product);
  const hasDiscount = product.discountPercent > 0;
  const isBogo = product.isBogoActive ?? (product.isBogo && (!product.bogoEndsAt || new Date(product.bogoEndsAt) > new Date()));
  const isLiked = isInWishlist(product._id);

  const gallery = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);
  const activeIdx = Math.min(activeImage, gallery.length - 1);
  const mainImage = gallery[activeIdx] || product.image;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toastSuccess('Added to Cart', `${product.name} (Qty: ${quantity}) added!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Afsha Enterprises`}</title>
        <meta name="description" content={product.description?.substring(0, 160)} />
      </Helmet>

      <div className="product-detail-app-container">
        {/* ── Top Header Bar (Screenshot 2) ── */}
        <header className="pdp-top-bar">
          <button
            type="button"
            className="pdp-circle-btn"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="pdp-top-title">Details Products</h1>

          <button
            type="button"
            className="pdp-circle-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                toastInfo('Link Copied', 'Product link copied to clipboard.');
              }
            }}
            aria-label="Share options"
          >
            <MoreHorizontal size={18} />
          </button>
        </header>

        {/* ── Main Showcase Image ── */}
        <div className="pdp-stage-section">
          <div className="pdp-stage-img-wrap">
            <img
              src={mainImage}
              alt={product.name}
              className="pdp-stage-img"
              fetchpriority="high"
            />
            {isBogo && (
              <div className="pdp-bogo-float-badge">
                <Gift size={13} /> {product.bogoBadgeText || 'BUY 1 GET 1 FREE'}
              </div>
            )}
          </div>

          {/* Circular Gallery Thumbnail Strip (Screenshot 2) */}
          {gallery.length > 1 && (
            <div className="pdp-circular-thumbnails">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pdp-thumb-circle ${i === activeIdx ? 'active' : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info Sheet (Screenshot 2) ── */}
        <div className="pdp-info-sheet">
          <div className="pdp-title-row">
            <div>
              <h2 className="pdp-product-name">{product.name}</h2>
              <p className="pdp-category-name">
                {product.category?.name || 'Personal Care & Wellness'}
              </p>
            </div>

            {/* Wishlist Heart Button */}
            <button
              type="button"
              className={`pdp-heart-circle-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
            >
              <Heart
                size={20}
                fill={isLiked ? '#ef4444' : 'none'}
                color={isLiked ? '#ef4444' : '#94a3b8'}
              />
            </button>
          </div>

          {/* Price Row */}
          <div className="pdp-price-row">
            <span className="pdp-price-current">{formatPrice(finalPrice)}</span>
            {(hasDiscount || product.originalPrice) && (
              <span className="pdp-price-original">
                {formatPrice(hasDiscount ? product.price : product.originalPrice)}
              </span>
            )}
            {hasDiscount && (
              <span className="pdp-save-chip">-{product.discountPercent}% OFF</span>
            )}
          </div>

          {/* BOGO Countdown Timer */}
          {isBogo && product.bogoEndsAt && (
            <div className="pdp-bogo-timer-box">
              <CountdownTimer targetDate={product.bogoEndsAt} label="BOGO Offer Ends In" />
            </div>
          )}

          {/* Options / Variant Selector Pills (Screenshot 2) */}
          <div className="pdp-variants-section">
            <span className="pdp-section-subhead">Options</span>
            <div className="pdp-variant-pills">
              {['Standard', isBogo ? 'Pack of 2 (BOGO Deal)' : 'Value Pack', 'Pro Edition'].map((variant) => (
                <button
                  key={variant}
                  type="button"
                  className={`pdp-variant-pill ${selectedVariant === variant ? 'active' : ''}`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>

          {/* Description with Read More */}
          <div className="pdp-description-section">
            <p className={`pdp-desc-text ${descExpanded ? 'expanded' : ''}`}>
              {product.description}
            </p>
            {product.description?.length > 120 && (
              <button
                type="button"
                className="pdp-read-more-btn"
                onClick={() => setDescExpanded(!descExpanded)}
              >
                {descExpanded ? 'Read less' : 'Read more...'}
              </button>
            )}
          </div>

          {/* Social Proof Favorite Avatars (Screenshot 2) */}
          <div className="pdp-social-proof">
            <div className="pdp-avatar-group">
              <span className="pdp-avatar av-1">✨</span>
              <span className="pdp-avatar av-2">🌸</span>
              <span className="pdp-avatar av-3">💎</span>
              <span className="pdp-avatar av-4">⭐</span>
            </div>
            <span className="pdp-social-proof-text">10,000+ people favorite this</span>
          </div>
        </div>

        {/* ── Fixed Bottom Action Bar (Screenshot 2) ── */}
        <div className="pdp-bottom-action-bar">
          {/* Stepper Capsule */}
          <div className="pdp-stepper-capsule">
            <button
              type="button"
              className="pdp-stepper-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="pdp-stepper-val">{quantity}</span>
            <button
              type="button"
              className="pdp-stepper-btn"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart / Buy Now Golden Yellow CTA */}
          <button
            type="button"
            className="pdp-cta-yellow-btn"
            onClick={handleBuyNow}
            disabled={product.inStock === false}
          >
            {product.inStock === false ? 'Out of Stock' : 'Add to cart'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
