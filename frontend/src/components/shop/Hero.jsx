import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift } from 'lucide-react';
import { fetchProducts } from '../../api';
import './Hero.css';

const circleFeatures = [
  { img: '/circle-eyebrow.png', label: 'Eyebrow' },
  { img: '/circle-face.png', label: 'Face' },
  { img: '/circle-neck.png', label: 'Neck' },
  { img: '/circle-arm.png', label: 'Arm' },
  { img: '/circle-underarm.png', label: 'Underarm' },
  { img: '/circle-leg.png', label: 'Legs' },
  { img: '/circle-bikini.png', label: 'Bikini' },
];

export default function Hero() {
  const [hairRemover, setHairRemover] = useState(null);

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

  const isBogo = hairRemover?.isBogoActive ?? (hairRemover?.isBogo && (!hairRemover?.bogoEndsAt || new Date(hairRemover.bogoEndsAt) > new Date()));
  const displayImage = '/hair-remover-transparent.png';

  return (
    <section id="home" className="hero-banner-section">
      <div className="container">
        <div className="hero-banner-card">
          {/* Top Half: Left Headline + Right Trimmer */}
          <div className="hero-banner-main-row">
            {/* Left Text & CTA */}
            <div className="hero-banner-left">
              <div className="hero-banner-eyebrow">
                <Sparkles size={12} className="hero-sparkle-icon" />
                <span>Multi-functional Trimmer</span>
              </div>

              <h2 className="hero-banner-title">
                Silky Smooth <br />
                <span className="hero-banner-title-main">Flawless Finish</span> <br />
                <span className="hero-banner-title-accent">
                  {isBogo ? 'Buy 1 Get 1 Free' : 'Painless & Instant'}
                </span>
              </h2>

              <Link
                to={hairRemover?.slug ? `/products/${hairRemover.slug}` : '#all-products'}
                className="hero-banner-shop-btn"
              >
                Shop now
              </Link>
            </div>

            {/* Right Transparent Trimmer with Orbiting Badges */}
            <div className="hero-banner-right">
              <div className="hero-banner-img-container">
                <img
                  src={displayImage}
                  alt={hairRemover?.name || 'Multi-functional Eyebrow & Body Trimmer'}
                  className="hero-banner-img"
                  fetchpriority="high"
                  decoding="async"
                />

                {/* Floating Orbiting Badges */}
                <div className="hero-orbit-badge badge-top-left">
                  <img src="/circle-eyebrow.png" alt="Eyebrow" />
                  <span>Eyebrow</span>
                </div>
                <div className="hero-orbit-badge badge-top-right">
                  <img src="/circle-face.png" alt="Face" />
                  <span>Face</span>
                </div>
                <div className="hero-orbit-badge badge-bottom-left">
                  <img src="/circle-underarm.png" alt="Underarm" />
                  <span>Underarm</span>
                </div>
                <div className="hero-orbit-badge badge-bottom-right">
                  <img src="/circle-bikini.png" alt="Bikini" />
                  <span>Bikini</span>
                </div>

                {isBogo && (
                  <div className="hero-banner-bogo-tag">
                    <Gift size={11} /> BOGO FREE
                  </div>
                )}
              </div>
              <div className="hero-banner-glow" />
            </div>
          </div>

          {/* Bottom Strip: Circular Usage Callouts (Eyebrow, Face, Arm, Legs, etc.) */}
          <div className="hero-banner-circles-strip">
            <span className="circles-strip-title">Suitable for:</span>
            <div className="circles-strip-items">
              {circleFeatures.map((feat) => (
                <div key={feat.label} className="circle-feat-pill">
                  <div className="circle-feat-img-box">
                    <img src={feat.img} alt={feat.label} />
                  </div>
                  <span className="circle-feat-text">{feat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
