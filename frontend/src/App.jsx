import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HomeLayout } from './pages/shop/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoginModal from './components/LoginModal';
import { useAuth } from './context/AuthContext';
import BottomNav from './components/layout/BottomNav';
import './pages/shop/Home.css';

const Cart = lazy(() => import('./pages/shop/Cart'));
const ProductDetail = lazy(() => import('./pages/shop/ProductDetail'));
const CategoryProducts = lazy(() => import('./pages/shop/CategoryProducts'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyOtp = lazy(() => import('./pages/auth/VerifyOtp'));
const Checkout = lazy(() => import('./pages/shop/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/shop/CheckoutSuccess'));
const AccountLayout = lazy(() => import('./pages/account/AccountLayout'));
const OrderHistory = lazy(() => import('./pages/account/OrderHistory'));
const AccountSettings = lazy(() => import('./pages/account/AccountSettings'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminStock = lazy(() => import('./pages/admin/AdminStock'));
const NotFound = lazy(() => import('./pages/NotFound'));
import ManishKumarProfile from './pages/profile/ManishKumarProfile';

function App() {
  const location = useLocation();
  const { showLoginModal, setShowLoginModal } = useAuth();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <Suspense fallback={<div className="loading-screen"><div className="loading-spinner" /></div>}>
      <Routes>
        <Route path="/" element={<HomeLayout />} />

        {/* Dedicated Manish Kumar High-Authority SEO Routes (Distraction-Free) */}
        <Route path="/manish" element={<ManishKumarProfile />} />
        <Route path="/manish-kumar" element={<ManishKumarProfile />} />
        <Route path="/manishkumar" element={<ManishKumarProfile />} />
        <Route path="/profile" element={<ManishKumarProfile />} />
        <Route path="/profile/manish-kumar" element={<ManishKumarProfile />} />
        <Route path="/profile/manish" element={<ManishKumarProfile />} />
        <Route path="/manish-profile" element={<ManishKumarProfile />} />
        <Route path="/manish-kumar-profile" element={<ManishKumarProfile />} />
        <Route path="/developer-profile" element={<ManishKumarProfile />} />
        <Route path="/manish-kumar-java-developer" element={<ManishKumarProfile />} />
        <Route path="/manish-kumar-devops-engineer" element={<ManishKumarProfile />} />
        <Route path="/manish-kumar-full-stack-developer" element={<ManishKumarProfile />} />
        <Route path="/manish-kumar-java-full-stack-developer" element={<ManishKumarProfile />} />
        <Route path="/manish-kumar-software-engineer" element={<ManishKumarProfile />} />
        <Route path="/manish-kumar-aws-architect" element={<ManishKumarProfile />} />
        <Route path="/manish-kumar-resume" element={<ManishKumarProfile />} />
        <Route path="/about-manish-kumar" element={<ManishKumarProfile />} />
        <Route path="/developer/manish-kumar" element={<ManishKumarProfile />} />
        <Route path="/developer" element={<ManishKumarProfile />} />

        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
              <Footer />
            </>
          }
        />

        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/products" element={<CategoryProducts />} />
        <Route path="/electric-body-massager" element={<ProductDetail />} />
        <Route path="/deep-tissue-massager" element={<ProductDetail />} />
        <Route path="/painless-facial-hair-remover" element={<ProductDetail />} />
        <Route path="/neck-and-shoulder-massager" element={<ProductDetail />} />
        <Route path="/foot-and-calf-massager" element={<ProductDetail />} />
        <Route path="/rechargeable-body-massager" element={<ProductDetail />} />
        <Route path="/category/:categorySlug" element={<CategoryProducts />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/success"
          element={
            <ProtectedRoute>
              <CheckoutSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OrderHistory />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="stock" element={<AdminStock />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/new" element={<AdminCategories />} />
          <Route path="categories/:id/edit" element={<AdminCategories />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      <BottomNav />
    </>
  );
}

export default App;
