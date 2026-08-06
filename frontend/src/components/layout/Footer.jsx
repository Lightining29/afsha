import { useState } from 'react';
import { Mail, MapPin, Phone, Instagram, Youtube, Truck, ShieldCheck, CreditCard, Headphones, Send } from 'lucide-react';
import { toastSuccess } from '../../utils/toast.js';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toastSuccess('Thank you for subscribing! Check your email for a 10% OFF coupon code.');
      setEmail('');
    }
  };

  return (
    <footer id="contact" className="footer">
      {/* Trust Highlights Strip */}
      <div className="footer-trust-strip">
        <div className="container trust-strip-container">
          <div className="trust-item">
            <Truck className="trust-icon" size={24} color="#E94057" />
            <div>
              <h5>Fast Doorstep Delivery</h5>
              <p>Reliable express dispatch</p>
            </div>
          </div>
          <div className="trust-item">
            <ShieldCheck className="trust-icon" size={24} color="#10B981" />
            <div>
              <h5>100% Genuine Guarantee</h5>
              <p>1-Year Quality Warranty</p>
            </div>
          </div>
          <div className="trust-item">
            <CreditCard className="trust-icon" size={24} color="#F59E0B" />
            <div>
              <h5>Secure Instant Checkout</h5>
              <p>UPI, Razorpay, Cards & COD</p>
            </div>
          </div>
          <div className="trust-item">
            <Headphones className="trust-icon" size={24} color="#3B82F6" />
            <div>
              <h5>24/7 Dedicated Support</h5>
              <p>WhatsApp & Phone Helpline</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.png" alt="Afsha Enterprises" className="footer-logo-img" />
            </div>
            <p className="footer-tagline">
              <strong>Afsha Enterprises</strong> — Your trusted retail & e-commerce partner for premium beauty, skincare, and modern lifestyle essentials.
            </p>
            <div className="footer-contact-details">
              <p><MapPin size={15} color="#E94057" inline /> 75 Raja Muthai Road, Periyamet, Opposite Nehru Stadium Main Gate</p>
              <p><Phone size={15} color="#10B981" inline /> +91 8073786650</p>
              <p><Mail size={15} color="#3B82F6" inline /> reazafsha0@gmail.com</p>
            </div>
            <div className="footer-social">
              <a
                href="https://www.instagram.com/afsha.reaz?utm_source=qr&igsh=eWNwNmNkaDdldHh0"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn instagram"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/@afsh_aenterprises"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn youtube"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://wa.me/918073786650"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn whatsapp"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-links">
            <h4>Popular Categories</h4>
            <a href="/#categories">Skincare & Beauty</a>
            <a href="/#categories">Hair Removal Trimmers</a>
            <a href="/#categories">Body Massagers & Care</a>
            <a href="/#bestsellers">Bestselling Products</a>
            <a href="/#flash-sale">⚡ Flash Deals & Offers</a>
          </div>

          {/* Customer Support Column */}
          <div className="footer-links">
            <h4>Customer Service</h4>
            <a href="/#contact">Contact Support</a>
            <a href="/#faq">Order Tracking & FAQs</a>
            <a href="/#privacy">Privacy & Data Security</a>
            <a href="/#terms">Terms of Service</a>
          </div>

          {/* Newsletter Column */}
          <div className="footer-newsletter-col">
            <h4>Join Afsha VIP Club</h4>
            <p>Subscribe to receive instant <strong>10% OFF discount coupons</strong> and VIP flash sale notifications!</p>

            <form className="footer-newsletter-box" onSubmit={handleSubscribe}>
              <input
                type="email"
                className="footer-newsletter-input"
                placeholder="Enter your email address…"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="footer-newsletter-btn">
                <Send size={15} /> Subscribe
              </button>
            </form>
            <div className="footer-payment-badges">
              <span>💳 Accepted Payments:</span>
              <div className="payment-icons-row">
                <span className="pay-chip">UPI</span>
                <span className="pay-chip">Razorpay</span>
                <span className="pay-chip">Visa</span>
                <span className="pay-chip">Mastercard</span>
                <span className="pay-chip">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>© {new Date().getFullYear()} <strong>Afsha Enterprises</strong>. All rights reserved. GSTIN: 27AAACA1234A1Z5.</p>
          <div className="footer-bottom-links">
            <a href="/#privacy">Privacy Policy</a>
            <a href="/#terms">Terms of Service</a>
            <a href="/#contact">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
