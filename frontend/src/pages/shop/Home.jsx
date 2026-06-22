import { Link } from 'react-router-dom';
import { Leaf, FlaskConical, Recycle, Rabbit, ArrowRight, Star, Truck, ShieldCheck, Users } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/shop/Hero';
import TrustBar from '../../components/shop/TrustBar';
import Categories from '../../components/shop/Categories';
import AdsBanner from '../../components/shop/AdsBanner';
import PromoBanner from '../../components/shop/PromoBanner';
import Bestsellers from '../../components/shop/Bestsellers';
import AllProducts from '../../components/shop/AllProducts';
import Testimonials from '../../components/shop/Testimonials';
import Footer from '../../components/layout/Footer';
import '../../styles/animations.css';
import './Home.css';

const pillars = [
  { icon: Leaf,          title: 'Clean Ingredients',  desc: 'Only the best from nature' },
  { icon: FlaskConical,  title: 'Science-Backed',     desc: 'Dermatologist tested formulas' },
  { icon: Recycle,       title: 'Eco-Friendly',       desc: 'Sustainable packaging' },
  { icon: Rabbit,        title: 'Cruelty-Free',       desc: 'Never tested on animals' },
];

const stats = [
  { icon: Users,      value: '10k+', label: 'Happy Customers' },
  { icon: Star,       value: '4.9',  label: 'Average Rating' },
  { icon: Truck,      value: 'Free', label: 'Shipping Over ₹999' },
  { icon: ShieldCheck,value: '100%', label: 'Secure Payments' },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Bold stat strip — instant social proof right under the hero */}
      <section className="stat-strip">
        <div className="container stat-strip-grid">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="stat-item">
              <span className="stat-icon"><Icon size={22} /></span>
              <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ads banner grid right after hero */}
      <AdsBanner />

      {/* Categories manages its own section + padding */}
      <Categories />

      <section id="bestsellers" className="section home-section reveal">
        <div className="container">
          <Bestsellers />
        </div>
      </section>

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
            About <span className="serif-italic">Glowora</span>
          </h2>
          <p className="about-desc">
            We believe skincare should be simple, effective, and kind to both your skin
            and the planet. Every Glowora product is formulated with dermatologist-tested
            ingredients, free from harsh chemicals, and never tested on animals.
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
            <p className="cta-band-sub">Deep-tissue relief and everyday calm — meet the Glowora massager.</p>
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
