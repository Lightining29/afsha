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
    title: 'Fast deleivery',
    subtitle: 'Fast and secure delivery across India',
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

      </div>
    </section>
  );
}
