import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Menu, X, Bell, LayoutGrid } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Left: Clean 4-Dot Grid / Menu Button */}
        <button
          className="icon-btn mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={20} /> : <LayoutGrid size={20} />}
        </button>

        {/* Center: Single Clean Logo */}
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <img
            src="/logo.png"
            alt="Afsha Enterprises"
            className="logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="logo-brand-text" style={{ display: 'none' }}>Afsha</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link)}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Clean Notification Bell & User Avatar */}
        <div className="nav-actions">
          {/* Notification Bell */}
          <button
            type="button"
            className="icon-btn notification-btn"
            aria-label="Notifications"
            onClick={() => toastInfo('Notifications', 'No new notifications right now.')}
          >
            <Bell size={18} />
          </button>

          {/* User Profile */}
          <div className="user-menu-wrap">
            <button
              className={`icon-btn ${user?.photoUrl ? 'navbar-user-btn' : ''}`}
              aria-label="Account"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
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
