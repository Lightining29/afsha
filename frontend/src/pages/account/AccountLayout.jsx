import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Package, Heart, ShoppingBag, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import '../../styles/Panel.css';

export default function AccountLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="panel-layout">
        <aside className="panel-sidebar">
          <div className="panel-sidebar-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '4px' }}>
            {user?.photoUrl ? (
              <img 
                src={user.photoUrl} 
                alt={user.name} 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px', border: '3px solid var(--sky-blue-light)' }} 
              />
            ) : (
              <div 
                style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', border: '2px solid var(--border)' }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>My Account</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user?.name}</p>
          </div>
          <nav className="panel-nav">
            <NavLink to="/account" end>
              <Package size={18} /> Order History
            </NavLink>
            <NavLink to="/account/wishlist">
              <Heart size={18} /> Wishlist
            </NavLink>
            <NavLink to="/cart">
              <ShoppingBag size={18} /> Cart
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin">
                <Shield size={18} /> Admin Panel
              </NavLink>
            )}
            <button onClick={handleLogout}>
              <LogOut size={18} /> Sign Out
            </button>
          </nav>
        </aside>
        <main className="panel-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
