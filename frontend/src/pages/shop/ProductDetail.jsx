import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RefreshCw,
  Shield,
  Minus,
  Plus,
  Check,
  Share2,
  Sparkles,
  Award,
  Zap,
  Flame,
  RotateCw,
  Video,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import {
  fetchProduct,
  fetchProducts,
  formatPrice,
  getProductPrice,
  addToWishlist,
  removeFromWishlist,
} from '../../api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

import ProductCard from '../../components/product/ProductCard';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { toastWishlist, toastSuccess } from '../../utils/toast.js';
import './ProductDetail.css';

const sampleFaqs = [
  { q: "Is this product authentic & original?", a: "Yes! All Afsha Enterprises products are 100% authentic, quality tested, and backed by a 1-year warranty." },
  { q: "How long until I see visible results?", a: "Most customers notice smoother texture within 3 to 5 days of regular daily application." },
  { q: "What is the product warranty?", a: "All products include a 1-year warranty covering manufacturing defects and hardware performance." },
  { q: "How fast is shipping & delivery?", a: "Orders are processed within 24 hours and delivered via express courier in 2 to 4 business days." }
];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct]     = useState(null);
  const [similar, setSimilar]     = useState([]);
  const [alsoLike, setAlsoLike]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [quantity, setQuantity]   = useState(1);
  const [cartAdded, setCartAdded] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [openFaq, setOpenFaq]     = useState(0);
  const [copied, setCopied]       = useState(false);

  const { list: recentlyViewed, track } = useRecentlyViewed(product?._id);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProduct(slug)
      .then(async (data) => {
        if (!mounted) return;
        setProduct(data);
        track(data);

        const catId = data.category?._id;
        if (catId) {
          try {
            const list = await fetchProducts({ category: catId, limit: '10' });
            const others = (Array.isArray(list) ? list : []).filter((p) => p._id !== data._id);
            if (mounted) setSimilar(others.slice(0, 4));
            if (mounted) setAlsoLike(others.slice(4, 8));
          } catch {}
        }
      })
      .catch(() => { if (mounted) navigate('/'); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [slug, navigate]);



  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-detail-loading"><div className="loading-spinner" /></div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-not-found">
          <h2>Product not found</h2>
          <Link to="/" className="btn btn-sky">← Back to Shop</Link>
        </div>
        <Footer />
      </>
    );
  }

  const finalPrice = getProductPrice(product);
  const discount = product.discountPercent > 0 ? product.price - finalPrice : 0;
  const wished = isInWishlist(product._id);

  const gallery = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);
  const activeIdx = Math.min(activeImage, gallery.length - 1);
  const mainImage = gallery[activeIdx] || product.image;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleAddBundleToCart = () => {
    addToCart(product);
    if (similar[0]) addToCart(similar[0]);
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Afsha Enterprises`}</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Helmet>
      <Navbar />

      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          {product.category && (
            <>
              <Link to={`/category/${product.category.slug}`}>{product.category.name}</Link>
              <span className="separator">/</span>
            </>
          )}
          <span className="current">{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className="product-detail-wrapper">
          {/* Left Column: Organized Image Gallery with Side Strip & Stage */}
          <div className="product-image-section">
            <div className="organized-gallery-layout">
              {/* Thumbnail Strip Column */}
              {gallery.length > 0 && (
                <div className="gallery-thumbnail-strip">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      className={`thumbnail-strip-item ${i === activeIdx ? 'active' : ''}`}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={src} alt={`${product.name} view ${i + 1}`} />
                      <span className="thumb-idx">{i + 1}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Main HD Image Stage Wrapper */}
              <div className="product-stage-wrapper">
                <div className="product-image-container">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className={`product-image-main ${is360Mode ? 'rotating-360' : ''}`}
                    fetchpriority="high"
                    decoding="async"
                  />

                  {/* Single Sleek Discount Badge (if applicable) */}
                  {product.discountPercent > 0 && (
                    <span className="product-stage-discount-badge">
                      -{product.discountPercent}% OFF
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Info & Buy Options */}
          <div className="product-info-section">
            <div className="product-header">
              <div>
                <span className="product-category-chip">
                  <Sparkles size={12} /> {product.category?.name || 'Skincare & Beauty'}
                </span>
                <h1 className="product-title">{product.name}</h1>
                <div className="product-rating-section">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="#FFD700" color="#FFD700" />
                    ))}
                  </div>
                  <span className="rating-number">4.9</span>
                  <span className="review-count">({product.reviewCount || 148} reviews)</span>
                </div>
              </div>

              <div className="product-actions-top">
                <button
                  className={`wishlist-icon-btn ${wished ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart size={22} fill={wished ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Price Box */}
            <div className="price-section">
              <div className="price-group">
                <span className="price-current">{formatPrice(finalPrice)}</span>
                {product.discountPercent > 0 && (
                  <span className="price-original">{formatPrice(product.price)}</span>
                )}
              </div>
              {product.discountPercent > 0 && (
                <span className="discount-percent-badge">Save {product.discountPercent}%</span>
              )}
            </div>

            {/* Description */}
            <p className="product-description">{product.description}</p>

            {/* Action Buttons */}
            <div className="actions-section">
              <div className="action-buttons-group">
                <button className={`btn-add-to-cart ${cartAdded ? 'added' : ''}`} onClick={handleAddToCart}>
                  {cartAdded ? <Check size={20} /> : <ShoppingBag size={20} />}
                  {cartAdded ? 'Added to Cart!' : 'Add to Cart'}
                </button>

                <button className="btn-buy-now-glow" onClick={handleBuyNow}>
                  One-Click Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Tabs: Description, Videos & FAQ */}
        <div className="product-tabs-section">
          <div className="tabs-header-bar">
            <button className={`tab-link ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
              Product Description
            </button>
            <button className={`tab-link ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>
              <Video size={16} inline /> Product Demo Video
            </button>
            <button className={`tab-link ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>
              <HelpCircle size={16} inline /> Product FAQs
            </button>
          </div>

          <div className="tab-content-panel">
            {activeTab === 'description' && (
              <div>
                <h3>Product Overview & Specifications</h3>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'video' && (
              <div>
                <h3>Interactive Video Showcase</h3>
                <div className="video-player-box">
                  <iframe
                    width="100%"
                    height="400"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Product Video Demo"
                    style={{ borderRadius: '16px', border: 'none' }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="faqs-accordion">
                {sampleFaqs.map((faq, i) => (
                  <div key={i} className="faq-accordion-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div className="faq-question">
                      <span>{faq.q}</span>
                      {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section (Grid - No Horizontal Scrolling) */}
        {similar.length > 0 && (
          <div className="related-products-section" style={{ marginTop: '48px', marginBottom: '40px' }}>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '24px', fontSize: '1.5rem', fontWeight: 800 }}>
              Related Products & Accessories
            </h2>
            <div className="products-grid">
              {similar.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}


      </div>

      <Footer />
    </>
  );
}
