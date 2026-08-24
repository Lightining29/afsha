import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchProducts, fetchCategories } from '../../api';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/shop/Hero';
import ProductCard from '../../components/product/ProductCard';
import Footer from '../../components/layout/Footer';
import './Home.css';

const siteTitle = 'Afsha Enterprises | Premium Body Massagers & Personal Grooming';
const siteDescription = 'Afsha Enterprises offers premium electric massagers, body hair removers, and wellness devices with fast express shipping across India.';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchProducts({ limit: '24' }),
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

      {/* ── Top Hero Special Sale Banner ── */}
      <Hero />

      {/* ── Section 1: New Arrival ── */}
      <section className="home-section-block">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title">New Arrival</h2>
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

          {/* Category Filter Pills */}
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
