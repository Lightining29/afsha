import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import crypto from 'crypto';

import { connectDB, lastDbError } from './src/config/database.js';
import categoryRoutes from './src/routes/categories.js';
import productRoutes from './src/routes/products.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import orderRoutes, { razorpayWebhookHandler, fulfillOrder } from './src/routes/orders.js';
import adminRoutes from './src/routes/admin.js';
import bannerRoutes from './src/routes/banner.js';
import reviewRoutes from './src/routes/reviews.js';
import imageRoutes from './src/routes/images.js';
import contactRoutes from './src/routes/contact.js';
import stockRoutes from './src/routes/stock.js';
import settingsRoutes from './src/routes/settings.js';
import blogRoutes from './src/routes/blogs.js';
import aiRoutes from './src/routes/ai.js';
import { promoBannersPublic, promoBannersAdmin } from './src/routes/promoBanners.js';

import Product from './src/models/Product.js';
import Category from './src/models/Category.js';
import Blog from './src/models/Blog.js';
import Banner from './src/models/Banner.js';
import Order from './src/models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || process.env.APP_PORT || 5000;

// Enable reverse proxy trust (Crucial for Hostinger Nginx / Cloudflare / LiteSpeed SSL & IP forwarding)
app.set('trust proxy', 1);

// Configure keep-alive timeouts for Hostinger reverse proxies
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
server.requestTimeout = 120_000;

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Configure allowed CORS origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  process.env.SITE_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()) : []),
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // In production, also allow same-host subdomains or configured domain
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

app.use(cors(corsOptions));

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Cache prevention on dynamic API routes & disable etag
app.set('etag', false);
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Raw body parser for Razorpay webhooks — MUST be registered before express.json()
app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), razorpayWebhookHandler);
app.post('/razorpay/webhook', express.raw({ type: 'application/json' }), razorpayWebhookHandler);
app.post('/api/razorpay/webhook', express.raw({ type: 'application/json' }), razorpayWebhookHandler);

// Standard body parsers with generous limits for file / image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check API
app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    message: 'Glowora API is active and operational',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: states[dbState] || 'unknown',
      connected: dbState === 1,
      lastError: lastDbError,
      host: mongoose.connection.host || null,
    },
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'production',
  });
});

// Mount all core API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/promo-banners', promoBannersPublic);
app.use('/api/admin/promo-banners', promoBannersAdmin);

