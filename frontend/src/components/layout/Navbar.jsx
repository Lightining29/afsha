import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toastSuccess, toastInfo } from '../../utils/toast.js';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '#categories' },
  { label: 'Bestsellers', href: '#all-products' },
];

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Elevate the bar (stronger shadow / tighter blur) once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleNavClick(e, link) {
    setMenuOpen(false);
    if (link.href && link.href.startsWith('#')) {
      e.preventDefault();
      const id = link.href.slice(1);
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.location.hash = link.href;
      }, 150);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setQuery('');
    navigate(`/?q=${encodeURIComponent(q)}#all-products`);
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Mobile Left Menu Toggle */}
        <button
          className="icon-btn mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="Afsha Enterprises" className="logo-img" onError={(e) => { e.target.style.display = 'none'; }} />
          <span className="logo-brand-text">Afsha</span>
        </Link>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {/* Expandable search */}
          <form className={`nav-search ${searchOpen ? 'open' : ''}`} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
              <Search size={18} />
            </button>
          </form>

          {/* Notification Bell */}
          <button
            type="button"
            className="icon-btn notification-btn"
            aria-label="Notifications"
            onClick={() => toastInfo('Notifications', 'No new notifications right now.')}
          >
            <Bell size={18} />
          </button>

          <div className="user-menu-wrap">
            <button className={`icon-btn ${user?.photoUrl ? 'navbar-user-btn' : ''}`} aria-label="Account" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar" className="navbar-avatar" />
              ) : (
                <User size={18} />
              )}
            </button>
            {userMenuOpen && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <p className="user-dropdown-name">{user.name}</p>
                    <Link to="/account" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                    <Link to="/account/wishlist" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>

                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}>Admin Panel</Link>
                    )}
                    <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); toastSuccess('Signed out', 'You have been signed out successfully.'); }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                    <Link to="/register" onClick={() => setUserMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
