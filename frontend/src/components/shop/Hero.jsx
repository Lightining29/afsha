import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Gift } from 'lucide-react';
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

  return (
    <section id="home" className="hero-banner-section">
      <div className="container">
        <div className="hero-banner-card">
          {/* Left Text & CTA */}
          <div className="hero-banner-left">
            <h2 className="hero-banner-title">
              Get your <br />
              <span className="hero-banner-title-main">special sale</span> <br />
              <span className="hero-banner-title-accent">
                {isBogo ? 'Buy 1 Get 1 Free' : 'up to 50%'}
              </span>
            </h2>

            <Link
              to={hairRemover?.slug ? `/products/${hairRemover.slug}` : '#all-products'}
              className="hero-banner-shop-btn"
            >
              Shop now
            </Link>
          </div>

          {/* Right Product Image — Body Hair Remover */}
          <div className="hero-banner-right">
            {hairRemover && !imgError ? (
              <img
                src={hairRemover.image}
                alt={hairRemover.name || 'Body Hair Remover'}
                className="hero-banner-img"
                fetchpriority="high"
                decoding="async"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="hero-banner-placeholder">
                <Zap size={44} color="#fec22a" />
                <span>Body Hair Remover</span>
              </div>
            )}

            {isBogo && (
              <div className="hero-banner-bogo-tag">
                <Gift size={12} /> BOGO FREE
              </div>
            )}
            <div className="hero-banner-glow" />
          </div>
        </div>
      </div>
    </section>
  );
}
