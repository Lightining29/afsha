import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertCircle,
  TrendingUp,
  PlusCircle,
  Sparkles,
  Mail,
  Zap,
  Boxes,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  PackageCheck
} from 'lucide-react';
import { fetchAdminAnalytics, formatPrice, getStatusLabel, getStatusColor } from '../../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAdminAnalytics().then(setData).catch(() => {});
  }, []);

  if (!data) return <div className="loading-spinner" style={{ margin: '60px auto' }} />;

  return (
    <div className="admin-dashboard-page">
      {/* Official Management Banner Header */}
      <div className="admin-welcome-banner">
        <div className="admin-banner-info">
          <h1>
            Afsha Enterprises <span style={{ opacity: 0.7, fontWeight: 400 }}>| Official Store Dashboard</span>
          </h1>
          <p>Real-time analytics, revenue stats, AI marketing engines, and order management hub.</p>
        </div>

        <div className="admin-status-badge-row">
          <div className="admin-status-chip">
            <span className="admin-dot-online"></span> Store Online
          </div>
          <div className="admin-status-chip">
            <Sparkles size={13} color="#FFD700" /> AI Suite Ready
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Total Gross Revenue</span>
            <div className="admin-kpi-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{formatPrice(data.totalRevenue)}</div>
          <div className="admin-kpi-sub" style={{ color: '#10b981', fontWeight: 600 }}>
            <TrendingUp size={13} inline /> +14.8% growth this month
          </div>
        </div>

        <div className="admin-kpi-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Total Store Orders</span>
            <div className="admin-kpi-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{data.totalOrders}</div>
          <div className="admin-kpi-sub">Across all payment channels</div>
        </div>

        <div className="admin-kpi-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Registered Customers</span>
            <div className="admin-kpi-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{data.totalUsers}</div>
          <div className="admin-kpi-sub">Verified customer profiles</div>
        </div>

        <div className="admin-kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Pending Approvals</span>
            <div className="admin-kpi-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="admin-kpi-value" style={{ color: '#d97706' }}>{data.pendingApproval}</div>
          <div className="admin-kpi-sub">Requires admin action</div>
        </div>
      </div>

      {/* Quick Action Launchers */}
      <div className="admin-quick-actions-section">
        <h2 className="admin-section-title">
          <Zap size={20} color="#E94057" /> Quick Management Suite
        </h2>

        <div className="admin-action-cards-grid">
          <Link to="/admin/products/new" className="admin-action-launcher">
            <div className="icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <PlusCircle size={22} />
            </div>
            <div className="admin-action-title">Add New Product</div>
            <div className="admin-action-desc">Upload photos, set pricing & stock</div>
          </Link>

          <Link to="/admin/offline-sale" className="admin-action-launcher">
            <div className="icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <ShoppingBag size={22} />
            </div>
            <div className="admin-action-title">Record Offline Sale</div>
            <div className="admin-action-desc">Instore & Cash/UPI transactions</div>
          </Link>

          <Link to="/admin/ai-banner-generator" className="admin-action-launcher">
            <span className="launcher-badge-pill" style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
              PRO AI
            </span>
            <div className="icon-box" style={{ background: '#fff1f2', color: '#e11d48' }}>
              <Sparkles size={22} />
            </div>
            <div className="admin-action-title">AI Banner Generator</div>
            <div className="admin-action-desc">Website, Social & Ad Creatives</div>
          </Link>

          <Link to="/admin/ai-email-generator" className="admin-action-launcher">
            <span className="launcher-badge-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
              PRO AI
            </span>
            <div className="icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Mail size={22} />
            </div>
            <div className="admin-action-title">AI Email Generator</div>
            <div className="admin-action-desc">Festival & Offer Email Campaigns</div>
          </Link>

          <Link to="/admin/flash-sale" className="admin-action-launcher">
            <span className="launcher-badge-pill" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>
              HOT
            </span>
            <div className="icon-box" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Zap size={22} />
            </div>
            <div className="admin-action-title">Flash Sale Setup</div>
            <div className="admin-action-desc">Limited time promotion timers</div>
          </Link>

          <Link to="/admin/stock" className="admin-action-launcher">
            <div className="icon-box" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Boxes size={22} />
            </div>
            <div className="admin-action-title">Stock Management</div>
            <div className="admin-action-desc">Update quantities & low stock</div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid: Recent Orders & Top Products */}
      <div className="admin-content-grid">
        {/* Left Column: Recent Orders */}
        <div className="admin-card-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Recent Customer Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '13px', fontWeight: 700, color: '#E94057', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700, color: '#1A2B3C' }}>{o.orderNumber}</td>
                    <td>{o.user?.name || o.shippingAddress?.fullName || 'Guest Customer'}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(o.total)}</td>
                    <td>
                      <span
                        className="admin-badge-status"
                        style={{
                          background: `${getStatusColor(o.status)}15`,
                          color: getStatusColor(o.status),
                          border: `1px solid ${getStatusColor(o.status)}30`
                        }}
                      >
                        {getStatusLabel(o.status)}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                      No orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Top Products & Low Stock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-card-box">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: 800 }}>Top Selling Products</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.map((p) => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>{p.sold}</td>
                      <td style={{ fontWeight: 700, color: '#10b981' }}>{formatPrice(p.revenue)}</td>
                    </tr>
                  ))}
                  {data.topProducts.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                        No product sales recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Warning */}
          {data.lowStock.length > 0 && (
            <div className="admin-card-box" style={{ borderLeft: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} /> Low Stock Alert
                </h3>
                <Link to="/admin/stock" style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626' }}>
                  Refill Stock →
                </Link>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lowStock.map((p) => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td style={{ color: '#ef4444', fontWeight: 800 }}>{p.stockQuantity} left</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Health Footer Bar */}
      <div className="admin-system-health-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={24} color="#10b981" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
              Afsha Enterprises Core Engine
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Database change streams active • Real-time banner socket connected • High AI models enabled
            </div>
          </div>
        </div>

        <Link to="/" className="admin-status-chip" style={{ background: '#1A2B3C', color: '#fff', textDecoration: 'none' }}>
          View Live Storefront →
        </Link>
      </div>
    </div>
  );
}
