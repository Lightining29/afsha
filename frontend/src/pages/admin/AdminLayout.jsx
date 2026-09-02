import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Home,
  Mail,
  Boxes,
  Menu,
  X,
  PlusCircle,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminCurtainTransition from '../../components/admin/AdminCurtainTransition';
import '../../styles/Panel.css';
import './AdminMobile.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the drawer on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSignOut = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  const sidebarClass = `panel-sidebar ${menuOpen ? 'open' : ''}`;
  const sidebarStyle = {
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.03)',
  };
  const headerStyle = { borderBottom: '1px solid #e2e8f0' };
  const navItemStyle = { color: '#334155', fontWeight: 600 };

  return (
    <div className="panel-layout admin-layout-shell">
      {/* ── Grand Theatrical Curtain Opening Effect ── */}
      <AdminCurtainTransition />

      {/* ── Mobile Top Bar (Clean, modern app-like header) ── */}
      <div className="admin-mobile-bar">
        <div className="admin-mobile-left">
          <button
            className="admin-menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <img src="/logo.png" alt="Afsha Enterprises" className="admin-mobile-logo" />
        </div>

        <div className="admin-mobile-right">
          <NavLink to="/admin/products/new" className="admin-mobile-add-btn" aria-label="Add Product">
            <PlusCircle size={17} />
            <span>Add</span>
          </NavLink>
          <div className="admin-avatar-pill" title={user?.name}>
            <span>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
          </div>
        </div>
      </div>

      {/* Overlay behind the drawer (mobile only) */}
      <div
        className={`admin-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ── Desktop & Mobile Slide-Out Sidebar ── */}
      <aside className={sidebarClass} style={sidebarStyle}>
        <div className="panel-sidebar-header" style={headerStyle}>
          <img src="/logo.png" alt="Afsha Enterprises" className="admin-sidebar-logo" />
          <div className="admin-profile-badge">
            <div className="admin-avatar-small">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="admin-user-title">{user?.name || 'Administrator'}</p>
              <span className="admin-role-tag">Super Admin</span>
            </div>
          </div>
        </div>

        <nav className="panel-nav">
          <NavLink to="/admin" end style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/orders" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Package size={18} /> Orders
          </NavLink>
          <NavLink to="/admin/products" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <ShoppingCart size={18} /> Products
          </NavLink>
          <NavLink to="/admin/stock" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Boxes size={18} /> Stock Management
          </NavLink>
          <NavLink to="/admin/categories" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Layers size={18} /> Categories
          </NavLink>
          <NavLink to="/admin/contacts" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Mail size={18} /> Messages
          </NavLink>
          <NavLink to="/admin/products/new" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <PlusCircle size={18} /> Add Product
          </NavLink>
          <NavLink to="/" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Home size={18} /> View Storefront <ArrowUpRight size={14} />
          </NavLink>
          <button onClick={handleSignOut} style={navItemStyle}>
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
      </aside>

      {/* ── Main Panel Content ── */}
      <main className="panel-content admin-main-panel">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Navigation Bar (Real App-like UX) ── */}
      <nav className="admin-mobile-bottom-nav">
        <NavLink to="/admin" end className="mobile-nav-item">
          <LayoutDashboard size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/admin/orders" className="mobile-nav-item">
          <Package size={20} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/admin/products/new" className="mobile-nav-item mobile-nav-center">
          <div className="center-add-circle">
            <PlusCircle size={24} />
          </div>
          <span>Add</span>
        </NavLink>
        <NavLink to="/admin/products" className="mobile-nav-item">
          <ShoppingCart size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/stock" className="mobile-nav-item">
          <Boxes size={20} />
          <span>Stock</span>
        </NavLink>
      </nav>
    </div>
  );
}
