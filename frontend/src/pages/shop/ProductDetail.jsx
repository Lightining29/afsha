import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, Shield, Minus, Plus, Check, Share2 } from 'lucide-react';
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
import ReviewSection from '../../components/shop/ReviewSection';
import ProductRow from '../../components/shop/ProductRow';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { toastWishlist, toastSuccess } from '../../utils/toast.js';
import './ProductDetail.css';

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
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  const { list: recentlyViewed, track } = useRecentlyViewed(product?._id);

  // Load product + category products
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setProduct(null);
    setSimilar([]);
    setAlsoLike([]);

    fetchProduct(slug)
      .then(async (data) => {
        if (!mounted) return;
        setProduct(data);
        track(data); // record in recently viewed

        const catId = data.category?._id;
        if (catId) {
          try {
            const list = await fetchProducts({ category: catId, limit: '10' });
            const others = (Array.isArray(list) ? list : []).filter((p) => p._id !== data._id);
            // Similar Products — first 4
            if (mounted) setSimilar(others.slice(0, 4));
            // You May Also Like — next 4 (different from Similar)
            if (mounted) setAlsoLike(others.slice(4, 8));
          } catch {
            /* best-effort */
          }
        }
      })
      .catch(() => { if (mounted) navigate('/'); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, navigate]);

  useEffect(() => {
    setQuantity(1);
    setCartAdded(false);
    setActiveImage(0);
  }, [product?._id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-detail-loading">
          <div className="loading-spinner" />
        </div>
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

  // Build the gallery: prefer the multi-image array, fall back to the single
  // primary URL. Clamp the active index against the available count.
  const gallery = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);
  const activeIdx = Math.min(activeImage, gallery.length - 1);
  const mainImage = gallery[activeIdx] || product.image;

  const handleWishlist = async () => {
    toggleWishlist(product);
    toastWishlist(!wished);
    if (isAuthenticated) {
      try {
        if (wished) {
          await removeFromWishlist(product._id);
        } else {
          await addToWishlist(product._id);
        }
      } catch {
        toggleWishlist(product);
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Glowora!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no error toast needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toastSuccess('Link Copied!', 'Product link copied to clipboard.');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard blocked
      }
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1 && newQty <= product.stockQuantity) {
      setQuantity(newQty);
    }
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': [
      product.image ? (product.image.startsWith('http') ? product.image : `https://www.afshaenterprises.com${product.image}`) : 'https://www.afshaenterprises.com/masage.jpg'
    ],
    'description': product.description,
    'brand': {
      '@type': 'Brand',
      'name': 'Afsha Enterprises'
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://www.afshaenterprises.com/products/${product.slug}`,
      'priceCurrency': 'INR',
      'price': finalPrice,
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://www.afshaenterprises.com/'
      },
      product.category ? {
        '@type': 'ListItem',
        'position': 2,
        'name': product.category.name,
        'item': `https://www.afshaenterprises.com/category/${product.category.slug}`
      } : null,
      {
        '@type': 'ListItem',
        'position': product.category ? 3 : 2,
        'name': product.name,
        'item': `https://www.afshaenterprises.com/products/${product.slug}`
      }
    ].filter(Boolean)
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Afsha Enterprises`}</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <link rel="canonical" href={`https://www.afshaenterprises.com/products/${product.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${product.name} | Afsha Enterprises`} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://www.afshaenterprises.com/products/${product.slug}`} />
        <meta property="og:image" content={product.image ? (product.image.startsWith('http') ? product.image : `https://www.afshaenterprises.com${product.image}`) : 'https://www.afshaenterprises.com/masage.jpg'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | Afsha Enterprises`} />
        <meta name="twitter:description" content={product.description.substring(0, 160)} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Navbar />
      <div className="product-detail-container">
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

        <div className="product-detail-wrapper">
          {/* Left: Product Image */}
          <div className="product-image-section">
            <div className="product-image-container">
              <img
                src={mainImage}
                alt={`${product.name} - image ${activeIdx + 1}`}
                className="product-image-main"
              />
              {product.discountPercent > 0 && (
                <div className="discount-badge-large">
                  <span>-{product.discountPercent}%</span>
                  <span className="save-amount">Save {formatPrice(discount)}</span>
                </div>
              )}
              {!product.inStock && (
                <div className="out-of-stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="product-image-thumbnails">
                {gallery.map((src, i) => (
                  <div
                    key={i}
                    className={`thumbnail ${i === activeIdx ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={src} alt={`${product.name} thumbnail ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="product-info-section">
            {/* Header */}
            <div className="product-header">
              <div>
                <h1 className="product-title">{product.name}</h1>
                <div className="product-rating-section">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < Math.floor(product.rating) ? '#FFD700' : '#E5E7EB'}
                        color={i < Math.floor(product.rating) ? '#FFD700' : '#E5E7EB'}
                      />
                    ))}
                  </div>
                  <span className="rating-number">{product.rating}</span>
                  <span className="review-count">({product.reviewCount} reviews)</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  className="share-icon-btn"
                  onClick={handleShare}
                  title="Share product"
                >
                  <Share2 size={22} />
                  {copied && <span className="share-tooltip">Copied!</span>}
                </button>
                <button
                  className={`wishlist-icon-btn ${wished ? 'active' : ''}`}
                  onClick={handleWishlist}
                  title="Add to wishlist"
                >
                  <Heart size={26} fill={wished ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="price-section">
              <div className="price-group">
                <span className="price-current">{formatPrice(finalPrice)}</span>
                {product.discountPercent > 0 && (
                  <span className="price-original">{formatPrice(product.price)}</span>
                )}
              </div>
              {product.discountPercent > 0 && (
                <span className="discount-percent">Save {product.discountPercent}%</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.inStock ? (
                <>
                  <Check size={20} color="#10B981" />
                  <span className="in-stock">In Stock ({product.stockQuantity} available)</span>
                </>
              ) : (
                <span className="out-stock">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="product-description">{product.description}</p>

            {/* Features */}
            <div className="features-list">
              <div className="feature-item">
                <Truck size={20} />
                <div>
                  <div className="feature-title">Fast deleivery</div>
                  <div className="feature-subtitle">Fast and secure delivery across India</div>
                </div>
              </div>
              <div className="feature-item">
                <RefreshCw size={20} />
                <div>
                  <div className="feature-title">Customer Support</div>
                  <div className="feature-subtitle">Dedicated assistance for your orders</div>
                </div>
              </div>
              <div className="feature-item">
                <Shield size={20} />
                <div>
                  <div className="feature-title">Secure Checkout</div>
                  <div className="feature-subtitle">Protected payments</div>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="actions-section">
              {product.inStock && (
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-input">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="qty-btn"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stockQuantity}
                      className="qty-input"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stockQuantity}
                      className="qty-btn"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <button
                  className={`btn btn-add-cart ${cartAdded ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {cartAdded ? (
                    <>
                      <Check size={20} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  className="btn btn-buy-now"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-row">
                <span className="info-label">SKU:</span>
                <span className="info-value">{product.slug}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Category:</span>
                <span className="info-value">{product.category?.name || 'Uncategorized'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Availability:</span>
                <span className="info-value">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="product-details-section">
          <div className="tab-pane" style={{ background: 'var(--white)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--neu-out-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-dark)' }}>Product Description</h3>
            <p style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>{product.description}</p>
            <p style={{ lineHeight: 1.7, color: 'var(--text-muted)', marginTop: '12px' }}>
              This premium product is formulated with the finest ingredients to deliver visible results.
              Suitable for all skin types, dermatologist tested, and cruelty-free.
            </p>
          </div>
        </div>

        {/* Customer Reviews */}
        <ReviewSection product={product} />

        {/* Related Products (same category) */}
      </div>

      {/* ── You May Also Like ── */}
      <ProductRow
        label="Just For You"
        title="You May Also"
        italic="Like"
        products={alsoLike}
        loading={false}
        accentColor="#10b981"
        viewAllHref={product.category ? `/category/${product.category.slug}` : '#'}
      />

      {/* ── Similar Products ── */}
      <ProductRow
        label="Same Category"
        title="Similar"
        italic="Products"
        products={similar}
        loading={false}
        accentColor="#3b82f6"
        viewAllHref={product.category ? `/category/${product.category.slug}` : '#'}
      />

      {/* ── Recently Viewed ── */}
      {recentlyViewed.length > 0 && (
        <ProductRow
          label="Your History"
          title="Recently"
          italic="Viewed"
          products={recentlyViewed}
          loading={false}
          accentColor="#f59e0b"
        />
      )}

      <Footer />
    </>
  );
}
