import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();
  const { cartCount, wishlist } = useCart();
  const { user, isAuthenticated, setShowLoginModal } = useAuth();
  const path = location.pathname;

  // Don't show bottom nav in admin dashboard
  if (path.startsWith('/admin')) {
    return null;
  }

  const isHome = path === '/';
  const isCart = path === '/cart';
  const isWishlist = path === '/account/wishlist' || path === '/wishlist';
  const isAccount = path.startsWith('/account') || path === '/login' || path === '/register';

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <Link to="/" className={`bottom-nav-item ${isHome ? 'active' : ''}`}>
        <div className="bottom-nav-icon-wrap">
          <Home size={22} strokeWidth={isHome ? 2.5 : 1.8} />
          {isHome && <span className="bottom-nav-dot" />}
        </div>
      </Link>

      <Link to="/cart" className={`bottom-nav-item ${isCart ? 'active' : ''}`}>
        <div className="bottom-nav-icon-wrap">
          <ShoppingBag size={22} strokeWidth={isCart ? 2.5 : 1.8} />
          {cartCount > 0 && <span className="bottom-nav-badge">{cartCount}</span>}
          {isCart && <span className="bottom-nav-dot" />}
        </div>
      </Link>

      <Link to={isAuthenticated ? '/account/wishlist' : '/cart'} onClick={(e) => {
        if (!isAuthenticated && !isWishlist) {
          // let them view wishlist or login modal
        }
      }} className={`bottom-nav-item ${isWishlist ? 'active' : ''}`}>
        <div className="bottom-nav-icon-wrap">
          <Heart size={22} strokeWidth={isWishlist ? 2.5 : 1.8} />
          {wishlist?.length > 0 && <span className="bottom-nav-badge">{wishlist.length}</span>}
          {isWishlist && <span className="bottom-nav-dot" />}
        </div>
      </Link>

      <Link
        to={isAuthenticated ? '/account' : '/login'}
        className={`bottom-nav-item ${isAccount ? 'active' : ''}`}
        onClick={() => {
          if (!isAuthenticated) setShowLoginModal(true);
        }}
      >
        <div className="bottom-nav-icon-wrap">
          <User size={22} strokeWidth={isAccount ? 2.5 : 1.8} />
          {isAccount && <span className="bottom-nav-dot" />}
        </div>
      </Link>
    </nav>
  );
}
