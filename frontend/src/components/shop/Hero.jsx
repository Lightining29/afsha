import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Sparkles,
  Flame,
  Star,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import './Hero.css';

const SLIDES = [
  {
    id: 0,
    tabLabel: 'Electric Massager',
    tabIcon: Zap,
    themeClass: 'slide-wellness-gold',
    eyebrowText: 'Top-Rated Pain Relief & Relaxation',
    eyebrowClass: 'eyebrow-gold',
    eyebrowIcon: Zap,
    titleLead: 'Therapeutic Full Body',
    titleHighlight: 'Electric Massager',
    highlightClass: 'highlight-amber',
    titleSub: 'Instant relief from back, neck & shoulder fatigue',
    price: '₹1,499',
    origPrice: '₹2,999',
    discount: '50% OFF',
    rating: '4.9',
    reviewsCount: '380+',
    features: [
      '3200 RPM High-Torque Pure Copper Motor',
      '4 Interchangeable Heads + Mesh Guard',
      'Variable Speed Dial with Deep Kneading'
    ],
    ctaText: 'Shop Massager ⚡',
    ctaClass: 'btn-gold',
    ctaLink: '/electric-body-massager',
    image: '/masage.jpg',
    imageAlt: 'Electric Body Massager Machine',
    floatingBadges: [
      { text: '⚡ 3200 RPM Copper Core', position: 'float-top-left' },
      { text: '🔥 50% OFF TODAY', position: 'float-top-right' },
      { text: '✨ 4 Multi-Heads', position: 'float-bottom-left' }
    ]
  },
  {
    id: 1,
    tabLabel: 'Facial Trimmer',
    tabIcon: Sparkles,
    themeClass: 'slide-skincare-rose',
    eyebrowText: '100% Painless & Gentle Grooming',
    eyebrowClass: 'eyebrow-rose',
    eyebrowIcon: Sparkles,
    titleLead: 'Silky Smooth Glowing Skin',
    titleHighlight: 'Flawless Facial Trimmer',
    highlightClass: 'highlight-rose',
    titleSub: 'Instant touch-ups for peach fuzz & upper lips with zero redness',
    price: '₹799',
    origPrice: '₹1,599',
    discount: '50% OFF',
    rating: '4.8',
    reviewsCount: '510+',
    features: [
      'Hypoallergenic 18K Gold-Plated Precision Head',
      'Built-in Smart LED Light for Fine Peach Fuzz',
      'Discreet Lipstick Size & USB Fast Charging'
    ],
    ctaText: 'Explore Trimmer 💖',
    ctaClass: 'btn-rose',
    ctaLink: '/painless-facial-hair-remover',
    image: '/hair-remover-showcase-v3.png',
    imageAlt: 'Painless Facial Hair Remover',
    floatingBadges: [
      { text: '✨ 18K Rose Gold Head', position: 'float-top-left' },
      { text: '💡 Built-in LED Guide', position: 'float-top-right' },
      { text: '🌸 Zero Redness & Cuts', position: 'float-bottom-right' }
    ]
  },
  {
    id: 2,
    tabLabel: 'Massage Gun',
    tabIcon: Flame,
    themeClass: 'slide-recovery-slate',
    eyebrowText: 'Athletic Recovery & Deep Tissue Release',
    eyebrowClass: 'eyebrow-amber',
    eyebrowIcon: Flame,
    titleLead: 'Professional Grade Percussion',
    titleHighlight: 'Deep Tissue Massage Gun',
    highlightClass: 'highlight-amber',
    titleSub: 'Flush lactic acid & eliminate muscle knots in minutes',
    price: '₹2,499',
    origPrice: '₹4,999',
    discount: '50% OFF',
    rating: '4.9',
    reviewsCount: '420+',
    features: [
      '12mm Deep Muscle Stroke Amplitude',
      '6 Intelligent Speed Levels up to 3600 RPM',
      '4-6 Hours Rechargeable Battery Life'
    ],
    ctaText: 'Shop Massage Gun 🎯',
    ctaClass: 'btn-amber',
    ctaLink: '/deep-tissue-massager',
    image: '/bg.jpg',
    imageAlt: 'Deep Tissue Percussion Massager Gun',
    floatingBadges: [
      { text: '🎯 12mm Deep Amplitude', position: 'float-top-left' },
      { text: '🔋 6-Hour Battery Life', position: 'float-top-right' },
      { text: '🤫 <45dB Whisper Quiet', position: 'float-bottom-left' }
    ]
  }
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  // 4.5s Auto Slider Timer (pauses on user hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
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
        {/* ── Quick Switcher Header Tabs ── */}
        <div className="hero-quick-tabs">
          {SLIDES.map((slide, idx) => {
            const Icon = slide.tabIcon;
            return (
              <button
                key={slide.id}
                type="button"
                className={`hero-tab-pill ${activeSlide === idx ? 'tab-active' : ''}`}
                onClick={() => setActiveSlide(idx)}
              >
                <Icon size={14} className="hero-tab-icon" />
                <span>{slide.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Interactive Slider Viewport ── */}
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
                    <EyebrowIcon size={13} className="eyebrow-icon" />
                    <span>{slide.eyebrowText}</span>
                  </div>

                  <h2 className="hero-banner-title">
                    {slide.titleLead} <br />
                    <span className={`hero-title-highlight ${slide.highlightClass}`}>
                      {slide.titleHighlight}
                    </span> <br />
                    <span className="hero-title-sub">{slide.titleSub}</span>
                  </h2>

                  {/* Feature Checklist Tags */}
                  <div className="hero-feature-tags">
                    {slide.features.map((feat, fIdx) => (
                      <span key={fIdx} className="hero-tag">
                        <CheckCircle2 size={12} className="tag-check-icon" />
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Pricing, Reviews & CTA Row */}
                  <div className="hero-action-box">
                    <div className="hero-price-stack">
                      <div className="hero-price-line">
                        <span className="hero-curr-price">{slide.price}</span>
                        <span className="hero-orig-price">{slide.origPrice}</span>
                        <span className="hero-save-badge">{slide.discount}</span>
                      </div>
                      <div className="hero-rating-badge">
                        <div className="hero-stars-row">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={11} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                        <span className="hero-rating-text">{slide.rating} ({slide.reviewsCount} reviews)</span>
                      </div>
                    </div>

                    <Link to={slide.ctaLink} className={`hero-shop-btn ${slide.ctaClass}`}>
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={16} className="btn-arrow-icon" />
                    </Link>
                  </div>
                </div>

                {/* Right Interactive Product Stage */}
                <div className="hero-banner-right">
                  <div className="hero-stage-aura" />
                  <div className="hero-img-box">
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      className="hero-product-photo"
                      fetchpriority={idx === 0 ? 'high' : 'auto'}
                      decoding="async"
                    />

                    {/* Dynamic Floating Badges */}
                    {slide.floatingBadges.map((badge, bIdx) => (
                      <div key={bIdx} className={`hero-floating-chip ${badge.position}`}>
                        <span>{badge.text}</span>
                      </div>
                    ))}
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
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="hero-nav-arrow arrow-next"
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
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
