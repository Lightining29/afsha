import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift, HeartHandshake, Flame } from 'lucide-react';
import { fetchProducts } from '../../api';
import './Hero.css';

export default function Hero() {
  const [hairRemover, setHairRemover] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    fetchProducts({ limit: '16' })
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.items || []);
        if (Array.isArray(items)) {
          const found = items.find((p) =>
            /hair.remover|hair.removal|epilat|ipl|wax|trimmer|shaver|eyebrow/i.test(p.name)
          );
          if (found) {
            setHairRemover(found);
          } else if (items.length > 0) {
            setHairRemover(items[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  // 3s Auto Slider Timer for 3 slides as requested
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 35) {
      setActiveSlide((prev) => (prev + 1) % 3);
    } else if (diff < -35) {
      setActiveSlide((prev) => (prev === 0 ? 2 : prev - 1));
    }
    touchStartX.current = null;
  };

  const isBogo = hairRemover?.isBogoActive ?? (hairRemover?.isBogo && (!hairRemover?.bogoEndsAt || new Date(hairRemover.bogoEndsAt) > new Date()));
  const showcaseImage = '/hair-remover-showcase-v3.png';
  const targetProductLink = hairRemover?.slug ? `/products/${hairRemover.slug}` : '#all-products';

  return (
    <section id="home" className="hero-banner-section">
      <div className="container">
        <div
          className="hero-slider-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* ── Slide 1: Raksha Bandhan Light Theme (Same as Slide 2) with Product Showcase ── */}
          <div className={`hero-banner-card slide-raksha-light slide-trimmer-light ${activeSlide === 0 ? 'slide-active' : 'slide-hidden'}`}>
            {/* Left Content */}
            <div className="hero-banner-left">
              <div className="hero-banner-eyebrow raksha-light-eyebrow">
                <Gift size={11} className="raksha-heart-icon" />
                <span>Raksha Bandhan Special</span>
              </div>

              <h2 className="hero-banner-title slide-light-title">
                Silky Smooth <br />
                <span className="slide-light-title-main">Flawless Finish</span> <br />
                <span className="slide-light-title-accent">
                  {isBogo ? 'Buy 1 Get 1 Free' : 'Special Gift For Sister'}
                </span>
              </h2>

              <Link to={targetProductLink} className="hero-banner-shop-btn slide-light-cta-btn">
                Shop Gift 🎁
              </Link>
            </div>

            {/* Right Product Image Showcase (No shadow as requested) */}
            <div className="hero-banner-right">
              <div className="hero-banner-img-container">
                <img
                  src={showcaseImage}
                  alt={hairRemover?.name || 'Multi-functional Eyebrow & Body Trimmer'}
                  className="hero-banner-img hero-img-no-shadow"
                  fetchpriority="high"
                  decoding="async"
                />

                {isBogo && (
                  <div className="hero-banner-bogo-tag slide-light-bogo-tag">
                    <Gift size={11} /> BOGO FREE
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Slide 2: Raksha Bandhan Special Banner (Light Theme, Wishes & Shop Button Only) ── */}
          <div className={`hero-banner-card slide-raksha-light ${activeSlide === 1 ? 'slide-active' : 'slide-hidden'}`}>
            <div className="raksha-light-content">
              {/* Left Transparent Raksha Bandhan & Rakhi Art */}
              <div className="raksha-light-left-art">
                <img
                  src="/raksha-bandhan-clean-transparent.png"
                  alt="Happy Raksha Bandhan"
                  className="raksha-light-main-img hero-img-no-shadow"
                  fetchpriority="high"
                />
              </div>

              {/* Right Wishes & Shop Button */}
              <div className="raksha-light-text-col">
                <div className="raksha-light-eyebrow">
                  <HeartHandshake size={13} className="raksha-heart-icon" />
                  <span>Bond of Love &amp; Protection</span>
                </div>

                <h3 className="raksha-light-wishes-title">
                  Happy <span className="raksha-title-highlight">Raksha Bandhan</span> ✨
                </h3>

                <div className="raksha-ornament-wrap">
                  <img
                    src="/festive-rakhi-ornament.png"
                    alt="Festive Rakhi"
                    className="raksha-ornament-img hero-img-no-shadow"
                  />
                </div>

                <p className="raksha-light-wishes-desc">
                  May this auspicious festival of Rakhi bring boundless love, peace, and eternal joy to you and your family.
                </p>

                <Link to="#all-products" className="hero-banner-shop-btn raksha-light-cta-btn">
                  Shop Festive Gifts 🎁
                </Link>
              </div>
            </div>
          </div>

          {/* ── Slide 3: Royal Festive Light Theme with Half Rakhi Hanging Out & Italic Colorful Text ── */}
          <div className={`hero-banner-card slide-raksha-royal-light ${activeSlide === 2 ? 'slide-active' : 'slide-hidden'}`}>
            {/* Half Rakhi Hanging Out of Banner Top-Right */}
            <div className="hero-hanging-rakhi-wrap">
              <img
                src="/hanging-rakhi-ornament.png"
                alt="Hanging Rakhi Ornament"
                className="hero-hanging-rakhi-img"
              />
            </div>

            {/* Slide Content */}
            <div className="royal-slide-content">
              <div className="royal-eyebrow royal-light-eyebrow">
                <Flame size={12} className="royal-sparkle-icon" />
                <span>Rakhi Festive Celebration</span>
              </div>

              <h2 className="royal-italic-headline royal-light-italic-headline">
                <span className="royal-italic-line-1-dark">A Sacred Thread of</span> <br />
                <span className="royal-italic-colorful-light">Love, Joy &amp; Protection</span>
              </h2>

              <p className="royal-wishes-subtitle royal-light-subtitle">
                Cherish the sweetest memories and celebrate eternal sibling love with exclusive curated gifts.
              </p>

              <div className="royal-btn-group">
                <Link to="#all-products" className="hero-banner-shop-btn royal-light-cta-btn">
                  Gift Sister Today 💖
                </Link>
              </div>
            </div>
          </div>

          {/* ── Slider Pagination Indicators (3 Dots) ── */}
          <div className="hero-slider-indicators">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                className={`hero-slider-dot dot-on-light ${activeSlide === idx ? 'active' : ''}`}
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
