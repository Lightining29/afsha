import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();
  const { cartCount, wishlist } = useCart();
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const path = location.pathname;

  // Don't show bottom nav on admin, product details, checkout, or developer profile pages
  if (
    path.startsWith('/admin') ||
    path.startsWith('/product') ||
    path.startsWith('/checkout') ||
    path.startsWith('/manish') ||
    path.startsWith('/developer') ||
    path.startsWith('/about-manish') ||
    path.startsWith('/profile')
  ) {
    return null;
  }

  const isHome = path === '/';
  const isCart = path === '/cart';
  const isWishlist = path === '/account/wishlist' || path === '/wishlist';
  const isAccount = path.startsWith('/account') || path === '/login' || path === '/register';

  return (
    <nav className="mobile-bottom-nav" aria-label="Bottom Navigation">
      {/* Home Tab */}
      <Link to="/" className={`bottom-nav-item ${isHome ? 'active' : ''}`}>
        <div className="bottom-nav-icon-box">
          <Home size={20} strokeWidth={isHome ? 2.5 : 1.8} />
          {isHome && <span className="bottom-nav-pill-dot" />}
        </div>
        {isHome && <span className="bottom-nav-label">Home</span>}
      </Link>

      {/* Cart Tab */}
      <Link to="/cart" className={`bottom-nav-item ${isCart ? 'active' : ''}`}>
        <div className="bottom-nav-icon-box">
          <ShoppingBag size={20} strokeWidth={isCart ? 2.5 : 1.8} />
          {cartCount > 0 && <span className="bottom-nav-badge">{cartCount}</span>}
          {isCart && <span className="bottom-nav-pill-dot" />}
        </div>
        {isCart && <span className="bottom-nav-label">Cart</span>}
      </Link>

      {/* Wishlist Tab */}
      <Link
        to={isAuthenticated ? '/account/wishlist' : '/login'}
        onClick={(e) => {
          if (!isAuthenticated) {
            e.preventDefault();
            setShowLoginModal(true);
          }
        }}
        className={`bottom-nav-item ${isWishlist ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon-box">
          <Heart size={20} strokeWidth={isWishlist ? 2.5 : 1.8} />
          {wishlist?.length > 0 && <span className="bottom-nav-badge">{wishlist.length}</span>}
          {isWishlist && <span className="bottom-nav-pill-dot" />}
        </div>
        {isWishlist && <span className="bottom-nav-label">Wishlist</span>}
      </Link>

      {/* Account Tab */}
      <Link
        to={isAuthenticated ? '/account' : '/login'}
        className={`bottom-nav-item ${isAccount ? 'active' : ''}`}
        onClick={() => {
          if (!isAuthenticated) setShowLoginModal(true);
        }}
      >
        <div className="bottom-nav-icon-box">
          <User size={20} strokeWidth={isAccount ? 2.5 : 1.8} />
          {isAccount && <span className="bottom-nav-pill-dot" />}
        </div>
        {isAccount && <span className="bottom-nav-label">Profile</span>}
      </Link>
    </nav>
  );
}
