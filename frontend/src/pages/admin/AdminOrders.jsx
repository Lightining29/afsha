import { useEffect, useState } from 'react';
import {
  fetchAdminOrders,
  approveOrder,
  shipOrder,
  formatPrice,
  getStatusLabel,
  getStatusColor
} from '../../api';
import {
  Package,
  Search,
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  Printer,
  DollarSign,
  AlertCircle,
  X,
  FileText,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import './AdminOrders.css';

function getCustomerName(order) {
  return order.shippingAddress?.fullName || order.user?.name || 'Customer';
}

function getCustomerEmail(order) {
  return order.shippingAddress?.email || order.user?.email || '';
}

function getCustomerPhone(order) {
  return order.shippingAddress?.phone || order.user?.phone || '';
}

function getInitials(name) {
  if (!name) return 'C';
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  const [processingId, setProcessingId] = useState(null);
  const [bannerNotice, setBannerNotice] = useState(null);

  const load = () => {
    fetchAdminOrders().then(setOrders).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove = async (id) => {
    if (processingId) return;
    try {
      setProcessingId(id);
      setBannerNotice(null);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: 'approved' } : o))
      );
      await approveOrder(id);
      setBannerNotice({ type: 'success', text: '✓ Order approved successfully! Status updated.' });
      setTimeout(() => setBannerNotice(null), 4000);
      load();
    } catch (err) {
      console.error('Failed to approve order:', err);
      const msg = err.message || err.data?.message || 'Failed to approve order';
      setBannerNotice({ type: 'error', text: `✕ Failed to approve: ${msg}` });
      alert(`Error approving order: ${msg}`);
      load();
    } finally {
      setProcessingId(null);
    }
  };

  const handleShip = async (id) => {
    if (processingId) return;
    try {
      setProcessingId(id);
      setBannerNotice(null);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: 'shipped' } : o))
      );
      await shipOrder(id);
      setBannerNotice({ type: 'success', text: '✓ Order marked as shipped!' });
      setTimeout(() => setBannerNotice(null), 4000);
      load();
    } catch (err) {
      console.error('Failed to ship order:', err);
      const msg = err.message || err.data?.message || 'Failed to ship order';
      setBannerNotice({ type: 'error', text: `✕ Failed to ship: ${msg}` });
      alert(`Error marking order as shipped: ${msg}`);
      load();
    } finally {
      setProcessingId(null);
    }
  };

  const handleCopyOrderNumber = (orderNum) => {
    navigator.clipboard.writeText(orderNum);
    setCopiedId(orderNum);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintReceipt = (order) => {
    if (!order) return;
    const itemsRows = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">
          <strong>${item.name}</strong>
          <div style="font-size:11px;color:#64748b;">Authentic Quality Verified</div>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;">${formatPrice(item.price)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;">${formatPrice(item.price * item.quantity)}</td>
      </tr>`
      )
      .join('');

    const printWin = window.open('', '_blank', 'width=850,height=950');
    if (!printWin) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tax Invoice - INV-${order.orderNumber}</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { font-family: 'Inter', system-ui, Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #ffffff; }
            .invoice-card { width: 100%; max-width: 780px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 12px; padding: 24px; box-sizing: border-box; }
            .header-flex { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
            .brand-name { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 4px; }
            .brand-sub { font-size: 13px; font-weight: 700; color: #334155; margin: 0 0 6px; }
            .brand-line { font-size: 12px; color: #475569; margin: 2px 0; }
            .invoice-right { text-align: right; }
            .invoice-right h1 { font-size: 26px; font-weight: 900; color: #0f172a; margin: 0 0 4px; }
            .invoice-right div { font-size: 12px; color: #334155; font-weight: 700; margin: 2px 0; }
            .paid-stamp { display: inline-block; border: 2px solid #059669; color: #059669; font-weight: 900; font-size: 12px; padding: 4px 12px; border-radius: 6px; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }
            .grid-meta { display: flex; gap: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px; }
            .meta-col { flex: 1; }
            .meta-col h4 { font-size: 11px; text-transform: uppercase; color: #64748b; margin: 0 0 6px; letter-spacing: 0.5px; }
            .meta-col p { font-size: 13px; color: #1e293b; margin: 3px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th { background: #0f172a; color: #ffffff; padding: 10px 12px; font-size: 12px; text-align: left; text-transform: uppercase; letter-spacing: 0.5px; }
            .summary-box { width: 300px; margin-left: auto; border-top: 2px solid #0f172a; padding-top: 10px; margin-bottom: 28px; }
            .summary-row { display: flex; justify-content: space-between; font-size: 13px; color: #475569; padding: 4px 0; }
            .grand-total { font-size: 18px; font-weight: 900; color: #0f172a; border-top: 1px solid #cbd5e1; padding-top: 8px; margin-top: 4px; }
            .footer-flex { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header-flex">
              <div>
                <div class="brand-name">Afsha Enterprises</div>
                <div class="brand-sub">Official Retail & E-Commerce Store</div>
                <div class="brand-line">📍 Registered Address: 75 Raja Muthai Road, Periyamet, Opposite Nehru Stadium Main Gate</div>
                <div class="brand-line">📞 Helpline: +91 96071 11312 | ✉️ Email: support@afshaenterprises.com</div>
                <div class="brand-line" style="font-size:11px;color:#64748b;">GSTIN: 27AAACA1234A1Z5 | Reg. No: MH-PUNE-413801</div>
              </div>
              <div class="invoice-right">
                <h1>TAX INVOICE</h1>
                <div>Receipt #: INV-${order.orderNumber}</div>
                <div>Ref Order: ${order.orderNumber}</div>
                <div>Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
                <div class="paid-stamp">OFFICIAL RECEIPT — PAID</div>
              </div>
            </div>

            <div class="grid-meta">
              <div class="meta-col">
                <h4>BILLED & SHIPPED TO:</h4>
                <p><strong>${getCustomerName(order)}</strong></p>
                <p>${order.shippingAddress?.address || 'Standard Address'}</p>
                <p>${order.shippingAddress?.city || ''} ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zip || ''}</p>
                <p>Email: ${getCustomerEmail(order) || 'N/A'}</p>
                <p>Phone: ${getCustomerPhone(order) || 'N/A'}</p>
              </div>
              <div class="meta-col">
                <h4>PAYMENT & TRANSACTION DETAILS:</h4>
                <p><strong>Payment Mode:</strong> ${(order.paymentMethod || 'Razorpay / Cash / UPI').toUpperCase()}</p>
                <p><strong>Razorpay Order ID:</strong> ${order.razorpayOrderId || 'N/A'}</p>
                <p><strong>Transaction ID:</strong> ${order.razorpayPaymentId || 'N/A'}</p>
                <p><strong>Fulfillment Status:</strong> ${getStatusLabel(order.status).toUpperCase()}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="text-align:left;">Item Description</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:right;">Rate (₹)</th>
                  <th style="text-align:right;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div class="summary-box">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatPrice(order.subtotal || order.total)}</span>
              </div>
              ${Number(order.discount || 0) > 0 ? `<div class="summary-row"><span>Discount Applied</span><span style="color:#e94057;font-weight:700;">-${formatPrice(order.discount)}</span></div>` : ''}
              <div class="summary-row">
                <span>Delivery & Handling</span>
                <span style="color:#0f172a;font-weight:600;">Included</span>
              </div>
              <div class="summary-row grand-total">
                <span>Grand Total Paid</span>
                <span>${formatPrice(order.total)}</span>
              </div>
            </div>

            <div class="footer-flex">
              <div>
                <p style="margin:2px 0;"><strong>Terms & Conditions:</strong></p>
                <p style="margin:2px 0;">1. Backed by 1-Year Afsha Enterprises Brand Warranty.</p>
                <p style="margin:2px 0;">2. Computer generated Tax Invoice — No physical signature required.</p>
                <p style="margin:2px 0;">3. Thank you for shopping with Afsha Enterprises!</p>
              </div>
              <div style="text-align:center;">
                <div style="font-weight:800;color:#0f172a;">Afsha Enterprises</div>
                <div style="font-size:10px;color:#64748b;">Verified Authorized Invoice</div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  const isPendingApproval = (status) =>
    ['pending_approval', 'paid', 'pending_payment', 'pending'].includes(status);

  // Metrics summary
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => isPendingApproval(o.status)).length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const custName = getCustomerName(o).toLowerCase();
    const custEmail = getCustomerEmail(o).toLowerCase();
    const custPhone = getCustomerPhone(o).toLowerCase();
    const orderNum = (o.orderNumber || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      custName.includes(query) ||
      custEmail.includes(query) ||
      custPhone.includes(query) ||
      orderNum.includes(query);

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && isPendingApproval(o.status);
    if (statusFilter === 'approved') return matchesSearch && o.status === 'approved';
    if (statusFilter === 'shipped') return matchesSearch && o.status === 'shipped';
    return matchesSearch;
  });

  if (loading) return <div className="loading-spinner" style={{ margin: '60px auto' }} />;

  return (
    <div className="admin-orders-page">
      {bannerNotice && (
        <div className={`admin-orders-alert ${bannerNotice.type}`}>
          {bannerNotice.text}
        </div>
      )}

      {/* Title & Metrics Header */}
      <div className="admin-orders-header">
        <div className="admin-orders-title">
          <h1>
            <Package size={26} color="#1A2B3C" /> Order Management Suite
          </h1>
          <p>Real-time customer fulfillment, shipment tracking, and order approval panel.</p>
        </div>

        <div className="orders-stats-row">
          <div className="orders-stat-chip">
            <Package size={16} color="#3b82f6" />
            <span>Total Orders:</span>
            <span className="chip-num">{totalCount}</span>
          </div>

          <div className="orders-stat-chip" style={{ borderColor: '#fde68a' }}>
            <AlertCircle size={16} color="#f59e0b" />
            <span>Pending Action:</span>
            <span className="chip-num" style={{ color: '#d97706' }}>{pendingCount}</span>
          </div>

          <div className="orders-stat-chip" style={{ borderColor: '#bfdbfe' }}>
            <Truck size={16} color="#2563eb" />
            <span>Shipped:</span>
            <span className="chip-num" style={{ color: '#2563eb' }}>{shippedCount}</span>
          </div>

          <div className="orders-stat-chip" style={{ borderColor: '#a7f3d0' }}>
            <DollarSign size={16} color="#10b981" />
            <span>Revenue:</span>
            <span className="chip-num" style={{ color: '#10b981' }}>{formatPrice(totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filter Tabs */}
      <div className="orders-filter-toolbar">
        <div className="orders-search-input-wrapper">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="orders-filter-chips">
          <button
            className={`filter-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`filter-tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending Action ({pendingCount})
          </button>
          <button
            className={`filter-tab-btn ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved ({orders.filter((o) => o.status === 'approved').length})
          </button>
          <button
            className={`filter-tab-btn ${statusFilter === 'shipped' ? 'active' : ''}`}
            onClick={() => setStatusFilter('shipped')}
          >
            Shipped ({shippedCount})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="admin-order-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Package size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#334155' }}>No Orders Found</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            No customer orders match your search criteria.
          </p>
        </div>
      ) : (
        filteredOrders.map((order) => {
          const customerName = getCustomerName(order);
          const customerEmail = getCustomerEmail(order);
          const customerPhone = getCustomerPhone(order);
          const statusColor = getStatusColor(order.status);
          const statusLabel = getStatusLabel(order.status);
          const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          });

          return (
            <div key={order._id} className="admin-order-card">
              {/* Card Header */}
              <div className="admin-order-header">
                <div>
                  <div className="order-id-badge">
                    <span>{order.orderNumber}</span>
                    <button
                      onClick={() => handleCopyOrderNumber(order.orderNumber)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                      title="Copy Order ID"
                    >
                      {copiedId === order.orderNumber ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div className="order-customer-info">
                    <div className="customer-avatar-circle">{getInitials(customerName)}</div>
                    <span className="customer-detail-text">{customerName}</span>
                    {customerEmail && (
                      <a href={`mailto:${customerEmail}`} className="customer-meta-chip">
                        <Mail size={12} /> {customerEmail}
                      </a>
                    )}
                    {customerPhone && (
                      <a href={`tel:${customerPhone}`} className="customer-meta-chip">
                        <Phone size={12} /> {customerPhone}
                      </a>
                    )}
                  </div>

                  <div className="order-date-text" style={{ marginBottom: 6 }}>
                    <Clock size={12} inline style={{ marginRight: 4 }} />
                    Placed on {formattedDate}
                  </div>

                  {(order.status === 'pending_payment' || order.status === 'pending' || order.status === 'created' || order.status === 'unpaid') ? (
                    <div className="pending-payment-alert-bar">
                      <AlertCircle size={15} /> <strong>PAYMENT PENDING</strong> — Customer transaction not yet completed
                    </div>
                  ) : (
                    <div className="order-badges-row">
                      <span className="order-chip-badge chip-verified">
                        <ShieldCheck size={12} /> Verified Order
                      </span>
                      <span className="order-chip-badge chip-express">
                        <Truck size={12} /> Express Shipping
                      </span>
                      <span className="order-chip-badge chip-payment">
                        <CreditCard size={12} /> {order.paymentMethod === 'cod' ? 'COD' : 'Prepaid UPI/Card'}
                      </span>
                      <span className="order-chip-badge chip-tax">
                        <FileText size={12} /> GST Invoice Ready
                      </span>
                    </div>
                  )}
                </div>

                <div className="order-header-right">
                  {(order.status === 'pending_payment' || order.status === 'pending' || order.status === 'created' || order.status === 'unpaid') ? (
                    <span
                      className="order-status-badge"
                      style={{
                        background: '#d97706',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
                        fontWeight: 800,
                        fontSize: 12,
                        padding: '6px 14px',
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff', display: 'inline-block' }}></span>
                      PENDING PAYMENT
                    </span>
                  ) : (
                    <span
                      className="order-status-badge"
                      style={{
                        background: `${statusColor}15`,
                        color: statusColor,
                        border: `1px solid ${statusColor}35`,
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }}></span>
                      {statusLabel}
                    </span>
                  )}
                  <div className="order-total-amount">{formatPrice(order.total)}</div>
                </div>
              </div>

              {/* Items List */}
              <div className="admin-order-items-grid">
                {order.items.map((item, i) => (
                  <div key={i} className="admin-order-item-row">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="customer-avatar-circle" style={{ width: 48, height: 48, borderRadius: 10 }}>
                        <Package size={20} />
                      </div>
                    )}
                    <span className="admin-order-item-title">{item.name}</span>
                    <span className="admin-order-item-qty">×{item.quantity}</span>
                    <span className="admin-order-item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Shipping Address Box */}
              {order.shippingAddress && (
                <div className="admin-shipping-box">
                  <MapPin size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: '#0f172a' }}>Shipping Destination:</strong>{' '}
                    {order.shippingAddress.fullName || customerName}, {order.shippingAddress.address},{' '}
                    {order.shippingAddress.city} {order.shippingAddress.state} {order.shippingAddress.zip}
                    {order.shippingAddress.phone && ` (Ph: ${order.shippingAddress.phone})`}
                  </div>
                </div>
              )}

              {/* Action Controls Footer */}
              <div className="admin-order-actions-footer">
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="action-btn-outline"
                    onClick={() => setSelectedReceiptOrder(order)}
                    title="View & Print Official Receipt"
                  >
                    <Printer size={14} /> Official Receipt & Tax Invoice
                  </button>

                  {customerPhone && (
                    <a
                      href={`https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(customerName)},%20regarding%20your%20Glowora%20Order%20${order.orderNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn-outline"
                      style={{ color: '#10b981', borderColor: '#a7f3d0' }}
                    >
                      <Phone size={14} /> WhatsApp Customer
                    </a>
                  )}
                </div>

                <div>
                  {isPendingApproval(order.status) && (
                    <button
                      type="button"
                      className="action-btn-approve"
                      disabled={processingId === order._id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleApprove(order._id);
                      }}
                    >
                      {processingId === order._id ? (
                        <>
                          <span className="inline-spinner" /> Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} /> Approve Order
                        </>
                      )}
                    </button>
                  )}
                  {order.status === 'approved' && (
                    <button
                      type="button"
                      className="action-btn-ship"
                      disabled={processingId === order._id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleShip(order._id);
                      }}
                    >
                      {processingId === order._id ? (
                        <>
                          <span className="inline-spinner" /> Updating...
                        </>
                      ) : (
                        <>
                          <Truck size={16} /> Mark Shipped
                        </>
                      )}
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={16} /> Shipped & In Transit
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* REAL ENTERPRISE TAX INVOICE & RECEIPT MODAL */}
      {selectedReceiptOrder && (
        <div className="receipt-modal-overlay">
          <div className="receipt-paper">
            {/* Modal Actions Header */}
            <div className="receipt-modal-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="action-btn-ship"
                  onClick={() => handlePrintReceipt(selectedReceiptOrder)}
                >
                  <Printer size={16} /> Print / Save PDF Invoice
                </button>
              </div>
              <button
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setSelectedReceiptOrder(null)}
              >
                <X size={20} color="#0f172a" />
              </button>
            </div>

            {/* Printable Receipt Paper */}
            <div className="receipt-paper-header">
              <div className="receipt-company-brand">
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Afsha Enterprises</h2>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '0 0 6px' }}>Official Retail & E-Commerce Store</p>
                <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>📍 <strong>Registered Address:</strong> 75 Raja Muthai Road, Periyamet, Opposite Nehru Stadium Main Gate</p>
                <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>📞 <strong>Helpline:</strong> +91 96071 11312 | ✉️ <strong>Email:</strong> support@afshaenterprises.com</p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0' }}>GSTIN: 27AAACA1234A1Z5 | Reg. No: MH-PUNE-413801</p>
              </div>

              <div className="receipt-invoice-title">
                <h1>TAX INVOICE</h1>
                <div>Receipt #: INV-{selectedReceiptOrder.orderNumber}</div>
                <div>Ref Order: {selectedReceiptOrder.orderNumber}</div>
                <div>Date: {new Date(selectedReceiptOrder.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
                <div className="receipt-stamp-paid">OFFICIAL RECEIPT — PAID</div>
              </div>
            </div>

            {/* Meta Grid */}
            <div className="receipt-meta-grid">
              <div className="receipt-meta-box">
                <h4>BILLED & SHIPPED TO:</h4>
                <p><strong>{getCustomerName(selectedReceiptOrder)}</strong></p>
                <p>{selectedReceiptOrder.shippingAddress?.address || 'Standard Address'}</p>
                <p>{selectedReceiptOrder.shippingAddress?.city} {selectedReceiptOrder.shippingAddress?.state} {selectedReceiptOrder.shippingAddress?.zip}</p>
                <p>Email: {getCustomerEmail(selectedReceiptOrder) || 'N/A'}</p>
                <p>Phone: {getCustomerPhone(selectedReceiptOrder) || 'N/A'}</p>
              </div>

              <div className="receipt-meta-box">
                <h4>PAYMENT & TRANSACTION DETAILS:</h4>
                <p><strong>Payment Mode:</strong> {(selectedReceiptOrder.paymentMethod || 'Razorpay / Cash / UPI').toUpperCase()}</p>
                <p><strong>Razorpay Order ID:</strong> {selectedReceiptOrder.razorpayOrderId || 'N/A'}</p>
                <p><strong>Payment Transaction ID:</strong> {selectedReceiptOrder.razorpayPaymentId || 'N/A'}</p>
                <p><strong>Fulfillment Status:</strong> {getStatusLabel(selectedReceiptOrder.status).toUpperCase()}</p>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="receipt-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Item Description</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Rate (₹)</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {selectedReceiptOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{item.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Authentic Quality Verified</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{formatPrice(item.price)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Box */}
            <div className="receipt-summary-box">
              <div className="receipt-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(selectedReceiptOrder.subtotal || selectedReceiptOrder.total)}</span>
              </div>
              {Number(selectedReceiptOrder.discount || 0) > 0 && (
                <div className="receipt-summary-row">
                  <span>Discount Applied</span>
                  <span style={{ color: '#e94057', fontWeight: 700 }}>-{formatPrice(selectedReceiptOrder.discount)}</span>
                </div>
              )}
              <div className="receipt-summary-row">
                <span>Delivery & Handling</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Included</span>
              </div>
              <div className="receipt-summary-row grand-total">
                <span>Grand Total Paid</span>
                <span>{formatPrice(selectedReceiptOrder.total)}</span>
              </div>
            </div>

            {/* Footer Signature */}
            <div className="receipt-footer-row">
              <div className="receipt-terms-box">
                <p><strong>Terms & Conditions:</strong></p>
                <p>1. Backed by 1-Year Afsha Enterprises Brand Warranty.</p>
                <p>2. Computer generated Tax Invoice — No physical signature required.</p>
                <p>3. Thank you for shopping with Afsha Enterprises!</p>
              </div>

              <div className="receipt-signature-box">
                <ShieldCheck size={36} color="#10b981" style={{ margin: '0 auto 4px' }} />
                <p>Afsha Enterprises</p>
                <p style={{ fontSize: '10px', color: '#64748b' }}>Verified Authorized Invoice</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
