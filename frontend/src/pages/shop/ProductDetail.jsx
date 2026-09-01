import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  MoreHorizontal,
  Heart,
  Minus,
  Plus,
  Gift,
  Zap,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ShoppingBag,
  Share2,
  Award,
  Sparkles,
  Sliders,
  Flame,
  Check,
  X
} from 'lucide-react';
import {
  fetchProduct,
  formatPrice,
  getProductPrice,
} from '../../api';
import { useCart } from '../../context/CartContext';
import CountdownTimer from '../../components/shop/CountdownTimer';
import Footer from '../../components/layout/Footer';
import { toastSuccess, toastInfo } from '../../utils/toast.js';
import { getProductSeoContent } from '../../data/productSeoContent';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract slug from param or direct path like /electric-body-massager
  const slug = paramSlug || location.pathname.replace(/^\/(products|product)?\/?/, '').replace(/\.html$/, '') || 'electric-body-massager';
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProduct(slug)
      .then((data) => {
        if (!mounted) return;
        setProduct(data);
      })
      .catch(() => {
        if (mounted) navigate('/');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="product-detail-app-container">
        <div className="product-detail-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-app-container">
        <div className="product-not-found">
          <h2>Product not found</h2>
          <Link to="/" className="btn btn-gold">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const seoData = getProductSeoContent(slug, product);
  const finalPrice = getProductPrice(product);
  const hasDiscount = product.discountPercent > 0 || seoData.discountPercent > 0;
  const isBogo = product.isBogoActive ?? (product.isBogo && (!product.bogoEndsAt || new Date(product.bogoEndsAt) > new Date()));
  const isLiked = isInWishlist(product._id);

  const gallery = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);
  const activeIdx = Math.min(activeImage, gallery.length - 1);
  const mainImage = gallery[activeIdx] || product.image || '/masage.jpg';
  const fullImageUrl = mainImage.startsWith('http') ? mainImage : `https://www.afshaenterprises.com${mainImage}`;
  const canonicalUrl = `https://www.afshaenterprises.com/product/${slug}`;

  // Direct Buy Flow: Adds selected quantity to cart and routes straight to checkout
  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toastSuccess('Added to Cart', `${product.name} (Qty: ${quantity}) added.`);
  };

  // Structured Data (JSON-LD) for Product, Offer, AggregateRating, FAQs, and BreadcrumbList
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        "name": product.name,
        "image": fullImageUrl,
        "description": seoData.metaDescription || product.description,
        "sku": `AFSHA-${product._id?.substring(0, 8)?.toUpperCase() || 'PROD'}`,
        "mpn": `AF-${slug}`,
        "brand": {
          "@type": "Brand",
          "name": "Afsha Enterprises"
        },
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "INR",
          "price": finalPrice,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "Afsha Enterprises"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "INR"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "IN"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 0,
                "maxValue": 1,
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 2,
                "maxValue": 5,
                "unitCode": "DAY"
              }
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "IN",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 7,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": (product.rating ?? seoData.rating ?? 4.9).toFixed(1),
          "reviewCount": product.reviewCount || seoData.reviewCount || 240,
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": (seoData.reviewsList || []).map((rev) => ({
          "@type": "Review",
          "author": { "@type": "Person", "name": rev.name },
          "datePublished": "2026-08-20",
          "reviewBody": rev.comment,
          "reviewRating": { "@type": "Rating", "ratingValue": rev.rating }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.afshaenterprises.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": product.category?.name || "Wellness & Massage",
            "item": `https://www.afshaenterprises.com/category/${product.category?.slug || 'wellness-massage'}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.name,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": (seoData.faqs || []).map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      {
        "@type": "HowTo",
        "@id": `${canonicalUrl}#howto`,
        "name": `How to Use ${product.name}`,
        "description": `Step-by-step instructions on how to use ${product.name} safely and effectively.`,
        "step": (seoData.howToUse || []).map((step, idx) => ({
          "@type": "HowToStep",
          "position": idx + 1,
          "name": step.title,
          "text": step.desc
        }))
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="title" content={seoData.title} />
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.metaDescription} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:alt" content={product.name} />
        <meta name="thumbnail" content={fullImageUrl} />
        <meta property="product:price:amount" content={finalPrice} />
        <meta property="product:price:currency" content="INR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.metaDescription} />
        <meta name="twitter:image" content={fullImageUrl} />

        {/* Structured Data Graph */}
        <script type="application/ld+json">{JSON.stringify(jsonLdGraph)}</script>
      </Helmet>

      <div className="product-detail-app-container">
        {/* ── Top Header Navigation Bar ── */}
        <header className="pdp-top-bar">
          <button
            type="button"
            className="pdp-circle-btn"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="pdp-top-title">{product.name}</h1>

          <button
            type="button"
            className="pdp-circle-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                toastInfo('Link Copied', 'Product link copied to clipboard.');
              }
            }}
            aria-label="Share product"
          >
            <Share2 size={18} />
          </button>
        </header>

        {/* ── Main Showcase Grid (Image Gallery & Core Buying Info) ── */}
        <div className="pdp-main-content-layout">
          {/* Main Showcase Image Stage */}
          <div className="pdp-stage-section">
            <div className="pdp-stage-img-wrap">
              <img
                src={mainImage}
                alt={product.name}
                className="pdp-stage-img"
                fetchpriority="high"
              />
              {isBogo && (
                <div className="pdp-bogo-float-badge">
                  <Gift size={13} /> {product.bogoBadgeText || 'BUY 1 GET 1 FREE'}
                </div>
              )}
              {hasDiscount && (
                <div className="pdp-discount-float-badge">
                  <Flame size={13} /> {product.discountPercent || seoData.discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Circular Gallery Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="pdp-circular-thumbnails">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pdp-thumb-circle ${i === activeIdx ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={src} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Buying Info Sheet */}
          <div className="pdp-info-sheet">
            {/* Rating Badge */}
            <div className="pdp-rating-badge">
              <div className="pdp-stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    fill={star <= Math.round(product.rating ?? seoData.rating ?? 4.9) ? '#f59e0b' : '#e2e8f0'}
                    color={star <= Math.round(product.rating ?? seoData.rating ?? 4.9) ? '#f59e0b' : '#cbd5e1'}
                  />
                ))}
              </div>
              <span className="pdp-rating-score">{(product.rating ?? seoData.rating ?? 4.9).toFixed(1)}</span>
              <span className="pdp-rating-reviews">({product.reviewCount || seoData.reviewCount || 384} verified reviews)</span>
            </div>

            <div className="pdp-title-row">
              <div>
                <h2 className="pdp-product-name">{product.name}</h2>
                <p className="pdp-category-name">
                  {product.category?.name || seoData.category || "Wellness & Care"}
                </p>
              </div>

              {/* Wishlist Heart Button */}
              <button
                type="button"
                className={`pdp-heart-circle-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={20}
                  fill={isLiked ? '#ef4444' : 'none'}
                  color={isLiked ? '#ef4444' : '#94a3b8'}
                />
              </button>
            </div>

            {/* Price Row */}
            <div className="pdp-price-row">
              <span className="pdp-price-current">{formatPrice(finalPrice)}</span>
              {(hasDiscount || product.originalPrice || seoData.originalPrice) && (
                <span className="pdp-price-original">
                  {formatPrice(product.originalPrice || seoData.originalPrice || (finalPrice * 2))}
                </span>
              )}
              {hasDiscount && (
                <span className="pdp-save-chip">SAVE {product.discountPercent || seoData.discountPercent}%</span>
              )}
            </div>

            {/* BOGO Countdown Timer (if active) */}
            {isBogo && product.bogoEndsAt && (
              <div className="pdp-bogo-timer-box">
                <CountdownTimer targetDate={product.bogoEndsAt} label="Special Limited-Time Offer Ends In" />
              </div>
            )}

            {/* Short Headline & Overview */}
            <div className="pdp-quick-headline-card">
              <Sparkles size={16} className="sparkle-gold" />
              <p>{seoData.headline}</p>
            </div>

            {/* Direct Action Buttons on Info Sheet */}
            <div className="pdp-desktop-actions-row">
              <button
                type="button"
                className="pdp-action-btn pdp-btn-cart"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                className="pdp-action-btn pdp-btn-buy"
                onClick={handleBuyNow}
              >
                <Zap size={18} fill="#ffffff" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Comprehensive Long-Form SEO Content Sections ── */}
        <section className="pdp-long-content-container">

          {/* 1. Key Features & Highlights */}
          <div className="pdp-section-card">
            <h3 className="pdp-section-title">
              <Award size={20} className="title-icon-amber" /> Key Highlights &amp; Features
            </h3>
            <ul className="pdp-features-list">
              {seoData.highlights.map((h, i) => (
                <li key={i} className="pdp-feature-item">
                  <CheckCircle2 size={18} className="check-green" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Scientific & Health Benefits */}
          <div className="pdp-section-card">
            <h3 className="pdp-section-title">
              <Sparkles size={20} className="title-icon-rose" /> Therapeutic &amp; Health Benefits
            </h3>
            <div className="pdp-benefits-grid">
              {seoData.benefits.map((b, i) => (
                <div key={i} className="pdp-benefit-card">
                  <h4 className="pdp-benefit-title">{b.title}</h4>
                  <p className="pdp-benefit-desc">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Step-by-Step Usage Guide */}
          <div className="pdp-section-card">
            <h3 className="pdp-section-title">
              <Sliders size={20} className="title-icon-cyan" /> Step-by-Step How to Use
            </h3>
            <div className="pdp-steps-timeline">
              {seoData.howToUse.map((step) => (
                <div key={step.step} className="pdp-step-row">
                  <div className="pdp-step-number">{step.step}</div>
                  <div className="pdp-step-text">
                    <h4 className="pdp-step-title">{step.title}</h4>
                    <p className="pdp-step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Technical Specifications Table */}
          <div className="pdp-section-card">
            <h3 className="pdp-section-title">
              <Award size={20} className="title-icon-amber" /> Technical Specifications
            </h3>
            <div className="pdp-specs-table">
              {seoData.specs.map((spec, i) => (
                <div key={i} className="pdp-spec-row">
                  <span className="pdp-spec-label">{spec.label}</span>
                  <span className="pdp-spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Direct Comparison: Afsha Enterprises vs Other Brands */}
          <div className="pdp-section-card">
            <h3 className="pdp-section-title">
              <CheckCircle2 size={20} className="title-icon-green" /> Why Choose Afsha Enterprises?
            </h3>
            <div className="pdp-comparison-table-wrapper">
              <table className="pdp-comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="th-afsha">Afsha Enterprises ⭐</th>
                    <th className="th-other">Other Cheap Brands ❌</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Motor &amp; Core</td>
                    <td><Check size={16} className="icon-yes" /> 100% Pure Copper Heavy-Duty Motor</td>
                    <td><X size={16} className="icon-no" /> Aluminum/Plastic Weak Motor</td>
                  </tr>
                  <tr>
                    <td>Build Quality</td>
                    <td><Check size={16} className="icon-yes" /> High-Grade Non-Toxic ABS Body</td>
                    <td><X size={16} className="icon-no" /> Flimsy Recycled Plastic</td>
                  </tr>
                  <tr>
                    <td>Performance &amp; Durability</td>
                    <td><Check size={16} className="icon-yes" /> High-Torque Smooth Quiet Operation</td>
                    <td><X size={16} className="icon-no" /> Loud Vibrations &amp; Fast Overheating</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Verified Customer Reviews */}
          <div className="pdp-section-card">
            <div className="pdp-reviews-head">
              <div>
                <h3 className="pdp-section-title">Verified Customer Reviews</h3>
                <p className="pdp-reviews-sub">Based on {product.reviewCount || seoData.reviewCount || 384} ratings across India</p>
              </div>
              <div className="pdp-review-score-box">
                <span className="score-big">{(product.rating ?? seoData.rating ?? 4.9).toFixed(1)}</span>
                <div className="pdp-stars-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
              </div>
            </div>

            <div className="pdp-reviews-list">
              {(seoData.reviewsList || []).map((rev, rIdx) => (
                <div key={rIdx} className="pdp-review-item">
                  <div className="review-meta">
                    <span className="reviewer-name">{rev.name}</span>
                    <span className="verified-badge"><CheckCircle2 size={13} /> Verified Buyer ({rev.location})</span>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div className="pdp-stars-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="review-comment">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Frequently Asked Questions (FAQ Accordion with Google Rich Snippet support) */}
          <div className="pdp-section-card">
            <h3 className="pdp-section-title">
              <HelpCircle size={20} className="title-icon-amber" /> Frequently Asked Questions
            </h3>
            <div className="pdp-faq-accordion">
              {seoData.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`pdp-faq-item ${activeFaq === idx ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="pdp-faq-question-btn"
                    onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`pdp-faq-chevron ${activeFaq === idx ? 'rotated' : ''}`}
                    />
                  </button>
                  {activeFaq === idx && (
                    <div className="pdp-faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fixed Sticky Bottom Action Bar with Direct Buy Flow ── */}
        <div className="pdp-bottom-action-bar">
          {/* Stepper Capsule */}
          <div className="pdp-stepper-capsule">
            <button
              type="button"
              className="pdp-stepper-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="pdp-stepper-val">{quantity}</span>
            <button
              type="button"
              className="pdp-stepper-btn"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            className="pdp-mobile-add-cart-btn"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <ShoppingBag size={18} />
          </button>

          {/* Direct Buy Now Button */}
          <button
            type="button"
            className="pdp-cta-yellow-btn"
            onClick={handleBuyNow}
            disabled={product.inStock === false}
          >
            <Zap size={16} fill="#111827" />
            <span>{product.inStock === false ? 'Out of Stock' : 'Buy Now'}</span>
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
