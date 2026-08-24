import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchProducts, fetchCategories } from '../../api';
import Navbar from '../../components/layout/Navbar';
import SearchBar from '../../components/shop/SearchBar';
import Hero from '../../components/shop/Hero';
import ProductCard from '../../components/product/ProductCard';
import Footer from '../../components/layout/Footer';
import './Home.css';

const siteTitle = 'Afsha Enterprises | Premium Body Massagers & Personal Grooming';
const siteDescription = 'Afsha Enterprises offers premium electric massagers, body hair removers, and wellness devices with fast express shipping across India.';

// Local instant-loading fast assets for category circular badges (0ms load time)
const LOCAL_CATEGORY_PHOTOS = [
  '/hair-remover-transparent.png',
  '/circle-face.png',
  '/circle-eyebrow.png',
  '/circle-arm.png',
  '/circle-leg.png',
  '/circle-bikini.png',
  '/circle-neck.png',
  '/circle-underarm.png',
];

function getCategoryPhoto(name = '', idx = 0) {
  const lower = name.toLowerCase();
  if (/trimmer|cutter|hair|epilat|shav/i.test(lower)) return '/hair-remover-transparent.png';
  if (/face|skin|glow/i.test(lower)) return '/circle-face.png';
  if (/eye|brow/i.test(lower)) return '/circle-eyebrow.png';
  if (/arm|body|hand/i.test(lower)) return '/circle-arm.png';
  if (/leg|foot/i.test(lower)) return '/circle-leg.png';
  if (/bikini|underarm/i.test(lower)) return '/circle-bikini.png';
  return LOCAL_CATEGORY_PHOTOS[idx % LOCAL_CATEGORY_PHOTOS.length];
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchProducts({ limit: '30' }),
      fetchCategories()
    ])
      .then(([productsData, categoriesData]) => {
        if (!isMounted) return;
        const prodList = Array.isArray(productsData) ? productsData : (productsData?.items || []);
        setProducts(prodList);
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      })
      .catch((err) => console.error('Failed to load home data:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const newArrivals = products.slice(0, 8);

  const filteredBestSellers = activeCategory === 'all'
    ? products
    : products.filter((p) => (p.category?._id === activeCategory || p.category === activeCategory || p.category?.slug === activeCategory));

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
      </Helmet>

      <div className="container">
        {/* ── Search Bar with character auto-suggestions (Image 4) ── */}
        <SearchBar />
      </div>

      {/* ── Hero Banner with Transparent Trimmer & Orbiting Badges ── */}
      <Hero />

      {/* ── Circular Categories Row (Instant Loading Local Badges) ── */}
      <section id="categories" className="home-categories-circle-section">
        <div className="container">
          <div className="home-categories-circle-scroll">
            {/* All Category Circle */}
            <div
              className={`home-cat-circle-item ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              <div className="cat-circle-avatar-box">
                <img
                  src="/hair-remover-transparent.png"
                  alt="All Items"
                  className="cat-circle-img"
                  fetchpriority="high"
                  decoding="async"
                />
              </div>
              <span className="cat-circle-label">All</span>
            </div>

            {/* Dynamic Category Circles */}
            {categories.map((cat, idx) => {
              const photo = cat.image || cat.imageUrl || getCategoryPhoto(cat.name, idx);
              return (
                <div
                  key={cat._id}
                  className={`home-cat-circle-item ${activeCategory === cat._id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(activeCategory === cat._id ? 'all' : cat._id)}
                >
                  <div className="cat-circle-avatar-box">
                    <img
                      src={photo}
                      alt={cat.name}
                      className="cat-circle-img"
                      fetchpriority="high"
                      decoding="async"
                      onError={(e) => {
                        e.target.src = getCategoryPhoto(cat.name, idx);
                      }}
                    />
                  </div>
                  <span className="cat-circle-label">{cat.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 1: New Arrival (Horizontal Swiper Carousel) ── */}
      <section className="home-section-block">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title">New Arrival</h2>
            <a href="#all-products" className="home-see-all-link">See all</a>
          </div>

          {/* Horizontal Swiper Carousel */}
          <div className="home-carousel-scroll">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} variant="carousel" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Best Seller (With Category Filter Pills) ── */}
      <section id="all-products" className="home-section-block">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title">Best Seller</h2>
            <a href="#all-products" className="home-see-all-link">See all</a>
          </div>

          {/* Horizontal Category Filter Pill Tabs (Screenshot match) */}
          <div className="home-category-pills">
            <button
              type="button"
              className={`home-cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                className={`home-cat-pill ${activeCategory === cat._id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Best Seller 2-Column Grid */}
          <div className="home-product-grid best-seller-grid">
            {filteredBestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
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
