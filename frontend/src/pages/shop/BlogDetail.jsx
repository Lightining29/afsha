import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  Clock,
  UserCheck,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  Zap,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Share2
} from 'lucide-react';
import { getBlogPost, BLOG_POSTS } from '../../data/blogData';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import NotFound from '../NotFound';
import './BlogDetail.css';

export default function BlogDetail() {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const [activeFaq, setActiveFaq] = useState(0);

  // Extract slug from param or direct path like /blog/top-10-benefits-of-using-a-body-massager
  const slug = paramSlug || location.pathname.replace(/^\/(blogs|blog)?\/?/, '').replace(/\.html$/, '') || 'top-10-benefits-of-using-a-body-massager';

  const post = getBlogPost(slug);

  if (!post) {
    return <NotFound />;
  }

  const canonicalUrl = `https://www.afshaenterprises.com/blog/${post.slug}`;
  const imageUrl = `https://www.afshaenterprises.com${post.image}`;

  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  // Convert simple markdown headings, lists, links and bold text to formatted JSX
  const renderContent = (rawText) => {
    const paragraphs = rawText.split('\n\n');
    return paragraphs.map((block, idx) => {
      if (block.startsWith('### ')) {
        return <h3 key={idx} className="article-h3">{block.replace('### ', '')}</h3>;
      }
      if (block.startsWith('#### ')) {
        return <h4 key={idx} className="article-h4">{block.replace('#### ', '')}</h4>;
      }
      if (block.startsWith('* ') || block.startsWith('1. ') || block.startsWith('2. ') || block.startsWith('3. ') || block.startsWith('4. ') || block.startsWith('5. ') || block.startsWith('6. ') || block.startsWith('7. ') || block.startsWith('8. ') || block.startsWith('9. ') || block.startsWith('10. ')) {
        const lines = block.split('\n');
        return (
          <ul key={idx} className="article-list">
            {lines.map((line, lIdx) => {
              const cleaned = line.replace(/^\* |^\d+\.\s*/, '');
              return (
                <li key={lIdx}>
                  <span dangerouslySetInnerHTML={{
                    __html: cleaned
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#0284c7;font-weight:700;text-decoration:underline;">$1</a>')
                  }} />
                </li>
              );
            })}
          </ul>
        );
      }
      return (
        <p key={idx} className="article-p" dangerouslySetInnerHTML={{
          __html: block
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#0284c7;font-weight:700;text-decoration:underline;">$1</a>')
        }} />
      );
    });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "isPartOf": { "@type": "WebSite", "@id": "https://www.afshaenterprises.com/#website", "name": "Afsha Enterprises" },
        "headline": post.title,
        "description": post.metaDescription,
        "image": imageUrl,
        "datePublished": `${post.publishedDate}T09:00:00+05:30`,
        "dateModified": `${post.publishedDate}T09:00:00+05:30`,
        "mainEntityOfPage": canonicalUrl,
        "author": {
          "@type": "Person",
          "name": post.author,
          "url": "https://www.afshaenterprises.com/manish-kumar"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Afsha Enterprises",
          "logo": { "@type": "ImageObject", "url": "https://www.afshaenterprises.com/vite.svg" }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.afshaenterprises.com/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.afshaenterprises.com/blogs" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": (post.faqs || []).map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{post.metaTitle || `${post.title} | Afsha Enterprises`}</title>
        <meta name="title" content={post.metaTitle || post.title} />
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords} />
        <meta name="author" content={post.author} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* OpenGraph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Afsha Enterprises" />
        <meta name="thumbnail" content={imageUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd, null, 2)}
        </script>
      </Helmet>

      <Navbar />

      <main className="blog-detail-page">
        {/* Breadcrumb Header */}
        <div className="blog-breadcrumb-bar">
          <div className="blog-detail-container">
            <nav className="breadcrumb-nav">
              <Link to="/">Home</Link>
              <ChevronRight size={14} />
              <Link to="/blogs">Blogs</Link>
              <ChevronRight size={14} />
              <span className="curr-page">{post.title}</span>
            </nav>
          </div>
        </div>

        <div className="blog-detail-container blog-detail-layout">
          {/* Main Article Content */}
          <article className="blog-main-article">
            <span className="article-category-chip">{post.category}</span>
            <h1 className="article-title">{post.title}</h1>

            <div className="article-meta-row">
              <div className="author-badge">
                <UserCheck size={16} className="author-icon" />
                <div>
                  <strong>{post.author}</strong>
                  <span>{post.authorRole}</span>
                </div>
              </div>
              <div className="article-date-time">
                <span><Calendar size={14} /> {post.publishedDate}</span>
                <span><Clock size={14} /> {post.readTime}</span>
              </div>
            </div>

            {/* Featured Hero Image */}
            <div className="article-hero-img-wrap">
              <img src={post.image} alt={post.title} className="article-hero-img" />
            </div>

            {/* Article Body */}
            <div className="article-body-content">
              {renderContent(post.content)}
            </div>

            {/* Featured Product Buy Widget Inside Article */}
            {post.productSlug && (
              <div className="article-product-callout">
                <div className="product-callout-header">
                  <Sparkles size={18} className="sparkle-icon" />
                  <strong>Recommended Wellness Device</strong>
                </div>
                <div className="product-callout-body">
                  <div className="callout-info">
                    <h4>{post.productName}</h4>
                    <p className="callout-price">₹{post.productPrice}</p>
                  </div>
                  <div className="callout-actions">
                    <Link to={`/${post.productSlug}`} className="btn-callout-view">
                      View Details
                    </Link>
                    <Link to={`/checkout`} className="btn-callout-buy">
                      <Zap size={15} /> Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Frequently Asked Questions */}
            {post.faqs && post.faqs.length > 0 && (
              <section className="article-faq-section">
                <h3 className="faq-heading">
                  <HelpCircle size={20} className="faq-icon" /> Frequently Asked Questions
                </h3>
                <div className="article-faq-accordion">
                  {post.faqs.map((faq, idx) => (
                    <div key={idx} className={`article-faq-item ${activeFaq === idx ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="article-faq-btn"
                        onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={18} className={`chevron-icon ${activeFaq === idx ? 'rotated' : ''}`} />
                      </button>
                      {activeFaq === idx && (
                        <div className="article-faq-answer">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Profile Footer Box */}
            <div className="article-author-card">
              <div className="author-card-avatar">
                <img src="/manish.jpg" alt="Manish Kumar" />
              </div>
              <div className="author-card-info">
                <h3>About {post.author}</h3>
                <p>
                  Senior Java Full Stack Developer &amp; AWS DevOps Cloud Solutions Architect at Afsha Enterprises. Dedicated to engineering robust e-commerce solutions, high-speed architectures, and empowering users with science-backed wellness advice.
                </p>
                <div className="author-card-links">
                  <Link to="/manish-kumar" className="author-link">View Full Profile →</Link>
                  <a href="https://github.com/Lightining29" target="_blank" rel="noreferrer" className="author-link">GitHub</a>
                  <a href="https://manish-java-developer.vercel.app/" target="_blank" rel="noreferrer" className="author-link">Portfolio</a>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Direct Shop Navigation */}
            <div className="sidebar-widget shop-widget">
              <h3>Shop Best Sellers</h3>
              <p>Experience deep relaxation with our certified high-performance body massagers.</p>
              <Link to="/products" className="btn-sidebar-shop">
                <ShoppingBag size={16} /> Explore All Products
              </Link>
            </div>

            {/* Related Articles */}
            <div className="sidebar-widget related-widget">
              <h3>Related Guides</h3>
              <div className="related-articles-list">
                {relatedPosts.map((rel) => (
                  <Link key={rel.slug} to={`/blog/${rel.slug}`} className="related-article-item">
                    <img src={rel.image} alt={rel.title} />
                    <div>
                      <h4>{rel.title}</h4>
                      <span><Clock size={12} /> {rel.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
