import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, XCircle, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './Checkout.css';

export default function RazorpayCheckoutTest() {
  const [amountInRupees, setAmountInRupees] = useState('10.00'); // Default ₹10.00
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle, creating_order, modal_open, verifying, success, failed
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi or card
  const [upiId, setUpiId] = useState('success@razorpay');

  const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T8Ygt8NbBXbGwW';

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setPaymentDetails(null);

    const amountInPaise = Math.round(parseFloat(amountInRupees) * 100);

    if (isNaN(amountInPaise) || amountInPaise < 100) {
      setError('Amount must be at least ₹1.00 (100 paise).');
      return;
    }

    setLoading(true);
    setStatus('creating_order');

    try {
      // Step 1: Create Order on Backend
      const token = localStorage.getItem('glowora_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const orderRes = await fetch(`${API_BASE}/create-order`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_test_${Date.now()}`
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        if (orderRes.status === 401) {
          throw new Error('Authentication failure: Razorpay API keys are invalid or not configured.');
        }
        throw new Error(orderData.message || 'Failed to create order on backend.');
      }

      setStatus('modal_open');

      // Step 2: Open Razorpay Modal
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Glowora Standard Checkout',
        description: 'Test Razorpay Integration',
        order_id: orderData.order_id,
        handler: async (response) => {
          setStatus('verifying');
          try {
            // Step 3: Verify Payment Signature
            const verifyRes = await fetch(`${API_BASE}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(verifyData.message || 'Signature verification failed.');
            }

            setStatus('success');
            setPaymentDetails({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
          } catch (err) {
            setError(err.message || 'Error during payment verification.');
            setStatus('failed');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled by user.');
            setStatus('failed');
            setLoading(false);
          },
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        notes: {
          purpose: 'Testing Standard Checkout Integration',
        },
        theme: {
          color: '#0ea5e9', // Premium Sky Blue
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (resp) => {
        setError(resp.error.description || 'Payment transaction failed.');
        setStatus('failed');
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || 'An error occurred during payment setup.');
      setStatus('failed');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout-page" style={{ minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', py: 4 }}>
        <div className="container" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <Link to="/" className="back-link" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={18} /> Back to Shop
          </Link>

          <div className="checkout-form-card" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(14, 165, 233, 0.1)',
            padding: '30px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background design elements */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Sparkles className="animate-pulse" style={{ color: 'var(--sky, #0ea5e9)' }} size={24} />
                <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.8rem', color: '#1e293b' }}>Razorpay Checkout</h2>
              </div>
              <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.95rem' }}>
                Test the Razorpay Standard Checkout flow. Connects to backend endpoints to create orders and verify cryptographic signatures.
              </p>

              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  background: '#fef2f2',
                  borderLeft: '4px solid #ef4444',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: 20,
                  color: '#991b1b',
                  fontSize: '0.9rem'
                }}>
                  <AlertCircle size={18} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Status Tracker */}
              {status !== 'idle' && (
                <div style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(14,165,233,0.15)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: 24
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>Payment Status</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                      {status === 'creating_order' ? (
                        <RefreshCw className="spin" size={14} style={{ color: '#0ea5e9' }} />
                      ) : ['modal_open', 'verifying', 'success', 'failed'].includes(status) ? (
                        <CheckCircle size={14} style={{ color: '#10b981' }} />
                      ) : (
                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1' }} />
                      )}
                      <span style={{ color: status === 'creating_order' ? '#0f172a' : '#64748b', fontWeight: status === 'creating_order' ? 600 : 400 }}>
                        1. Creating Order on Backend
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                      {status === 'modal_open' ? (
                        <RefreshCw className="spin" size={14} style={{ color: '#0ea5e9' }} />
                      ) : ['verifying', 'success'].includes(status) ? (
                        <CheckCircle size={14} style={{ color: '#10b981' }} />
                      ) : status === 'failed' && error === 'Payment cancelled by user.' ? (
                        <XCircle size={14} style={{ color: '#ef4444' }} />
                      ) : (
                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1' }} />
                      )}
                      <span style={{ color: status === 'modal_open' ? '#0f172a' : '#64748b', fontWeight: status === 'modal_open' ? 600 : 400 }}>
                        2. Completing Checkout Modal
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                      {status === 'verifying' ? (
                        <RefreshCw className="spin" size={14} style={{ color: '#0ea5e9' }} />
                      ) : status === 'success' ? (
                        <CheckCircle size={14} style={{ color: '#10b981' }} />
                      ) : status === 'failed' && error !== 'Payment cancelled by user.' && error !== '' ? (
                        <XCircle size={14} style={{ color: '#ef4444' }} />
                      ) : (
                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1' }} />
                      )}
                      <span style={{ color: status === 'verifying' ? '#0f172a' : '#64748b', fontWeight: status === 'verifying' ? 600 : 400 }}>
                        3. Cryptographic Signature Verification
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {status === 'success' && paymentDetails && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: 24,
                  textAlign: 'center'
                }}>
                  <CheckCircle size={44} style={{ color: '#22c55e', margin: '0 auto 12px' }} />
                  <h3 style={{ margin: '0 0 4px 0', color: '#14532d', fontWeight: 700 }}>Payment Successful!</h3>
                  <p style={{ color: '#15803d', fontSize: '0.85rem', margin: '0 0 16px 0' }}>Signature Verified Cryptographically</p>
                  
                  <div style={{
                    textAlign: 'left',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    color: '#334155',
                    wordBreak: 'break-all'
                  }}>
                    <strong>Payment ID:</strong> {paymentDetails.paymentId}<br />
                    <strong>Order ID:</strong> {paymentDetails.orderId}<br />
                    <strong>Signature:</strong> {paymentDetails.signature.substring(0, 32)}...
                  </div>
                </div>
              )}

              {/* Test Credentials Info */}
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: 24,
                fontSize: '0.82rem',
                color: '#334155'
              }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: '#1e40af', fontSize: '0.85rem' }}>🧪 Test Credentials</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>UPI</div>
                    <code style={{ color: '#0ea5e9', fontWeight: 600 }}>success@razorpay</code>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 8, padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>Card</div>
                    <code style={{ color: '#0ea5e9', fontSize: '0.75rem', fontWeight: 600 }}>4111 1111 1111 1111</code>
                    <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 2 }}>CVV: 123 · Exp: 12/26</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayment}>
                {/* Payment Method Selector */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                    Payment Method
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      disabled={loading || status === 'success'}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: `2px solid ${paymentMethod === 'upi' ? '#0ea5e9' : 'rgba(14, 165, 233, 0.15)'}`,
                        background: paymentMethod === 'upi' ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                        color: paymentMethod === 'upi' ? '#0369a1' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>📱</span> UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      disabled={loading || status === 'success'}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: `2px solid ${paymentMethod === 'card' ? '#0ea5e9' : 'rgba(14, 165, 233, 0.15)'}`,
                        background: paymentMethod === 'card' ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                        color: paymentMethod === 'card' ? '#0369a1' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      <CreditCard size={16} /> Card
                    </button>
                  </div>
                </div>

                {/* UPI ID Field - shown when UPI is selected */}
                {paymentMethod === 'upi' && (
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                      UPI ID (VPA)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. test@razorpay"
                      disabled={loading || status === 'success'}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid rgba(14, 165, 233, 0.2)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: '#0f172a',
                        background: 'rgba(255, 255, 255, 0.9)',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        fontFamily: 'monospace'
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: 6 }}>
                      For test mode, use <strong>success@razorpay</strong>
                    </span>
                  </div>
                )}

                {/* Card Info - shown when Card is selected */}
                {paymentMethod === 'card' && (
                  <div style={{
                    marginBottom: 20,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    fontSize: '0.82rem',
                    color: '#475569'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 6, color: '#334155' }}>💳 Card details will be entered in the Razorpay modal</div>
                    <div>Use test card: <code style={{ color: '#0ea5e9' }}>4111 1111 1111 1111</code> · CVV: <code style={{ color: '#0ea5e9' }}>123</code> · Expiry: <code style={{ color: '#0ea5e9' }}>12/26</code></div>
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                    Payment Amount (INR)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontWeight: 600,
                      color: '#475569',
                      fontSize: '1.1rem'
                    }}>₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1.00"
                      value={amountInRupees}
                      onChange={(e) => setAmountInRupees(e.target.value)}
                      disabled={loading || status === 'success'}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 32px',
                        border: '2px solid rgba(14, 165, 233, 0.2)',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        background: 'rgba(255, 255, 255, 0.9)',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      required
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: 6 }}>
                    Equals {Math.round(parseFloat(amountInRupees || '0') * 100)} Paise. Minimum required amount is ₹1.00 (100 Paise).
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  {status === 'success' ? (
                    <button
                      type="button"
                      className="btn btn-sky"
                      onClick={() => { setStatus('idle'); setAmountInRupees('10.00'); setPaymentDetails(null); setUpiId('success@razorpay'); setPaymentMethod('upi'); }}
                      style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                    >
                      Reset and Pay Again
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-sky"
                      disabled={loading}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: '14px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="spin" size={18} /> Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard size={18} /> Pay {amountInRupees ? `₹${parseFloat(amountInRupees).toFixed(2)}` : ''}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Dynamic spinner and pulse CSS styles */}
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </>
  );
}
