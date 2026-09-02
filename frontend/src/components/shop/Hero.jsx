import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Sparkles,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fetchProduct, fetchProducts, formatPrice, getProductPrice } from '../../api';
import './Hero.css';

const SLIDES = [
  {
    id: 0,
    themeClass: 'slide-skincare-rose',
    eyebrowText: '100% Painless Body Grooming',
    eyebrowClass: 'eyebrow-rose',
    eyebrowIcon: Sparkles,
    titleLead: 'Flawless Painless',
    titleHighlight: 'Body Hair Remover',
    highlightClass: 'highlight-rose',
    titleSub: 'Instant Touch-Ups • Zero Redness, Cuts or Bumps',
    ctaText: 'Buy Hair Remover 💖',
    ctaClass: 'btn-rose',
    ctaLink: '/painless-facial-hair-remover',
    image: '/hair-remover-showcase-v3.png',
    imageAlt: 'Painless Body & Facial Hair Remover',
    badgeText: '✨ 18K Gold Precision Head'
  },
  {
    id: 1,
    themeClass: 'slide-skincare-rose',
    eyebrowText: 'Gentle on Sensitive Skin',
    eyebrowClass: 'eyebrow-gold',
    eyebrowIcon: Star,
    titleLead: 'Full Body & Facial',
    titleHighlight: 'Precision Shaver',
    highlightClass: 'highlight-amber',
    titleSub: 'Face • Arms • Legs • Underarms • Bikini Line',
    ctaText: 'Shop Hair Remover ⚡',
    ctaClass: 'btn-gold',
    ctaLink: '/painless-facial-hair-remover',
    image: '/hair-remover-transparent.png',
    imageAlt: 'Flawless Body Hair Remover Trimmer',
    badgeText: '💖 100% Safe For All Skin Types'
  },
  {
    id: 2,
    themeClass: 'slide-skincare-rose',
    eyebrowText: 'Portable Lipstick Design',
    eyebrowClass: 'eyebrow-rose',
    eyebrowIcon: Zap,
    titleLead: 'Compact & Rechargeable',
    titleHighlight: 'Body Hair Trimmer',
    highlightClass: 'highlight-rose',
    titleSub: 'Built-in LED Light • USB Fast Charging',
    ctaText: 'Order Now 50% Off ✨',
    ctaClass: 'btn-rose',
    ctaLink: '/painless-facial-hair-remover',
    image: '/hair-remover-showcase.png',
    imageAlt: 'Rechargeable Body Hair Remover',
    badgeText: '⚡ Built-in Smart LED Light'
  }
];

function findHairRemover(items) {
  if (!Array.isArray(items)) return null;
  return items.find(
    (p) =>
      p.slug === 'painless-facial-hair-remover' ||
      /painless.*hair|facial.*hair|hair[- ]?remover/i.test(p.slug || '') ||
      /hair[- ]?remover|facial.*trimmer/i.test(p.name || '')
  );
}

export default function Hero({ products: initialProducts = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [productData, setProductData] = useState(() => findHairRemover(initialProducts));
  const touchStartX = useRef(null);

  // Fetch real live product data and pricing from API
  useEffect(() => {
    let isMounted = true;

    if (initialProducts && initialProducts.length > 0) {
      const match = findHairRemover(initialProducts);
      if (match) {
        setProductData(match);
        return;
      }
    }

    fetchProduct('painless-facial-hair-remover')
      .then((data) => {
        if (!isMounted) return;
        if (data && (data.price !== undefined || data.finalPrice !== undefined)) {
          setProductData(data);
        }
      })
      .catch(() => {
        fetchProducts({ limit: 10 })
          .then((res) => {
            if (!isMounted) return;
            const list = Array.isArray(res) ? res : res?.items || [];
            const match = findHairRemover(list);
            if (match) setProductData(match);
          })
          .catch(() => {});
      });

    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  // 4s Auto Slider Timer (pauses on user hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Set banner price to 1,799 as requested
  const currentPrice = 1799;
  const originalPrice = productData?.originalPrice || productData?.mrp || 3599;

  const displayPrice = formatPrice(currentPrice);
  const displayOrigPrice = formatPrice(originalPrice);
  const displayDiscount = productData?.discountPercent
    ? `${productData.discountPercent}% OFF`
    : originalPrice > currentPrice
    ? `${Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF`
    : '50% OFF';

  const productTargetLink = productData?.slug
    ? `/${productData.slug}`
    : '/painless-facial-hair-remover';

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 35) {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    } else if (diff < -35) {
      setActiveSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    }
    touchStartX.current = null;
  };

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setActiveSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  return (
    <section id="home" className="hero-banner-section">
      <div className="container">
        {/* ── Main Slider Viewport (Exact 210px Aspect Ratio) ── */}
        <div
          className="hero-slider-viewport"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {SLIDES.map((slide, idx) => {
            const EyebrowIcon = slide.eyebrowIcon;
            const isActive = activeSlide === idx;

            return (
              <div
                key={slide.id}
                className={`hero-banner-card ${slide.themeClass} ${isActive ? 'slide-active' : 'slide-hidden'}`}
              >
                {/* Background Ambient Glow Orbs */}
                <div className="hero-ambient-glow glow-1" />
                <div className="hero-ambient-glow glow-2" />

                {/* Left Content Column */}
                <div className="hero-banner-left">
                  <div className={`hero-eyebrow ${slide.eyebrowClass}`}>
                    <EyebrowIcon size={12} className="eyebrow-icon" />
                    <span>{slide.eyebrowText}</span>
                  </div>

                  <h2 className="hero-banner-title">
                    {slide.titleLead} <br />
                    <span className={`hero-title-highlight ${slide.highlightClass}`}>
                      {slide.titleHighlight}
                    </span> <br />
                    <span className="hero-title-sub">{slide.titleSub}</span>
                  </h2>

                  {/* Pricing & CTA Row with Real Live Fetched Prices */}
                  <div className="hero-action-row">
                    <Link to={productTargetLink} className={`hero-shop-btn ${slide.ctaClass}`}>
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={14} className="btn-arrow-icon" />
                    </Link>

                    <div className="hero-price-chip">
                      <span className="hero-curr-price">{displayPrice}</span>
                      <span className="hero-orig-price">{displayOrigPrice}</span>
                      <span className="hero-save-badge">{displayDiscount}</span>
                    </div>
                  </div>
                </div>

                {/* Right Product Image Column */}
                <div className="hero-banner-right">
                  <div className="hero-img-box">
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      className="hero-product-photo hero-img-no-shadow"
                      fetchpriority={idx === 0 ? 'high' : 'auto'}
                      decoding="async"
                    />

                    {/* Floating Feature Chip */}
                    <div className="hero-floating-chip">
                      <span>{slide.badgeText}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Desktop Arrow Controls */}
          <button
            type="button"
            className="hero-nav-arrow arrow-prev"
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="hero-nav-arrow arrow-next"
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            <ChevronRight size={18} />
          </button>

          {/* Slider Pagination Indicators */}
          <div className="hero-slider-indicators">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`hero-slider-dot ${activeSlide === idx ? 'active' : ''}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
