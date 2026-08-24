import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift } from 'lucide-react';
import { fetchProducts } from '../../api';
import './Hero.css';

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

  // The transparent trimmed trimmer from the uploaded product image
  const displayImage = '/hair-remover-transparent.png';

  return (
    <section id="home" className="hero-banner-section">
      <div className="container">
        <div className="hero-banner-card">
          {/* Left Text & CTA */}
          <div className="hero-banner-left">
            <div className="hero-banner-eyebrow">
              <Sparkles size={13} className="hero-sparkle-icon" />
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

          {/* Right Product Image — Exact Transparent Hair Remover Trimmer */}
          <div className="hero-banner-right">
            <div className="hero-banner-img-container">
              <img
                src={displayImage}
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
            <div className="hero-banner-glow" />
          </div>
        </div>
      </div>
    </section>
  );
}
