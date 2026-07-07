import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Star, Headphones, ShoppingBag, Zap, CheckCircle2 } from 'lucide-react';
import { toastBuyNow } from '../../utils/toast.js';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts, formatPrice, getProductPrice } from '../../api';
import './Hero.css';

const trustStats = [
  { icon: Star, value: '4.9', label: 'Avg. Rating' },
  { icon: ShieldCheck, value: '100%', label: 'Secure Pay' },
  { icon: Headphones, value: '24/7', label: 'Support' },
];

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [hairRemover, setHairRemover] = useState(null);
  const [imgError, setImgError] = useState(false);
  const { addToCart, addToCartSilent } = useCart();
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch body hair remover product
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((p) =>
            /hair.remover|hair.removal|epilat|ipl|wax/i.test(p.name)
          );
          if (found) setHairRemover(found);
          else if (data.length > 0) {
            const fallback = data.find((p) => !/massager/i.test(p.name)) || data[0];
            setHairRemover(fallback);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (!hairRemover) return;

    addToCartSilent(hairRemover);

    toastBuyNow(
      {
        name: hairRemover.name,
        price: formatPrice(getProductPrice(hairRemover)),
        imgSrc: !imgError ? hairRemover.image : null,
      },
      navigate
    );
  };

  const finalPrice = hairRemover ? getProductPrice(hairRemover) : null;
  const hasDiscount = hairRemover?.discountPercent > 0;

  const parallaxStyle = {
    '--scroll-y': `${Math.min(scrollY * 0.1, 28)}px`,
  };

  return (
    <section id="home" className="hero" style={parallaxStyle}>
      <div className="hero-bg">
        <div className="hero-bg-blob blob-1" />
        <div className="hero-bg-blob blob-2" />
        <div className="hero-bg-grid" />
      </div>

      <div className="container hero-grid">
        {/* LEFT — content */}
        <div className="hero-content animate-in">
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            New Arrival · Smooth Skin Wellness
          </span>

          <h1 className="hero-title">
            Silky Smooth Skin,
            <br />
            <span className="hero-title-highlight">Effortlessly at Home.</span>
          </h1>

          <p className="hero-desc">
            Say goodbye to salon trips. Our Body Hair Remover delivers painless,
            long-lasting results — gentle on all skin types, built for everyday use.
          </p>

          <div className="hero-actions">
            <a href="#all-products" className="hero-cta-primary">
              Shop Now <ArrowRight size={18} />
            </a>
            <a href="#categories" className="hero-cta-ghost">
              Explore Categories
            </a>
          </div>

          <div className="hero-stats">
            {trustStats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="hero-stat">
                <span className="hero-stat-icon"><Icon size={16} /></span>
                <div>
                  <div className="hero-stat-value">{value}</div>
                  <div className="hero-stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Body Hair Remover product card */}
        <div className="hero-visual animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="hero-product-card">

            {/* Product image area */}
            <div className="hero-product-img-wrap">
              {hairRemover && !imgError ? (
                <img
                  src={hairRemover.image}
                  alt={hairRemover.name || 'Body Hair Remover'}
                  className="hero-product-image"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="hero-product-img-placeholder">
                  <Zap size={48} color="#60a5fa" />
                  <span>Body Hair Remover</span>
                </div>
              )}

              {/* Discount badge */}
              {hasDiscount && (
                <div className="hero-product-badge">
                  -{hairRemover.discountPercent}% OFF
                </div>
              )}

              {/* Rating chip */}
              <div className="hero-product-rating-chip">
                <Star size={13} fill="#fbbf24" color="#fbbf24" />
                <span>{hairRemover?.rating ?? '4.8'}</span>
                <span className="hero-product-rating-count">
                  ({hairRemover?.reviewCount ?? '1,200'}+)
                </span>
              </div>
            </div>

            {/* Product info */}
            <div className="hero-product-info">
              <p className="hero-product-label">Body Hair Remover</p>
              <h3 className="hero-product-name">
                {hairRemover?.name ?? 'Smooth Body Hair Remover'}
              </h3>

              <ul className="hero-product-features">
                <li><CheckCircle2 size={14} /> Painless &amp; gentle on skin</li>
                <li><CheckCircle2 size={14} /> Use anywhere on the body</li>
                <li><CheckCircle2 size={14} /> Long-lasting smooth results</li>
              </ul>

              <div className="hero-product-price-row">
                <span className="hero-product-price">
                  {finalPrice ? formatPrice(finalPrice) : '₹999.00'}
                </span>
                {hasDiscount && (
                  <span className="hero-product-price-old">
                    {formatPrice(hairRemover.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="hero-product-save">
                    Save {formatPrice(hairRemover.price - finalPrice)}
                  </span>
                )}
              </div>

              <div className="hero-product-actions">
                <button
                  className="hero-buy-btn"
                  onClick={handleBuyNow}
                  disabled={hairRemover?.inStock === false}
                  aria-label="Buy now"
                >
                  <ShoppingBag size={17} /> Buy Now
                </button>

                {hairRemover?.slug ? (
                  <Link
                    to={`/products/${hairRemover.slug}`}
                    className="hero-view-btn"
                  >
                    View Details
                  </Link>
                ) : (
                  <a href="#all-products" className="hero-view-btn">
                    View Details
                  </a>
                )}
              </div>

              {hairRemover?.inStock === false && (
                <p className="hero-out-of-stock">Currently out of stock</p>
              )}
            </div>

            <div className="hero-product-glow" />
          </div>
        </div>
      </div>
    </section>
  );
}
