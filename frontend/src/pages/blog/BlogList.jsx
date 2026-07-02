import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { fetchBlogs } from '../../api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './BlogList.css';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchBlogs()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setBlogs(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Helmet>
        <title>Health & Wellness Blog | Afsha Enterprises</title>
        <meta name="description" content="Read expert tips and insights on health, body massage benefits, pain relief tips at home, and buying guides for electric and handheld massagers." />
        <meta name="keywords" content="body massager benefits, electric vs manual massager, neck pain relief, back pain relief, handheld massagers" />
        <link rel="canonical" href="https://afshaenterprises.com/blogs" />
        {/* Open Graph */}
        <meta property="og:title" content="Health & Wellness Blog | Afsha Enterprises" />
        <meta property="og:description" content="Read expert tips and insights on health, body massage benefits, pain relief tips at home, and buying guides for electric and handheld massagers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://afshaenterprises.com/blogs" />
        <meta property="og:image" content="https://afshaenterprises.com/logo.png" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Health & Wellness Blog | Afsha Enterprises" />
        <meta name="twitter:description" content="Read expert tips and insights on health, body massage benefits, pain relief tips at home, and buying guides for electric and handheld massagers." />
      </Helmet>
      <Navbar />
      <div className="blog-list-page">
        <div className="container">
          <div className="blog-header text-center">
            <span className="section-label">Articles & Guides</span>
            <h1 className="section-title blog-title">Wellness Blog</h1>
            <p className="blog-subtitle">
              Learn how to relieve pain, select the best massage tools, and maintain a healthy body at home.
            </p>
          </div>

          {loading ? (
            <div className="blog-loading">
              <div className="loading-spinner" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="blog-empty">
              <h3>No articles found</h3>
              <p>We are currently writing new articles. Please check back later.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {blogs.map((post) => (
                <article key={post._id} className="blog-card reveal visible">
                  <div className="blog-card-img-wrap">
                    <img src={post.image || '/masage.jpg'} alt={post.title} loading="lazy" />
                  </div>
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span className="blog-meta-item">
                        <Calendar size={14} />
                        {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="blog-meta-item">
                        <User size={14} />
                        {post.author}
                      </span>
                    </div>
                    <h2 className="blog-card-title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="blog-card-description">{post.metaDescription}</p>
                    <Link to={`/blog/${post.slug}`} className="blog-read-more">
                      Read Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
