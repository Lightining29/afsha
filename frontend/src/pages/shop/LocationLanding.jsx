import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Truck, CheckCircle2, Star, Zap, ShoppingBag, Shield, ArrowRight } from 'lucide-react';
import { getLocationData } from '../../data/locationData';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './LocationLanding.css';

export default function LocationLanding() {
  const { city: paramCity } = useParams();
  const location = useLocation();

  const citySlug = paramCity || location.pathname.replace(/^\/(locations|location)?\/?/, '').replace(/\.html$/, '') || 'delhi';
  const loc = getLocationData(citySlug);

  const featuredProducts = [
    {
      slug: 'electric-body-massager',
      name: 'Electric Body Massager Machine',
      price: 1499,
      orig: 2999,
      img: '/masage.jpg',
      rating: 4.9
    },
    {
      slug: 'deep-tissue-massager',
      name: 'Deep Tissue Percussion Massager Gun',
      price: 2499,
      orig: 4999,
      img: '/bg.jpg',
      rating: 4.9
    },
    {
      slug: 'neck-and-shoulder-massager',
      name: 'Cervical Neck & Shoulder Massager',
      price: 1899,
      orig: 3799,
      img: '/masage.jpg',
      rating: 4.9
    }
  ];

  return (
    <>
      <Helmet>
        <title>{loc.metaTitle}</title>
        <meta name="description" content={loc.metaDescription} />
        <meta name="keywords" content={loc.keywords} />
        <link rel="canonical" href={`https://www.afshaenterprises.com/locations/${citySlug}`} />
      </Helmet>

      <Navbar />

      <main className="location-page">
        {/* Hero */}
        <section className="location-hero">
          <div className="location-hero-inner">
            <div className="loc-badge">
              <MapPin size={16} /> Official Store Delivery in {loc.city}
            </div>
            <h1>
              Buy Electric Body Massagers in <span>{loc.city}</span>
            </h1>
            <p>
              Enjoy {loc.deliveryTime} across all major pin codes in {loc.city} &amp; surrounding regions.
            </p>
            <div className="loc-perks-row">
              <span><Truck size={16} /> {loc.deliveryTime}</span>
              <span><CheckCircle2 size={16} /> 100% Genuine Certified</span>
              <span><Star size={16} /> 4.9/5 Rated by Customers</span>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="location-products-section">
          <div className="location-container">
            <h2 className="section-title">Best-Selling Body Massagers in {loc.city}</h2>
            <div className="loc-products-grid">
              {featuredProducts.map((p) => (
                <div key={p.slug} className="loc-product-card">
                  <div className="loc-img-wrap">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="loc-card-body">
                    <h3>{p.name}</h3>
                    <div className="loc-price-row">
                      <span className="price-curr">₹{p.price}</span>
                      <span className="price-orig">₹{p.orig}</span>
                      <span className="save-chip">50% OFF</span>
                    </div>
                    <div className="loc-card-actions">
                      <Link to={`/${p.slug}`} className="btn-loc-details">
                        View Details
                      </Link>
                      <Link to={`/checkout`} className="btn-loc-buy">
                        <Zap size={14} /> Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Local Verified Review Card */}
            {loc.localReview && (
              <div className="loc-review-card">
                <div className="review-tag">⭐ Verified Customer in {loc.city}</div>
                <p className="review-quote">&quot;{loc.localReview.comment}&quot;</p>
                <span className="review-author">— {loc.localReview.author} ({loc.localReview.locality})</span>
              </div>
            )}

            {/* Delivery Pincodes */}
            <div className="loc-pincodes-card">
              <h3>Fast Serviceable PIN Codes in {loc.city}:</h3>
              <div className="pincode-chips">
                {loc.popularPincodes.map((pin) => (
                  <span key={pin} className="pin-chip">✓ {pin}</span>
                ))}
                <span className="pin-chip highlight">+ All {loc.city} PIN Codes</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
