import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Users,
  AlertCircle,
  TrendingUp,
  PlusCircle,
  Boxes,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { fetchAdminAnalytics, formatPrice, getStatusLabel, getStatusColor } from '../../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAdminAnalytics()
      .then((res) => setData({
        totalRevenue: res?.totalRevenue ?? 0,
        totalOrders: res?.totalOrders ?? 0,
        totalUsers: res?.totalUsers ?? 0,
        pendingApproval: res?.pendingApproval ?? 0,
        recentOrders: res?.recentOrders ?? [],
        topProducts: res?.topProducts ?? [],
        lowStock: res?.lowStock ?? [],
      }))
      .catch(() => setError(true));
  }, []);

  if (error) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
      <h2 style={{ color: '#0f172a' }}>Dashboard unavailable</h2>
      <p>Could not load analytics. Please check your server connection.</p>
      <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '10px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Retry</button>
    </div>
  );

  if (!data) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}><div className="loading-spinner" /></div>;

  return (
    <div className="admin-dashboard-page">

      {/* Header */}
      <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Afsha Enterprises — Store Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          Real-time analytics, revenue and order management
        </p>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card" style={{ borderLeft: '3px solid #0f172a' }}>
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Total Revenue</span>
            <div className="admin-kpi-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{formatPrice(data.totalRevenue)}</div>
          <div className="admin-kpi-sub" style={{ color: '#10b981', fontWeight: 600 }}>
            <TrendingUp size={13} /> +14.8% this month
          </div>
        </div>

        <div className="admin-kpi-card" style={{ borderLeft: '3px solid #0f172a' }}>
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Total Orders</span>
            <div className="admin-kpi-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{data.totalOrders}</div>
          <div className="admin-kpi-sub">Across all channels</div>
        </div>

        <div className="admin-kpi-card" style={{ borderLeft: '3px solid #0f172a' }}>
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Customers</span>
            <div className="admin-kpi-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{data.totalUsers}</div>
          <div className="admin-kpi-sub">Verified profiles</div>
        </div>

        <div className="admin-kpi-card" style={{ borderLeft: '3px solid #0f172a' }}>
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Pending Approvals</span>
            <div className="admin-kpi-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{data.pendingApproval}</div>
          <div className="admin-kpi-sub">Requires action</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions-section">
        <h2 className="admin-section-title" style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700 }}>
          Quick Actions
        </h2>
        <div className="admin-action-cards-grid">
          <Link to="/admin/products/new" className="admin-action-launcher">
            <div className="icon-box" style={{ background: '#f1f5f9', color: '#0f172a' }}>
              <PlusCircle size={22} />
            </div>
            <div className="admin-action-title">Add New Product</div>
            <div className="admin-action-desc">Upload photos, set pricing & stock</div>
          </Link>

          <Link to="/admin/stock" className="admin-action-launcher">
            <div className="icon-box" style={{ background: '#f1f5f9', color: '#0f172a' }}>
              <Boxes size={22} />
            </div>
            <div className="admin-action-title">Stock Management</div>
            <div className="admin-action-desc">Update quantities & low stock</div>
          </Link>
        </div>
      </div>

      {/* Orders & Products Grid */}
      <div className="admin-content-grid">
        {/* Recent Orders */}
        <div className="admin-card-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
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
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{o.orderNumber}</td>
                    <td>{o.user?.name || o.shippingAddress?.fullName || 'Guest'}</td>
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

        {/* Top Products & Low Stock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-card-box">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Top Selling Products</h3>
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
                        No sales recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Warning */}
          {data.lowStock.length > 0 && (
            <div className="admin-card-box" style={{ borderLeft: '3px solid #ef4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={17} /> Low Stock Alert
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

      {/* Footer */}
      <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="#10b981" />
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Afsha Enterprises — Database & Payments Active
          </span>
        </div>
        <Link to="/" style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
          View Storefront →
        </Link>
      </div>
    </div>
  );
}
