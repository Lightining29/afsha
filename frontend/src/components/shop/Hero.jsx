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

  // 2s Auto Slider Timer for 3 slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 2000);
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
          {/* ── Slide 1: Original Trimmer Banner (Dark Luxury Theme) ── */}
          <div className={`hero-banner-card slide-trimmer ${activeSlide === 0 ? 'slide-active' : 'slide-hidden'}`}>
            {/* Left Content */}
            <div className="hero-banner-left">
              <div className="hero-banner-eyebrow">
                <Sparkles size={11} className="hero-sparkle-icon" />
                <span>Multi-functional Trimmer</span>
              </div>

              <h2 className="hero-banner-title">
                Silky Smooth <br />
                <span className="hero-banner-title-main">Flawless Finish</span> <br />
                <span className="hero-banner-title-accent">
                  {isBogo ? 'Buy 1 Get 1 Free' : 'Painless & Instant'}
                </span>
              </h2>

              <Link to={targetProductLink} className="hero-banner-shop-btn">
                Shop now
              </Link>
            </div>

            {/* Right Product Image Showcase */}
            <div className="hero-banner-right">
              <div className="hero-banner-img-container">
                <img
                  src={showcaseImage}
                  alt={hairRemover?.name || 'Multi-functional Eyebrow & Body Trimmer'}
                  className="hero-banner-img"
                  fetchpriority="high"
                  decoding="async"
                />

                {isBogo && (
                  <div className="hero-banner-bogo-tag">
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
                  className="raksha-light-main-img"
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
                    className="raksha-ornament-img"
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

          {/* ── Slide 3: Royal Velvet Theme with Half Rakhi Hanging Out & Italic Colorful Text ── */}
          <div className={`hero-banner-card slide-raksha-royal ${activeSlide === 2 ? 'slide-active' : 'slide-hidden'}`}>
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
              <div className="royal-eyebrow">
                <Flame size={12} className="royal-sparkle-icon" />
                <span>Rakhi Festive Celebration</span>
              </div>

              <h2 className="royal-italic-headline">
                <span className="royal-italic-line-1">A Sacred Thread of</span> <br />
                <span className="royal-italic-colorful">Love, Joy &amp; Protection</span>
              </h2>

              <p className="royal-wishes-subtitle">
                Cherish the sweetest memories and celebrate eternal sibling love with exclusive curated gifts.
              </p>

              <div className="royal-btn-group">
                <Link to="#all-products" className="hero-banner-shop-btn royal-glow-btn">
                  Gift Sister Today 💖
                </Link>
              </div>
            </div>
          </div>

          {/* ── Slider Pagination Indicators (3 Dots) ── */}
          <div className="hero-slider-indicators">
            <button
              type="button"
              className={`hero-slider-dot ${activeSlide === 0 ? 'active' : ''} ${activeSlide === 1 ? 'dot-on-light' : ''}`}
              onClick={() => setActiveSlide(0)}
              aria-label="Slide 1 - Trimmer Showcase"
            />
            <button
              type="button"
              className={`hero-slider-dot ${activeSlide === 1 ? 'active' : ''} ${activeSlide === 1 ? 'dot-on-light' : ''}`}
              onClick={() => setActiveSlide(1)}
              aria-label="Slide 2 - Raksha Bandhan Greetings"
            />
            <button
              type="button"
              className={`hero-slider-dot ${activeSlide === 2 ? 'active' : ''}`}
              onClick={() => setActiveSlide(2)}
              aria-label="Slide 3 - Royal Rakhi Special"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
