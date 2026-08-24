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

// Curated high-res circular category avatars matching Image 3 & 4
const CATEGORY_IMAGES = {
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=160&auto=format&fit=crop&q=80',
  skincare: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=160&auto=format&fit=crop&q=80',
  hair: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=160&auto=format&fit=crop&q=80',
  wellness: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=160&auto=format&fit=crop&q=80',
  massage: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=160&auto=format&fit=crop&q=80',
  body: 'https://images.unsplash.com/photo-1512290900672-1f55a1532085?w=160&auto=format&fit=crop&q=80',
  grooming: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=160&auto=format&fit=crop&q=80',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&auto=format&fit=crop&q=80',
  jewelry: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=160&auto=format&fit=crop&q=80',
  fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=160&auto=format&fit=crop&q=80',
};

function getCategoryPhoto(name = '') {
  const lower = name.toLowerCase();
  for (const [k, url] of Object.entries(CATEGORY_IMAGES)) {
    if (lower.includes(k)) return url;
  }
  return CATEGORY_IMAGES.beauty;
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

  const newArrivals = products.slice(0, 4);

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
        {/* ── Search Bar with character-by-character auto-suggestions (Image 4) ── */}
        <SearchBar />
      </div>

      {/* ── Top Hero Banner with Transparent Trimmer & Orbiting Badges ── */}
      <Hero />

      {/* ── Circular Categories Row (Image 3 & 4) ── */}
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
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=160&auto=format&fit=crop&q=80"
                  alt="All Items"
                  className="cat-circle-img"
                />
              </div>
              <span className="cat-circle-label">All</span>
            </div>

            {/* Dynamic Category Circles */}
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`home-cat-circle-item ${activeCategory === cat._id ? 'active' : ''}`}
                onClick={() => setActiveCategory(activeCategory === cat._id ? 'all' : cat._id)}
              >
                <div className="cat-circle-avatar-box">
                  <img
                    src={cat.image || cat.imageUrl || getCategoryPhoto(cat.name)}
                    alt={cat.name}
                    className="cat-circle-img"
                    onError={(e) => { e.target.src = getCategoryPhoto(cat.name); }}
                  />
                </div>
                <span className="cat-circle-label">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 1: Special For You / New Arrival (Image 4) ── */}
      <section className="home-section-block">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title">Special For You</h2>
            <a href="#all-products" className="home-see-all-link">See all</a>
          </div>

          <div className="home-product-grid new-arrival-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Best Seller ── */}
      <section id="all-products" className="home-section-block">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title">Best Seller</h2>
            <a href="#all-products" className="home-see-all-link">See all</a>
          </div>

          {/* Best Seller Grid */}
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
