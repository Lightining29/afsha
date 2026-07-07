/**
 * PromoBannerGrid — shows promotional ad banners in a responsive grid.
 * Used twice on the home page: position="above_categories" and "below_categories".
 * Each banner is a full clickable image that links to a product, category, or URL.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PromoBannerGrid.css';

// Resolve image URL — in dev the backend is on a different port
const BACKEND =
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
    : import.meta.env.DEV
      ? 'http://127.0.0.1:5000'
      : '';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:5000/api' : '/api');

function absImg(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BACKEND}${url}`;
}

function resolveHref(linkType, linkValue) {
  if (!linkValue || linkType === 'none') return null;
  if (linkType === 'product')  return `/products/${linkValue}`;
  if (linkType === 'category') return `/category/${linkValue}`;
  if (linkType === 'url')      return linkValue;
  return null;
}

function BannerItem({ banner }) {
  const href  = resolveHref(banner.linkType, banner.linkValue);
  const imgEl = (
    <img
      src={absImg(banner.imageUrl)}
      alt={banner.altText || 'Promotional banner'}
      className="promo-banner-img"
      loading="lazy"
    />
  );

  if (!href) return <div className="promo-banner-item">{imgEl}</div>;

  if (banner.linkType === 'url') {
    return (
      <a href={href} className="promo-banner-item" target="_blank" rel="noopener noreferrer">
        {imgEl}
      </a>
    );
  }

  return <Link to={href} className="promo-banner-item">{imgEl}</Link>;
}

export default function PromoBannerGrid({ position }) {
  const [banners, setBanners] = useState([]);
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    const q = position ? `?position=${encodeURIComponent(position)}` : '';
    fetch(`${API_BASE}/promo-banners${q}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setBanners(data);
      })
      .catch((err) => console.error('[PromoBannerGrid]', position, err.message))
      .finally(() => setLoaded(true));
  }, [position]);

  if (!loaded || banners.length === 0) return null;

  const count = Math.min(banners.length, 6); // clamp for CSS class

  return (
    <section className="promo-banner-section">
      <div className="container">
        <div className={`promo-banner-grid promo-banner-grid--${count}`}>
          {banners.map((b) => (
            <BannerItem key={b._id} banner={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
