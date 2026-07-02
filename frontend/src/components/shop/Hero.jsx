import { useEffect, useState } from 'react';
import { ArrowRight, Truck, ShieldCheck, Star } from 'lucide-react';
import './Hero.css';

const HERO_IMAGE_URL = '/hi.jpg';

// Inline SVG placeholder shown if the product photo is missing.
const PLACEHOLDER_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0%" stop-color="#1e3a8a"/>
           <stop offset="100%" stop-color="#0f172a"/>
         </linearGradient>
       </defs>
       <rect width="600" height="800" fill="url(#g)"/>
       <g fill="none" stroke="#60a5fa" stroke-width="6" opacity="0.6">
         <rect x="210" y="240" width="180" height="320" rx="40"/>
         <circle cx="300" cy="200" r="60"/>
       </g>
       <text x="300" y="640" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#dbeafe">Massager Photo</text>
       <text x="300" y="684" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#93c5fd">Add public/masage.jpg</text>
     </svg>`
  );

const trustStats = [
  { icon: Star, value: '4.9', label: 'Avg. Rating' },
  { icon: ShieldCheck, value: '100%', label: 'Secure Pay' },
   { icon: Headphones, value: '', label: '24/7 Support' },
];

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [imgSrc, setImgSrc] = useState(HERO_IMAGE_URL);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
            New Arrival · Percussive Wellness
          </span>

          <h1 className="hero-title">
            Restore Your Body,
            <br />
            <span className="hero-title-highlight">Recharge Your Day.</span>
          </h1>

          <p className="hero-desc">
            Meet the Glowora percussive massager — 9 attachments, deep-tissue relief,
            whisper-quiet power, and 6 hours of battery. Engineered for everyday recovery.
          </p>

          <div className="hero-actions">
            <a href="#bestsellers" className="hero-cta-primary">
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

        {/* RIGHT — featured product */}
        <div className="hero-visual animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="hero-product-stage">
            <img
              src={imgSrc}
              alt="Glowora percussive wellness massager"
              className="hero-product-image"
              onError={() => setImgSrc(PLACEHOLDER_SVG)}
            />

            {/* floating glass chips */}
            <div className="hero-chip hero-chip-discount">
              <span className="hero-chip-value">-25%</span>
              <span className="hero-chip-label">Launch Offer</span>
            </div>

            <div className="hero-chip hero-chip-rating">
              <span className="hero-chip-stars">★★★★★</span>
              <span className="hero-chip-count">2,300+ reviews</span>
            </div>

            <div className="hero-chip hero-chip-price">
              <span className="hero-chip-price-old">₹6,999</span>
              <span className="hero-chip-price-new">₹5,249</span>
            </div>

            <div className="hero-product-glow" />
          </div>
        </div>
      </div>
    </section>
  );
}
