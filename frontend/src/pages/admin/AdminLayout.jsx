import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, PlusCircle, LogOut, Home, Mail, Boxes, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Panel.css';

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
    <div className="panel-layout" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Mobile top bar — hidden on desktop */}
      <div className="admin-mobile-bar" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <button
          className="admin-menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <img src="/logo.png" alt="Afsha Enterprises" className="admin-mobile-logo" />
        <span className="admin-mobile-user">{user?.name}</span>
      </div>

      {/* Overlay behind the drawer (mobile only) */}
      <div
        className={`admin-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside className={sidebarClass} style={sidebarStyle}>
        <div className="panel-sidebar-header" style={headerStyle}>
          <img src="/logo.png" alt="Afsha Enterprises" className="admin-sidebar-logo" />
          <p style={{ color: '#0f172a', fontWeight: 700 }}>{user?.name}</p>
        </div>
        <nav className="panel-nav">
          <NavLink to="/admin" end style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/orders" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Package size={18} /> Orders
          </NavLink>
          <NavLink to="/admin/offline-sale" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <PlusCircle size={18} /> Add Offline Sale
          </NavLink>
          <NavLink to="/admin/products" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <ShoppingCart size={18} /> Products
          </NavLink>
          <NavLink to="/admin/stock" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Boxes size={18} /> Stock Management
          </NavLink>
          <NavLink to="/admin/categories" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Package size={18} /> Categories
          </NavLink>
          <NavLink to="/admin/contacts" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Mail size={18} /> Messages
          </NavLink>

          <NavLink to="/admin/products/new" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <PlusCircle size={18} /> Add Product
          </NavLink>
          <NavLink to="/" style={navItemStyle} onClick={() => setMenuOpen(false)}>
            <Home size={18} /> Storefront
          </NavLink>
          <button onClick={handleSignOut} style={navItemStyle}>
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
      </aside>
      <main className="panel-content" style={{ background: '#ffffff', padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
}

