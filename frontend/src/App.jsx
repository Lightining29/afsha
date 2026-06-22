import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomeLayout } from './pages/shop/Home';
import Cart from './pages/shop/Cart';
import ProductDetail from './pages/shop/ProductDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Checkout from './pages/shop/Checkout';
import CheckoutSuccess from './pages/shop/CheckoutSuccess';
import AccountLayout from './pages/account/AccountLayout';
import OrderHistory from './pages/account/OrderHistory';
import WishlistPage from './pages/account/WishlistPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminBanner from './pages/admin/AdminBanner';
import AdminTheme from './pages/admin/AdminTheme';
import AdminCategories from './pages/admin/AdminCategories';
import AdminContacts from './pages/admin/AdminContacts';
import AdminStock from './pages/admin/AdminStock';
import Contact from './pages/Contact';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import './pages/shop/Home.css';

function RevealShell({ children }) {
  return <div className="reveal">{children}</div>;
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const nodes = document.querySelectorAll('.reveal, .animate-in, .scroll-reveal');
    nodes.forEach((node) => io.observe(node));

    return () => io.disconnect();
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<RevealShell><HomeLayout /></RevealShell>} />
      <Route
        path="/cart"
        element={
          <>
            <Navbar />
            <RevealShell><Cart /></RevealShell>
            <Footer />
          </>
        }
      />
      <Route
        path="/product/:slug"
        element={<RevealShell><ProductDetail /></RevealShell>}
      />
      <Route
        path="/contact"
        element={
          <>
            <Navbar />
            <RevealShell><Contact /></RevealShell>
            <Footer />
          </>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <RevealShell><Checkout /></RevealShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout/success"
        element={
          <ProtectedRoute>
            <RevealShell><CheckoutSuccess /></RevealShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <RevealShell><AccountLayout /></RevealShell>
          </ProtectedRoute>
        }
      >
        <Route index element={<OrderHistory />} />
        <Route path="wishlist" element={<WishlistPage />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <RevealShell><AdminLayout /></RevealShell>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="stock" element={<AdminStock />} />
        <Route path="banner" element={<AdminBanner />} />
        <Route path="theme" element={<AdminTheme />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/new" element={<AdminCategories />} />
        <Route path="categories/:id/edit" element={<AdminCategories />} />
        <Route path="contacts" element={<AdminContacts />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
