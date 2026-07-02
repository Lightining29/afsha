import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Leaf, FlaskConical, Recycle, Rabbit, ArrowRight, Star, Truck, ShieldCheck, Users } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/shop/Hero';
import TrustBar from '../../components/shop/TrustBar';
import Categories from '../../components/shop/Categories';
import AdsBanner from '../../components/shop/AdsBanner';
import PromoBanner from '../../components/shop/PromoBanner';
import AllProducts from '../../components/shop/AllProducts';
import Testimonials from '../../components/shop/Testimonials';
import Footer from '../../components/layout/Footer';
import '../../styles/animations.css';
import './Home.css';

const pillars = [
  { icon: Leaf, title: 'Clean Ingredients', desc: 'Only the best from nature' },
  { icon: FlaskConical, title: 'Science-Backed', desc: 'Dermatologist tested formulas' },
  { icon: Recycle, title: 'Eco-Friendly', desc: 'Sustainable packaging' },
  { icon: Rabbit, title: 'Cruelty-Free', desc: 'Never tested on animals' },
];

const stats = [
  { icon: Users, value: '10k+', label: 'Happy Customers' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
  { icon: Truck, value: 'Free', label: 'Shipping Over ₹999' },
  { icon: ShieldCheck, value: '100%', label: 'Secure Payments' },
];

export default function Home() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Afsha Enterprises',
    'url': 'https://afshaenterprises.com',
    'logo': 'https://afshaenterprises.com/logo.png',
    'sameAs': [
      'https://www.facebook.com/afshaenterprises',
      'https://www.instagram.com/afshaenterprises',
      'https://twitter.com/afshaenterprises'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+91-9999999999',
      'contactType': 'customer service'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Afsha Enterprises',
    'url': 'https://afshaenterprises.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://afshaenterprises.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <Helmet>
        <title>Best Body Massager in India | Afsha Enterprises</title>
        <meta name="description" content="Buy premium body massagers from Afsha Enterprises. Electric, handheld and pain relief massagers with fast delivery across India." />
        <meta name="keywords" content="Best body massager in India, Electric massager machine, Handheld massager online, Neck and shoulder massager, Pain relief massager, Foot massager machine, Deep tissue massager" />
        <link rel="canonical" href="https://afshaenterprises.com" />
        {/* Open Graph */}
        <meta property="og:title" content="Best Body Massager in India | Afsha Enterprises" />
        <meta property="og:description" content="Buy premium body massagers from Afsha Enterprises. Electric, handheld and pain relief massagers with fast delivery across India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://afshaenterprises.com" />
        <meta property="og:image" content="https://afshaenterprises.com/logo.png" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Body Massager in India | Afsha Enterprises" />
        <meta name="twitter:description" content="Buy premium body massagers from Afsha Enterprises. Electric, handheld and pain relief massagers with fast delivery across India." />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>
      <Hero />

      {/* Ads banner grid right after hero */}
      <AdsBanner />

      {/* Categories manages its own section + padding */}
      <Categories />


      <section className="section home-section reveal">
        <div className="container">
          <AllProducts />
        </div>
      </section>

      <section className="section home-section reveal">
        <div className="container">
          <PromoBanner />
        </div>
      </section>

      <section className="section home-section reveal">
        <div className="container">
          <Testimonials />
        </div>
      </section>

      <section id="about" className="section home-section about-section reveal">
        <div className="container about-content">
          <p className="section-label" style={{ justifyContent: 'center' }}>Our Story</p>
          <h2 className="section-title">
            About <span className="serif-italic">Afsha enterprises</span>
          </h2>
          <p className="about-desc">
            We believe skincare and pain relief massage should be simple, effective, and kind to both your skin
            and the planet. Every Afsha enterprises product is formulated with dermatologist-tested
            ingredients, products.
          </p>
          <div className="about-pillars">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="about-pillar">
                <span className="about-pillar-icon"><Icon size={22} /></span>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band reveal">
        <div className="container cta-band-inner">
          <div>
            <h3 className="cta-band-title">Start your wellness ritual</h3>
            <p className="cta-band-sub">Deep-tissue relief and everyday calm — meet the Afsha enterprises massager.</p>
          </div>
          <Link to="/checkout" className="btn btn-hero-primary cta-band-btn">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

export function HomeLayout() {
  return (
    <>
      <Navbar />
      <Home />
      <Footer />
    </>
  );
}
