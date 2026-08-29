import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Clock, Calendar, ArrowRight, Search, Sparkles, UserCheck } from 'lucide-react';
import { BLOG_POSTS } from '../../data/blogData';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './BlogList.css';

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Wellness & Therapy', 'Pain Relief & Health', 'Buyer Guide', 'Posture & Ergonomics', 'Product Comparison'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.metaDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <>
      <Helmet>
        <title>Health & Wellness Blog — Body Massagers & Pain Relief Articles | Afsha Enterprises</title>
        <meta name="description" content="Explore expert articles on electric body massagers, pain relief remedies, back pain relief, posture tips, and wellness buying guides by Afsha Enterprises." />
        <meta name="keywords" content="health blog, body massager articles, back pain relief tips, electric massager guide, Afsha Enterprises blog, Manish Kumar" />
        <link rel="canonical" href="https://www.afshaenterprises.com/blogs" />
        <meta property="og:title" content="Health & Wellness Blog — Body Massagers & Pain Relief Articles" />
        <meta property="og:description" content="Expert insights, buying guides, and pain relief tips for electric massagers and wellness devices." />
        <meta property="og:image" content="https://www.afshaenterprises.com/masage.jpg" />
        <meta property="og:url" content="https://www.afshaenterprises.com/blogs" />
      </Helmet>

      <Navbar />

      <main className="blog-list-page">
        {/* Hero Header */}
        <section className="blog-hero-section">
          <div className="blog-hero-container">
            <div className="blog-badge-pill">
              <Sparkles size={14} /> Official Health &amp; Wellness Journal
            </div>
            <h1 className="blog-main-title">
              Insights, Guides &amp; <span>Pain Relief</span> Tips
            </h1>
            <p className="blog-subtitle">
              Evidence-based guides, wellness tips, and buyer guides to help you live pain-free and revitalized.
            </p>

            {/* Search Bar */}
            <div className="blog-search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search articles on back pain, massagers, sleep, recovery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Pills */}
            <div className="blog-category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="blog-grid-section">
          <div className="blog-grid-container">
            {filteredPosts.length === 0 ? (
              <div className="blog-no-results">
                <h3>No articles found</h3>
                <p>Try searching for a different keyword or category.</p>
                <button type="button" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="blog-cards-grid">
                {filteredPosts.map((post) => (
                  <article key={post.slug} className="blog-post-card">
                    <Link to={`/blog/${post.slug}`} className="blog-card-img-link">
                      <img src={post.image} alt={post.title} loading="lazy" />
                      <span className="blog-category-tag">{post.category}</span>
                    </Link>

                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span><Clock size={13} /> {post.readTime}</span>
                        <span><Calendar size={13} /> {post.publishedDate}</span>
                      </div>

                      <h2 className="blog-card-title">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="blog-card-summary">{post.summary}</p>

                      <div className="blog-card-footer">
                        <div className="blog-author-info">
                          <UserCheck size={14} className="author-icon" />
                          <span>By {post.author}</span>
                        </div>
                        <Link to={`/blog/${post.slug}`} className="blog-read-more-btn">
                          Read Article <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