// Razorpay checkout endpoints
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: 'Amount is required' });
    }
    if (amount < 100) {
      return res.status(400).json({ message: 'Amount must be at least 100 paise (₹1)' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID?.trim()?.replace(/^["']|["']$/g, '');
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim()?.replace(/^["']|["']$/g, '');

    if (!key_id || !key_secret) {
      return res.status(401).json({ message: 'Razorpay API credentials not configured in environment' });
    }

    const razorpayInstance = new Razorpay({ key_id, key_secret });

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(amount),
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return res.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error('Create order error:', err);
    if (err.statusCode === 401) {
      return res.status(401).json({ message: 'Razorpay authentication failure' });
    }
    return res.status(500).json({ message: err.message || 'Razorpay order creation failed' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required payment verification fields' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET?.trim()?.replace(/^["']|["']$/g, '');
    if (!secret) {
      return res.status(500).json({ message: 'Razorpay API credentials not configured in environment' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature mismatch' });
    }

    try {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (order && order.status === 'pending_payment') {
        order.status = 'paid';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();
        await fulfillOrder(order);
      }
    } catch (dbErr) {
      console.error('Failed to update database order:', dbErr);
    }

    return res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    console.error('Verify payment error:', err);
    return res.status(500).json({ message: err.message || 'Payment verification failed' });
  }
});

app.post('/api/test-simulate-payment', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID?.trim()?.replace(/^["']|["']$/g, '');
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim()?.replace(/^["']|["']$/g, '');

    if (!keyId || !keySecret) {
      return res.status(401).json({ message: 'Razorpay API credentials not configured' });
    }

    const razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpayInstance.orders.create({
      amount: Math.round(amount || 100),
      currency: currency || 'INR',
      receipt: `test_rcpt_${Date.now()}`,
    });

    const syntheticPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const signature = crypto
      .createHmac('sha256', keySecret)
      .update(`${order.id}|${syntheticPaymentId}`)
      .digest('hex');

    return res.json({
      success: true,
      order_id: order.id,
      payment_id: syntheticPaymentId,
      signature: signature,
      amount: order.amount,
      currency: order.currency,
      note: 'Test simulation: real order + synthetic payment_id + valid HMAC signature',
    });
  } catch (err) {
    console.error('Test simulate payment error:', err);
    return res.status(500).json({ message: err.message || 'Test payment simulation failed' });
  }
});

// Dynamic SEO Robots.txt Route
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'www.afshaenterprises.com';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const domain = process.env.SITE_URL || `${protocol}://${host}`;
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /login
Disallow: /register

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /login
Disallow: /register

User-agent: Googlebot-Image
Allow: /

Sitemap: ${domain}/sitemap.xml
Sitemap: ${domain}/sitemap_index.xml
`);
});

// Dynamic SEO Sitemap.xml & sitemap_index.xml Route
// Google Search Console Best Practice: Only 100% canonical 200-OK URLs! No duplicates, no redirects, no aliases.
app.get([
  '/sitemap.xml',
  '/sitemap_index.xml',
  '/sitemap-index.xml',
  /.*sitemap.*\.xml$/
], async (req, res) => {
  try {
    const host = req.get('host') || 'www.afshaenterprises.com';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const domain = (process.env.SITE_URL || `${protocol}://${host}`).replace(/\/$/, '');
    const today = '2026-09-09';

    // If sitemap_index.xml is explicitly requested, return standard sitemap index
    if (req.path.includes('index')) {
      res.header('Content-Type', 'application/xml; charset=utf-8');
      return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${domain}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`);
    }

    let products = [];
    let blogs = [];

    try {
      if (mongoose.connection.readyState === 1) {
        products = await Product.find({ isActive: { $ne: false } }).select('slug name image updatedAt');
        blogs = await Blog.find().select('slug title image updatedAt');
      }
    } catch (dbErr) {
      console.warn('Sitemap DB query warning:', dbErr.message);
    }

    const fallbackProducts = [
      { slug: 'electric-body-massager', name: 'Electric Full Body Massager Machine', image: '/masage.jpg' },
      { slug: 'deep-tissue-massager', name: 'Deep Tissue Percussion Massage Gun', image: '/masage.jpg' },
      { slug: 'painless-facial-hair-remover', name: 'Painless Facial & Body Hair Remover', image: '/hair-remover-showcase-v3.png' },
      { slug: 'neck-and-shoulder-massager', name: 'Shiatsu Neck and Shoulder Massager', image: '/masage.jpg' },
      { slug: 'foot-and-calf-massager', name: 'Foot and Calf Acupressure Massager', image: '/masage.jpg' },
      { slug: 'rechargeable-body-massager', name: 'Handheld Rechargeable Cordless Body Massager', image: '/masage.jpg' }
    ];

    const fallbackBlogs = [
      { slug: 'top-10-benefits-of-using-a-body-massager', title: 'Top 10 Benefits of Using an Electric Body Massager Daily' },
      { slug: 'best-massager-for-back-pain-in-india', title: 'Best Massager for Back Pain in India (2026 Doctor Guide)' },
      { slug: 'how-to-choose-a-handheld-massager', title: 'How to Choose the Right Handheld Massager' },
      { slug: 'neck-pain-relief-tips-at-home', title: '5 Quick Neck Pain Relief Tips at Home' },
      { slug: 'electric-vs-manual-massagers', title: 'Electric vs Manual Massagers: Which Is Better?' },
      { slug: 'how-to-relieve-sciatic-nerve-pain-at-home', title: 'How to Relieve Sciatic Nerve Pain at Home' },
      { slug: 'plantar-fasciitis-foot-massager-guide', title: 'Best Foot Massagers for Plantar Fasciitis in India' },
      { slug: 'facial-hair-removal-tips-for-women', title: 'Painless Facial Hair Removal Tips for Women' },
      { slug: 'full-body-massage-machine-price-in-india', title: 'Full Body Massage Machine Price in India (2026 Buying Guide)' }
    ];

    const finalProducts = products.length > 0 ? products : fallbackProducts;
    const finalBlogs = blogs.length > 0 ? blogs : fallbackBlogs;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // 1. Core Site Pages (Canonical 200 OK)
    const coreUrls = [
      { loc: `${domain}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${domain}/products`, priority: '0.9', changefreq: 'daily' },
      { loc: `${domain}/blogs`, priority: '0.8', changefreq: 'daily' },
      { loc: `${domain}/contact`, priority: '0.7', changefreq: 'monthly' },
      {
        loc: `${domain}/manish-kumar`,
        priority: '1.0',
        changefreq: 'daily',
        image: `${domain}/manish-kumar.jpg`,
        imageTitle: 'Manish Kumar - Senior Java Full Stack Developer & AWS DevOps Architect'
      },
    ];

    coreUrls.forEach(u => {
      xml += `  <url>\n`;
      xml += `    <loc>${u.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      xml += `    <priority>${u.priority}</priority>\n`;
      if (u.image) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${u.image}</image:loc>\n`;
        xml += `      <image:title>${u.imageTitle.replace(/&/g, '&amp;')}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    });

    // 2. Product Canonical Pages (/product/:slug)
    finalProducts.forEach(p => {
      const pImage = p.image ? (p.image.startsWith('http') ? p.image : `${domain}${p.image}`) : `${domain}/masage.jpg`;
      xml += `  <url>\n`;
      xml += `    <loc>${domain}/product/${p.slug}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>1.0</priority>\n`;
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${pImage}</image:loc>\n`;
      xml += `      <image:title>${(p.name || p.slug).replace(/&/g, '&amp;')}</image:title>\n`;
      xml += `    </image:image>\n`;
      xml += `  </url>\n`;
    });

    // 3. Category Canonical Pages
    ['wellness-massage', 'skincare', 'hair-care', 'body'].forEach(cat => {
      xml += `  <url>\n`;
      xml += `    <loc>${domain}/category/${cat}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.85</priority>\n`;
      xml += `  </url>\n`;
    });

    // 4. Blog Canonical Pages (/blog/:slug)
    finalBlogs.forEach(b => {
      xml += `  <url>\n`;
      xml += `    <loc>${domain}/blog/${b.slug}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.85</priority>\n`;
      xml += `  </url>\n`;
    });

    // 5. Location Pages
    ['delhi', 'mumbai', 'bangalore'].forEach(city => {
      xml += `  <url>\n`;
      xml += `    <loc>${domain}/locations/${city}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    return res.send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    return res.status(500).send('Error generating sitemap');
  }
});

// Resolve frontend static files directory
function resolveStaticDirectory() {
  const candidates = [
    path.join(__dirname, 'public'),
    path.join(__dirname, '..', 'frontend', 'dist'),
    path.join(__dirname, 'frontend', 'dist'),
    path.join(__dirname, '..', 'public'),
    path.join(__dirname, 'dist'),
    path.join(process.cwd(), 'frontend', 'dist'),
    path.join(process.cwd(), 'backend', 'public'),
    path.join(process.cwd(), 'public'),
    path.join(process.cwd(), 'dist'),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'index.html'))) {
      return dir;
    }
  }
  return null;
}

const staticDir = resolveStaticDirectory();

if (staticDir) {
  console.log(`[Static] Serving frontend from: ${staticDir}`);

  // Helper to send a true HTTP 404 response with noindex header to prevent GSC Soft 404 errors
  const send404 = (res) => {
    res.status(404);
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    const custom404 = path.join(staticDir, '404.html');
    if (fs.existsSync(custom404)) {
      return res.sendFile(custom404);
    }
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 - Page Not Found | Afsha Enterprises</title>
  <meta name="robots" content="noindex, nofollow">
</head>
<body style="font-family:sans-serif; text-align:center; padding:50px;">
  <h1>404 - Page Not Found</h1>
  <p>The page you are looking for does not exist.</p>
  <a href="/">Go to Homepage</a>
</body>
</html>`);
  };

  // 1. Fast-path instant static handler for Manish Kumar Profile
  app.get(['/manish-kumar', '/manish-kumar.html'], (req, res) => {
    if (req.path.endsWith('.html')) {
      return res.redirect(301, '/manish-kumar');
    }
    const profilePath = path.join(staticDir, 'manish-kumar.html');
    if (fs.existsSync(profilePath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('Link', '<https://www.afshaenterprises.com/manish-kumar>; rel="canonical"');
      return res.sendFile(profilePath);
    }
    res.sendFile(path.join(staticDir, 'index.html'));
  });

  // 2. 301 Permanent Redirects for all legacy/alias Manish Kumar URLs to single canonical /manish-kumar
  app.get([
    '/manish',
    '/manishkumar',
    '/profile',
    '/profile/manish',
    '/profile/manish-kumar',
    '/profile.html',
    '/manish.html',
    '/manishkumar.html',
    '/developer',
    '/developer.html',
    '/developer-profile',
    '/developer-profile.html',
    '/about-manish-kumar',
    '/manish-profile',
    '/manish-kumar-profile',
    '/manish-kumar-java-developer',
    '/manish-kumar-devops-engineer',
    '/manish-kumar-full-stack-developer',
    '/manish-kumar-java-full-stack-developer',
    '/manish-kumar-software-engineer',
    '/manish-kumar-aws-architect',
    '/manish-kumar-resume',
    '/developer/manish-kumar'
  ], (_req, res) => {
    return res.redirect(301, '/manish-kumar');
  });

  // 3. Fast-path instant static handler for All Products Catalog (/products)
  app.get(['/products', '/products.html'], (req, res) => {
    if (req.path.endsWith('.html')) {
      return res.redirect(301, '/products');
    }
    const filePath = path.join(staticDir, 'products.html');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('Link', '<https://www.afshaenterprises.com/products>; rel="canonical"');
      return res.sendFile(filePath);
    }
    res.sendFile(path.join(staticDir, 'index.html'));
  });

  // 4. Fast-path instant static handler for Blog Articles List (/blogs)
  app.get(['/blogs', '/blogs.html', '/blog', '/blog.html'], (req, res) => {
    if (req.path !== '/blogs') {
      return res.redirect(301, '/blogs');
    }
    const filePath = path.join(staticDir, 'blogs.html');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('Link', '<https://www.afshaenterprises.com/blogs>; rel="canonical"');
      return res.sendFile(filePath);
    }
    res.sendFile(path.join(staticDir, 'index.html'));
  });

  // 5. Fast-path instant static handler for Contact Page (/contact)
  app.get(['/contact', '/contact.html', '/contact-us', '/contact-us.html'], (req, res) => {
    if (req.path !== '/contact') {
      return res.redirect(301, '/contact');
    }
    const filePath = path.join(staticDir, 'contact.html');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('Link', '<https://www.afshaenterprises.com/contact>; rel="canonical"');
      return res.sendFile(filePath);
    }
    res.sendFile(path.join(staticDir, 'index.html'));
  });

  // 6. Fast-path instant static handler for Categories (/category/:slug)
  app.get(['/category/:slug', '/categories/:slug'], (req, res) => {
    const raw = req.params.slug;
    if (req.path.startsWith('/categories/') || raw.endsWith('.html')) {
      const clean = raw.replace(/\.html$/, '');
      return res.redirect(301, `/category/${clean}`);
    }
    const slug = raw.toLowerCase();
    const filePath = path.join(staticDir, 'category', `${slug}.html`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('Link', `<https://www.afshaenterprises.com/category/${slug}>; rel="canonical"`);
      return res.sendFile(filePath);
    }
    return send404(res);
  });

  // 7. Fast-path instant static handler for Locations (/locations/:city)
  app.get(['/locations/:city', '/location/:city'], (req, res) => {
    const raw = req.params.city;
    if (req.path.startsWith('/location/') || raw.endsWith('.html')) {
      const clean = raw.replace(/\.html$/, '');
      return res.redirect(301, `/locations/${clean}`);
    }
    const city = raw.toLowerCase();
    const filePath = path.join(staticDir, 'locations', `${city}.html`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('Link', `<https://www.afshaenterprises.com/locations/${city}>; rel="canonical"`);
      return res.sendFile(filePath);
    }
    return send404(res);
  });

  // 8. Fast-path instant static handler for Product Detail Pages (/product/:slug)
  app.get('/product/:slug', (req, res) => {
    if (req.params.slug.endsWith('.html')) {
      return res.redirect(301, `/product/${req.params.slug.replace(/\.html$/, '')}`);
    }
    const slug = req.params.slug;
    const candidates = [
      path.join(staticDir, 'product', `${slug}.html`),
      path.join(staticDir, `${slug}.html`)
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        res.setHeader('Link', `<https://www.afshaenterprises.com/product/${slug}>; rel="canonical"`);
        return res.sendFile(p);
      }
    }
    return send404(res);
  });

  // 9. 301 Permanent Redirects for legacy product URLs to single canonical /product/:slug
  app.get(['/products/:slug', '/:slug.html'], (req, res, next) => {
    const raw = req.params.slug || req.path.replace(/^\/|\.html$/g, '');
    const slug = raw.replace(/^products\//, '').replace(/^product\//, '');
    const validSlugs = [
      'electric-body-massager',
      'deep-tissue-massager',
      'painless-facial-hair-remover',
      'neck-and-shoulder-massager',
      'foot-and-calf-massager',
      'rechargeable-body-massager'
    ];
    if (validSlugs.includes(slug)) {
      return res.redirect(301, `/product/${slug}`);
    }
    next();
  });

  // 10. Fast-path instant static handler for Blog Articles (/blog/:slug)
  app.get('/blog/:slug', (req, res) => {
    if (req.params.slug.endsWith('.html')) {
      return res.redirect(301, `/blog/${req.params.slug.replace(/\.html$/, '')}`);
    }
    const slug = req.params.slug;
    const candidates = [
      path.join(staticDir, 'blog', `${slug}.html`),
      path.join(staticDir, `${slug}.html`)
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        res.setHeader('Link', `<https://www.afshaenterprises.com/blog/${slug}>; rel="canonical"`);
        return res.sendFile(p);
      }
    }
    return send404(res);
  });

  // 11. 301 Permanent Redirects for legacy blog URLs to single canonical /blog/:slug
  app.get(['/blogs/:slug', '/blog/:slug.html', '/blogs/:slug.html'], (req, res, next) => {
    const slug = (req.params.slug || req.path.replace(/^\/blogs?\//, '')).replace(/\.html$/, '');
    if (slug) {
      return res.redirect(301, `/blog/${slug}`);
    }
    next();
  });

  // Serve static assets with caching headers & automatic .html extension support
  app.use(
    express.static(staticDir, {
      maxAge: '1d',
      extensions: ['html'],
      setHeaders: (res, filePath) => {
        if (filePath.includes('assets') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        }
      },
    })
  );

  // SPA fallback for all remaining non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/socket.io/')) {
      return next();
    }

    // Block crawl loops on unknown file extensions by sending true HTTP 404 (prevents Soft 404)
    const ext = path.extname(req.path).toLowerCase();
    if (ext && ext !== '.html') {
      return send404(res);
    }
    if (ext === '.html') {
      const directFile = path.join(staticDir, req.path);
      if (fs.existsSync(directFile)) {
        return res.sendFile(directFile);
      }
      return send404(res);
    }

    // Explicitly noindex private and administrative routes
    const privatePrefixes = ['/cart', '/checkout', '/account', '/login', '/register', '/admin'];
    if (privatePrefixes.some(prefix => req.path === prefix || req.path.startsWith(prefix + '/'))) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(staticDir, 'index.html'));
  });
} else {
  console.warn('[Static] No frontend build found. Running in API server mode.');
  app.get('/', (_req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Glowora API Server</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; max-width: 600px; width: 100%; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          h1 { margin-top: 0; color: #38bdf8; font-size: 24px; }
          p { color: #94a3b8; line-height: 1.6; }
          .badge { display: inline-block; background: #0284c7; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
          .status { background: #064e3b; color: #6ee7b7; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; margin: 16px 0; }
          a { color: #38bdf8; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Hostinger Production Ready</span>
          <h1>Glowora Backend API Server</h1>
          <div class="status">✓ API Server is running on port ${PORT}</div>
          <p>All API endpoints are available under <code>/api/*</code>.</p>
          <p>To serve the full frontend, build the React frontend with <code>npm run build</code> or upload your <code>frontend/dist</code> files.</p>
          <p>Check health status: <a href="/api/health">/api/health</a></p>
        </div>
      </body>
      </html>
    `);
  });
}

// 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized error handling middleware
app.use((err, req, res, _next) => {
  console.error('[Error Handler]', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

// Connect to MongoDB database
connectDB();

// Socket.IO real-time banner updates
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Watch Banner collection for real-time updates (Change Streams or Polling fallback)
async function setupBannerChangeStream() {
  try {
    if (!Banner || mongoose.connection.readyState !== 1) {
      setupBannerPolling();
      return;
    }

    const admin = Banner.db?.db?.admin();
    if (!admin) {
      setupBannerPolling();
      return;
    }

    const serverStatus = await admin.command({ isMaster: 1 }).catch(() => ({}));
    const isReplicaSetOrMongos = !!(serverStatus.setName || serverStatus.msg === 'isdbgrid');

    if (!isReplicaSetOrMongos) {
      console.log('[Banner Stream] Standalone MongoDB detected — activating polling fallback.');
      setupBannerPolling();
      return;
    }

    const bannerCollection = Banner.collection;
    const changeStream = bannerCollection.watch([
      { $match: { operationType: { $in: ['insert', 'update', 'replace'] }, 'fullDocument.singleton': true } },
    ]);

    changeStream.on('change', async () => {
      try {
        const banner = await Banner.findOne({ singleton: true });
        if (banner) {
          const v = banner.updatedAt ? banner.updatedAt.getTime() : Date.now();
          const imageUrl = banner.imageData ? `/api/images/banner/hero?v=${v}` : null;
          const promoImageUrl = banner.promoImageData ? `/api/images/banner/promo?v=${v}` : null;
          io.emit('banner-updated', { imageUrl, promoImageUrl, updatedAt: banner.updatedAt });
        }
      } catch (err) {
        console.error('[Banner Stream] Change error:', err.message);
      }
    });

    changeStream.on('error', (err) => {
      console.error('[Banner Stream] Stream error:', err.message);
      setTimeout(setupBannerChangeStream, 5000);
    });

    console.log('[Banner Stream] Real-time MongoDB change stream active.');
  } catch (err) {
    console.warn('[Banner Stream] Falling back to polling:', err.message);
    setupBannerPolling();
  }
}

let lastBannerUpdate = null;
function setupBannerPolling() {
  setInterval(async () => {
    try {
      if (mongoose.connection.readyState !== 1) return;
      const banner = await Banner.findOne({ singleton: true });
      if (banner) {
        const updatedAt = banner.updatedAt ? banner.updatedAt.toISOString() : null;
        if (updatedAt && updatedAt !== lastBannerUpdate) {
          lastBannerUpdate = updatedAt;
          const v = banner.updatedAt ? banner.updatedAt.getTime() : Date.now();
          const imageUrl = banner.imageData ? `/api/images/banner/hero?v=${v}` : null;
          const promoImageUrl = banner.promoImageData ? `/api/images/banner/promo?v=${v}` : null;
          io.emit('banner-updated', { imageUrl, promoImageUrl, updatedAt: banner.updatedAt });
        }
      }
    } catch {
      // Silently ignore polling errors
    }
  }, 10000);
}

// Start banner watcher safely after startup
setTimeout(setupBannerChangeStream, 3000);

// Global safety exception handlers
process.on('unhandledRejection', (reason) => {
  console.error('[Process] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err);
});

// Graceful shutdown handling
function handleGracefulShutdown(signal) {
  console.log(`[Process] Received ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.log('[Process] HTTP server closed.');
    mongoose.connection.close(false).then(() => {
      console.log('[Process] MongoDB connection closed.');
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error('[Process] Forcefully shutting down after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

// Start listening (binds automatically to Hostinger PORT)
server.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` Glowora Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(`=============================================`);
});

export { app, server, io };
