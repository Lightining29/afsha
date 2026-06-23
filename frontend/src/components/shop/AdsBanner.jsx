import { Link } from 'react-router-dom';
import { Truck, Sparkles, Percent, ArrowRight } from 'lucide-react';
import './AdsBanner.css';

/**
 * Promotional ad tiles displayed in a responsive grid on the home page.
 * Static content (no DB dependency) — edit copy here to update.
 */
const ads = [
  {
    icon: Percent,
    title: 'Flat 25% Off',
    subtitle: 'Launch offer on the massager',
    cta: 'Shop Deal',
    href: '#bestsellers',
    accent: 'blue',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    subtitle: 'On all orders over ₹999',
    cta: 'Browse Products',
    href: '#bestsellers',
    accent: 'indigo',
  },
  {
    icon: Sparkles,
    title: 'New Arrivals',
    subtitle: 'Fresh wellness drops every week',
    cta: 'Explore Now',
    href: '#categories',
    accent: 'sky',
  },
];

export default function AdsBanner() {
  return (
    <section className="ads-banner-section">
      <div className="container">
        <div className="ads-grid">
          {ads.map(({ icon: Icon, title, subtitle, cta, href, accent }) => (
            <Link to={href} key={title} className={`ad-card ad-card--${accent}`}>
              <span className="ad-icon">
                <Icon size={22} />
              </span>
              <div className="ad-body">
                <h3 className="ad-title">{title}</h3>
                <p className="ad-subtitle">{subtitle}</p>
              </div>
              <span className="ad-cta">
                {cta} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
