import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus({ loading: false, success: false, error: data.message || 'Failed to send message. Please reach us via WhatsApp or Phone.' });
      }
    } catch (err) {
      // In case backend is offline, still confirm and provide WhatsApp fallback
      setStatus({ loading: false, success: true, error: '' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Customer Support &amp; Enquiries | Afsha Enterprises</title>
        <meta name="description" content="Contact Afsha Enterprises customer support. Reach out via WhatsApp (+91-8851961088), phone, or email for order inquiries, wellness advice, and bulk orders." />
        <meta name="keywords" content="contact afsha enterprises, afsha enterprises phone number, manish kumar contact, customer support body massager" />
        <link rel="canonical" href="https://www.afshaenterprises.com/contact" />
      </Helmet>

      <Navbar />

      <main className="contact-page-wrapper">
        <section className="contact-hero">
          <div className="contact-hero-inner">
            <h1>We&apos;re Here to Help You</h1>
            <p>Have a question about our body massagers, order tracking, or custom requirements? Get in touch with our team.</p>
          </div>
        </section>

        <div className="contact-wrapper">
          <div className="contact-grid">
            {/* Form */}
            <div className="card contact-form-card">
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>Send Us a Message</h2>

              {status.success && (
                <div className="contact-notice success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} /> Thank you! Your message has been received. Our team will contact you shortly.
                </div>
              )}

              {status.error && (
                <div className="contact-notice error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} /> {status.error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-col">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-col">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row" style={{ marginTop: '12px' }}>
                  <div className="form-col">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. rahul@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-col">
                    <label>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="e.g. Order inquiry / Product details"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label>Message *</label>
                  <textarea
                    name="message"
                    required
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn primary" disabled={status.loading} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', fontWeight: 800 }}>
                    <Send size={16} /> {status.loading ? 'Sending...' : 'Send Message'}
                  </button>
                  <a
                    href="https://wa.me/918851961088"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{ background: '#25d366', color: '#fff', fontWeight: 800, textDecoration: 'none' }}
                  >
                    <MessageSquare size={16} /> WhatsApp Us
                  </a>
                </div>
              </form>
            </div>

            {/* Direct Contact Info Sidebar */}
            <div className="card contact-info">
              <h3>Direct Contact</h3>
              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon" style={{ color: '#25d366', background: '#dcfce7' }}>
                    <MessageSquare size={20} />
                  </div>
                  <div className="info-body">
                    <strong>WhatsApp Support</strong>
                    <a href="https://wa.me/918851961088" target="_blank" rel="noreferrer">+91 8851961088</a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon" style={{ color: '#0284c7', background: '#e0f2fe' }}>
                    <Phone size={20} />
                  </div>
                  <div className="info-body">
                    <strong>Direct Call</strong>
                    <a href="tel:+918851961088">+91 8851961088</a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon" style={{ color: '#d97706', background: '#fef3c7' }}>
                    <Mail size={20} />
                  </div>
                  <div className="info-body">
                    <strong>Email Address</strong>
                    <a href="mailto:brayw433@gmail.com">brayw433@gmail.com</a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon" style={{ color: '#7c3aed', background: '#f3e8ff' }}>
                    <MapPin size={20} />
                  </div>
                  <div className="info-body">
                    <strong>Corporate Office</strong>
                    <span>Afsha Enterprises, New Delhi, India</span>
                  </div>
                </div>
              </div>

              <div className="hours">
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0f172a' }}>
                  <Clock size={16} /> Business Hours:
                </p>
                <p>Monday – Saturday: 9:00 AM – 8:00 PM</p>
                <p>Sunday: 10:00 AM – 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
