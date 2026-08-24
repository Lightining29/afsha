import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift } from 'lucide-react';
import { fetchProducts } from '../../api';
import './Hero.css';

export default function Hero() {
  const [hairRemover, setHairRemover] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetchProducts({ limit: '16' })
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.items || []);
        if (Array.isArray(items)) {
          const found = items.find((p) =>
            /hair.remover|hair.removal|epilat|ipl|wax|trimmer|shaver/i.test(p.name)
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

  // Prioritize transparent vector asset or product image
  const displayImage = (!imgError && hairRemover?.image)
    ? hairRemover.image
    : '/hair-remover-transparent.svg';

  return (
    <section id="home" className="hero-banner-section">
      <div className="container">
        <div className="hero-banner-card">
          {/* Left Text & CTA */}
          <div className="hero-banner-left">
            <div className="hero-banner-eyebrow">
              <Sparkles size={13} className="hero-sparkle-icon" />
              <span>Painless &amp; Instant</span>
            </div>

            <h2 className="hero-banner-title">
              Silky Smooth <br />
              <span className="hero-banner-title-main">Flawless Skin</span> <br />
              <span className="hero-banner-title-accent">
                {isBogo ? 'Buy 1 Get 1 Free' : 'Salon Finish at Home'}
              </span>
            </h2>

            <Link
              to={hairRemover?.slug ? `/products/${hairRemover.slug}` : '#all-products'}
              className="hero-banner-shop-btn"
            >
              Shop now
            </Link>
          </div>

          {/* Right Product Image — Transparent & Beautiful Body Hair Remover */}
          <div className="hero-banner-right">
            <div className="hero-banner-img-container">
              <img
                src={displayImage}
                alt={hairRemover?.name || 'Body Hair Remover'}
                className="hero-banner-img"
                fetchpriority="high"
                decoding="async"
                onError={() => {
                  if (displayImage !== '/hair-remover-transparent.svg') {
                    setImgError(true);
                  }
                }}
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
