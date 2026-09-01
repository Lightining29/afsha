import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Sparkles, Flame, Star, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(null);

  // 4s Auto Slider Timer for 3 slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4000);
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

  return (
    <section id="home" className="hero-banner-section">
      <div className="container">
        <div
          className="hero-slider-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* ── Slide 1: Electric Body Massager (Best-Seller Hero) ── */}
          <div className={`hero-banner-card slide-wellness-gold ${activeSlide === 0 ? 'slide-active' : 'slide-hidden'}`}>
            <div className="hero-banner-left">
              <div className="hero-eyebrow eyebrow-gold">
                <Zap size={13} className="eyebrow-icon" />
                <span>Instant Pain Relief &amp; Relaxation</span>
              </div>

              <h2 className="hero-banner-title">
                Therapeutic Full Body <br />
                <span className="hero-title-highlight highlight-amber">Electric Massager</span> <br />
                <span className="hero-title-sub">Relieve Back, Neck &amp; Muscle Stiffness</span>
              </h2>

              <div className="hero-feature-tags">
                <span className="hero-tag"><Star size={12} fill="#f59e0b" color="#f59e0b" /> 4.9 Rating (380+ Reviews)</span>
                <span className="hero-tag"><CheckCircle2 size={12} color="#16a34a" /> 100% Pure Copper Motor</span>
                <span className="hero-tag"><ShieldCheck size={12} color="#0284c7" /> 4 Multi-Heads + Mesh Guard</span>
              </div>

              <div className="hero-cta-row">
                <Link to="/electric-body-massager" className="hero-shop-btn btn-gold">
                  Shop Massager <ArrowRight size={15} />
                </Link>
                <span className="hero-offer-badge">⚡ Special Price ₹1,499</span>
              </div>
            </div>

            <div className="hero-banner-right">
              <div className="hero-img-box">
                <img
                  src="/masage.jpg"
                  alt="Electric Body Massager Machine"
                  className="hero-product-photo"
                  fetchpriority="high"
                  decoding="async"
                />
                <div className="hero-floating-chip chip-top-left">
                  <span>✨ 3200 RPM High Torque</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Slide 2: Painless Facial Hair Remover (Skincare Hero) ── */}
          <div className={`hero-banner-card slide-skincare-rose ${activeSlide === 1 ? 'slide-active' : 'slide-hidden'}`}>
            <div className="hero-banner-left">
              <div className="hero-eyebrow eyebrow-rose">
                <Sparkles size={13} className="eyebrow-icon" />
                <span>100% Painless &amp; Gentle Grooming</span>
              </div>

              <h2 className="hero-banner-title">
                Silky Smooth Skin <br />
                <span className="hero-title-highlight highlight-rose">Flawless Facial Trimmer</span> <br />
                <span className="hero-title-sub">Instant Touch-Ups • Zero Redness or Bumps</span>
              </h2>

              <div className="hero-feature-tags">
                <span className="hero-tag"><CheckCircle2 size={12} color="#16a34a" /> 18K Gold-Plated Precision Head</span>
                <span className="hero-tag"><CheckCircle2 size={12} color="#16a34a" /> Built-in Smart LED Light</span>
                <span className="hero-tag"><CheckCircle2 size={12} color="#16a34a" /> Pocket Lipstick Size</span>
              </div>

              <div className="hero-cta-row">
                <Link to="/painless-facial-hair-remover" className="hero-shop-btn btn-rose">
                  Explore Trimmer <ArrowRight size={15} />
                </Link>
                <span className="hero-offer-badge badge-rose">💖 Only ₹799 (50% OFF)</span>
              </div>
            </div>

            <div className="hero-banner-right">
              <div className="hero-img-box">
                <img
                  src="/hair-remover-showcase-v3.png"
                  alt="Painless Facial Hair Remover"
                  className="hero-product-photo"
                  fetchpriority="high"
                  decoding="async"
                />
                <div className="hero-floating-chip chip-bottom-right">
                  <span>✨ Hypoallergenic 18K Gold</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Slide 3: Deep Tissue Massage Gun (Muscle Recovery Hero) ── */}
          <div className={`hero-banner-card slide-recovery-slate ${activeSlide === 2 ? 'slide-active' : 'slide-hidden'}`}>
            <div className="hero-banner-left">
              <div className="hero-eyebrow eyebrow-amber">
                <Flame size={13} className="eyebrow-icon" />
                <span>Athletic Recovery &amp; Trigger Point Relief</span>
              </div>

              <h2 className="hero-banner-title">
                Professional Grade <br />
                <span className="hero-title-highlight highlight-amber">Deep Tissue Massage Gun</span> <br />
                <span className="hero-title-sub">Flush Lactic Acid &amp; Release Muscle Knots</span>
              </h2>

              <div className="hero-feature-tags">
                <span className="hero-tag"><CheckCircle2 size={12} color="#16a34a" /> 12mm Deep Stroke Amplitude</span>
                <span className="hero-tag"><CheckCircle2 size={12} color="#16a34a" /> 6 Speed Gears up to 3600 RPM</span>
                <span className="hero-tag"><CheckCircle2 size={12} color="#16a34a" /> 4-6 Hours Battery Life</span>
              </div>

              <div className="hero-cta-row">
                <Link to="/deep-tissue-massager" className="hero-shop-btn btn-amber">
                  Shop Massage Gun <ArrowRight size={15} />
                </Link>
                <span className="hero-offer-badge badge-amber">🔥 ₹2,499 (Save ₹2,500)</span>
              </div>
            </div>

            <div className="hero-banner-right">
              <div className="hero-img-box">
                <img
                  src="/bg.jpg"
                  alt="Deep Tissue Percussion Massager Gun"
                  className="hero-product-photo"
                  fetchpriority="high"
                  decoding="async"
                />
                <div className="hero-floating-chip chip-top-left">
                  <span>🎯 12mm Deep Amplitude</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Slider Pagination Indicators (3 Dots) ── */}
          <div className="hero-slider-indicators">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
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
