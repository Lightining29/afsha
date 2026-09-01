import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Sparkles,
  Flame,
  Star,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Hero.css';

const SLIDES = [
  {
    id: 0,
    themeClass: 'slide-wellness-gold',
    eyebrowText: 'Instant Pain Relief & Relaxation',
    eyebrowClass: 'eyebrow-gold',
    eyebrowIcon: Zap,
    titleLead: 'Therapeutic Full Body',
    titleHighlight: 'Electric Massager',
    highlightClass: 'highlight-amber',
    titleSub: 'Relieve Back, Neck & Muscle Stiffness',
    price: '₹1,499',
    origPrice: '₹2,999',
    discount: '50% OFF',
    rating: '4.9',
    reviewsCount: '380+',
    ctaText: 'Shop Massager ⚡',
    ctaClass: 'btn-gold',
    ctaLink: '/electric-body-massager',
    image: '/masage.jpg',
    imageAlt: 'Electric Body Massager Machine',
    badgeText: '✨ 3200 RPM Copper Motor'
  },
  {
    id: 1,
    themeClass: 'slide-skincare-rose',
    eyebrowText: '100% Painless & Gentle Grooming',
    eyebrowClass: 'eyebrow-rose',
    eyebrowIcon: Sparkles,
    titleLead: 'Silky Smooth Glowing Skin',
    titleHighlight: 'Flawless Facial Trimmer',
    highlightClass: 'highlight-rose',
    titleSub: 'Instant Touch-Ups • Zero Redness or Bumps',
    price: '₹799',
    origPrice: '₹1,599',
    discount: '50% OFF',
    rating: '4.8',
    reviewsCount: '510+',
    ctaText: 'Explore Trimmer 💖',
    ctaClass: 'btn-rose',
    ctaLink: '/painless-facial-hair-remover',
    image: '/hair-remover-showcase-v3.png',
    imageAlt: 'Painless Facial Hair Remover',
    badgeText: '✨ 18K Gold Precision Head'
  },
  {
    id: 2,
    themeClass: 'slide-recovery-slate',
    eyebrowText: 'Athletic Recovery & Deep Tissue',
    eyebrowClass: 'eyebrow-amber',
    eyebrowIcon: Flame,
    titleLead: 'Professional Grade Percussion',
    titleHighlight: 'Deep Tissue Massage Gun',
    highlightClass: 'highlight-amber',
    titleSub: 'Flush Lactic Acid & Release Muscle Knots',
    price: '₹2,499',
    origPrice: '₹4,999',
    discount: '50% OFF',
    rating: '4.9',
    reviewsCount: '420+',
    ctaText: 'Shop Massage Gun 🎯',
    ctaClass: 'btn-amber',
    ctaLink: '/deep-tissue-massager',
    image: '/bg.jpg',
    imageAlt: 'Deep Tissue Percussion Massager Gun',
    badgeText: '🎯 12mm Deep Amplitude'
  }
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  // 4s Auto Slider Timer (pauses on user hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

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
        {/* ── Main Slider Viewport (Exact 210px Rakshabandhan Aspect Ratio) ── */}
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

                  {/* Pricing & CTA Row */}
                  <div className="hero-action-row">
                    <Link to={slide.ctaLink} className={`hero-shop-btn ${slide.ctaClass}`}>
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={14} className="btn-arrow-icon" />
                    </Link>

                    <div className="hero-price-chip">
                      <span className="hero-curr-price">{slide.price}</span>
                      <span className="hero-orig-price">{slide.origPrice}</span>
                      <span className="hero-save-badge">{slide.discount}</span>
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
