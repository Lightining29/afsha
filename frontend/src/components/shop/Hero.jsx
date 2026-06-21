import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Battery, Volume2, Layers } from 'lucide-react';
import { fetchBanner } from '../../api';
import './Hero.css';

const HERO_IMAGE_URL = '/massager.png';

// Inline SVG placeholder shown if public/massager.png is missing or fails to load.
const PLACEHOLDER_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0%" stop-color="#ffe6ef"/>
           <stop offset="100%" stop-color="#fff5f9"/>
         </linearGradient>
       </defs>
       <rect width="600" height="800" fill="url(#g)"/>
       <g fill="none" stroke="#d46a95" stroke-width="6" opacity="0.5">
         <rect x="210" y="240" width="180" height="320" rx="40"/>
         <circle cx="300" cy="200" r="60"/>
       </g>
       <text x="300" y="640" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#5a3145">Massager Photo</text>
       <text x="300" y="684" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#8a5a6e">Add public/massager.png</text>
     </svg>`
  );

const DEFAULT_BANNER = {
  heading: 'Restore. Relax. Renew.',
  headingHighlight: 'Renew.',
  subheading:
    'Meet the Glowora percussive wellness massager — nine attachments, deep-tissue relief, and a moment of calm in your daily ritual.',
  badgeText: 'New Arrival',
  ctaPrimary: 'Shop the Massager',
};

const badges = [
  { icon: Layers,   label: '9 Interchangeable Heads' },
  { icon: Battery,  label: 'Up to 6h Battery' },
  { icon: Volume2,  label: 'Whisper-Quiet' },
];

function buildTitle(heading, highlight) {
  if (!highlight || !heading.includes(highlight)) return <>{heading}</>;
  const parts = heading.split(highlight);
  return (
    <>
      {parts[0]}
      <span className="hero-title-highlight">{highlight}</span>
      {parts[1]}
    </>
  );
}

export default function Hero() {
  const [banner, setBanner] = useState(DEFAULT_BANNER);
  const [scrollY, setScrollY] = useState(0);
  const [imgSrc, setImgSrc] = useState(HERO_IMAGE_URL);

  useEffect(() => {
    fetchBanner()
      .then((data) =>
        setBanner({
          ...DEFAULT_BANNER,
          ...data,
          // Admin-edited banner copy wins for headline/subheading if set;
          // keep our wellness defaults otherwise.
          heading: data?.heading || DEFAULT_BANNER.heading,
          headingHighlight: data?.headingHighlight || DEFAULT_BANNER.headingHighlight,
          subheading: data?.subheading || DEFAULT_BANNER.subheading,
        })
      )
      .catch(() => {});

    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallaxStyle = {
    '--scroll-y': `${Math.min(scrollY * 0.12, 36)}px`,
    '--content-y': `${Math.min(scrollY * 0.04, 18)}px`,
    '--glow-strength': `${0.25 + Math.min(scrollY / 220, 0.30)}`,
  };

  return (
    <section id="home" className="hero" style={parallaxStyle}>
      <div className="hero-bg">
        <div className="hero-bg-blob blob-1" />
        <div className="hero-bg-blob blob-2" />
        <div className="hero-bg-blob blob-3" />
      </div>

      <div className="container hero-grid">
        <div className="hero-content animate-in" style={{ transform: 'translateY(var(--content-y, 0px))' }}>
          <span className="hero-tag">
            <Sparkles size={12} />
            {banner.badgeText}
          </span>

          <h1 className="hero-title">
            {buildTitle(banner.heading, banner.headingHighlight)}
          </h1>

          <p className="hero-desc">{banner.subheading}</p>

          <div className="hero-actions">
            <a href="#bestsellers" className="btn btn-hero-primary" id="hero-shop-now">
              {banner.ctaPrimary} <ArrowRight size={18} />
            </a>
            <a href="#categories" className="btn btn-hero-ghost" id="hero-explore">
              Explore Wellness
            </a>
          </div>

          <div className="hero-badges">
            {badges.map(({ icon: Icon, label }) => (
              <div key={label} className="hero-badge">
                <span className="hero-badge-icon"><Icon size={16} /></span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual animate-in" style={{ animationDelay: '0.2s', transform: 'translateY(calc(var(--scroll-y, 0px) * 0.75))' }}>
          <div className="hero-visual-stage">
            <img
              src={imgSrc}
              alt="Glowora percussive wellness massager"
              className="hero-main-image"
              onError={() => setImgSrc(PLACEHOLDER_SVG)}
            />
            <div className="hero-visual-glow hero-visual-glow-left" />
            <div className="hero-visual-glow hero-visual-glow-right" />
            <div className="hero-visual-ribbon">Featured</div>
            <div className="hero-visual-rating">
              <span className="hero-rating-stars">★★★★★</span>
              <span className="hero-rating-text">4.9 · 2,300+ reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-dot" />
      </div>
    </section>
  );
}
